import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Plant, WaterTank, WateringLog } from '../models/plant.interface';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private plants: Plant[] = [
    {
      id: 1,
      name: "Monstera Deliciosa",
      type: "Tropical",
      location: "Living Room",
      soilHumidity: 65,
      lastWatered: "2025-01-27T08:30:00Z",
      wateringDuration: 45,
      status: "optimal",
      image: "https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=400",
      optimalHumidity: {
        min: 50,
        max: 70
      }
    },
    {
      id: 2,
      name: "Peace Lily",
      type: "Flowering",
      location: "Bedroom",
      soilHumidity: 35,
      lastWatered: "2025-01-25T14:15:00Z",
      wateringDuration: 30,
      status: "dry",
      image: "https://images.pexels.com/photos/7664820/pexels-photo-7664820.jpeg?auto=compress&cs=tinysrgb&w=400",
      optimalHumidity: {
        min: 45,
        max: 65
      }
    },
    {
      id: 3,
      name: "Snake Plant",
      type: "Succulent",
      location: "Office",
      soilHumidity: 40,
      lastWatered: "2025-01-24T10:00:00Z",
      wateringDuration: 20,
      status: "optimal",
      image: "https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg?auto=compress&cs=tinysrgb&w=400",
      optimalHumidity: {
        min: 30,
        max: 50
      }
    },
    {
      id: 4,
      name: "Fiddle Leaf Fig",
      type: "Tree",
      location: "Living Room",
      soilHumidity: 80,
      lastWatered: "2025-01-27T09:45:00Z",
      wateringDuration: 60,
      status: "wet",
      image: "https://images.pexels.com/photos/6208087/pexels-photo-6208087.jpeg?auto=compress&cs=tinysrgb&w=400",
      optimalHumidity: {
        min: 55,
        max: 75
      }
    },
    {
      id: 5,
      name: "Pothos",
      type: "Vine",
      location: "Kitchen",
      soilHumidity: 58,
      lastWatered: "2025-01-26T16:20:00Z",
      wateringDuration: 35,
      status: "optimal",
      image: "https://images.pexels.com/photos/4751978/pexels-photo-4751978.jpeg?auto=compress&cs=tinysrgb&w=400",
      optimalHumidity: {
        min: 45,
        max: 65
      }
    },
    {
      id: 6,
      name: "Rubber Plant",
      type: "Tree",
      location: "Balcony",
      soilHumidity: 28,
      lastWatered: "2025-01-23T12:00:00Z",
      wateringDuration: 50,
      status: "dry",
      image: "https://images.pexels.com/photos/3125195/pexels-photo-3125195.jpeg?auto=compress&cs=tinysrgb&w=400",
      optimalHumidity: {
        min: 50,
        max: 70
      }
    }
  ];

  private waterTank: WaterTank = {
    id: 1,
    capacity: 50,
    currentLevel: 32,
    lastRefilled: "2025-01-25T06:00:00Z",
    status: "medium"
  };

  private wateringLogs: WateringLog[] = [
    {
      id: 1,
      plantId: 1,
      timestamp: "2025-01-27T08:30:00Z",
      duration: 45,
      waterAmount: 0.8
    },
    {
      id: 2,
      plantId: 4,
      timestamp: "2025-01-27T09:45:00Z",
      duration: 60,
      waterAmount: 1.2
    },
    {
      id: 3,
      plantId: 5,
      timestamp: "2025-01-26T16:20:00Z",
      duration: 35,
      waterAmount: 0.6
    },
    {
      id: 4,
      plantId: 2,
      timestamp: "2025-01-25T14:15:00Z",
      duration: 30,
      waterAmount: 0.5
    },
    {
      id: 5,
      plantId: 3,
      timestamp: "2025-01-24T10:00:00Z",
      duration: 20,
      waterAmount: 0.4
    },
    {
      id: 6,
      plantId: 6,
      timestamp: "2025-01-23T12:00:00Z",
      duration: 50,
      waterAmount: 1.0
    }
  ];

  getPlants(): Observable<Plant[]> {
    return of(this.plants);
  }

  getWaterTank(): Observable<WaterTank> {
    return of(this.waterTank);
  }

  getWateringLogs(): Observable<WateringLog[]> {
    return of(this.wateringLogs);
  }

  getPlantById(id: number): Observable<Plant | undefined> {
    const plant = this.plants.find(p => p.id === id);
    return of(plant);
  }

  getWateringLogsByPlantId(plantId: number): Observable<WateringLog[]> {
    const logs = this.wateringLogs.filter(log => log.plantId === plantId);
    return of(logs);
  }

  waterPlant(plantId: number, duration: number): Observable<boolean> {
    const plant = this.plants.find(p => p.id === plantId);
    if (plant) {
      plant.lastWatered = new Date().toISOString();
      plant.wateringDuration = duration;
      plant.soilHumidity = Math.min(plant.soilHumidity + 20, 100);
      
      // Update status based on new humidity
      if (plant.soilHumidity < plant.optimalHumidity.min) {
        plant.status = 'dry';
      } else if (plant.soilHumidity > plant.optimalHumidity.max) {
        plant.status = 'wet';
      } else {
        plant.status = 'optimal';
      }

      // Add new watering log
      const newLog: WateringLog = {
        id: this.wateringLogs.length + 1,
        plantId: plantId,
        timestamp: new Date().toISOString(),
        duration: duration,
        waterAmount: duration * 0.02
      };
      this.wateringLogs.unshift(newLog);

      return of(true);
    }
    return of(false);
  }
}