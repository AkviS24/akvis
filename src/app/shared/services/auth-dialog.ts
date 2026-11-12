import { Injectable, signal } from '@angular/core';

export type AuthMode = 'login' | 'register';

@Injectable({
  providedIn: 'root',
})
export class AuthDialog {
  isOpen = signal(false);
  mode = signal<AuthMode>('login');

  openLogin(): void {
    this.mode.set('login');
    this.isOpen.set(true);
  }

  openRegister(): void {
    this.mode.set('register');
  }

  showLogin(): void {
    this.mode.set('login');
  }

  close(): void {
    this.isOpen.set(false);
  }
}
