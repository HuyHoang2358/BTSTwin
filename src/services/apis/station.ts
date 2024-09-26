import type { Point, WrapperResponse } from '@/services/services.types';
import client from '@/services/client';
import {
  API_BTS,
  API_CALCULATE,
  API_CAMERA_POSE,
  API_INVENTORY,
  API_MEDIA_MANAGER,
  API_STATION,
} from '@/services/apiPath';
import type { Address } from '@/services/apis/stationCategory';

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
  station_code: string;
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

// TODO: Define types
export interface LocationPoint {
  id: number;
  latitude: string;
  longitude: string;
  height: string;
}

export interface Station {
  id: number;
  name: string;
  code: string;
  description: string;
  scans_count: number;
  scans: Scan[];
  location: LocationPoint;
  address: Address;
  expanded?: boolean;
}

export interface Model3D {
  id: number;
  filename: string;
  preview_img: string;
  url: string;
  file_path: string;
  type: string;
}
export interface Scan {
  id: number;
  name: string;
  code: string;
  station_category_id: number | null;
  date: string;
  status: number;
  models: Model3D[];
}

// TODO: Functions
export const fetchStations = (): WrapperResponse<Station[]> => client.get(API_STATION);
