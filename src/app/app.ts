import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./layout/header/header";
import { Footer } from "./layout/footer/footer";
import { AuthDialog } from './shared/components/auth-dialog/auth-dialog';
import { StatusDialog } from './shared/components/status-dialog/status-dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, AuthDialog, StatusDialog],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('akvis');
}
