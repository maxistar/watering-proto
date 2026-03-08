import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Plant, WaterTank, WateringLog } from '../models/plant.interface';

interface WaterPlantResponse {
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private readonly apiBaseUrl = environment.apiBaseUrl.replace(/\/$/, '');
  private cachedPlants: Plant[] = [];

  constructor(private readonly http: HttpClient) {}

  getPlants(): Observable<Plant[]> {
    return this.http
      .get<Plant[]>(`${this.apiBaseUrl}/dashboard/plants`)
      .pipe(
        tap((plants) => {
          this.cachedPlants = plants;
        }),
      );
  }

  getWaterTank(): Observable<WaterTank> {
    return this.http.get<WaterTank>(`${this.apiBaseUrl}/dashboard/water-tank`);
  }

  getWateringLogs(): Observable<WateringLog[]> {
    return of([]);
  }

  getPlantById(id: number): Observable<Plant | undefined> {
    return this.getPlants().pipe(
      map((plants) => plants.find((plant) => plant.id === id)),
      catchError(() => of(this.cachedPlants.find((plant) => plant.id === id))),
    );
  }

  getWateringLogsByPlantId(_plantId: number): Observable<WateringLog[]> {
    return of([]);
  }

  waterPlant(plantId: number, duration: number): Observable<boolean> {
    return this.http
      .post<WaterPlantResponse>(`${this.apiBaseUrl}/dashboard/plants/${plantId}/water`, { duration })
      .pipe(
        map((response) => response.success === true),
        catchError(() => of(false)),
      );
  }
}
