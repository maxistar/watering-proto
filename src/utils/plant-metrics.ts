import type { Plant } from '../models/plant.interface';

export function countHealthyPlants(plants: Plant[]): number {
  return plants.filter((plant) => plant.status === 'optimal').length;
}

export function countPlantsNeedingWater(plants: Plant[]): number {
  return plants.filter((plant) => plant.status === 'dry').length;
}

export function statusToText(status: Plant['status']): string {
  switch (status) {
    case 'dry':
      return 'Needs Water';
    case 'optimal':
      return 'Healthy';
    case 'wet':
      return 'Too Wet';
    default:
      return 'Unknown';
  }
}
