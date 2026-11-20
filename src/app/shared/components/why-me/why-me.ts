import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-why-me',
  imports: [RouterModule],
  templateUrl: './why-me.html',
  styleUrl: './why-me.scss',
})
export class WhyMe {
  translate = inject(TranslationService);

  scrollToElement(id: string, event: Event): void {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
