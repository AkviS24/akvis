import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-hero',
  imports: [ RouterModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  translate = inject(TranslationService);

  scrollToElement(id: string, event: Event): void {
  event.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
}
