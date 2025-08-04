import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaterTank } from '../../models/plant.interface';

@Component({
  selector: 'app-water-tank',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './water-tank.component.html',
  styleUrls: ['./water-tank.component.css'],
})
export class WaterTankComponent {
  @Input() waterTank!: WaterTank;

  getWaterPercentage(): number {
    return Math.round((this.waterTank.currentLevel / this.waterTank.capacity) * 100);
  }

  getStatusText(): string {
    switch (this.waterTank.status) {
      case 'low': return 'Low Level';
      case 'medium': return 'Good Level';
      case 'full': return 'Full';
      default: return 'Unknown';
    }
  }

  getButtonText(): string {
    switch (this.waterTank.status) {
      case 'low': return 'Refill Urgently';
      case 'medium': return 'Refill Soon';
      case 'full': return 'Tank Full';
      default: return 'Refill';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getEstimatedDays(): number {
    // Simple estimation based on current level and average daily usage
    const averageDailyUsage = 2.5; // liters per day
    return Math.floor(this.waterTank.currentLevel / averageDailyUsage);
  }
}