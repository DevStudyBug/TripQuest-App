import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  token: string | null;
  role: string | null;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private tokenKey = 'tripquest_token';
  private roleKey = 'tripquest_role';

  // Get JWT token from localStorage
  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Get user role
  get role(): string | null {
    return localStorage.getItem(this.roleKey);
  }

  //  Check if logged in
  isLoggedIn(): boolean {
    return !!this.token;
  }

  //  Register new user
  register(username: string, email: string, password: string) {
    const url = `${environment.apiBaseUrl}/auth/register`;
    return this.http.post<AuthResponse>(url, { username, email, password });
  }

  // Login user (Traveller or Admin)
  login(username: string, password: string) {
    const url = `${environment.apiBaseUrl}/auth/login`;
    return this.http.post<AuthResponse>(url, { username, password });
  }

  // Save token & role in localStorage
  saveSession(token: string, role: string) {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.roleKey, role);
  }

  //  Logout user & clear session
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  //  Redirect based on role (optional helper)
  redirectAfterLogin(role: string | null) {
    if (role === 'ROLE_ADMIN') {
      this.router.navigateByUrl('/admin', { replaceUrl: true });
    } else {
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    }
  }
}
