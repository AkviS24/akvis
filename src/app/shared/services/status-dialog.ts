import { Injectable, signal } from '@angular/core';

export type StatusType = 'success' | 'error';

export interface StatusMessage {
  type: StatusType;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class StatusDialog {
  message = signal<StatusMessage | null>(null);

  private timeout?: ReturnType<typeof setTimeout>;

  isClosing = signal(false);

  private animationTimeout?: ReturnType<typeof setTimeout>;

  showSuccess(message: string): void {
    this.show(message, 'success', 3500);
  }

  showError(message: string): void {
    this.show(message, 'error', 5000);
  }

  private show(
    message: string,
    type: StatusType,
    duration: number,
  ): void {
    this.clearTimeout();
    this.isClosing.set(false);
    this.message.set({ message, type });
    this.timeout = setTimeout(() => this.close(), duration);
  }

  close(): void {
    if (!this.message() || this.isClosing()) return;

    this.clearTimeout();
    this.isClosing.set(true);

    this.animationTimeout = setTimeout(() => {
      this.message.set(null);
      this.isClosing.set(false);
      this.animationTimeout = undefined;
    }, 350);
  }

  private clearTimeout(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }

    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = undefined;
    }
  }
}