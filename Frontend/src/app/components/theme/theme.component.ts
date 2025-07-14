import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-theme',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.css'],
})
export class ThemeComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  visible: boolean = true;

  temas = [
    { nombre: 'Oscuro', fondo: '#121212', texto: '#ffffff', clase: 'dark-mode' },
    { nombre: 'Azul', fondo: '#007BFF', texto: '#ffffff', clase: 'azul' },
    { nombre: 'Verde', fondo: '#28a745', texto: '#ffffff', clase: 'verde' },
    { nombre: 'Rosa', fondo: '#e83e8c', texto: '#ffffff', clase: 'rosa' },
    { nombre: 'Naranja', fondo: '#fd7e14', texto: '#000000', clase: 'naranja' },
    // Puedes agregar 'Claro' si quieres
  ];

  temaSeleccionado: { nombre: string; fondo: string; texto: string; clase: string } | null = null;

  ngOnInit() {
    // Al iniciar, leer tema guardado y aplicarlo
    const temaGuardado = localStorage.getItem('tema');
    if (temaGuardado) {
      const tema = this.temas.find(t => t.clase === temaGuardado);
      if (tema) {
        this.temaSeleccionado = tema;
        this.aplicarClaseTema(tema);
      }
    }
  }

  seleccionarTema(tema: { nombre: string; fondo: string; texto: string; clase: string }) {
    this.temaSeleccionado = tema;
    this.aplicarClaseTema(tema);
    this.cerrar(); // cerrar modal
  }

  aplicarClaseTema(tema: { nombre: string; fondo: string; texto: string; clase: string }) {
    document.body.classList.remove('light-mode', 'dark-mode', 'azul', 'verde', 'rosa', 'naranja');
    document.body.classList.add(tema.clase);
    localStorage.setItem('tema', tema.clase);
  }

  cerrar() {
    this.visible = false;
    this.close.emit();
  }
}
