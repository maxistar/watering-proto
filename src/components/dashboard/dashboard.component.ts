import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantCardComponent } from '../plant-card/plant-card.component';
import { WaterTankComponent } from '../water-tank/water-tank.component';
import { PlantService } from '../../services/plant.service';
import { Plant, WaterTank } from '../../models/plant.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, PlantCardComponent, WaterTankComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  plants: Plant[] = [];
  waterTank!: WaterTank;

  constructor(private plantService: PlantService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.plantService.getPlants().subscribe(plants => {
      this.plants = plants;
    });

    this.plantService.getWaterTank().subscribe(tank => {
      this.waterTank = tank;
    });
  }

  onWaterPlant(plantId: number): void {
    this.plantService.waterPlant(plantId, 30).subscribe(success => {
      if (success) {
        this.loadData(); // Refresh data after watering
      }
    });
  }

  getHealthyPlantsCount(): number {
    return this.plants.filter(plant => plant.status === 'optimal').length;
  }

  getNeedsWaterCount(): number {
    return this.plants.filter(plant => plant.status === 'dry').length;
  }
}