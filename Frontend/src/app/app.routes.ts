import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PagPrincipalComponent } from './pages/pag-principal/pag-principal.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'pagPrincipal', component: PagPrincipalComponent }
];
