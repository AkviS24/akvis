import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { AuthService } from '../../services/auth';
import { AuthDialog as AuthDialogService } from '../../services/auth-dialog';

/** Activate an account from its email link and report the result in AuthDialog. */
@Component({
  selector: 'app-activation',
  imports: [],
  templateUrl: './activation.html',
})
export class Activation {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly authDialog = inject(AuthDialogService);

  constructor() {
    const uid = this.route.snapshot.paramMap.get('uid') ?? '';
    const token = this.route.snapshot.paramMap.get('token') ?? '';
    if (!uid || !token) {
      this.authDialog.openActivationResult(false);
      return;
    }
    this.auth.getCsrfCookie().pipe(
      switchMap(() => this.auth.activate({ uid, token })),
    ).subscribe({
      next: () => this.authDialog.openActivationResult(true),
      error: () => this.authDialog.openActivationResult(false),
    });
  }
}
