import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FeedService } from '../services/feed.service';
import { ComunidadService } from '../../services/comunidad.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-tus-comunidades',
  imports: [CommonModule],
  templateUrl: './tus-comunidades.component.html',
  styleUrl: '../feed/feed.component.css'
})
export class TusComunidadesComponent implements OnInit {

  posts: Array<{
    id: string;
    title: string;
    content: string;
    subreddit: string;
    user: string;
    userId: string;
    time: string;
    image?: string;
    likes?: string;
    isLike?: boolean;
    dislike?: string;
    isdisLike?: boolean;
    totalSaved?: string;
    isSaved?: boolean;
    comentarios?: any[];
    mostrarFormComentario?: boolean;
    mostrarArea?: boolean;
    showShareMenu?: boolean;
    archivo?: any;
    archivoTipo?: string;
    comunidades?: String[];
  }> = [];

  currentUser = localStorage.getItem('idUsuario') || 'Anonimo';

  constructor(private feedService: FeedService, private comunidadService: ComunidadService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.comunidadService.obtenerComunidadesPorUsuario(this.currentUser).subscribe((data) => {
      const comunidadesPermitidas = data.map(c => c.nombre);
      console.log(comunidadesPermitidas);

      this.feedService.getPublicaciones().subscribe((data) => {
        this.posts = data
          // 1️⃣ Filtrar solo los posts que tienen al menos una comunidad permitida
          .filter(pub =>
            (pub.comunidad || []).some((c: string) => comunidadesPermitidas.includes(c))
          )
          // 2️⃣ Mapear los posts permitidos normalmente
          .map(pub => ({
            id: pub._id,
            title: pub.titulo || 'Sin título',
            content: pub.contenido,
            subreddit: 'r/FeedComponent',
            user: pub.usuarioId?.username || 'u/anonimo',
            userId: pub.usuarioId?._id || 'u/anonimo',
            time: new Date(pub.fechaPublicacion).toLocaleString(),
            image: pub.archivoUrl || undefined,
            archivoTipo: pub.mimeType,
            comunidades: pub.comunidad // conserva todas las comunidades originales
          }));

          this.posts.forEach(post => {
            this.getArchivos(post.id, post.archivoTipo);
          });
      });
    });
  }

  getArchivos(id: string, tipo: any) {
    if (tipo) {
      this.feedService.getArchivo(id).subscribe(blob => {
        const tipo = blob.type;
        console.log(tipo);
        const objectURL = URL.createObjectURL(blob);
        const archivoUrl = objectURL;
        const foundPost = this.posts.find(post => post.id == id);
        if (archivoUrl && foundPost) {
          if (tipo === 'application/pdf') {
            foundPost.archivo = this.sanitizer.bypassSecurityTrustResourceUrl(archivoUrl);
          } else {
            foundPost.archivo = archivoUrl;
          }
          foundPost.archivoTipo = tipo;
        }
      });
    }
  }

  getSanitizedPdfUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
