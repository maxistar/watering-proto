import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PlantDetailsComponent } from './components/plant-details/plant-details.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'plant/:id', component: PlantDetailsComponent },
  { path: '**', redirectTo: '' }
];