import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [ RouterModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
})
export class Hero {
  scrollToElement(id: string, event: Event): void {
  event.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
}
