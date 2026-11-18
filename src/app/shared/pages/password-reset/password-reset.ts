import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap } from 'rxjs';

import { AuthService } from '../../services/auth';
import { StatusDialog as StatusDialogService } from '../../services/status-dialog';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-password-reset',
  imports: [],
  templateUrl: './password-reset.html',
  styleUrl: './password-reset.scss',
})
export class PasswordReset {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(AuthService);
  private statusDialog = inject(StatusDialogService);
  translate = inject(TranslationService);

  isSubmitting = false;
  private uid = this.route.snapshot.paramMap.get('uid') ?? '';
  private token = this.route.snapshot.paramMap.get('token') ?? '';

  resetPassword(password: string, passwordConfirm: string): void {
    if (password !== passwordConfirm) {
      this.statusDialog.showError(this.translate.t().auth.passwordMismatch);
      return;
    }

    this.isSubmitting = true;
    this.auth.getCsrfCookie().pipe(
      switchMap(() => this.auth.confirmPasswordReset({
        uid: this.uid,
        token: this.token,
        password,
        password_confirm: passwordConfirm,
      })),
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => {
        this.statusDialog.showSuccess(this.translate.t().auth.passwordResetSuccess);
        void this.router.navigateByUrl('/');
      },
      error: () => this.statusDialog.showError(
        this.translate.t().auth.passwordResetFailed
      ),
    });
  }
}
