import type { Point, WrapperResponse } from '@/services/services.types';
import client from '@/services/client';
import { API_BTS, API_CAMERA_POSE, API_INVENTORY } from '@/services/apiPath';

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
  paramB: number;
  northDirection: number[];
  geom: Point;
  zplane: number;
};

export interface Inventory {
  id: number;
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

export const fetchBTS = (): WrapperResponse<Bts[]> => client.get(API_BTS);

export const fetchBTSById = (id: string): WrapperResponse<Bts> => client.get(`${API_BTS}/${id}`);

export const fetchInventoryByBtsId = (id: string): WrapperResponse<Inventory[]> =>
  client.get(`${API_INVENTORY}/get-by-bts/${id}`);

export const fetchImage2DByBtsId = (id: string): WrapperResponse<Image2D[]> =>
  client.get(`${API_CAMERA_POSE}/get-by-bts/${id}`);
