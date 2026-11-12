import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuthResponse {
  detail: string;
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

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly apiUrl = '/api/auth/';

  getCsrfCookie(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(
      `${this.apiUrl}csrf/`,
      { withCredentials: true }
    );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}register/`,
      data,
      { withCredentials: true }
    );
  }

  login(data: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}login/`,
      data,
      { withCredentials: true }
    );
  }

  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}logout/`,
      {},
      { withCredentials: true }
    );
  }

  refresh(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}refresh/`,
      {},
      { withCredentials: true }
    );
  }

  activate(data: ActivationData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}activate/`,
      data,
      { withCredentials: true }
    );
  }
}
