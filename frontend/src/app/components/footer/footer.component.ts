import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-dark text-white py-4 mt-auto border-top border-secondary">
      <div class="container text-center">
        <div class="d-flex justify-content-center align-items-center gap-2 mb-2">
          <i class="bi bi-speedometer2 text-danger fs-4"></i>
          <span class="fw-bold fs-5">Auto<span class="text-danger">Elite</span> Motors</span>
        </div>
        <p class="text-secondary small mb-2">
          Catálogo exclusivo de vehículos premium, deportivos, SUVs y camionetas de última generación.
        </p>
        <div class="text-muted small">
          &copy; 2026 AutoElite Motors - Desarrollado con Spring Boot & Angular
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
