import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-privacy-policy',
  imports: [],
  templateUrl: './privacy-policy.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './privacy-policy.scss',
})
export class PrivacyPolicy {
  translate = inject(TranslationService);
}
