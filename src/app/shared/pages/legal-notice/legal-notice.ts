import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-legal-notice',
  imports: [],
  templateUrl: './legal-notice.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './legal-notice.scss',
})
export class LegalNotice {
  translate = inject(TranslationService);
}
