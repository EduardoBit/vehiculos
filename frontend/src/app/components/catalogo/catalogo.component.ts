import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculoService } from '../../services/vehiculo.service';
import { Vehiculo } from '../../models/vehiculo.model';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- HERO SECTION -->
    <section class="hero-section text-white py-5 position-relative">
      <div class="container py-4">
        <div class="row align-items-center">
          <div class="col-lg-7">
            <span class="badge bg-danger px-3 py-2 text-uppercase mb-3 fw-bold">Catálogo Exclusivo 2026</span>
            <h1 class="display-4 fw-extrabold mb-3">Encuentra el Vehículo de tus Sueños</h1>
            <p class="lead text-light opacity-90 mb-4">
              Explora nuestra cuidada selección de deportivos, SUVs, sedanes y camionetas con los más altos estándares de calidad y garantía certificada.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- FILTERS AND SEARCH SECTION -->
    <div class="container my-4">
      <div class="card shadow-sm border-0 rounded-3 p-3 bg-white">
        <div class="row g-3 align-items-end">
          <!-- Text Search -->
          <div class="col-12 col-md-4 col-lg-3">
            <label class="form-label small fw-semibold text-secondary">Búsqueda rápida</label>
            <div class="input-group">
              <span class="input-group-text bg-light"><i class="bi bi-search"></i></span>
              <input
                type="text"
                class="form-control"
                placeholder="Marca, modelo o estilo..."
                [(ngModel)]="filtroBusqueda"
                (input)="aplicarFiltros()">
            </div>
          </div>

          <!-- Brand Filter -->
          <div class="col-6 col-md-3 col-lg-2">
            <label class="form-label small fw-semibold text-secondary">Marca</label>
            <select class="form-select" [(ngModel)]="filtroMarca" (change)="aplicarFiltros()">
              <option value="">Todas las marcas</option>
              @for (marca of marcas; track marca) {
                <option [value]="marca">{{ marca }}</option>
              }
            </select>
          </div>

          <!-- Category Filter -->
          <div class="col-6 col-md-3 col-lg-2">
            <label class="form-label small fw-semibold text-secondary">Categoría</label>
            <select class="form-select" [(ngModel)]="filtroCategoria" (change)="aplicarFiltros()">
              <option value="">Todas</option>
              @for (cat of categorias; track cat) {
                <option [value]="cat">{{ cat }}</option>
              }
            </select>
          </div>

          <!-- Clear Filters Button -->
          <div class="col-12 col-md-2 col-lg-2 text-end">
            <button class="btn btn-outline-secondary w-100" (click)="limpiarFiltros()">
              <i class="bi bi-arrow-counterclockwise"></i> Reiniciar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- VEHICLES CATALOG GRID -->
    <div class="container mb-5">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="fw-bold mb-0 text-dark">
          Vehículos Disponibles <span class="badge bg-secondary ms-2">{{ vehiculos.length }}</span>
        </h4>
      </div>

      <!-- Loading State -->
      @if (cargando) {
        <div class="text-center py-5">
          <div class="spinner-border text-danger" style="width: 3rem; height: 3rem;" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-3 text-secondary">Cargando catálogo de vehículos...</p>
        </div>
      }

      <!-- Empty State -->
      @if (!cargando && vehiculos.length === 0) {
        <div class="text-center py-5 bg-white rounded-3 shadow-sm my-3 p-5">
          <i class="bi bi-car-front text-muted fs-1 mb-3 d-block"></i>
          <h5 class="fw-bold text-secondary">No se encontraron vehículos</h5>
          <p class="text-muted small">Prueba modificando los filtros o el término de búsqueda.</p>
          <button class="btn btn-danger btn-sm" (click)="limpiarFiltros()">Restablecer Filtros</button>
        </div>
      }

      <!-- Grid Cards -->
      <div class="row g-4">
        @for (vehiculo of vehiculos; track vehiculo.id) {
          <div class="col-12 col-md-6 col-lg-4">
            <div class="card vehicle-card h-100 border-0 shadow-sm">
              <div class="img-container">
                <img
                  [src]="vehiculo.imagenUrl || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80'"
                  class="card-img-top"
                  [alt]="vehiculo.marca + ' ' + vehiculo.modelo"
                  loading="lazy">
                <span class="badge bg-danger badge-category shadow-sm">{{ vehiculo.categoria }}</span>
                <span class="badge badge-overlay shadow-sm" [class.bg-success]="vehiculo.disponible" [class.bg-secondary]="!vehiculo.disponible">
                  {{ vehiculo.disponible ? 'Disponible' : 'Reservado' }}
                </span>
              </div>

              <div class="card-body d-flex flex-direction-column flex-column justify-content-between p-3">
                <div>
                  <div class="text-secondary small fw-bold text-uppercase">{{ vehiculo.marca }}</div>
                  <h5 class="card-title fw-bold text-dark mb-1">{{ vehiculo.modelo }}</h5>
                  <div class="text-muted small mb-2"><i class="bi bi-calendar-event me-1"></i> Año {{ vehiculo.anio }}</div>

                  <!-- Quick Specs Icons -->
                  <div class="d-flex flex-wrap gap-2 py-2 border-top border-bottom small text-secondary my-2">
                    <span title="Transmisión"><i class="bi bi-gear me-1"></i>{{ vehiculo.transmision }}</span>
                    <span class="text-muted">•</span>
                    <span title="Combustible"><i class="bi bi-fuel-pump me-1"></i>{{ vehiculo.combustible }}</span>
                    <span class="text-muted">•</span>
                    <span title="Kilometraje"><i class="bi bi-speedometer me-1"></i>{{ vehiculo.kilometraje | number }} km</span>
                  </div>
                </div>

                <div class="pt-2">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="text-secondary small">Precio de contado:</span>
                    <span class="price-tag">{{ vehiculo.precio | currency:'USD':'symbol':'1.0-0' }}</span>
                  </div>

                  <button
                    class="btn btn-outline-dark w-100 fw-semibold d-flex align-items-center justify-content-center gap-2"
                    (click)="abrirDetalle(vehiculo)">
                    <i class="bi bi-eye"></i> Ver Ficha Técnica
                  </button>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- MODAL DE DETALLE DEL VEHÍCULO -->
    @if (vehiculoSeleccionado) {
      <div class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div class="modal-content rounded-4 border-0 shadow-lg overflow-hidden">
            <div class="modal-header bg-dark text-white border-0 py-3">
              <h5 class="modal-title fw-bold">
                <i class="bi bi-car-front-fill text-danger me-2"></i>
                {{ vehiculoSeleccionado.marca }} {{ vehiculoSeleccionado.modelo }} ({{ vehiculoSeleccionado.anio }})
              </h5>
              <button type="button" class="btn-close btn-close-white" (click)="cerrarDetalle()" aria-label="Close"></button>
            </div>

            <div class="modal-body p-4">
              <div class="row g-4">
                <div class="col-12 col-md-6">
                  <img
                    [src]="vehiculoSeleccionado.imagenUrl"
                    class="img-fluid rounded-3 shadow-sm mb-3 w-100"
                    style="height: 260px; object-fit: cover;"
                    [alt]="vehiculoSeleccionado.modelo">

                  <div class="card bg-light border-0 p-3 rounded-3 text-center">
                    <span class="text-secondary small">Precio de Venta</span>
                    <span class="text-success fs-3 fw-bold">{{ vehiculoSeleccionado.precio | currency:'USD':'symbol':'1.0-0' }}</span>
                    <span class="badge bg-success mx-auto mt-1 px-3 py-1">Disponibilidad Inmediata</span>
                  </div>
                </div>

                <div class="col-12 col-md-6">
                  <h6 class="fw-bold text-dark border-bottom pb-2">Especificaciones Técnicas</h6>
                  <ul class="list-group list-group-flush small mb-3">
                    <li class="list-group-item d-flex justify-content-between px-0">
                      <span class="text-secondary"><i class="bi bi-tag me-1"></i> Categoría:</span>
                      <strong class="text-dark">{{ vehiculoSeleccionado.categoria }}</strong>
                    </li>
                    <li class="list-group-item d-flex justify-content-between px-0">
                      <span class="text-secondary"><i class="bi bi-calendar me-1"></i> Año:</span>
                      <strong class="text-dark">{{ vehiculoSeleccionado.anio }}</strong>
                    </li>
                    <li class="list-group-item d-flex justify-content-between px-0">
                      <span class="text-secondary"><i class="bi bi-speedometer me-1"></i> Kilometraje:</span>
                      <strong class="text-dark">{{ vehiculoSeleccionado.kilometraje | number }} km</strong>
                    </li>
                    <li class="list-group-item d-flex justify-content-between px-0">
                      <span class="text-secondary"><i class="bi bi-fuel-pump me-1"></i> Combustible:</span>
                      <strong class="text-dark">{{ vehiculoSeleccionado.combustible }}</strong>
                    </li>
                    <li class="list-group-item d-flex justify-content-between px-0">
                      <span class="text-secondary"><i class="bi bi-gear me-1"></i> Transmisión:</span>
                      <strong class="text-dark">{{ vehiculoSeleccionado.transmision }}</strong>
                    </li>
                    <li class="list-group-item d-flex justify-content-between px-0">
                      <span class="text-secondary"><i class="bi bi-palette me-1"></i> Color:</span>
                      <strong class="text-dark">{{ vehiculoSeleccionado.color }}</strong>
                    </li>
                  </ul>

                  <h6 class="fw-bold text-dark border-bottom pb-2">Descripción del Vehículo</h6>
                  <p class="text-secondary small">
                    {{ vehiculoSeleccionado.descripcion || 'Sin descripción adicional.' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="modal-footer bg-light border-0 py-3">
              <button type="button" class="btn btn-secondary btn-sm" (click)="cerrarDetalle()">Cerrar</button>
              <button type="button" class="btn btn-danger btn-sm px-4 fw-semibold" (click)="solicitarContacto()">
                <i class="bi bi-telephone-fill me-1"></i> Solicitar Información / Test Drive
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(rgba(17, 24, 39, 0.88), rgba(17, 24, 39, 0.88)),
                  url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80') center/cover no-repeat;
    }
  `]
})
export class CatalogoComponent implements OnInit {
  vehiculos: Vehiculo[] = [];
  marcas: string[] = [];
  categorias: string[] = [];
  cargando = true;

  // Filtros
  filtroBusqueda = '';
  filtroMarca = '';
  filtroCategoria = '';

  vehiculoSeleccionado: Vehiculo | null = null;

  constructor(private vehiculoService: VehiculoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.cdr.detectChanges();
    this.vehiculoService.getVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar vehículos', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });

    this.vehiculoService.getMarcas().subscribe({
      next: (data) => {
        this.marcas = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });

    this.vehiculoService.getCategorias().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  aplicarFiltros(): void {
    this.cargando = true;
    this.cdr.detectChanges();
    this.vehiculoService.getVehiculos({
      marca: this.filtroMarca || undefined,
      categoria: this.filtroCategoria || undefined,
      busqueda: this.filtroBusqueda || undefined
    }).subscribe({
      next: (data) => {
        this.vehiculos = data;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFiltros(): void {
    this.filtroBusqueda = '';
    this.filtroMarca = '';
    this.filtroCategoria = '';
    this.aplicarFiltros();
  }

  abrirDetalle(vehiculo: Vehiculo): void {
    this.vehiculoSeleccionado = vehiculo;
  }

  cerrarDetalle(): void {
    this.vehiculoSeleccionado = null;
  }

  solicitarContacto(): void {
    alert(`¡Gracias por tu interés en el ${this.vehiculoSeleccionado?.marca} ${this.vehiculoSeleccionado?.modelo}! Un asesor de ventas se pondrá en contacto contigo pronto.`);
    this.cerrarDetalle();
  }
}
