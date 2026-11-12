import { Injectable, signal } from '@angular/core';

export type AuthMode = 'login' | 'register';

@Injectable({
  providedIn: 'root',
})
export class AuthDialog {
  isOpen = signal(false);
  isClosing = signal(false);
  mode = signal<AuthMode>('login');

  private animationTimeout?: ReturnType<typeof setTimeout>;

  openLogin(): void {
    this.clearAnimationTimeout();
    this.isClosing.set(false);
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
    if (!this.isOpen() || this.isClosing()) return;

    this.isClosing.set(true);
    this.animationTimeout = setTimeout(() => {
      this.isOpen.set(false);
      this.isClosing.set(false);
      this.animationTimeout = undefined;
    }, 350);
  }

  private clearAnimationTimeout(): void {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = undefined;
    }
  }
}