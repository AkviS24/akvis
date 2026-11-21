import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';

import { DemoLaunchService, PortfolioAuthenticationRequired } from '../../services/demo-launch';
import type { DemoProject } from '../../services/demo-launch';
import { AuthDialog as AuthDialogService } from '../../services/auth-dialog';
import { StatusDialog as StatusDialogService } from '../../services/status-dialog';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './projects.scss',
})
export class Projects {
  translate = inject(TranslationService);
  private demoLaunch = inject(DemoLaunchService);
  private authDialog = inject(AuthDialogService);
  private statusDialog = inject(StatusDialogService);

  isLaunchingDemo = signal(false);
  showDemoAccessDialog = signal(false);
  private pendingDemo?: DemoProject;
  private demoWindow: Window | null = null;
  private demoCancelled = false;

  /** Open a temporary browser context synchronously to avoid popup blocking. */
  openDemo(project: DemoProject): void {
    if (this.isLaunchingDemo()) return;
    this.demoWindow = window.open('about:blank', '_blank');
    if (!this.demoWindow) {
      this.statusDialog.showError(this.translate.t().projects.demoLaunchFailed);
      return;
    }
    this.demoWindow.document.title = 'Starting demo…';
    this.demoWindow.blur();
    window.focus();
    this.pendingDemo = project;
    this.demoCancelled = false;
    this.authDialog.setCloseHandler(() => this.cancelPendingDemo());
    this.launchDemo(project);
  }

  /** Start the selected demo and stream progress into the shared auth dialog. */
  private launchDemo(project: DemoProject): void {
    this.isLaunchingDemo.set(true);
    let progressStarted = false;
    this.demoLaunch
      .launch(project, (message) => {
        if (!progressStarted) {
          this.authDialog.startDemoProgress(project, message);
          progressStarted = true;
        } else {
          this.authDialog.updateDemoProgress(message);
        }
      })
      .then((url) => {
        if (this.demoCancelled || !this.demoWindow || this.demoWindow.closed) {
          this.cancelPendingDemo();
          return;
        }
        this.pendingDemo = undefined;
        this.authDialog.setCloseHandler(undefined);
        this.authDialog.clearDemoProgress();
        this.authDialog.close();
        this.demoWindow.location.replace(url);
        this.demoWindow.focus();
        this.demoWindow = null;
      })
      .catch((error: unknown) => this.handleDemoError(error))
      .finally(() => this.isLaunchingDemo.set(false));
  }

  /** Handle missing login separately and close temporary windows on other errors. */
  private handleDemoError(error: unknown): void {
    this.authDialog.clearDemoProgress();
    if (error instanceof PortfolioAuthenticationRequired) {
      this.showDemoAccessDialog.set(true);
      return;
    }
    this.closeDemoWindow();
    if (this.authDialog.isOpen()) this.authDialog.close();
    const denied =
      error instanceof HttpErrorResponse &&
      error.status === 403 &&
      error.url?.includes('/permission-api/');
    const message = denied
      ? this.translate.t().projects.demoAccessDenied
      : error instanceof HttpErrorResponse && error.status === 503
        ? this.translate.t().projects.demoUnavailable
        : this.translate.t().projects.demoLaunchFailed;
    this.statusDialog.showError(message);
  }

  /** Close the access prompt and cancel any pending browser context. */
  closeDemoAccessDialog(preservePending = false): void {
    this.showDemoAccessDialog.set(false);
    if (!preservePending) this.cancelPendingDemo();
  }

  /** Continue the pending demo only after the portfolio login succeeds. */
  openPortfolioLogin(): void {
    this.closeDemoAccessDialog(true);
    this.authDialog.setLoginSuccessHandler(() => {
      const project = this.pendingDemo;
      if (project) this.launchDemo(project);
    });
    this.authDialog.openLogin();
  }

  /** Registration never resumes a previously selected demo. */
  openPortfolioRegistration(): void {
    this.cancelPendingDemo();
    this.closeDemoAccessDialog(true);
    this.authDialog.setLoginSuccessHandler(undefined);
    this.authDialog.openLogin();
    this.authDialog.openRegister();
  }

  /** Cancel the pending demo and close its temporary browser context. */
  private cancelPendingDemo(): void {
    this.demoCancelled = true;
    this.pendingDemo = undefined;
    this.authDialog.setLoginSuccessHandler(undefined);
    this.authDialog.clearDemoProgress();
    this.closeDemoWindow();
  }

  /** Close and release the temporary demo window if it is still open. */
  private closeDemoWindow(): void {
    if (this.demoWindow && !this.demoWindow.closed) this.demoWindow.close();
    this.demoWindow = null;
    this.authDialog.setCloseHandler(undefined);
  }
}
