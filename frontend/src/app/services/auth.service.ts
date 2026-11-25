import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest, UsuarioInfo } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private tokenKey = 'vehiculos_token';
  private userKey = 'vehiculos_user';

  currentUserSignal = signal<UsuarioInfo | null>(this.obtenerUsuarioGuardado());

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res && res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          const userInfo: UsuarioInfo = {
            id: res.id,
            username: res.username,
            nombreCompleto: res.nombreCompleto,
            email: res.email,
            rol: res.rol
          };
          localStorage.setItem(this.userKey, JSON.stringify(userInfo));
          this.currentUserSignal.set(userInfo);
        }
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserSignal();
    return user ? user.rol === 'ROLE_ADMIN' : false;
  }

  getCurrentUser(): UsuarioInfo | null {
    return this.currentUserSignal();
  }

  private obtenerUsuarioGuardado(): UsuarioInfo | null {
    try {
      const stored = localStorage.getItem(this.userKey);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
