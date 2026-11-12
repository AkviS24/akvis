import { Component, inject } from '@angular/core';
import { AuthDialog as AuthDialogService} from '../../services/auth-dialog';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-auth-dialog',
  imports: [],
  templateUrl: './auth-dialog.html',
  styleUrl: './auth-dialog.scss',
})
export class AuthDialog {
  authDialog = inject(AuthDialogService);
  translate = inject(TranslationService);
}
