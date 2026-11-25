export interface Vehiculo {
  id?: number;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  kilometraje: number;
  combustible: string;
  transmision: string;
  color: string;
  categoria: string;
  descripcion: string;
  imagenUrl: string;
  disponible: boolean;
}
