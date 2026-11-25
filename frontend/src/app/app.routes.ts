import { Routes } from '@angular/router';
import { CatalogoComponent } from './components/catalogo/catalogo.component';
import { LoginComponent } from './components/login/login.component';
import { AdminCrudComponent } from './components/admin-crud/admin-crud.component';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'catalogo', pathMatch: 'full' },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminCrudComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: 'catalogo' }
];
