import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditarPerfilService } from './../../services/editarperfil.service';
import { AuthService } from './../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css']
})
export class EditarPerfilComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  username = '';
  phone = '';
  avatarFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  showToast: boolean = false;
  toastMessage: string = '';
  private toastTimer: any;


  constructor(
    private editarPerfilService: EditarPerfilService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const idUsuario = this.authService.getToken()
      ? localStorage.getItem('idUsuario') || ''
      : '';

    if (!idUsuario) {
      this.showCustomToast('No se encontró ID del usuario');
      return;
    }

    this.editarPerfilService.obtenerPerfil(idUsuario).subscribe({
      next: (usuario) => {
        this.username = usuario.username || '';
        this.phone = usuario.phone || '';

        if (usuario.avatar) {
          this.previewUrl = `http://localhost:5000/${usuario.avatar}`;
        } else {
          this.previewUrl = null;
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.showCustomToast('Error al cargar los datos del perfil');
      }
    });
  }

  cerrarPerfil() {
    this.close.emit();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.avatarFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(this.avatarFile);
    }
  }

  enviarFormulario() {
    const formData = new FormData();
    if (this.username.trim()) formData.append('username', this.username.trim());
    if (this.phone.trim()) formData.append('phone', this.phone.trim());
    if (this.avatarFile) formData.append('avatar', this.avatarFile);

    const idUsuario = this.authService.getToken()
      ? localStorage.getItem('idUsuario') || ''
      : '';
    if (!idUsuario) {
      this.showCustomToast('No se encontró ID del usuario');
      return;
    }

    this.editarPerfilService.actualizarPerfil(idUsuario, formData).subscribe({
      next: () => {
        this.showCustomToast('Perfil actualizado con éxito ✅');
        this.cerrarPerfil();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.showCustomToast('Error en la actualización: ' + (err.error?.message || err.statusText));
      }
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
  }
}
