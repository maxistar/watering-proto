import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PlantService } from '../../services/plant.service';
import { Plant, WateringLog } from '../../models/plant.interface';

@Component({
  selector: 'app-plant-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="plant-details" *ngIf="plant">
      <div class="details-header">
        <button class="back-button" (click)="goBack()">
          <span class="back-icon">←</span>
          Back to Dashboard
        </button>
        <div class="plant-status-badge" [class]="'badge-' + plant.status">
          {{ getStatusText() }}
        </div>
      </div>

      <div class="details-content">
        <div class="plant-hero">
          <div class="plant-image-large">
            <img [src]="plant.image" [alt]="plant.name" />
          </div>
          <div class="plant-main-info">
            <h1 class="plant-name">{{ plant.name }}</h1>
            <p class="plant-type">{{ plant.type }} • {{ plant.location }}</p>
            
            <div class="current-stats">
              <div class="stat-card">
                <div class="stat-icon">💧</div>
                <div class="stat-content">
                  <div class="stat-value">{{ plant.soilHumidity }}%</div>
                  <div class="stat-label">Soil Humidity</div>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">⏱️</div>
                <div class="stat-content">
                  <div class="stat-value">{{ plant.wateringDuration }}s</div>
                  <div class="stat-label">Last Duration</div>
                </div>
              </div>
              
              <div class="stat-card">
                <div class="stat-icon">📅</div>
                <div class="stat-content">
                  <div class="stat-value">{{ getDaysAgo() }}</div>
                  <div class="stat-label">Days Ago</div>
                </div>
              </div>
            </div>

            <button 
              class="water-button-large" 
              (click)="onWaterPlant()"
              [disabled]="plant.status === 'wet'">
              <span class="button-icon">💧</span>
              Water Plant Now
            </button>
          </div>
        </div>

        <div class="details-sections">
          <section class="humidity-section">
            <h2 class="section-title">Humidity Analysis</h2>
            <div class="humidity-details">
              <div class="humidity-gauge">
                <div class="gauge-container">
                  <div class="gauge-track"></div>
                  <div 
                    class="gauge-fill" 
                    [style.width.%]="plant.soilHumidity"
                    [class]="'fill-' + plant.status">
                  </div>
                  <div class="gauge-markers">
                    <div class="marker" style="left: 0%">0%</div>
                    <div class="marker" style="left: 25%">25%</div>
                    <div class="marker" style="left: 50%">50%</div>
                    <div class="marker" style="left: 75%">75%</div>
                    <div class="marker" style="left: 100%">100%</div>
                  </div>
                </div>
                <div class="optimal-range">
                  <div class="range-indicator" 
                       [style.left.%]="plant.optimalHumidity.min"
                       [style.width.%]="plant.optimalHumidity.max - plant.optimalHumidity.min">
                    Optimal Range: {{ plant.optimalHumidity.min }}% - {{ plant.optimalHumidity.max }}%
                  </div>
                </div>
              </div>
              
              <div class="humidity-recommendations">
                <h3>Recommendations</h3>
                <div class="recommendation" *ngIf="plant.status === 'dry'">
                  <span class="rec-icon">⚠️</span>
                  <div>
                    <strong>Water needed:</strong> Soil humidity is below optimal range. 
                    Consider watering for 30-45 seconds.
                  </div>
                </div>
                <div class="recommendation" *ngIf="plant.status === 'optimal'">
                  <span class="rec-icon">✅</span>
                  <div>
                    <strong>Perfect condition:</strong> Soil humidity is in the optimal range. 
                    Continue current watering schedule.
                  </div>
                </div>
                <div class="recommendation" *ngIf="plant.status === 'wet'">
                  <span class="rec-icon">🚫</span>
                  <div>
                    <strong>Too wet:</strong> Soil humidity is above optimal range. 
                    Wait before next watering to prevent root rot.
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section class="watering-history">
            <h2 class="section-title">Watering History</h2>
            <div class="history-list" *ngIf="wateringLogs.length > 0; else noHistory">
              <div class="history-item" *ngFor="let log of wateringLogs">
                <div class="history-date">
                  <div class="date-day">{{ formatDay(log.timestamp) }}</div>
                  <div class="date-time">{{ formatTime(log.timestamp) }}</div>
                </div>
                <div class="history-details">
                  <div class="history-duration">{{ log.duration }}s</div>
                  <div class="history-amount">{{ log.waterAmount }}L</div>
                </div>
                <div class="history-icon">💧</div>
              </div>
            </div>
            <ng-template #noHistory>
              <div class="no-history">
                <span class="no-history-icon">📝</span>
                <p>No watering history available for this plant.</p>
              </div>
            </ng-template>
          </section>

          <section class="plant-care-info">
            <h2 class="section-title">Care Information</h2>
            <div class="care-grid">
              <div class="care-item">
                <div class="care-icon">🌱</div>
                <div class="care-content">
                  <h4>Plant Type</h4>
                  <p>{{ plant.type }}</p>
                </div>
              </div>
              <div class="care-item">
                <div class="care-icon">📍</div>
                <div class="care-content">
                  <h4>Location</h4>
                  <p>{{ plant.location }}</p>
                </div>
              </div>
              <div class="care-item">
                <div class="care-icon">💧</div>
                <div class="care-content">
                  <h4>Optimal Humidity</h4>
                  <p>{{ plant.optimalHumidity.min }}% - {{ plant.optimalHumidity.max }}%</p>
                </div>
              </div>
              <div class="care-item">
                <div class="care-icon">⏰</div>
                <div class="care-content">
                  <h4>Last Watered</h4>
                  <p>{{ formatFullDate(plant.lastWatered) }}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>

    <div class="loading" *ngIf="!plant">
      <div class="loading-spinner"></div>
      <p>Loading plant details...</p>
    </div>
  `,
  styles: [`
    .plant-details {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .details-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .back-button {
      background: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .back-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    .back-icon {
      font-size: 18px;
    }

    .plant-status-badge {
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
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

    .details-content {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .plant-hero {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      padding: 40px;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }

    .plant-image-large {
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .plant-image-large img {
      width: 100%;
      height: 400px;
      object-fit: cover;
    }

    .plant-main-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .plant-name {
      font-size: 36px;
      font-weight: 800;
      margin: 0 0 8px 0;
      color: #1F2937;
    }

    .plant-type {
      font-size: 18px;
      color: #6B7280;
      margin: 0 0 32px 0;
    }

    .current-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      font-size: 24px;
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

    .water-button-large {
      background: linear-gradient(135deg, #3B82F6, #2563EB);
      color: white;
      border: none;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .water-button-large:hover:not(:disabled) {
      background: linear-gradient(135deg, #2563EB, #1D4ED8);
      transform: translateY(-2px);
    }

    .water-button-large:disabled {
      background: #9CA3AF;
      cursor: not-allowed;
      transform: none;
    }

    .details-sections {
      padding: 40px;
    }

    .section-title {
      font-size: 24px;
      font-weight: 700;
      color: #1F2937;
      margin: 0 0 24px 0;
    }

    .humidity-section {
      margin-bottom: 48px;
    }

    .humidity-details {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 32px;
    }

    .gauge-container {
      position: relative;
      margin-bottom: 16px;
    }

    .gauge-track {
      width: 100%;
      height: 20px;
      background: #E5E7EB;
      border-radius: 10px;
    }

    .gauge-fill {
      position: absolute;
      top: 0;
      left: 0;
      height: 20px;
      border-radius: 10px;
      transition: all 0.8s ease;
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

    .gauge-markers {
      display: flex;
      justify-content: space-between;
      margin-top: 8px;
    }

    .marker {
      font-size: 12px;
      color: #6B7280;
    }

    .optimal-range {
      position: relative;
      margin-top: 16px;
    }

    .range-indicator {
      position: absolute;
      height: 4px;
      background: #10B981;
      border-radius: 2px;
      opacity: 0.3;
    }

    .range-indicator::after {
      content: attr(title);
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 12px;
      color: #059669;
      font-weight: 600;
      white-space: nowrap;
    }

    .humidity-recommendations h3 {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 16px 0;
      color: #1F2937;
    }

    .recommendation {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: #F9FAFB;
      border-radius: 8px;
      border-left: 4px solid #10B981;
    }

    .rec-icon {
      font-size: 20px;
      margin-top: 2px;
    }

    .watering-history {
      margin-bottom: 48px;
    }

    .history-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .history-item {
      display: flex;
      align-items: center;
      padding: 20px;
      background: #F9FAFB;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
    }

    .history-date {
      min-width: 120px;
    }

    .date-day {
      font-weight: 600;
      color: #1F2937;
    }

    .date-time {
      font-size: 14px;
      color: #6B7280;
    }

    .history-details {
      flex: 1;
      display: flex;
      gap: 24px;
      margin-left: 24px;
    }

    .history-duration,
    .history-amount {
      font-weight: 600;
      color: #1F2937;
    }

    .history-icon {
      font-size: 20px;
      opacity: 0.6;
    }

    .no-history {
      text-align: center;
      padding: 40px;
      color: #6B7280;
    }

    .no-history-icon {
      font-size: 48px;
      display: block;
      margin-bottom: 16px;
    }

    .care-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
    }

    .care-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: #F9FAFB;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
    }

    .care-icon {
      font-size: 24px;
    }

    .care-content h4 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #1F2937;
    }

    .care-content p {
      font-size: 14px;
      color: #6B7280;
      margin: 0;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      color: white;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top: 4px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 1024px) {
      .plant-hero {
        grid-template-columns: 1fr;
        text-align: center;
      }

      .humidity-details {
        grid-template-columns: 1fr;
      }

      .current-stats {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .plant-details {
        padding: 16px;
      }

      .plant-hero {
        padding: 24px;
      }

      .details-sections {
        padding: 24px;
      }

      .plant-name {
        font-size: 28px;
      }

      .care-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
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