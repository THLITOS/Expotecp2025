// src/app/services/editarperfil.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditarPerfilService {
  private baseUrl = 'http://localhost:5000/api/usuarios';

  constructor(private http: HttpClient) {}

  // Actualizar perfil del usuario
  actualizarPerfil(idUsuario: string, datos: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${idUsuario}`, datos);
  }

  // Obtener los datos actuales del usuario
  obtenerPerfil(idUsuario: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${idUsuario}`);
  }
}
