import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlantDetailsComponent } from './components/plant-details/plant-details.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'plant/:id', component: PlantDetailsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
