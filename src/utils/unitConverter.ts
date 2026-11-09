import { UnitSystem } from '../types';

export const unitMultiplierToMeters: Record<UnitSystem, number> = {
  [UnitSystem.Millimeter]: 0.001,
  [UnitSystem.Centimeter]: 0.01,
  [UnitSystem.Meter]: 1.0,
  [UnitSystem.Inch]: 0.0254,
  [UnitSystem.Foot]: 0.3048,
};

export function toMeters(value: number, unitSystem: UnitSystem): number {
  return value * unitMultiplierToMeters[unitSystem];
}

export function fromMeters(valueInMeters: number, unitSystem: UnitSystem): number {
  return valueInMeters / unitMultiplierToMeters[unitSystem];
}

export function gramsToKg(grams: number): number {
  return grams / 1000;
}

export function kgToGrams(kg: number): number {
  return kg * 1000;
}

export function kgToPounds(kg: number): number {
  return kg * 2.20462262185;
}

export function kgToOunces(kg: number): number {
  return kg * 35.274;
}
