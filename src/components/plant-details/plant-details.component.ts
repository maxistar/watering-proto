import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantService } from '../../services/plant.service';
import { Plant, WateringLog } from '../../models/plant.interface';

@Component({
  selector: 'app-plant-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plant-details.component.html',
  styleUrls: ['./plant-details.component.css']
})
export class PlantDetailsComponent implements OnInit {
  plant: Plant | undefined;
  wateringLogs: WateringLog[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private plantService: PlantService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadPlantDetails(id);
    }
  }

  loadPlantDetails(id: number): void {
    this.plantService.getPlantById(id).subscribe(plant => {
      this.plant = plant;
    });

    this.plantService.getWateringLogsByPlantId(id).subscribe(logs => {
      this.wateringLogs = logs;
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  onWaterPlant(): void {
    if (this.plant) {
      this.plantService.waterPlant(this.plant.id, 30).subscribe(success => {
        if (success) {
          this.loadPlantDetails(this.plant!.id);
        }
      });
    }
  }

  getStatusText(): string {
    if (!this.plant) return '';
    switch (this.plant.status) {
      case 'dry': return 'Needs Water';
      case 'optimal': return 'Healthy';
      case 'wet': return 'Too Wet';
      default: return 'Unknown';
    }
  }

  getDaysAgo(): string {
    if (!this.plant) return '0';
    const lastWatered = new Date(this.plant.lastWatered);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastWatered.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays.toString();
  }

  formatDay(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  formatFullDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}