import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';

import {
  DemoLaunchService,
  DemoProject,
  PortfolioAuthenticationRequired,
} from '../../services/demo-launch';
import { AuthDialog as AuthDialogService } from '../../services/auth-dialog';
import { StatusDialog as StatusDialogService } from '../../services/status-dialog';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  translate = inject(TranslationService);
  private demoLaunch = inject(DemoLaunchService);
  private authDialog = inject(AuthDialogService);
  private statusDialog = inject(StatusDialogService);

  isLaunchingDemo = signal(false);
  showDemoAccessDialog = signal(false);

  /** Check Portfolio authentication and launch the selected protected demo. */
  openDemo(project: DemoProject): void {
    if (this.isLaunchingDemo()) return;

    this.isLaunchingDemo.set(true);
    this.demoLaunch.launch(project)
      .then((url) => window.location.assign(url))
      .catch((error: unknown) => this.handleDemoError(error))
      .finally(() => this.isLaunchingDemo.set(false));
  }

  /** Show the special access dialog only when Portfolio authentication fails. */
  private handleDemoError(error: unknown): void {
    if (error instanceof PortfolioAuthenticationRequired) {
      this.showDemoAccessDialog.set(true);
      return;
    }

    const message = error instanceof HttpErrorResponse && error.status === 403
      ? this.translate.t().projects.demoAccessDenied
      : error instanceof HttpErrorResponse && error.status === 503
        ? this.translate.t().projects.demoUnavailable
        : this.translate.t().projects.demoLaunchFailed;

    this.statusDialog.showError(message);
  }

  closeDemoAccessDialog(): void {
    this.showDemoAccessDialog.set(false);
  }

  openPortfolioLogin(): void {
    this.closeDemoAccessDialog();
    this.authDialog.openLogin();
  }

  openPortfolioRegistration(): void {
    this.closeDemoAccessDialog();
    this.authDialog.openLogin();
    this.authDialog.openRegister();
  }
}
