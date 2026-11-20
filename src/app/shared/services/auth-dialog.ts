import { Injectable, signal } from '@angular/core';

export type AuthMode = 'login' | 'register';

export interface DemoProgress {
  project: string;
  messages: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthDialog {
  isOpen = signal(false);
  isClosing = signal(false);
  mode = signal<AuthMode>('login');
  registrationComplete = signal(false);
  demoProgress = signal<DemoProgress | null>(null);

  private animationTimeout?: ReturnType<typeof setTimeout>;

  openLogin(): void {
    this.clearAnimationTimeout();
    this.isClosing.set(false);
    this.mode.set('login');
    this.registrationComplete.set(false);
    this.isOpen.set(true);
  }

  openRegister(): void {
    this.registrationComplete.set(false);
    this.mode.set('register');
  }

  showLogin(): void {
    this.mode.set('login');
  }

  showRegistrationComplete(): void {
    this.registrationComplete.set(true);
  }

  startDemoProgress(project: string, message: string): void {
    this.demoProgress.set({ project, messages: [message] });
    this.isOpen.set(true);
  }

  updateDemoProgress(message: string): void {
    const progress = this.demoProgress();
    if (!progress) return;
    this.demoProgress.set({
      ...progress,
      messages: [...progress.messages, message].slice(-6),
    });
  }

  clearDemoProgress(): void {
    this.demoProgress.set(null);
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
