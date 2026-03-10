import test from 'node:test';
import assert from 'node:assert/strict';
import {
  countHealthyPlants,
  countPlantsNeedingWater,
  statusToText,
} from '../../.unit-dist/src/utils/plant-metrics.js';

const fixtures = [
  { id: 1, status: 'optimal' },
  { id: 2, status: 'dry' },
  { id: 3, status: 'wet' },
];

test('countHealthyPlants counts optimal plants', () => {
  assert.equal(countHealthyPlants(fixtures), 1);
});

test('countPlantsNeedingWater counts dry plants', () => {
  assert.equal(countPlantsNeedingWater(fixtures), 1);
});

test('statusToText maps dashboard status to UI text', () => {
  assert.equal(statusToText('dry'), 'Needs Water');
  assert.equal(statusToText('optimal'), 'Healthy');
  assert.equal(statusToText('wet'), 'Too Wet');
});
