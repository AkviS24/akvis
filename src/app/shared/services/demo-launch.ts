import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  filter,
  firstValueFrom,
  switchMap,
  take,
  timeout,
  timer,
} from 'rxjs';

import { AuthService } from './auth';

export type DemoProject = 'join' | 'kanmind' | 'el-pollo-loco' | 'quizzy';

interface DemoAuthorizationResponse {
  state: 'starting' | 'ready';
  status_url: string;
}

interface DemoStatusResponse {
  state: 'starting' | 'ready' | 'failed' | 'revoked' | 'expired';
  redirect_to?: string;
}

export class PortfolioAuthenticationRequired extends Error {
  constructor() {
    super('A valid Portfolio session is required.');
  }
}

@Injectable({ providedIn: 'root' })
export class DemoLaunchService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = '/permission-api/api/demo/';

  /** Authenticate, authorize and poll the handler before returning a safe redirect. */
  async launch(project: DemoProject, onProgress?: (message: string) => void): Promise<string> {
    await firstValueFrom(this.auth.getCsrfCookie());
    await this.ensurePortfolioSession();
    onProgress?.('Portfolio session verified. Requesting authorization…');
    onProgress?.('Requesting short-lived authorization assertion…');
    const { assertion } = await firstValueFrom(
      this.auth.createDemoAssertion(project),
    );
    const launch = await firstValueFrom(
      this.http.post<DemoAuthorizationResponse>(
        this.apiUrl + 'authorize/',
        { assertion },
        { withCredentials: true },
      ),
    );
    onProgress?.('Permission Handler accepted the request. Waiting for project readiness…');
    const status = await this.waitForReady(launch.status_url, onProgress);
    if (status.state !== 'ready') {
      throw new Error(`Demo launch ended with state: ${status.state}`);
    }
    onProgress?.('Demo is ready. Opening the project…');
    return this.getSafeRedirect(status.redirect_to);
  }

  private async ensurePortfolioSession(): Promise<void> {
    try {
      await firstValueFrom(this.auth.getStatus());
      return;
    } catch (error) {
      if (!this.isUnauthorized(error)) throw error;
    }

    try {
      await firstValueFrom(this.auth.refresh());
      await firstValueFrom(this.auth.getStatus());
    } catch (error) {
      if (this.isUnauthorized(error)) {
        throw new PortfolioAuthenticationRequired();
      }
      throw error;
    }
  }

  private async waitForReady(
    statusPath: string,
    onProgress?: (message: string) => void,
  ): Promise<DemoStatusResponse> {
    const statusTarget = new URL(
      statusPath,
      window.location.origin + this.apiUrl,
    );
    const expectedStatusPath = new URL(
      'status/',
      window.location.origin + this.apiUrl,
    ).pathname;
    if (
      statusTarget.origin !== window.location.origin ||
      statusTarget.pathname !== expectedStatusPath
    ) {
      throw new Error('The Permission Handler returned an invalid status URL.');
    }

    return firstValueFrom(
      timer(0, 2000).pipe(
        switchMap(() => {
          onProgress?.('Checking project startup status…');
          return this.http.get<DemoStatusResponse>(statusTarget.toString(), {
            withCredentials: true,
          });
        }),
        filter((status) => status.state !== 'starting'),
        take(1),
        timeout({ first: 180_000 }),
      ),
    );
  }

  private getSafeRedirect(path?: string): string {
    if (!path || !path.startsWith('/') || path.startsWith('//')) {
      throw new Error('The Permission Handler returned an invalid path.');
    }

    const target = new URL(path, window.location.origin);
    if (target.origin !== window.location.origin) {
      throw new Error('The demo redirect must stay on this domain.');
    }
    return target.toString();
  }

  private isUnauthorized(error: unknown): boolean {
    return error instanceof HttpErrorResponse && error.status === 401;
  }
}
