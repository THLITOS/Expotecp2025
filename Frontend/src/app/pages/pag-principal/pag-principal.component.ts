import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FeedComponent } from '../../components/feed/feed.component';
import { ComunidadComponent } from '../../components/comunidad/comunidad.component';
import { CrearComunidadComponent } from '../../components/crearComunidad/crear-comunidad.component';
import { SoporteComponent } from '../../components/Soporte/soporte.component';
import { TusComunidadesComponent } from '../../components/tus-comunidades/tus-comunidades.component';

@Component({
  selector: 'app-pag-principal',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    FeedComponent,
    ComunidadComponent,
    CrearComunidadComponent,
    SoporteComponent,
    TusComunidadesComponent,
    NgIf
  ],
  templateUrl: './pag-principal.component.html',
  styleUrls: ['./pag-principal.component.css'],
})
export class PagPrincipalComponent {
  selectedSection: 'feed' | 'comunidades' | 'crearcomunidad' | 'soporte' | 'TusComunidades'|'otro' = 'feed';

  onSectionSelected(section: 'feed' | 'comunidades' | 'crearcomunidad' | 'soporte' |'TusComunidades'| 'otro') {
    this.selectedSection = section;
  }
}
