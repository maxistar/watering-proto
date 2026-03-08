import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantCardComponent } from '../plant-card/plant-card.component';
import { WaterTankComponent } from '../water-tank/water-tank.component';
import { PlantService } from '../../services/plant.service';
import { Plant, WaterTank } from '../../models/plant.interface';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PlantCardComponent, WaterTankComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  plants: Plant[] = [];
  waterTank: WaterTank | null = null;
  isLoading = false;
  errorMessage = '';
  wateringPlantIds = new Set<number>();

  constructor(
    private readonly plantService: PlantService,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.plantService.getPlants().subscribe(plants => {
      this.plants = plants;
      this.isLoading = false;
    }, () => {
      this.errorMessage = 'Failed to load plants from backend.';
      this.isLoading = false;
    });

    this.plantService.getWaterTank().subscribe(tank => {
      this.waterTank = tank;
    }, () => {
      this.errorMessage = 'Failed to load dashboard data from backend.';
    });
  }

  onWaterPlant(plantId: number): void {
    this.wateringPlantIds.add(plantId);
    this.plantService.waterPlant(plantId, 30).subscribe(success => {
      if (success) {
        this.loadData(); // Refresh data after watering
      } else {
        this.errorMessage = 'Failed to water plant. Please try again.';
      }
      this.wateringPlantIds.delete(plantId);
    }, () => {
      this.errorMessage = 'Failed to water plant. Please try again.';
      this.wateringPlantIds.delete(plantId);
    });
  }

  getHealthyPlantsCount(): number {
    return this.plants.filter(plant => plant.status === 'optimal').length;
  }

  getNeedsWaterCount(): number {
    return this.plants.filter(plant => plant.status === 'dry').length;
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      void this.router.navigate(['/login']);
    });
  }
}
