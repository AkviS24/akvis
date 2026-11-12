import { Component, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize, switchMap } from 'rxjs';

import { AuthDialog as AuthDialogService } from '../../services/auth-dialog';
import { AuthService } from '../../services/auth';
import { StatusDialog as StatusDialogService } from '../../services/status-dialog';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-auth-dialog',
  imports: [],
  templateUrl: './auth-dialog.html',
  styleUrl: './auth-dialog.scss',
})
export class AuthDialog {
  authDialog = inject(AuthDialogService);
  auth = inject(AuthService);
  statusDialog = inject(StatusDialogService);
  translate = inject(TranslationService);

  isSubmitting = false;

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
      next: (response) => {
        this.statusDialog.showSuccess(response.detail);
        this.authDialog.showLogin();
      },
      error: (error: HttpErrorResponse) => {
        this.statusDialog.showError(this.getErrorMessage(error, 'register'));
      },
    });
  }

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