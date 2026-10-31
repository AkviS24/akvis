import { Injectable, computed, signal } from '@angular/core';
import { Lang, TRANSLATIONS } from './translations';

const STORAGE_KEY = 'portfolio-lang';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  readonly lang = signal<Lang>(this.loadInitialLang());
  readonly t = computed(() => TRANSLATIONS[this.lang()]);

  setLang(lang: Lang): void {
    this.lang.set(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // The selected language remains active for the current session.
    }
  }

  private loadInitialLang(): Lang {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'de' || stored === 'en' ? stored : 'en';
    } catch {
      return 'en';
    }
  }
}
