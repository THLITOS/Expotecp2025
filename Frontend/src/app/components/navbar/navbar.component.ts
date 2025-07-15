import { Component, EventEmitter, Output } from '@angular/core';
import { SearchComponent } from './search/search.component';
import { FeedService } from '../services/feed.service';
import { SideChatPanelComponent } from '../chat/chat.component';
import { ThemeComponent } from '../theme/theme.component';
import { EditarPerfilComponent } from '../editar-perfil/editar-perfil.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

import { UsuariosService } from '../../services/usuarios.service'; // servicio para traer usuario por id

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    SideChatPanelComponent,
    ThemeComponent,
    EditarPerfilComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  @Output() navegarInicio = new EventEmitter<void>();

  isChatOpen: boolean = false;
  mostrarModal: boolean = false;
  mostrarPerfil: boolean = false;

  avatarUrl: string | null = null; 

  constructor(
    private feedService: FeedService,
    private authService: AuthService,
    private usuariosService: UsuariosService
  ) {}

  ngOnInit() {
    const temaGuardado = localStorage.getItem('tema');
    if (temaGuardado) {
      document.body.classList.add(temaGuardado);
    } else {
      document.body.classList.add('obscuro');
    }

    this.cargarAvatarUsuario();
  }

  cargarAvatarUsuario() {
    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) return;

    this.usuariosService.getUsuarioPorId(idUsuario).subscribe({
      next: (usuario) => {
        if (usuario.file && usuario.file.data) {
          const typedArray = new Uint8Array(usuario.file.data);
          const blob = new Blob([typedArray], { type: 'image/jpeg' }); 
          this.avatarUrl = URL.createObjectURL(blob);
        } else {
          this.avatarUrl = null;
        }
      },
      error: (err) => {
        console.error('Error cargando avatar', err);
      }
    });
  }

  abrirFormulario() {
    this.feedService.abrirFormulario();
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }

  togglePerfil(): void {
    this.mostrarPerfil = !this.mostrarPerfil;
  }

  irAInicio(): void {
    this.navegarInicio.emit();
  }
}
