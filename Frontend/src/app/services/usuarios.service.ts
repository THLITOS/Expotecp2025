// src/app/services/usuarios.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  _id: string;
  username: string;
  email: string;
  phone: string;
  avatar?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private baseUrl = 'https://expotecp2025.onrender.com/api/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarioPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }
}
