import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Plant } from '../../models/plant.interface';

@Component({
  selector: 'app-plant-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plant-card.component.html',
  styleUrl: './plant-card.component.css'
})
export class PlantCardComponent {
  @Input() plant!: Plant;
  @Output() waterPlant = new EventEmitter<number>();

  constructor(private router: Router) {}

  getStatusText(): string {
    switch (this.plant.status) {
      case 'dry': return 'Needs Water';
      case 'optimal': return 'Healthy';
      case 'wet': return 'Too Wet';
      default: return 'Unknown';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  onWaterPlant(): void {
    this.waterPlant.emit(this.plant.id);
  }

  viewDetails(): void {
    this.router.navigate(['/plant', this.plant.id]);
  }
}