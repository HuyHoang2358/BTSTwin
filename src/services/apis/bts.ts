import type { Point, WrapperResponse } from '@/services/services.types';
import client from '@/services/client';
import { API_CALCULATE } from '@/services/apiPath';

export type Bts = {
  id: number;
  createdAt: string;
  updatedAt: string;
  station: string;
  modelLink: string;
  address: string;
  operator: string;
  type: string;
  mountingPosition: string;
  towerHeight: number;
  towerTilt: number;
  gpsRatio: number;
  paramA: number;
  assetId: number;
  paramB: number;
  northDirection: number[];
  geom: Point;
  zplane: number;
};

export interface Inventory {
  id: number | string;
  createdAt: string;
  updatedAt: string;
  name: string;
  model: string;
  vendor: string;
  deviceTilt: number;
  deviceAzimuth: number;
  deviceHeight: number;
  status: boolean;
  modelHeight: number;
  modelWidth: number;
  modelDepth: number;
  vertices: string;
  translation: string;
  rotation: string;
  image2D?: Image2D;
}

export type StationItems = {
  station: string;
  expanded: boolean;
  items: Omit<Bts, 'station'>[];
};

export interface Image2D {
  id: number;
  createdAt: string;
  updatedAt: string;
  fileName: string;
  width: number;
  height: number;
  gpsLatitudeRef: string;
  gpsLongitudeRef: string;
  gpsAltitudeRef: string;
  gimbalRollDegree: string;
  gimbalYawDegree: string;
  gimbalPitchDegree: number;
  gpsAltitude: string;
  gpsLatitude: string;
  gpsLongitude: string;
  imageUrl: string;
  previewImageUrl: string;
  cameraPose: CameraPose;
}

export interface CameraPose {
  id: number;
  createdAt: string;
  updatedAt: string;
  fileName: string;
  w2c: string;
  qvec: string;
  tvec: string;
  intrinsicMtx: string;
  camCent: string;
  eulerAngle: string;
  cameraId: number;
  nerfName: string;
}

export interface CalculateData {
  pole_id: number;
  devices: Device[];
}

export interface Device {
  name: string;
  depth: number;
  width: number;
  height: number;
  DC: number;
}

export interface CalculateResType {
  pole_stress: number;
}

export const calculate = (data: CalculateData): WrapperResponse<CalculateResType> =>
  client.post(API_CALCULATE, data);
