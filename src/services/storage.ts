import { GeometryResult, MeasurementInput, PhysicsResult, ShapeType } from '../types';
import { toMeters, kgToOunces, kgToPounds } from './unitConverter';

const PI = Math.PI;

export function solveGeometry(input: MeasurementInput): GeometryResult {
  const l = toMeters(input.length, input.unitSystem);
  const w = toMeters(input.width, input.unitSystem);
  const h = toMeters(input.height, input.unitSystem);
  const r = toMeters(input.radius, input.unitSystem);
  const s = toMeters(input.sideLength, input.unitSystem);

  let volumeM3 = 0;
  let surfaceAreaM2 = 0;

  switch (input.shapeType) {
    case ShapeType.Cuboid:
      volumeM3 = l * w * h;
      surfaceAreaM2 = 2 * (l * w + l * h + w * h);
      break;
    case ShapeType.Cylinder:
      volumeM3 = PI * r * r * h;
      surfaceAreaM2 = 2 * PI * r * (r + h);
      break;
    case ShapeType.Sphere:
      volumeM3 = (4 / 3) * PI * r * r * r;
      surfaceAreaM2 = 4 * PI * r * r;
      break;
    case ShapeType.Cone:
      volumeM3 = (1 / 3) * PI * r * r * h;
      surfaceAreaM2 = PI * r * (r + Math.sqrt(h * h + r * r));
      break;
    case ShapeType.Pyramid:
      volumeM3 = (1 / 3) * s * s * h;
      const slant = Math.sqrt((s / 2) ** 2 + h ** 2);
      surfaceAreaM2 = s * s + 2 * s * slant;
      break;
  }

  const volumeCm3 = volumeM3 * 1000000;

  return {
    volumeM3,
    surfaceAreaM2,
    volumeCm3,
  };
}

export function solvePhysics(input: MeasurementInput, geometry: GeometryResult): PhysicsResult {
  const densityGcm3 = input.densityGcm3;
  const volumeCm3 = geometry.volumeCm3;
  const volumeM3 = geometry.volumeM3;

  const massKg = (densityGcm3 * volumeCm3) / 1000;
  const massG = densityGcm3 * volumeCm3;
  const densityKgM3 = densityGcm3 * 1000;

  if (input.massKg > 0 && volumeM3 > 0) {
    const derivedDensity = input.massKg / volumeM3;
    return {
      massKg: input.massKg,
      massG: input.massKg * 1000,
      densityKgM3: derivedDensity,
      densityGcm3: derivedDensity / 1000,
      massLb: input.massKg * 2.20462262185,
      massOz: input.massKg * 35.274,
    };
  }

  return {
    massKg,
    massG,
    densityKgM3,
    densityGcm3,
    massLb: kgToPounds(massKg),
    massOz: kgToOunces(massKg),
  };
}
