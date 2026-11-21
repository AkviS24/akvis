import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { StatusDialog as StatusDialogService } from '../../services/status-dialog';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-status-dialog',
  imports: [],
  templateUrl: './status-dialog.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './status-dialog.scss',
})
export class StatusDialog {
  statusDialog = inject(StatusDialogService);
  translate = inject(TranslationService);
}
