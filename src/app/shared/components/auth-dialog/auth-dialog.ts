import { Component, effect, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, switchMap } from 'rxjs';

import { AuthDialog as AuthDialogService } from '../../services/auth-dialog';
import { AuthService } from '../../services/auth';
import { StatusDialog as StatusDialogService } from '../../services/status-dialog';
import { TranslationService } from '../../services/translation';
import { RegistrationConfirmation } from './registration-confirmation/registration-confirmation';

@Component({
  selector: 'app-auth-dialog',
  imports: [RegistrationConfirmation],
  templateUrl: './auth-dialog.html',
  styleUrl: './auth-dialog.scss',
})
export class AuthDialog {
  authDialog = inject(AuthDialogService);
  auth = inject(AuthService);
  statusDialog = inject(StatusDialogService);
  translate = inject(TranslationService);

  isSubmitting = false;
  isForgotPassword = false;

  constructor() {
    effect(() => {
      if (this.authDialog.isOpen()) this.isForgotPassword = false;
    });
  }

  /** Switch the existing dialog to the password-reset request form. */
  showForgotPassword(): void {
    this.isForgotPassword = true;
  }

  /** Return from the password-reset request form to login. */
  backToLogin(): void {
    this.isForgotPassword = false;
  }

  /** Request a password-reset email and report the result to the user. */
  requestPasswordReset(email: string): void {
    this.isSubmitting = true;
    this.auth.getCsrfCookie().pipe(
      switchMap(() => this.auth.requestPasswordReset(email)),
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => this.statusDialog.showSuccess(
        this.translate.t().auth.passwordResetRequestSent
      ),
      error: () => this.statusDialog.showError(
        this.translate.t().auth.passwordResetRequestFailed
      ),
    });
  }

  /** Authenticate the user and close the dialog after a successful login. */
  login(email: string, password: string): void {
    this.isSubmitting = true;

    this.auth.getCsrfCookie().pipe(
      switchMap(() => this.auth.login({ email, password })),
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: (response) => {
        this.statusDialog.showSuccess(response.detail);
        this.authDialog.close();
      },
      error: (error: HttpErrorResponse) => {
        this.statusDialog.showError(this.getErrorMessage(error, 'login'));
      },
    });
  }

  /** Register a new account and show the in-dialog confirmation on success. */
  register(
    email: string,
    username: string,
    password: string,
    passwordConfirm: string
  ): void {
    this.isSubmitting = true;

    this.auth.getCsrfCookie().pipe(
      switchMap(() => this.auth.register({
        email,
        username,
        password,
        password_confirm: passwordConfirm,
      })),
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => this.authDialog.showRegistrationComplete(),
      error: (error: HttpErrorResponse) => {
        this.statusDialog.showError(this.getErrorMessage(error, 'register'));
      },
    });
  }

  /** Resolve a backend authentication error into a localized user message. */
  private getErrorMessage(
    error: HttpErrorResponse,
    action: 'login' | 'register'
  ): string {
    const response = error.error as Record<string, unknown> | null;

    const detail = response?.['detail'];
    const nonFieldErrors = response?.['non_field_errors'];

    const message =
      typeof detail === 'string'
        ? detail
        : Array.isArray(nonFieldErrors) && typeof nonFieldErrors[0] === 'string'
          ? nonFieldErrors[0]
          : null;

    if (message === 'No active account found with the given credentials') {
      return this.translate.lang() === 'de'
        ? 'Anmeldung fehlgeschlagen. Bitte überprüfe deine Zugangsdaten oder aktiviere zuerst dein Konto.'
        : 'Login failed. Please check your credentials or activate your account first.';
    }

    if (message === 'Registration could not be completed.') {
      return this.translate.lang() === 'de'
        ? 'Registrierung nicht möglich. Bitte überprüfe deine Angaben.'
        : 'Registration could not be completed. Please check your details.';
    }

    if (message) {
      return message;
    }

    if (this.translate.lang() === 'de') {
      return action === 'login'
        ? 'Anmeldung fehlgeschlagen. Bitte überprüfe deine Eingaben.'
        : 'Registrierung fehlgeschlagen. Bitte überprüfe deine Eingaben.';
    }

    return action === 'login'
      ? 'Login failed. Please check your credentials.'
      : 'Registration failed. Please check your details.';
  }
}
