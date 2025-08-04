import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WaterTank } from '../../models/plant.interface';

@Component({
  selector: 'app-water-tank',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="water-tank-card">
      <div class="tank-header">
        <h3 class="tank-title">💧 Water Tank Status</h3>
        <div class="status-indicator" [class]="'indicator-' + waterTank.status">
          {{ getStatusText() }}
        </div>
      </div>
      
      <div class="tank-visual">
        <div class="tank-container">
          <div class="tank-body">
            <div 
              class="water-level" 
              [style.height.%]="getWaterPercentage()"
              [class]="'level-' + waterTank.status">
            </div>
          </div>
          <div class="tank-graduations">
            <div class="graduation" style="bottom: 0%">0L</div>
            <div class="graduation" style="bottom: 25%">{{ waterTank.capacity * 0.25 }}L</div>
            <div class="graduation" style="bottom: 50%">{{ waterTank.capacity * 0.5 }}L</div>
            <div class="graduation" style="bottom: 75%">{{ waterTank.capacity * 0.75 }}L</div>
            <div class="graduation" style="bottom: 100%">{{ waterTank.capacity }}L</div>
          </div>
        </div>
        
        <div class="tank-stats">
          <div class="stat-item">
            <div class="stat-value">{{ waterTank.currentLevel }}L</div>
            <div class="stat-label">Current Level</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ waterTank.capacity }}L</div>
            <div class="stat-label">Total Capacity</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ getWaterPercentage() }}%</div>
            <div class="stat-label">Fill Level</div>
          </div>
        </div>
      </div>
      
      <div class="tank-info">
        <div class="info-row">
          <span class="label">Last refilled:</span>
          <span class="value">{{ formatDate(waterTank.lastRefilled) }}</span>
        </div>
        <div class="info-row">
          <span class="label">Estimated days remaining:</span>
          <span class="value">{{ getEstimatedDays() }} days</span>
        </div>
      </div>
      
      <button class="refill-button" [class]="'button-' + waterTank.status">
        <span class="button-icon">🔄</span>
        {{ getButtonText() }}
      </button>
    </div>
  `,
  styles: [`
    .water-tank-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      padding: 24px;
      transition: all 0.3s ease;
    }

    .water-tank-card:hover {
      box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.15);
    }

    .tank-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .tank-title {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
      color: #1F2937;
    }

    .status-indicator {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .indicator-low {
      background: #FEE2E2;
      color: #DC2626;
    }

    .indicator-medium {
      background: #FEF3C7;
      color: #D97706;
    }

    .indicator-full {
      background: #D1FAE5;
      color: #059669;
    }

    .tank-visual {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;
    }

    .tank-container {
      position: relative;
      flex: 1;
    }

    .tank-body {
      width: 100%;
      height: 200px;
      background: #F3F4F6;
      border: 2px solid #D1D5DB;
      border-radius: 8px;
      position: relative;
      overflow: hidden;
    }

    .water-level {
      position: absolute;
      bottom: 0;
      width: 100%;
      transition: all 0.8s ease;
      border-radius: 0 0 6px 6px;
    }

    .level-low {
      background: linear-gradient(180deg, #FCA5A5, #EF4444);
    }

    .level-medium {
      background: linear-gradient(180deg, #FBBF24, #F59E0B);
    }

    .level-full {
      background: linear-gradient(180deg, #6EE7B7, #10B981);
    }

    .tank-graduations {
      position: absolute;
      right: -60px;
      top: 0;
      height: 200px;
    }

    .graduation {
      position: absolute;
      font-size: 12px;
      color: #6B7280;
      white-space: nowrap;
    }

    .tank-stats {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 120px;
    }

    .stat-item {
      text-align: center;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #1F2937;
      margin-bottom: 4px;
    }

    .stat-label {
      font-size: 12px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .tank-info {
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

    .refill-button {
      width: 100%;
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

    .button-low {
      background: linear-gradient(135deg, #EF4444, #DC2626);
      color: white;
    }

    .button-medium {
      background: linear-gradient(135deg, #F59E0B, #D97706);
      color: white;
    }

    .button-full {
      background: #F3F4F6;
      color: #6B7280;
      cursor: not-allowed;
    }

    .refill-button:hover:not(.button-full) {
      transform: translateY(-1px);
    }

    .button-icon {
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .tank-visual {
        flex-direction: column;
      }
      
      .tank-stats {
        flex-direction: row;
        justify-content: space-around;
      }
      
      .tank-graduations {
        position: static;
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
      }
      
      .graduation {
        position: static;
      }
    }
  `]
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