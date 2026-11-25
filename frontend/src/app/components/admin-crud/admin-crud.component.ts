import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculoService } from '../../services/vehiculo.service';
import { Vehiculo } from '../../models/vehiculo.model';

@Component({
  selector: 'app-admin-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <!-- HEADER & ACTIONS -->
      <div class="card shadow-sm border-0 rounded-4 bg-dark text-white p-4 mb-4">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <div class="d-flex align-items-center gap-2 mb-1">
              <span class="badge bg-danger px-3 py-1 text-uppercase">Panel de Administración</span>
              <span class="badge bg-secondary">Rol: ADMIN</span>
            </div>
            <h2 class="fw-bold mb-0">Gestión de Catálogo de Vehículos (CRUD)</h2>
            <p class="text-secondary small mb-0 mt-1">Crea, modifica, visualiza y elimina vehículos en tiempo real con la API REST de Spring Boot.</p>
          </div>

          <div>
            <button class="btn btn-danger px-4 py-2 fw-semibold shadow-sm d-flex align-items-center gap-2" (click)="abrirModalCrear()">
              <i class="bi bi-plus-circle-fill fs-5"></i>
              <span>Nuevo Vehículo</span>
            </button>
          </div>
        </div>

        <!-- KPI Mini Cards -->
        <div class="row g-3 mt-3 pt-3 border-top border-secondary">
          <div class="col-6 col-md-3">
            <div class="text-secondary small">Total Vehículos</div>
            <div class="fs-4 fw-bold text-white">{{ vehiculos.length }}</div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-secondary small">Disponibles</div>
            <div class="fs-4 fw-bold text-success">{{ getDisponiblesCount() }}</div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-secondary small">Precio Promedio</div>
            <div class="fs-4 fw-bold text-warning">{{ getPrecioPromedio() | currency:'USD':'symbol':'1.0-0' }}</div>
          </div>
          <div class="col-6 col-md-3">
            <div class="text-secondary small">Categorías Activas</div>
            <div class="fs-4 fw-bold text-info">{{ categoriasUnicas.length }}</div>
          </div>
        </div>
      </div>

      <!-- ALERTS -->
      @if (mensajeAlerta) {
        <div class="alert alert-dismissible fade show shadow-sm" [class.alert-success]="tipoAlerta === 'success'" [class.alert-danger]="tipoAlerta === 'danger'" role="alert">
          <i class="bi" [class.bi-check-circle-fill]="tipoAlerta === 'success'" [class.bi-exclamation-triangle-fill]="tipoAlerta === 'danger'"></i>
          <span class="ms-2 fw-semibold">{{ mensajeAlerta }}</span>
          <button type="button" class="btn-close" (click)="mensajeAlerta = ''" aria-label="Close"></button>
        </div>
      }

      <!-- TABLE CONTROLS -->
      <div class="card shadow-sm border-0 rounded-4 overflow-hidden bg-white mb-4">
        <div class="card-header bg-white py-3 border-bottom d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
          <h5 class="fw-bold mb-0 text-dark">Inventario Actual</h5>
          <div class="input-group" style="max-width: 320px;">
            <span class="input-group-text bg-light"><i class="bi bi-search"></i></span>
            <input
              type="text"
              class="form-control form-control-sm"
              placeholder="Filtrar por marca, modelo o categoría..."
              [(ngModel)]="terminoFiltro"
              (input)="filtrarTabla()">
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light text-secondary small">
              <tr>
                <th scope="col" class="ps-4">Vehículo</th>
                <th scope="col">Año / Cat</th>
                <th scope="col">Precio</th>
                <th scope="col">Kilometraje</th>
                <th scope="col">Especificaciones</th>
                <th scope="col">Estado</th>
                <th scope="col" class="text-end pe-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              @if (cargando) {
                <tr>
                  <td colspan="7" class="text-center py-5">
                    <div class="spinner-border text-danger spinner-border-sm" role="status"></div>
                    <span class="ms-2 text-secondary">Cargando vehículos...</span>
                  </td>
                </tr>
              }

              @if (!cargando && vehiculosFiltrados.length === 0) {
                <tr>
                  <td colspan="7" class="text-center py-4 text-muted">
                    No se encontraron vehículos registrados.
                  </td>
                </tr>
              }

              @for (v of vehiculosFiltrados; track v.id) {
                <tr>
                  <!-- Vehicle photo & name -->
                  <td class="ps-4">
                    <div class="d-flex align-items-center gap-3">
                      <img
                        [src]="v.imagenUrl || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=120&q=80'"
                        class="rounded-3 shadow-sm"
                        style="width: 58px; height: 42px; object-fit: cover;"
                        [alt]="v.modelo">
                      <div>
                        <div class="fw-bold text-dark">{{ v.marca }} {{ v.modelo }}</div>
                        <span class="text-secondary small">{{ v.color }}</span>
                      </div>
                    </div>
                  </td>

                  <!-- Year & Category -->
                  <td>
                    <div class="fw-semibold text-dark">{{ v.anio }}</div>
                    <span class="badge bg-light text-dark border small">{{ v.categoria }}</span>
                  </td>

                  <!-- Price -->
                  <td>
                    <span class="fw-bold text-success fs-6">{{ v.precio | currency:'USD':'symbol':'1.0-0' }}</span>
                  </td>

                  <!-- Kilometers -->
                  <td>
                    <span class="text-secondary small">{{ v.kilometraje | number }} km</span>
                  </td>

                  <!-- Specs -->
                  <td>
                    <div class="small text-secondary">{{ v.combustible }}</div>
                    <div class="small text-muted">{{ v.transmision }}</div>
                  </td>

                  <!-- Status -->
                  <td>
                    @if (v.disponible) {
                      <span class="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">
                        <i class="bi bi-check-circle me-1"></i>Disponible
                      </span>
                    } @else {
                      <span class="badge bg-secondary-subtle text-secondary border border-secondary-subtle px-2 py-1">
                        <i class="bi bi-x-circle me-1"></i>No Disp.
                      </span>
                    }
                  </td>

                  <!-- Actions -->
                  <td class="text-end pe-4">
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" title="Editar Vehículo" (click)="abrirModalEditar(v)">
                        <i class="bi bi-pencil-square"></i>
                      </button>
                      <button class="btn btn-outline-danger" title="Eliminar Vehículo" (click)="abrirModalEliminar(v)">
                        <i class="bi bi-trash3-fill"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL FORMULARIO CREAR / EDITAR VEHICULO -->
    @if (modalFormAbierto) {
      <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content rounded-4 border-0 shadow-lg">
            <div class="modal-header bg-dark text-white border-0 py-3">
              <h5 class="modal-title fw-bold">
                <i class="bi text-danger me-2" [class.bi-plus-circle-fill]="!modoEdicion" [class.bi-pencil-square]="modoEdicion"></i>
                {{ modoEdicion ? 'Editar Vehículo' : 'Registrar Nuevo Vehículo' }}
              </h5>
              <button type="button" class="btn-close btn-close-white" (click)="cerrarModalForm()"></button>
            </div>

            <div class="modal-body p-4">
              <form (ngSubmit)="guardarVehiculo()">
                <div class="row g-3">
                  <!-- Marca -->
                  <div class="col-12 col-md-6">
                    <label class="form-label small fw-bold">Marca *</label>
                    <input type="text" class="form-control" [(ngModel)]="vehiculoForm.marca" name="marca" placeholder="Ej. BMW, Toyota, Ford" required>
                  </div>

                  <!-- Modelo -->
                  <div class="col-12 col-md-6">
                    <label class="form-label small fw-bold">Modelo *</label>
                    <input type="text" class="form-control" [(ngModel)]="vehiculoForm.modelo" name="modelo" placeholder="Ej. M4 Competition, Corolla" required>
                  </div>

                  <!-- Año -->
                  <div class="col-12 col-md-4">
                    <label class="form-label small fw-bold">Año *</label>
                    <input type="number" class="form-control" [(ngModel)]="vehiculoForm.anio" name="anio" min="1990" max="2027" required>
                  </div>

                  <!-- Precio -->
                  <div class="col-12 col-md-4">
                    <label class="form-label small fw-bold">Precio (USD) *</label>
                    <input type="number" class="form-control" [(ngModel)]="vehiculoForm.precio" name="precio" min="0" step="500" required>
                  </div>

                  <!-- Kilometraje -->
                  <div class="col-12 col-md-4">
                    <label class="form-label small fw-bold">Kilometraje (km) *</label>
                    <input type="number" class="form-control" [(ngModel)]="vehiculoForm.kilometraje" name="kilometraje" min="0" required>
                  </div>

                  <!-- Categoría -->
                  <div class="col-12 col-md-4">
                    <label class="form-label small fw-bold">Categoría *</label>
                    <select class="form-select" [(ngModel)]="vehiculoForm.categoria" name="categoria" required>
                      <option value="SUV">SUV</option>
                      <option value="Sedán">Sedán</option>
                      <option value="Deportivo">Deportivo</option>
                      <option value="Camioneta">Camioneta</option>
                      <option value="Hatchback">Hatchback</option>
                    </select>
                  </div>

                  <!-- Combustible -->
                  <div class="col-12 col-md-4">
                    <label class="form-label small fw-bold">Combustible *</label>
                    <select class="form-select" [(ngModel)]="vehiculoForm.combustible" name="combustible" required>
                      <option value="Gasolina">Gasolina</option>
                      <option value="Diésel">Diésel</option>
                      <option value="Híbrido">Híbrido</option>
                      <option value="Eléctrico">Eléctrico</option>
                    </select>
                  </div>

                  <!-- Transmisión -->
                  <div class="col-12 col-md-4">
                    <label class="form-label small fw-bold">Transmisión *</label>
                    <select class="form-select" [(ngModel)]="vehiculoForm.transmision" name="transmision" required>
                      <option value="Automática">Automática</option>
                      <option value="Manual">Manual</option>
                    </select>
                  </div>

                  <!-- Color -->
                  <div class="col-12 col-md-6">
                    <label class="form-label small fw-bold">Color *</label>
                    <input type="text" class="form-control" [(ngModel)]="vehiculoForm.color" name="color" placeholder="Ej. Rojo Carmín, Blanco Glaciar" required>
                  </div>

                  <!-- Disponible checkbox -->
                  <div class="col-12 col-md-6 d-flex align-items-center">
                    <div class="form-check form-switch mt-3">
                      <input class="form-check-input" type="checkbox" role="switch" id="disponibleSwitch" [(ngModel)]="vehiculoForm.disponible" name="disponible">
                      <label class="form-check-label fw-bold small ms-2" for="disponibleSwitch">Vehículo disponible para la venta</label>
                    </div>
                  </div>

                  <!-- URL Imagen -->
                  <div class="col-12">
                    <label class="form-label small fw-bold">URL de la Imagen</label>
                    <input type="url" class="form-control" [(ngModel)]="vehiculoForm.imagenUrl" name="imagenUrl" placeholder="https://ejemplo.com/foto-auto.jpg">
                    @if (vehiculoForm.imagenUrl) {
                      <div class="mt-2 text-center bg-light p-2 rounded-3">
                        <img [src]="vehiculoForm.imagenUrl" class="img-thumbnail" style="max-height: 140px;" alt="Vista previa">
                        <div class="small text-muted mt-1">Vista previa de la imagen</div>
                      </div>
                    }
                  </div>

                  <!-- Descripción -->
                  <div class="col-12">
                    <label class="form-label small fw-bold">Descripción detallada</label>
                    <textarea class="form-control" [(ngModel)]="vehiculoForm.descripcion" name="descripcion" rows="3" placeholder="Detalles de motor, equipamiento, estado de conservación..."></textarea>
                  </div>
                </div>

                <div class="modal-footer border-0 px-0 pb-0 mt-4">
                  <button type="button" class="btn btn-secondary" (click)="cerrarModalForm()">Cancelar</button>
                  <button type="submit" class="btn btn-danger px-4 fw-semibold" [disabled]="guardando">
                    @if (guardando) {
                      <span class="spinner-border spinner-border-sm me-2"></span> Guardando...
                    } @else {
                      <i class="bi bi-save me-1"></i> {{ modoEdicion ? 'Actualizar Vehículo' : 'Crear Vehículo' }}
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- MODAL CONFIRMACIÓN ELIMINAR -->
    @if (modalEliminarAbierto && vehiculoAEliminar) {
      <div class="modal fade show d-block" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content rounded-4 border-0 shadow-lg">
            <div class="modal-header bg-danger text-white border-0 py-3">
              <h5 class="modal-title fw-bold"><i class="bi bi-exclamation-triangle-fill me-2"></i> Confirmar Eliminación</h5>
              <button type="button" class="btn-close btn-close-white" (click)="modalEliminarAbierto = false"></button>
            </div>
            <div class="modal-body p-4 text-center">
              <i class="bi bi-trash3 text-danger fs-1 mb-2 d-block"></i>
              <h5 class="fw-bold">¿Deseas eliminar este vehículo?</h5>
              <p class="text-secondary mb-0">
                Esta acción borrará permanentemente el <strong>{{ vehiculoAEliminar.marca }} {{ vehiculoAEliminar.modelo }} ({{ vehiculoAEliminar.anio }})</strong> del catálogo y de la base de datos.
              </p>
            </div>
            <div class="modal-footer border-0 justify-content-center bg-light">
              <button type="button" class="btn btn-secondary px-3" (click)="modalEliminarAbierto = false">Cancelar</button>
              <button type="button" class="btn btn-danger px-4 fw-bold" (click)="confirmarEliminar()" [disabled]="eliminando">
                @if (eliminando) {
                  <span class="spinner-border spinner-border-sm me-2"></span> Eliminando...
                } @else {
                  <i class="bi bi-trash-fill me-1"></i> Sí, Eliminar
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminCrudComponent implements OnInit {
  vehiculos: Vehiculo[] = [];
  vehiculosFiltrados: Vehiculo[] = [];
  categoriasUnicas: string[] = [];
  cargando = true;
  terminoFiltro = '';

  // Alertas
  mensajeAlerta = '';
  tipoAlerta: 'success' | 'danger' = 'success';

  // Modal formulario
  modalFormAbierto = false;
  modoEdicion = false;
  guardando = false;
  vehiculoForm: Vehiculo = this.crearVehiculoVacio();

  // Modal eliminar
  modalEliminarAbierto = false;
  vehiculoAEliminar: Vehiculo | null = null;
  eliminando = false;

  constructor(
    private vehiculoService: VehiculoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarVehiculos();
  }

  cargarVehiculos(): void {
    this.cargando = true;
    this.cdr.detectChanges();
    this.vehiculoService.getVehiculos().subscribe({
      next: (data) => {
        this.vehiculos = data;
        this.vehiculosFiltrados = [...data];
        this.calcularCategorias();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.mostrarAlerta('Error al cargar la lista de vehículos: ' + (err.error?.mensaje || err.message), 'danger');
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrarTabla(): void {
    if (!this.terminoFiltro.trim()) {
      this.vehiculosFiltrados = [...this.vehiculos];
      return;
    }
    const q = this.terminoFiltro.toLowerCase();
    this.vehiculosFiltrados = this.vehiculos.filter(v =>
      v.marca.toLowerCase().includes(q) ||
      v.modelo.toLowerCase().includes(q) ||
      v.categoria.toLowerCase().includes(q) ||
      v.color.toLowerCase().includes(q) ||
      v.combustible.toLowerCase().includes(q)
    );
    this.cdr.detectChanges();
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.guardando = false;
    this.vehiculoForm = this.crearVehiculoVacio();
    this.modalFormAbierto = true;
    this.cdr.detectChanges();
  }

  abrirModalEditar(v: Vehiculo): void {
    this.modoEdicion = true;
    this.guardando = false;
    this.vehiculoForm = { ...v };
    this.modalFormAbierto = true;
    this.cdr.detectChanges();
  }

  cerrarModalForm(): void {
    this.modalFormAbierto = false;
    this.guardando = false;
    this.vehiculoForm = this.crearVehiculoVacio();
    this.cdr.detectChanges();
  }

  guardarVehiculo(): void {
    if (!this.vehiculoForm.marca || !this.vehiculoForm.modelo || !this.vehiculoForm.precio) {
      this.mostrarAlerta('Por favor completa los campos obligatorios del vehículo.', 'danger');
      return;
    }

    this.guardando = true;
    this.cdr.detectChanges();

    if (this.modoEdicion && this.vehiculoForm.id) {
      this.vehiculoService.actualizarVehiculo(this.vehiculoForm.id, this.vehiculoForm).subscribe({
        next: (actualizado) => {
          this.guardando = false;
          this.cerrarModalForm();
          this.mostrarAlerta(`Vehículo "${actualizado.marca} ${actualizado.modelo}" actualizado exitosamente.`, 'success');
          this.cargarVehiculos();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.guardando = false;
          this.mostrarAlerta('Error al actualizar vehículo: ' + (err.error?.mensaje || err.message), 'danger');
          this.cdr.detectChanges();
        }
      });
    } else {
      this.vehiculoService.crearVehiculo(this.vehiculoForm).subscribe({
        next: (creado) => {
          this.guardando = false;
          this.cerrarModalForm();
          this.mostrarAlerta(`Vehículo "${creado.marca} ${creado.modelo}" creado exitosamente.`, 'success');
          this.cargarVehiculos();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.guardando = false;
          this.mostrarAlerta('Error al crear vehículo: ' + (err.error?.mensaje || err.message), 'danger');
          this.cdr.detectChanges();
        }
      });
    }
  }

  abrirModalEliminar(v: Vehiculo): void {
    this.vehiculoAEliminar = v;
    this.eliminando = false;
    this.modalEliminarAbierto = true;
    this.cdr.detectChanges();
  }

  confirmarEliminar(): void {
    if (!this.vehiculoAEliminar || !this.vehiculoAEliminar.id) return;

    this.eliminando = true;
    this.cdr.detectChanges();
    this.vehiculoService.eliminarVehiculo(this.vehiculoAEliminar.id).subscribe({
      next: () => {
        this.eliminando = false;
        this.modalEliminarAbierto = false;
        this.mostrarAlerta(`Vehículo "${this.vehiculoAEliminar?.marca} ${this.vehiculoAEliminar?.modelo}" eliminado.`, 'success');
        this.vehiculoAEliminar = null;
        this.cargarVehiculos();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.eliminando = false;
        this.modalEliminarAbierto = false;
        this.mostrarAlerta('Error al eliminar vehículo: ' + (err.error?.mensaje || err.message), 'danger');
        this.cdr.detectChanges();
      }
    });
  }

  mostrarAlerta(mensaje: string, tipo: 'success' | 'danger'): void {
    this.mensajeAlerta = mensaje;
    this.tipoAlerta = tipo;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.mensajeAlerta = '';
      this.cdr.detectChanges();
    }, 5000);
  }

  getDisponiblesCount(): number {
    return this.vehiculos.filter(v => v.disponible).length;
  }

  getPrecioPromedio(): number {
    if (this.vehiculos.length === 0) return 0;
    const total = this.vehiculos.reduce((acc, v) => acc + (v.precio || 0), 0);
    return total / this.vehiculos.length;
  }

  private calcularCategorias(): void {
    const set = new Set(this.vehiculos.map(v => v.categoria));
    this.categoriasUnicas = Array.from(set);
  }

  private crearVehiculoVacio(): Vehiculo {
    return {
      marca: '',
      modelo: '',
      anio: new Date().getFullYear(),
      precio: 30000,
      kilometraje: 0,
      combustible: 'Gasolina',
      transmision: 'Automática',
      color: 'Negro',
      categoria: 'SUV',
      descripcion: '',
      imagenUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      disponible: true
    };
  }
}
