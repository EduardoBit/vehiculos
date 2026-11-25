import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm py-2">
      <div class="container">
        <!-- Brand -->
        <a class="navbar-brand d-flex align-items-center gap-2 fw-bold" routerLink="/catalogo">
          <i class="bi bi-speedometer2 text-danger fs-3"></i>
          <span>Auto<span class="text-danger">Elite</span> Motors</span>
        </a>

        <!-- Mobile Toggler -->
        <button
          class="navbar-toggler border-0"
          type="button"
          (click)="menuOpen = !menuOpen"
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar Links -->
        <div class="collapse navbar-collapse" [class.show]="menuOpen">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link px-3" routerLink="/catalogo" routerLinkActive="active" (click)="menuOpen = false">
                <i class="bi bi-grid-fill me-1"></i> Catálogo de Vehículos
              </a>
            </li>
            @if (authService.isAdmin()) {
              <li class="nav-item">
                <a class="nav-link px-3 text-warning fw-semibold" routerLink="/admin" routerLinkActive="active" (click)="menuOpen = false">
                  <i class="bi bi-shield-lock-fill me-1"></i> Gestión CRUD (Admin)
                </a>
              </li>
            }
          </ul>

          <!-- User Section -->
          <div class="d-flex align-items-center gap-2 mt-2 mt-lg-0">
            @if (authService.isAuthenticated()) {
              <div class="dropdown d-flex align-items-center gap-2 text-white me-2">
                <span class="badge" [class.bg-danger]="authService.isAdmin()" [class.bg-primary]="!authService.isAdmin()">
                  {{ authService.isAdmin() ? 'ADMIN' : 'CLIENTE' }}
                </span>
                <span class="small fw-semibold text-light d-none d-sm-inline">
                  {{ authService.currentUserSignal()?.nombreCompleto }}
                </span>
              </div>
              <button class="btn btn-outline-light btn-sm d-flex align-items-center gap-1" (click)="cerrarSesion()">
                <i class="bi bi-box-arrow-right"></i> Salir
              </button>
            } @else {
              <a routerLink="/login" class="btn btn-danger btn-sm px-3 d-flex align-items-center gap-1 shadow-sm">
                <i class="bi bi-person-fill"></i> Iniciar Sesión
              </a>
            }
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #111827 0%, #1f2937 100%) !important;
    }
    .navbar-brand {
      letter-spacing: 0.5px;
      font-size: 1.35rem;
    }
    .nav-link.active {
      color: #ffc107 !important;
      border-bottom: 2px solid #ffc107;
    }
  `]
})
export class NavbarComponent {
  menuOpen = false;

  constructor(public authService: AuthService, private router: Router) {}

  cerrarSesion(): void {
    this.authService.logout();
    this.menuOpen = false;
    this.router.navigate(['/catalogo']);
  }
}
