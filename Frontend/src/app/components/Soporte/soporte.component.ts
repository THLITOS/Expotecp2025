import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EditarPerfilService } from '../../services/editarperfil.service';

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './soporte.component.html',
  styleUrls: ['./soporte.component.css']
})
export class SoporteComponent {
  to = '';
  asunto = '';
  categoria = '';
  descripcion = '';
  mensaje = '';

  currentUser = localStorage.getItem('idUsuario') || 'Anonimo';

  constructor(private http: HttpClient, private editarPerfilService: EditarPerfilService) { }

  enviarCorreo() {
    this.editarPerfilService.obtenerPerfil(this.currentUser).subscribe((data) => {
      const currentEmail = data.email;
      const datos = {
        to: currentEmail,
        asunto: this.asunto,
        categoria: this.categoria,
        descripcion: this.descripcion
      };

      this.http.post('http://localhost:5000/api/email/send-support-email', datos)
        .subscribe({
          next: () => { 
            this.mensaje = '✅ Correo enviado correctamente';
            this.asunto = '';
            this.categoria = '';
            this.descripcion = '';
          },
          error: () => this.mensaje = '❌ Error al enviar correo'
        });
    });
  }
}
