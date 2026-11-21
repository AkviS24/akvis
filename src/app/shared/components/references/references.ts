import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-references',
  imports: [],
  templateUrl: './references.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './references.scss',
})
export class References {
  translate = inject(TranslationService);
}
