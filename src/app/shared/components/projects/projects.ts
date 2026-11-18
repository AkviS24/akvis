import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { finalize, switchMap } from 'rxjs';

import { AuthService } from '../../services/auth';
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
  private auth = inject(AuthService);
  private authDialog = inject(AuthDialogService);
  private statusDialog = inject(StatusDialogService);

  isCheckingKanMindAccess = signal(false);
  showKanMindAccessDialog = signal(false);

  openKanMindDemo(): void {
    if (this.isCheckingKanMindAccess()) return;

    this.isCheckingKanMindAccess.set(true);
    this.auth.getCsrfCookie().pipe(
      switchMap(() => this.auth.refresh()),
      finalize(() => this.isCheckingKanMindAccess.set(false))
    ).subscribe({
      next: () => window.location.assign('https://ak-coding.de/kanmind/'),
      error: (error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.showKanMindAccessDialog.set(true);
          return;
        }

        this.statusDialog.showError(
          this.translate.t().projects.kanmindAccessCheckFailed
        );
      },
    });
  }

  closeKanMindAccessDialog(): void {
    this.showKanMindAccessDialog.set(false);
  }

  openPortfolioLogin(): void {
    this.closeKanMindAccessDialog();
    this.authDialog.openLogin();
  }

  openPortfolioRegistration(): void {
    this.closeKanMindAccessDialog();
    this.authDialog.openLogin();
    this.authDialog.openRegister();
  }
}
