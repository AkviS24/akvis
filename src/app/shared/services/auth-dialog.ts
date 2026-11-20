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
  passwordReset = signal<{ uid: string; token: string } | null>(null);
  passwordResetComplete = signal(false);
  activationResult = signal<boolean | null>(null);

  private animationTimeout?: ReturnType<typeof setTimeout>;
  private loginSuccessHandler?: () => void;
  private closeHandler?: () => void;

  /** Register the one-time action to resume after a successful login. */
  setLoginSuccessHandler(handler?: () => void): void {
    this.loginSuccessHandler = handler;
  }

  /** Register cleanup for a demo dialog closed while it is loading. */
  setCloseHandler(handler?: () => void): void {
    this.closeHandler = handler;
  }

  /** Run the pending post-login action and report whether it handled the login. */
  notifyLoginSuccess(): boolean {
    if (!this.loginSuccessHandler) return false;
    const handler = this.loginSuccessHandler;
    this.loginSuccessHandler = undefined;
    handler();
    return true;
  }

  openLogin(): void {
    this.clearAnimationTimeout();
    this.isClosing.set(false);
    this.mode.set('login');
    this.registrationComplete.set(false);
    this.passwordReset.set(null);
    this.passwordResetComplete.set(false);
    this.activationResult.set(null);
    this.isOpen.set(true);
  }

  /** Open the shared dialog with a password-reset token from the email link. */
  openPasswordReset(uid: string, token: string): void {
    this.openLogin();
    this.passwordReset.set({ uid, token });
  }

  /** Show the result of an email activation in the shared dialog. */
  openActivationResult(success: boolean): void {
    this.openLogin();
    this.activationResult.set(success);
  }

  /** Mark the password-reset confirmation as complete inside the dialog. */
  showPasswordResetComplete(): void {
    this.passwordResetComplete.set(true);
    this.passwordReset.set(null);
  }

  openRegister(): void {
    this.registrationComplete.set(false);
    this.passwordReset.set(null);
    this.passwordResetComplete.set(false);
    this.activationResult.set(null);
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
    this.closeHandler?.();
    this.closeHandler = undefined;
    this.loginSuccessHandler = undefined;

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
