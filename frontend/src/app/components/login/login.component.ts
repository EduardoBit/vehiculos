import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest, RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-12 col-md-8 col-lg-5">
          <div class="card shadow-lg border-0 rounded-4 overflow-hidden">
            <!-- Header -->
            <div class="card-header bg-dark text-white text-center py-4 border-0 position-relative">
              <i class="bi bi-shield-lock-fill text-danger fs-1"></i>
              <h3 class="fw-bold mt-2 mb-0">Acceso a Auto<span class="text-danger">Elite</span></h3>
              <p class="text-secondary small mb-0">Gestión de Catálogo & Tienda de Vehículos</p>
            </div>

            <!-- Tab Switcher -->
            <div class="d-flex border-bottom bg-light">
              <button
                class="btn flex-fill py-3 border-0 rounded-0 fw-semibold"
                [class.bg-white]="isLoginMode"
                [class.text-danger]="isLoginMode"
                (click)="isLoginMode = true; mensajeError = ''; mensajeExito = ''">
                <i class="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesión
              </button>
              <button
                class="btn flex-fill py-3 border-0 rounded-0 fw-semibold text-muted"
                [class.bg-white]="!isLoginMode"
                [class.text-danger]="!isLoginMode"
                (click)="isLoginMode = false; mensajeError = ''; mensajeExito = ''">
                <i class="bi bi-person-plus me-1"></i> Registrarse
              </button>
            </div>

            <div class="card-body p-4">
              <!-- Alerts -->
              @if (mensajeError) {
                <div class="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                  <i class="bi bi-exclamation-triangle-fill"></i>
                  <span>{{ mensajeError }}</span>
                </div>
              }

              @if (mensajeExito) {
                <div class="alert alert-success py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                  <i class="bi bi-check-circle-fill"></i>
                  <span>{{ mensajeExito }}</span>
                </div>
              }

              <!-- FORM: INICIAR SESION -->
              @if (isLoginMode) {
                <form (ngSubmit)="onLogin()">
                  <div class="mb-3">
                    <label class="form-label fw-semibold small">Usuario</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light"><i class="bi bi-person"></i></span>
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Ingresa tu usuario"
                        [(ngModel)]="loginData.username"
                        name="username"
                        required>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-semibold small">Contraseña</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light"><i class="bi bi-key"></i></span>
                      <input
                        type="password"
                        class="form-control"
                        placeholder="••••••••"
                        [(ngModel)]="loginData.password"
                        name="password"
                        required>
                    </div>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-danger w-100 py-2 fw-semibold shadow-sm mb-3"
                    [disabled]="cargando">
                    @if (cargando) {
                      <span class="spinner-border spinner-border-sm me-2"></span> Iniciando...
                    } @else {
                      <i class="bi bi-box-arrow-in-right me-1"></i> Entrar al Sistema
                    }
                  </button>

                </form>
              } @else {
                <!-- FORM: REGISTRO -->
                <form (ngSubmit)="onRegister()">
                  <div class="mb-3">
                    <label class="form-label fw-semibold small">Nombre Completo</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Ej. Roberto Gómez"
                      [(ngModel)]="registerData.nombreCompleto"
                      name="nombreCompleto"
                      required>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold small">Correo Electrónico</label>
                    <input
                      type="email"
                      class="form-control"
                      placeholder="roberto@email.com"
                      [(ngModel)]="registerData.email"
                      name="email"
                      required>
                  </div>

                  <div class="mb-3">
                    <label class="form-label fw-semibold small">Nombre de Usuario</label>
                    <input
                      type="text"
                      class="form-control"
                      placeholder="robertog"
                      [(ngModel)]="registerData.username"
                      name="regUsername"
                      required>
                  </div>

                  <div class="mb-4">
                    <label class="form-label fw-semibold small">Contraseña</label>
                    <input
                      type="password"
                      class="form-control"
                      placeholder="Mínimo 6 caracteres"
                      [(ngModel)]="registerData.password"
                      name="regPassword"
                      required>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-dark w-100 py-2 fw-semibold shadow-sm"
                    [disabled]="cargando">
                    @if (cargando) {
                      <span class="spinner-border spinner-border-sm me-2"></span> Registrando...
                    } @else {
                      <i class="bi bi-person-check me-1"></i> Crear Cuenta
                    }
                  </button>
                </form>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  isLoginMode = true;
  cargando = false;
  mensajeError = '';
  mensajeExito = '';

  loginData: LoginRequest = {
    username: '',
    password: ''
  };

  registerData: RegisterRequest = {
    username: '',
    password: '',
    nombreCompleto: '',
    email: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onLogin(): void {
    if (!this.loginData.username || !this.loginData.password) {
      this.mensajeError = 'Por favor, ingresa tu usuario y contraseña.';
      this.cdr.detectChanges();
      return;
    }

    this.cargando = true;
    this.mensajeError = '';
    this.cdr.detectChanges();

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        this.cargando = false;
        this.cdr.detectChanges();
        if (res.rol === 'ROLE_ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/catalogo']);
        }
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = err.error?.mensaje || 'Error al iniciar sesión. Verifica tus credenciales.';
        this.cdr.detectChanges();
      }
    });
  }

  onRegister(): void {
    if (!this.registerData.username || !this.registerData.password || !this.registerData.nombreCompleto || !this.registerData.email) {
      this.mensajeError = 'Por favor, completa todos los campos del registro.';
      this.cdr.detectChanges();
      return;
    }

    this.cargando = true;
    this.mensajeError = '';
    this.mensajeExito = '';
    this.cdr.detectChanges();

    this.authService.register(this.registerData).subscribe({
      next: (res) => {
        this.cargando = false;
        this.mensajeExito = res.mensaje || 'Registro exitoso. ¡Ahora puedes iniciar sesión!';
        this.isLoginMode = true;
        this.loginData.username = this.registerData.username;
        this.loginData.password = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        this.mensajeError = err.error?.mensaje || 'Error al registrar usuario.';
        this.cdr.detectChanges();
      }
    });
  }
}
