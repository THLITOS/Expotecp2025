import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comunidad {
  _id?: string;
  nombre: string;
  descripcion: string;
  creadorId: string;
  miembros?: string[];
  imagenUrl?: string; // URL imagen
}

@Injectable({
  providedIn: 'root',
})
export class ComunidadService {
  private apiUrl = 'http://localhost:5000/api/comunidades';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  crearComunidad(data: FormData): Observable<Comunidad> {
    return this.http.post<Comunidad>(this.apiUrl, data, this.getAuthHeaders());
  }

  obtenerComunidades(): Observable<Comunidad[]> {
    return this.http.get<Comunidad[]>(this.apiUrl);
  }

  unirseAComunidad(id: string): Observable<Comunidad> {
    return this.http.post<Comunidad>(`${this.apiUrl}/${id}/unirse`, {}, this.getAuthHeaders());
  }

  salirseDeComunidad(id: string): Observable<{ message: string; comunidad: Comunidad }> {
    return this.http.post<{ message: string; comunidad: Comunidad }>(
      `${this.apiUrl}/${id}/salirse`,
      {},
      this.getAuthHeaders()
    );
  }

  obtenerComunidadesPorUsuario(id: string): Observable<Comunidad[]> {
    return this.http.get<Comunidad[]>(`${this.apiUrl}/${id}`);
  }
}
