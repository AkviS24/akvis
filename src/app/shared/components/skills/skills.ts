import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../../services/translation';

@Component({
  selector: 'app-skills',
  imports: [RouterModule],
  templateUrl: './skills.html',
  styleUrl: './skills.scss',
})
export class Skills {
  translate = inject(TranslationService);

  scrollToElement(id: string, event: Event): void {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
