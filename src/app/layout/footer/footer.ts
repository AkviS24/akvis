import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslationService } from '../../shared/services/translation';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './footer.scss',
})
export class Footer {
  translate = inject(TranslationService);
}
