export enum ShapeType {
  Cuboid = 'cuboid',
  Cylinder = 'cylinder',
  Sphere = 'sphere',
  Cone = 'cone',
  Pyramid = 'pyramid',
}

export enum UnitSystem {
  Millimeter = 'mm',
  Centimeter = 'cm',
  Meter = 'm',
  Inch = 'in',
  Foot = 'ft',
}

export enum SolveTarget {
  Mass = 'mass',
  Density = 'density',
}

export interface MaterialDensity {
  name: string;
  densityGcm3: number;
}

export interface MeasurementInput {
  shapeType: ShapeType;
  length: number;
  width: number;
  height: number;
  radius: number;
  sideLength: number;
  densityGcm3: number;
  massKg: number;
  unitSystem: UnitSystem;
  useReferenceScale: boolean;
  referenceScaleMm: number;
}

export interface GeometryResult {
  volumeM3: number;
  surfaceAreaM2: number;
  volumeCm3: number;
}

export interface PhysicsResult {
  massKg: number;
  massG: number;
  densityKgM3: number;
  densityGcm3: number;
  massLb: number;
  massOz: number;
}

export interface MeasurementRecord {
  id: string;
  createdAt: string;
  shapeType: ShapeType;
  length: number;
  width: number;
  height: number;
  radius: number;
  sideLength: number;
  densityGcm3: number;
  volumeCm3: number;
  massKg: number;
  photoUri?: string;
}
