import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthResponse {
  detail: string;
}

export interface AuthStatusResponse {
  authenticated: true;
}

export interface DemoAssertionResponse {
  assertion: string;
  expires_in: number;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ActivationData {
  uid: string;
  token: string;
}

export interface PasswordResetConfirmData extends ActivationData {
  password: string;
  password_confirm: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly apiUrl = '/api/auth/';

  getCsrfCookie(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(
      this.apiUrl + 'csrf/',
      { withCredentials: true }
    );
  }

  getStatus(): Observable<AuthStatusResponse> {
    return this.http.get<AuthStatusResponse>(
      this.apiUrl + 'me/',
      { withCredentials: true }
    );
  }

  createDemoAssertion(project: string): Observable<DemoAssertionResponse> {
    return this.http.post<DemoAssertionResponse>(
      this.apiUrl + 'demo-assertion/',
      { project, resource: 'live-demo' },
      { withCredentials: true }
    );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.apiUrl + 'register/',
      data,
      { withCredentials: true }
    );
  }

  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.apiUrl + 'login/',
      data,
      { withCredentials: true }
    );
  }

  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.apiUrl + 'logout/',
      {},
      { withCredentials: true }
    );
  }

  refresh(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.apiUrl + 'refresh/',
      {},
      { withCredentials: true }
    );
  }

  activate(data: ActivationData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.apiUrl + 'activate/',
      data,
      { withCredentials: true }
    );
  }

  requestPasswordReset(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.apiUrl + 'password-reset/',
      { email },
      { withCredentials: true }
    );
  }

  confirmPasswordReset(data: PasswordResetConfirmData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      this.apiUrl + 'password-reset/confirm/',
      data,
      { withCredentials: true }
    );
  }
}
