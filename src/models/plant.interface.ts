export interface Plant {
  id: number;
  name: string;
  type: string;
  location: string;
  soilHumidity: number;
  lastWatered: string;
  wateringDuration: number;
  status: 'dry' | 'optimal' | 'wet';
  image: string;
  optimalHumidity: {
    min: number;
    max: number;
  };
}

export interface WaterTank {
  id: number;
  capacity: number;
  currentLevel: number;
  lastRefilled: string;
  status: 'low' | 'medium' | 'full';
}

export interface WateringLog {
  id: number;
  plantId: number;
  timestamp: string;
  duration: number;
  waterAmount: number;
}