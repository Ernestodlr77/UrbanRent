import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  user: {
    id?: number;
    fullName?: string;
    email: string;
    role?: string;
  };
}

interface RegistrationData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: 'LANDLORD' | 'TENANT';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  register(data: RegistrationData): Observable<{ message: string; user: AuthResponse['user'] }> {
    return this.http.post<{ message: string; user: AuthResponse['user'] }>(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getStoredUser(): AuthResponse['user'] | null {
    const user = localStorage.getItem('user');
    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as AuthResponse['user'];
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getProfile() { return this.http.get<any>(`${this.apiUrl}/me`); }

  updateProfile(data: {fullName:string; phone?:string}) { return this.http.put<any>(`${this.apiUrl}/me`, data); }

  getUserRole(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  }
}