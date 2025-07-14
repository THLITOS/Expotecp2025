import { Component, OnInit } from '@angular/core';
import { ComunidadService, Comunidad } from '../../services/comunidad.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comunidad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comunidad.component.html',
  styleUrls: ['./comunidad.component.css'],
})
export class ComunidadComponent implements OnInit {
  comunidades: Comunidad[] = [];
  loading = false;
  unidas: Set<string> = new Set();

  showToast: boolean = false;
  toastMessage: string = '';
  private toastTimer: any;

  constructor(private comunidadService: ComunidadService) {}

  ngOnInit() {
    this.loadComunidades();
  }

  loadComunidades() {
    this.loading = true;
    this.comunidadService.obtenerComunidades().subscribe({
      next: (data) => {
        this.comunidades = data;
        console.log('📦 Comunidades:', this.comunidades); 
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.showCustomToast('Error cargando comunidades');
      },
    });
  }

  unirse(id: string) {
    this.comunidadService.unirseAComunidad(id).subscribe({
      next: () => {
        this.showCustomToast('Te uniste a la comunidad');
        this.loadComunidades();
      },
      error: (err) => {
        const mensaje = err.error?.error || 'Error desconocido';
        this.showCustomToast(mensaje);
      }
    });
  }

  salir(id: string) {
    this.comunidadService.salirseDeComunidad(id).subscribe({
      next: () => {
        this.showCustomToast('Saliste de la comunidad');
        this.loadComunidades();
      },
      error: (err) => {
        const mensaje = err.error?.error || 'Error desconocido';
        this.showCustomToast(mensaje);
      }
    });
  }

  // 👇 Utilidad para mostrar correctamente la imagen
  getImagenUrl(imagenUrl?: string): string {
    if (!imagenUrl) return 'assets/default-image.jpg'; // Imagen por defecto local
    if (imagenUrl.startsWith('http')) return imagenUrl;
    return `http://localhost:5000/uploads/${imagenUrl}`;
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
  }
}


