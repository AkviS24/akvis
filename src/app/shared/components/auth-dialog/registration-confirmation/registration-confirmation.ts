import { Component, inject } from '@angular/core';

import { AuthDialog as AuthDialogService } from '../../../services/auth-dialog';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'app-registration-confirmation',
  imports: [],
  templateUrl: './registration-confirmation.html',
  styleUrl: './registration-confirmation.scss',
})
export class RegistrationConfirmation {
  authDialog = inject(AuthDialogService);
  translate = inject(TranslationService);
}
