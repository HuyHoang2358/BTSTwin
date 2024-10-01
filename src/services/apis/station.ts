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
import * as THREE from 'three';
import type { Vendor } from '@/services/apis/vendor';

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

export interface CalculateData {
  station_code: string;
  devices: Device[];
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

export interface BtsDetail {
  id: number;
  name: string;
  code: string;
  station_category_id: number;
  date: string;
  status: number;
  detail: Detail;
  poles: Pole[];
  images: Image[];
  models: Model[];
}

export interface Detail {
  id: number;
  name: string;
  code: string;
  description: any;
  location_id: number;
  address_id: number;
  location: Location;
  address: Address;
}

export interface Location {
  id: number;
  latitude: string;
  longitude: string;
  height: string;
}

export interface Pole {
  id: number;
  name: string;
  height: number;
  is_roof: number;
  isExpanded: boolean;
  house_height: number;
  pole_category_id: number;
  size: any;
  diameter_body_tube: any;
  diameter_strut_tube: any;
  diameter_top_tube: any;
  diameter_bottom_tube: any;
  foot_size: any;
  top_size: any;
  structure: any;
  z_plane: number;
  is_shielded: number;
  north_direction: string;
  gps_ratio: string;
  tilt_angle: any;
  param_a: string;
  param_b: string;
  description: any;
  station_code: any;
  stress_value: any;
  pivot: Pivot;
  category: Category;
  devices: Device[];
  deviceCategories: {
    name: string;
    devices: Device[];
  }[];
}

export interface Pivot {
  station_id: number;
  pole_id: number;
  id: number;
}

export interface Category {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface Device {
  id: number;
  name: string;
  slug: string;
  model?: string;
  images: any;
  model_url: any;
  length: number;
  width: number;
  depth: number;
  weight: number;
  diameter: any;
  description: string;
  device_category_id: number;
  params: { key: string; value: string }[];
  vendor_id: number;
  pivot: Pivot2;
  boxMesh?: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;
  volume?: Potree.BoxVolume;
  visibleMesh: boolean;
  visible: boolean;
  clip: boolean;
  isNewDevice: boolean;
  newDevice?: any;
  category: Category;
  vendor: Vendor;
}

export interface Pivot2 {
  pole_id: number;
  device_id: number;
  id: number;
  attached_at: any;
  x: any;
  y: any;
  z: number;
  alpha: any;
  beta: any;
  gama: any;
  vertices: string;
  suggested_img: string;
  tilt: number;
  azimuth: number;
  height: number;
  description: string;
}

export interface Image {
  id: number;
  image_url: string;
  preview_image_url: string;
  filename: string;
  width: number;
  height: number;
  gps: Gps;
  camera_pose: CameraPose;
  gimbal: Gimbal;
  take_date: string;
}

export interface Gps {
  id: number;
  image_id: number;
  latitude: string;
  longitude: string;
  altitude: string;
  latitude_ref: string;
  longitude_ref: string;
  altitude_ref: string;
  created_at: string;
  updated_at: string;
}

export interface CameraPose {
  id: number;
  image_id: number;
  w2c: string;
  tvec: string;
  qvec: string;
  cent_point: string;
  euler_angle: string;
  intrinsic_mtx: string;
  created_at: string;
  updated_at: string;
}

export interface Gimbal {
  id: number;
  image_id: number;
  yaw_degree: string;
  pitch_degree: string;
  roll_degree: string;
  created_at: string;
  updated_at: string;
}

export interface Model {
  id: number;
  filename: string;
  preview_img: string;
  url: string;
  file_path: string;
  type: string;
}

export const fetchStations = (): WrapperResponse<Station[]> => client.get(API_STATION);

export const fetchBTSById = (id: string): WrapperResponse<BtsDetail> =>
  client.get(`${API_STATION}/${id}`);

export const fetchReport = (id: string) =>
  client.get(`${API_STATION}/excel/export`, {
    params: {
      stations: [id],
    },
  });
