import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Plant } from '../../models/plant.interface';

@Component({
  selector: 'app-plant-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="plant-card" [class]="'status-' + plant.status">
      <div class="plant-image">
        <img [src]="plant.image" [alt]="plant.name" />
        <div class="status-badge" [class]="'badge-' + plant.status">
          {{ getStatusText() }}
        </div>
      </div>
      
      <div class="plant-info">
        <h3 class="plant-name">{{ plant.name }}</h3>
        <p class="plant-type">{{ plant.type }} • {{ plant.location }}</p>
        
        <div class="humidity-meter">
          <div class="humidity-label">Soil Humidity</div>
          <div class="humidity-bar">
            <div 
              class="humidity-fill" 
              [style.width.%]="plant.soilHumidity"
              [class]="'fill-' + plant.status">
            </div>
          </div>
          <div class="humidity-value">{{ plant.soilHumidity }}%</div>
        </div>
        
        <div class="watering-info">
          <div class="info-row">
            <span class="label">Last watered:</span>
            <span class="value">{{ formatDate(plant.lastWatered) }}</span>
          </div>
          <div class="info-row">
            <span class="label">Duration:</span>
            <span class="value">{{ plant.wateringDuration }}s</span>
          </div>
          <div class="info-row">
            <span class="label">Optimal range:</span>
            <span class="value">{{ plant.optimalHumidity.min }}-{{ plant.optimalHumidity.max }}%</span>
          </div>
        </div>
        
        <button 
          class="water-button" 
          (click)="onWaterPlant()"
          [disabled]="plant.status === 'wet'">
          <span class="button-icon">💧</span>
          Water Plant
        </button>
        
        <button 
          class="details-button" 
          (click)="viewDetails()">
          <span class="button-icon">📊</span>
          View Details
        </button>
      </div>
    </div>
  `,
  styles: [`
    .plant-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .plant-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15);
    }

    .status-dry {
      border-color: #EF4444;
    }

    .status-optimal {
      border-color: #10B981;
    }

    .status-wet {
      border-color: #3B82F6;
    }

    .plant-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .plant-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .status-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-dry {
      background: #FEE2E2;
      color: #DC2626;
    }

    .badge-optimal {
      background: #D1FAE5;
      color: #059669;
    }

    .badge-wet {
      background: #DBEAFE;
      color: #2563EB;
    }

    .plant-info {
      padding: 20px;
    }

    .plant-name {
      font-size: 20px;
      font-weight: 700;
      margin: 0 0 4px 0;
      color: #1F2937;
    }

    .plant-type {
      color: #6B7280;
      font-size: 14px;
      margin: 0 0 20px 0;
    }

    .humidity-meter {
      margin-bottom: 20px;
    }

    .humidity-label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }

    .humidity-bar {
      width: 100%;
      height: 8px;
      background: #E5E7EB;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 4px;
    }

    .humidity-fill {
      height: 100%;
      transition: all 0.3s ease;
      border-radius: 4px;
    }

    .fill-dry {
      background: linear-gradient(90deg, #FCA5A5, #EF4444);
    }

    .fill-optimal {
      background: linear-gradient(90deg, #6EE7B7, #10B981);
    }

    .fill-wet {
      background: linear-gradient(90deg, #93C5FD, #3B82F6);
    }

    .humidity-value {
      font-size: 12px;
      color: #6B7280;
      text-align: right;
    }

    .watering-info {
      border-top: 1px solid #E5E7EB;
      padding-top: 16px;
      margin-bottom: 20px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .info-row:last-child {
      margin-bottom: 0;
    }

    .label {
      font-size: 14px;
      color: #6B7280;
    }

    .value {
      font-size: 14px;
      font-weight: 500;
      color: #1F2937;
    }

    .water-button {
      width: 100%;
      background: linear-gradient(135deg, #3B82F6, #2563EB);
      color: white;
      border: none;
      padding: 12px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .water-button:hover:not(:disabled) {
      background: linear-gradient(135deg, #2563EB, #1D4ED8);
      transform: translateY(-1px);
    }

    .water-button:disabled {
      background: #9CA3AF;
      cursor: not-allowed;
      transform: none;
    }

    .details-button {
      width: 100%;
      background: linear-gradient(135deg, #6B7280, #4B5563);
      color: white;
      border: none;
      padding: 12px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 8px;
    }

    .details-button:hover {
      background: linear-gradient(135deg, #4B5563, #374151);
      transform: translateY(-1px);
    }

    .button-icon {
      font-size: 16px;
    }
  `]
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