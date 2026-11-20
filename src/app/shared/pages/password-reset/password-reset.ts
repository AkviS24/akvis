import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthDialog as AuthDialogService } from '../../services/auth-dialog';

/** Open the shared authentication dialog with the password-reset email token. */
@Component({
  selector: 'app-password-reset',
  imports: [],
  templateUrl: './password-reset.html',
})
export class PasswordReset {
  private readonly route = inject(ActivatedRoute);
  private readonly authDialog = inject(AuthDialogService);

  constructor() {
    const uid = this.route.snapshot.paramMap.get('uid') ?? '';
    const token = this.route.snapshot.paramMap.get('token') ?? '';
    this.authDialog.openPasswordReset(uid, token);
  }
}
