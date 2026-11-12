import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { TranslationService } from '../../shared/services/translation';
import { Lang } from '../../shared/services/translations';
import { AuthDialog as AuthDialogService } from '../../shared/services/auth-dialog';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  translate = inject(TranslationService);
  menuOpen = false;
  authDialog = inject(AuthDialogService);

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  setLang(lang: Lang): void {
    this.translate.setLang(lang);
  }

  openLogin(event: Event): void {
    event.preventDefault();
    this.menuOpen = false;
    this.authDialog.openLogin();
  }

  scrollToElement(id: string, event: Event): void {
    event.preventDefault();
    this.menuOpen = false;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
