import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehiculo } from '../models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private apiUrl = '/api/vehiculos';

  constructor(private http: HttpClient) {}

  getVehiculos(filtros?: {
    marca?: string;
    categoria?: string;
    busqueda?: string;
  }): Observable<Vehiculo[]> {
    let params = new HttpParams();
    if (filtros) {
      if (filtros.marca) params = params.set('marca', filtros.marca);
      if (filtros.categoria) params = params.set('categoria', filtros.categoria);
      if (filtros.busqueda) params = params.set('busqueda', filtros.busqueda);
    }
    return this.http.get<Vehiculo[]>(this.apiUrl, { params });
  }

  getVehiculoById(id: number): Observable<Vehiculo> {
    return this.http.get<Vehiculo>(`${this.apiUrl}/${id}`);
  }

  getMarcas(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/marcas`);
  }

  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categorias`);
  }

  crearVehiculo(vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.http.post<Vehiculo>(this.apiUrl, vehiculo);
  }

  actualizarVehiculo(id: number, vehiculo: Vehiculo): Observable<Vehiculo> {
    return this.http.put<Vehiculo>(`${this.apiUrl}/${id}`, vehiculo);
  }

  eliminarVehiculo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
