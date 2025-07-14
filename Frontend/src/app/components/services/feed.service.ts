import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FeedService {
  private apiUrl = 'http://localhost:5000/api';

  private abrirFormularioSource = new BehaviorSubject<boolean>(false);
  formulario$ = this.abrirFormularioSource.asObservable();

  constructor(private http: HttpClient) { }

  abrirFormulario() {
    this.abrirFormularioSource.next(true);
  }

  cerrarFormulario() {
    this.abrirFormularioSource.next(false);
  }

  // Obtener todas las publicaciones
  getPublicaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/publicaciones');
  }

  // Crear nueva publicación
  crearPublicacion(publicacion: any): Observable<any> {
    const formData = new FormData();

    formData.append('titulo', publicacion.titulo);
    formData.append('contenido', publicacion.contenido);
    formData.append('tipoContenido', publicacion.tipoContenido);
    formData.append('archivoUrl', publicacion.archivoUrl);
    formData.append('usuarioId', publicacion.usuarioId);
    formData.append('archivo', publicacion.archivo);
    publicacion.comunidad.forEach((com: string | Blob) => {
      formData.append('comunidad', com);
    });

    return this.http.post(this.apiUrl + '/publicaciones', formData);
  }


  // Eliminar una publicacion
  eliminarPublicacion(idPublicacion: string): Observable<any> {
    return this.http.delete(this.apiUrl + `/publicaciones/${idPublicacion}`);
  }

    eliminarComentario(idcomentario: string): Observable<any> {
    return this.http.delete(this.apiUrl + `/comentarios/${idcomentario}`);
  }

  // Obtener el total de likes de una publicacion
  getLikes(idPublicacion: string): Observable<any> {
    return this.http.get(this.apiUrl + `/reacciones/likes-count/${idPublicacion}`);
  }

  // Obtener el total de dislikes de una publicacion
  getDisLikes(idPublicacion: string): Observable<any> {
    return this.http.get(this.apiUrl + `/reacciones/dislikes-count/${idPublicacion}`);
  }

  // Obtener el total de guardados de una publicacion
  getTotalSaved(idPublicacion: string): Observable<any> {
    return this.http.get(this.apiUrl + `/reacciones/saved-count/${idPublicacion}`);
  }

  // Obtener todas las reacciones de una publicacion y usuario
  getReaccionesByUsuario(idPublicacion: string, idUsuario: string): Observable<any> {
    return this.http.get(this.apiUrl + `/reacciones/reaciones-by-accion/${idPublicacion}/${idUsuario}`);
  }

  // Crear un comentario a una publicacion
  crearComentario(comentario: { publicacionId: string; usuarioId: string; mensaje: string }): Observable<any> {
    return this.http.post(this.apiUrl + '/comentarios', comentario);
  }

  // Obtener los comentarios de una publicacion
  getComentariosPorPublicacion(idPublicacion: string) {
    return this.http.get<any[]>(this.apiUrl + `/comentarios/publicacion/${idPublicacion}`);
  }

  // Crear una nueva reaccion
  crearReaccion(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/reacciones', data);
  }

  // Actualizar una reaccion
  actualizarReaccion(idReaccion: string, data: any): Observable<any> {
    return this.http.put(this.apiUrl + `/reacciones/${idReaccion}`, data);
  }

  // Obtener las conversaciones por usuario
  getChats(idUsuario: string) {
    return this.http.get(this.apiUrl + `/conversaciones/chats/${idUsuario}`);
  }

  // Enviar un mensaje a una conversacion existente
  sendMessage(idConversacion: string, data: any) {
    return this.http.post(this.apiUrl + `/conversaciones/${idConversacion}/mensaje`, data);
  }

  // Iniciar una conversacion nueva
  iniciarConversacion(data: any) {
    return this.http.post(this.apiUrl + `/conversaciones`, data);
  }

  // Obtener toda la lista de usuarios
  getUsuarios() {
    return this.http.get(this.apiUrl + `/usuarios`);
  }

  // Obtener un archivo de una publicacion
  getArchivo(idPublicacion: string): Observable<Blob> {
    return this.http.get(this.apiUrl + `/publicaciones/${idPublicacion}/archivo`, {
      responseType: 'blob'
    });
  }
}
