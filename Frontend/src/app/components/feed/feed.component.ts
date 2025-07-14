import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedService } from '../services/feed.service';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SearchService } from '../services/search.service';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { Comunidad, ComunidadService } from '../../services/comunidad.service';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
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
  }> = [];

  filteredPosts: any[] = [];
  private searchSubscription: Subscription | undefined;

  mostrarFormulario = false;
  mostrarArea = false;
  selectedFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  showConfirmModal: boolean = false;
  postIdToDelete: string | null = null;

  showToast: boolean = false;
  toastMessage: string = '';
  private toastTimer: any;

  comentarioIdToDelete: string | null = null;
  mensajeConfirmacion: string | null = null;

  currentUser = localStorage.getItem('idUsuario') || 'Anonimo';

  nuevoMensaje: { [postId: string]: string } = {};

  archivoSeleccionado: File | undefined;
  imagenPreviewUrl: string | null = null;
  videoPreviewUrl: string | null = null;
  audioPreviewUrl: string | null = null;
  pdfPreviewUrl: SafeResourceUrl | null = null;

  comunidadSeleccionada: any = null;
  chipsSeleccionados: any[] = [];

  comunidades: Comunidad[] = [];

  constructor(private feedService: FeedService, private sanitizer: DomSanitizer, private searchService: SearchService, private comunidadService: ComunidadService) { }

  ngOnInit() {
    // Cargar publicaciones de la API
    this.feedService.getPublicaciones().subscribe((data) => {
      this.posts = data.map(pub => ({
        id: pub._id,
        title: pub.titulo || 'Sin título',
        content: pub.contenido,
        subreddit: 'r/FeedComponent',
        user: pub.usuarioId?.username || 'u/anonimo',
        userId: pub.usuarioId?._id || 'u/anonimo',
        time: new Date(pub.fechaPublicacion).toLocaleString(),
        image: pub.archivoUrl || undefined,
        archivoTipo: pub.mimeType
      }));

      this.posts.forEach(post => {
        this.getLikes(post.id);
        this.getDisLikes(post.id);
        this.getReaccionesByUsuario(post.id, this.currentUser);
        this.getComentariosByPublicacion(post);
        this.getArchivos(post.id, post.archivoTipo);
      });
    });


    this.feedService.formulario$.subscribe((abrir) => {
      this.mostrarFormulario = abrir;
      this.imagenPreviewUrl = null;
      this.videoPreviewUrl = null;
      this.audioPreviewUrl = null;
      this.pdfPreviewUrl = null;
      this.archivoSeleccionado = undefined;
      this.chipsSeleccionados = [];
    });

    this.comunidadService.obtenerComunidades().subscribe({
      next: (data) => {
        this.comunidades = data;
      },
      error: () => {
        this.showCustomToast('Error cargando comunidades');
      },
    });

    this.filteredPosts = [...this.posts];
    this.searchSubscription = this.searchService.searchTerm$
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.filterPosts(searchTerm);
      });
  }

  filterPosts(searchTerm: string): void {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    if (!lowerCaseSearchTerm) {
      this.filteredPosts = [...this.posts];
      return;
    }
    this.filteredPosts = this.posts.filter(post =>
      post.title.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  onFileSelected(event: any) {
    this.imagenPreviewUrl = null;
    this.videoPreviewUrl = null;
    this.audioPreviewUrl = null;
    this.pdfPreviewUrl = null;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
      const maxSize = 2 * 1024 * 1024; // 2MB en bytes

      const allowedTypes = [
        'image/',
        'video/',
        'audio/',
        'application/pdf'
      ];

      const isAllowed = allowedTypes.some(type => this.archivoSeleccionado?.type.startsWith(type));

      if (!isAllowed) {
        this.showCustomToast('Tipo de archivo no permitido. Solo se aceptan imágenes, videos, audios o PDF.');
        input.value = '';
        return;
      }

      if (this.archivoSeleccionado.size > maxSize) {
        this.showCustomToast('El archivo excede el tamaño máximo permitido de 2MB.');
        input.value = '';
        return;
      }

      if (this.archivoSeleccionado.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagenPreviewUrl = reader.result as string;
        };
        reader.readAsDataURL(this.archivoSeleccionado);
      } else if (this.archivoSeleccionado.type.startsWith('video/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.videoPreviewUrl = reader.result as string;
        };
        reader.readAsDataURL(this.archivoSeleccionado);
      } else if (this.archivoSeleccionado.type.startsWith('audio/')) {
        const reader = new FileReader();
        reader.onload = () => {
          this.audioPreviewUrl = reader.result as string;
        };
        reader.readAsDataURL(this.archivoSeleccionado);
      } else if (this.archivoSeleccionado.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = () => {
          const unsafeUrl = reader.result as string;
          this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
        };
        reader.readAsDataURL(this.archivoSeleccionado);
      }
    }
  }

  agregarPublicacion(nuevaPub: {
    title: string;
    content: string;
    subreddit: string;
    user: string;
    time: string;
    image?: string;
    archivo?: File;
  }) {
    const chips = this.chipsSeleccionados.map(c => c.nombre);
    console.log(chips);
    // Crear publicación en el backend
    this.feedService.crearPublicacion({
      titulo: nuevaPub.title,
      contenido: nuevaPub.content,
      tipoContenido: nuevaPub.image ? 'foto' : 'mixto',
      archivoUrl: nuevaPub.image,
      usuarioId: this.currentUser,
      archivo: nuevaPub.archivo,
      comunidad: chips
    }).subscribe(res => {
      this.posts = [
        {
          id: res._id,
          title: res.titulo,
          content: res.contenido,
          subreddit: 'r/FeedComponent',
          user: res.usuarioId?.username || 'u/usuarioNuevo',
          userId: res.usuarioId?._id || 'u/anonimo',
          time: new Date(res.fechaPublicacion).toLocaleString(),
          image: res.archivoUrl || undefined,
        },
        ...this.posts
      ];
      this.getLikes(res._id);
      this.getDisLikes(res._id);
      this.getTotalSaved(res._id);
      this.getArchivos(res._id, res.mimeType);
      this.mostrarFormulario = false;
      this.filteredPosts = [...this.posts];
      this.searchService.setSearchTerm('');
    });
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;

    const title = (form.elements.namedItem('title') as HTMLInputElement).value;
    if (!title) {
      this.showCustomToast('El título es obligatorio');
      return;
    }

    const content = (form.elements.namedItem('content') as HTMLInputElement).value;
    if (!content) {
      this.showCustomToast('El contenido es obligatorio');
      return;
    }

    const nuevaPub = {
      title: title,
      content: content,
      subreddit: 'r/FeedComponent',
      user: 'u/usuarioNuevo',
      time: 'Justo ahora',
      image: (form.elements.namedItem('image') as HTMLInputElement).value || undefined,
      archivo: this.archivoSeleccionado,
    };
    console.log(nuevaPub);
    this.agregarPublicacion(nuevaPub);
    form.reset();
  }


  confirmarEliminar(postId: string): void {
    this.postIdToDelete = postId;
    this.showConfirmModal = true;
    this.mensajeConfirmacion = "esta publicacion";
  }

  confirmarEliminarComentario(comentariotId: string): void {
    this.comentarioIdToDelete = comentariotId;
    this.showConfirmModal = true;
    this.mensajeConfirmacion = "este comentario";
  }

  cancelarEliminacion(): void {
    this.showConfirmModal = false;
    this.postIdToDelete = null;
  }

  cancelarEliminacionComentario(): void {
    this.showConfirmModal = false;
    this.comentarioIdToDelete = null;
  }

  ejecutarEliminacion(): void {
    if (this.postIdToDelete) {
      this.eliminarPublicacion(this.postIdToDelete);
      this.showCustomToast('Publicación eliminada correctamente.');

      this.showConfirmModal = false;
      this.postIdToDelete = null;
    } else if (this.comentarioIdToDelete) {
      this.eliminarComentario(this.comentarioIdToDelete);
      this.showCustomToast('Comentario eliminado correctamente.');

      this.showConfirmModal = false;
      this.comentarioIdToDelete = null;
    }
  }

  eliminarPublicacion(id: string) {
    this.feedService.eliminarPublicacion(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
      this.filteredPosts = [...this.posts];
      this.searchService.setSearchTerm('');
    });
  }

 eliminarComentario(id: string) {
  this.feedService.eliminarComentario(id).subscribe(() => {
    // Filtramos todos los comentarios en los posts (opcional: puedes buscar por post específico)
    this.posts.forEach(post => {
      post.comentarios = post.comentarios?.filter(c => c.id !== id);
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

  getLikes(id: string) {
    this.feedService.getLikes(id).subscribe(res => {
      const foundPost = this.posts.find(post => post.id == id);
      if (foundPost) {
        if (res[0]) {
          foundPost.likes = res[0].totalLikes;
        } else {
          foundPost.likes = "0";
        }
      }
    });
  }

  getDisLikes(id: string) {
    this.feedService.getDisLikes(id).subscribe(res => {
      const foundPost = this.posts.find(post => post.id == id);
      if (foundPost) {
        if (res[0]) {
          foundPost.dislike = res[0].totalDislikes;
        } else {
          foundPost.dislike = "0";
        }
      }
    });
  }

  getTotalSaved(id: string) {
    this.feedService.getTotalSaved(id).subscribe(res => {
      const foundPost = this.posts.find(post => post.id == id);
      if (foundPost) {
        if (res[0]) {
          foundPost.totalSaved = res[0].totalSaved;
        } else {
          foundPost.totalSaved = "0";
        }
      }
    });
  }


  getReaccionesByUsuario(idPublicacion: string, idUsuario: string) {
    this.feedService.getReaccionesByUsuario(idPublicacion, idUsuario).subscribe(res => {
      const foundPost = this.posts.find(post => post.id == idPublicacion);
      if (foundPost) {
        if (res[0]) {
          foundPost.isLike = res[0].like;
          foundPost.isdisLike = res[0].dislike;
          foundPost.isSaved = res[0].isSaved;
        } else {
          foundPost.isLike = false;
          foundPost.isdisLike = false;
          foundPost.isSaved = false;
        }
      }
    });
  }

  mostrarFormularioComentario(post: any) {
    post.mostrarFormComentario = !post.mostrarFormComentario;
    post.mostrarArea = !post.mostrarArea;

    if (!post.comentarios || post.comentarios.length === 0) {
      this.getComentariosByPublicacion(post);
    }
  }

  getComentariosByPublicacion(post: any) {
    this.feedService.getComentariosPorPublicacion(post.id).subscribe(comentarios => {
      post.comentarios = comentarios.map(c => ({
        id: c._id,
        usuarioId: c.usuarioId?._id,
        mensaje: c.mensaje,
        usuario: c.usuarioId?.username || 'u/anonimo',
        fecha: new Date(c.fecha).toLocaleString()
      }));
    });
  }

  enviarComentario(post: any, mensaje: string) {
    const comentario = {
      publicacionId: post.id,
      usuarioId: this.currentUser || 'u/usuarioNuevo',
      mensaje
    };

    this.feedService.crearComentario(comentario).subscribe(res => {

      if (!post.comentarios) {
        post.comentarios = [];
      }

      post.comentarios.push({
        id: res._id,
        mensaje: res.mensaje,
        usuarioId: res.usuarioId?._id,
        usuario: res.usuarioId?.username || 'u/usuarioNuevo',
        fecha: new Date(res.fecha).toLocaleString()
      });

    });

    this.nuevoMensaje[post.id] = '';
    post.mostrarFormComentario = !post.mostrarFormComentario;
  }

  darLike(post: any) {
    const currentLike = post.isLike;
    this.feedService.getReaccionesByUsuario(post.id, this.currentUser)
      .subscribe({
        next: (res) => {
          if (Array.isArray(res) && res.length === 0) {
            const data = {
              "usuarioId": this.currentUser,
              "publicacionId": post.id,
              "like": "true"
            };
            this.feedService.crearReaccion(data).subscribe({
              next: () => {
                post.isLike = true;
                this.getLikes(post.id);
              },
              error: (err) => {
                console.error('Error al crear la reacción:', err);
              }
            });
          } else {
            const data = { "like": currentLike === true ? "false" : "true" };
            this.feedService.actualizarReaccion(res[0]._id, data).subscribe({
              next: () => {
                post.isLike = !post.isLike;
                this.getLikes(post.id);
              },
              error: (err) => {
                console.error('Error al actualizar la reacción:', err);
              }
            });
          }
        },
        error: (err) => {
          console.error('Error al obtener reacciones:', err);
        },
        complete: () => {
        }
      });
  }

  darDisLike(post: any) {
    const currentDisLike = post.isdisLike;
    this.feedService.getReaccionesByUsuario(post.id, this.currentUser)
      .subscribe({
        next: (res) => {
          if (Array.isArray(res) && res.length === 0) {
            const data = {
              "usuarioId": this.currentUser,
              "publicacionId": post.id,
              "dislike": "true"
            };
            this.feedService.crearReaccion(data).subscribe({
              next: () => {
                post.isdisLike = true;
                this.getDisLikes(post.id);
              },
              error: (err) => {
                console.error('Error al crear la reacción:', err);
              }
            });
          } else {
            const data = { "dislike": currentDisLike === true ? "false" : "true" };
            this.feedService.actualizarReaccion(res[0]._id, data).subscribe({
              next: () => {
                post.isdisLike = !post.isdisLike;
                this.getDisLikes(post.id);
              },
              error: (err) => {
                console.error('Error al actualizar la reacción:', err);
              }
            });
          }
        },
        error: (err) => {
          console.error('Error al obtener reacciones:', err);
        },
        complete: () => {
        }
      });
  }

  darSaved(post: any) {
    const currentSaved = post.isSaved;
    this.feedService.getReaccionesByUsuario(post.id, this.currentUser)
      .subscribe({
        next: (res) => {
          if (Array.isArray(res) && res.length === 0) {
            const data = {
              "usuarioId": this.currentUser,
              "publicacionId": post.id,
              "isSaved": "true"
            };
            this.feedService.crearReaccion(data).subscribe({
              next: () => {
                post.isSaved = true;
              },
              error: (err) => {
                console.error('Error al crear la reacción:', err);
              }
            });
          } else {
            const data = { "isSaved": currentSaved === true ? "false" : "true" };
            this.feedService.actualizarReaccion(res[0]._id, data).subscribe({
              next: () => {
                post.isSaved = !post.isSaved;
              },
              error: (err) => {
                console.error('Error al actualizar la reacción:', err);
              }
            });
          }
        },
        error: (err) => {
          console.error('Error al obtener reacciones:', err);
        },
        complete: () => {
        }
      });
  }

  toggleShareMenu(post: any): void {
    this.posts.forEach(p => {
      if (p !== post) {
        p.showShareMenu = false;
      }
    });
    post.showShareMenu = !post.showShareMenu;
  }

  copyLink(post: any): void {
    const linkToCopy = window.location.href;
    navigator.clipboard.writeText(linkToCopy)
      .then(() => {
        this.showCustomToast('Enlace copiado al portapapeles!');
        post.showShareMenu = false;
      })
      .catch(err => {
        console.error('Error al copiar el enlace:', err);
        this.showCustomToast('No se pudo copiar el enlace.');
      });
  }

  showCustomToast(message: string, duration: number = 3000): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toastMessage = message;
    this.showToast = true;

    this.toastTimer = setTimeout(() => {
      this.showToast = false;
      this.toastTimer = null;
    }, duration);
  }

  ngOnDestroy(): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  agregarComunidad() {
    if (
      this.comunidadSeleccionada &&
      !this.chipsSeleccionados.includes(this.comunidadSeleccionada)
    ) {
      this.chipsSeleccionados.push(this.comunidadSeleccionada);
    }
    this.comunidadSeleccionada = null;
  }

  eliminarChip(chip: any) {
    this.chipsSeleccionados = this.chipsSeleccionados.filter(c => c !== chip);
  }

  getSanitizedPdfUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

