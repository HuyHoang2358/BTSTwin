import client from '@/services/client';
import { API_STATION, API_STATION_SCAN, API_STATION_SCAN_IMAGE } from '@/services/apiPath';

import * as THREE from 'three';
import type { Vendor } from '@/services/apis/vendor';
import type { Address } from '@/services/apis/address';
import type { PoleCategory } from '@/services/apis/polecategory';
import type { WrapperResponse } from '@/services/services.types';
import type { DeviceCategory } from '@/services/apis/devicecategory';
import Measurement from '@/components/Measurement.vue';
import { data } from 'autoprefixer';

// TODO: Define types
export interface Location {
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
  scans: Scan[];
  location: Location;
  address: Address;
  expanded?: boolean;
  stress_value?: number;
  pole_category?: PoleCategory;
}

export interface Scan {
  id: number;
  name: string;
  status: string;
  is_active: number;
  date: string;
  station_id: number;
  models?: Model3D[];
  poles?: Pole[];
}

export interface Model3D {
  id: number;
  scan_id: number;
  filename: string;
  preview_img: string;
  url: string;
  file_path: string;
  type: string;
}

export interface Image {
  id: number;
  image_url: string;
  preview_image_url: string;
  filename: string;
  width: number;
  height: number;
  take_date: string;
  gps: Gps;
  camera_pose: CameraPose;
  gimbal: Gimbal;
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
}

export interface CameraPose {
  id: number;
  image_id: number;
  geometry_cone_id: number;
  w2c: string;
  tvec: string;
  qvec: string;
  intrinsic_mtx: string;
  geometry_cone: GeometryCone;
}

export interface GeometryCone {
  id: number;
  radius: number;
  height: number;
  radial_segments: number;
  pos_x: number;
  pos_y: number;
  pos_z: number;
  rotate_x: number;
  rotate_y: number;
  rotate_z: number;
}

export interface Gimbal {
  id: number;
  image_id: number;
  yaw_degree: string;
  pitch_degree: string;
  roll_degree: string;
}

export interface Pole {
  id: number;
  scan_id: number;
  pole_category_id: number;
  name: string;
  z_plane: number;
  plane_altitude: number;
  gps_ratio: number;
  stress_value: number;
  category: PoleCategory;
  pole_devices: PoleDevice[];
  pole_param: PoleParam;
  deviceCategories: PoleDeviceCategory[];
  isExpanded?: boolean;
}
export interface PoleDeviceCategory {
  name: string;
  devices: PoleDevice[];
}
export interface PoleDevice {
  id: number;
  pole_id: number;
  device_id: number;
  geometry_box_id: number;
  rotation: string;
  translation: string;
  vertices: string;
  tilt: any;
  azimuth?: number;
  ai_device_width: number;
  ai_device_height: number;
  ai_device_depth: number;
  suggested_img: string;
  user_id: number;
  is_active: number;
  device_info: DeviceInfo;
  geometry_box: GeometryBox;
  boxMesh?: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;
  volume?: Potree.BoxVolume;
  visibleMesh: boolean;
  visible: boolean;
  clip: boolean;
  isNewDevice: boolean;
  newDevice?: any;
}

export interface GeometryBox {
  id: number;
  depth: number;
  width: number;
  height: number;
  pos_x: number;
  pos_y: number;
  pos_z: number;
  rotate_x: number;
  rotate_y: number;
  rotate_z: number;
}

export interface DeviceInfo {
  id: number;
  name: string;
  slug: string;
  images?: string;
  model_url: any;
  length?: number;
  width?: number;
  depth: number;
  weight: number;
  diameter?: number;
  description?: string;
  device_category_id: number;
  vendor_id?: number;
  vendor?: Vendor;
  category: DeviceCategory;
  params: { key: string; value: string }[];
}

export interface Model {
  id: number;
  filename: string;
  preview_img: string;
  url: string;
  file_path: string;
  type: string;
}

export interface PoleHistory {
  id: string;
  field: Record<string, string | number>;
  createdAt: string;
  scanId: number;
  poleId: number;
}

export type DataCreatePole = {
  scanId: number;
  poleId: number;
  field: Record<string, string | number>;
};

export interface DeviceHistory {
  id: string;
  field: Record<string, string | number>;
  createdAt: string;
  scanId: number;
  deviceId: number;
}

export type DataCreateDevice = {
  scanId: number;
  deviceId: number;
  field: Record<string, string | number>;
};

export type DataSaveMeasurements = {
  scanId: number;
  measurements: string;
};

export interface PoleParam {
  id: number;
  pole_id: number;
  height: number;
  is_roof: number;
  house_height: number;
  diameter_body_tube: string;
  diameter_strut_tube: any;
  diameter_top_tube: string;
  diameter_bottom_tube: string;
  tilt_angle: any;
  is_shielded: number;
  size: any;
  foot_size: any;
  top_size: any;
  is_active: number;
  user_id: number;
  description: string;
}

// TODO: API Detail
// Get information of all stations
export const fetchStations = (): WrapperResponse<Station[]> => client.get(API_STATION);

// Get information of a scan of station by scan id
export const fetchScanDetail = (id: string): WrapperResponse<Scan> =>
  client.get(`${API_STATION_SCAN}/${id}`);

// Get all images of a scan by scan id
export const fetchScanImages = (id: string): WrapperResponse<Image[]> =>
  client.get(API_STATION_SCAN_IMAGE.replace(':id', id));

export const fetchReport = (id: string) =>
  client.get(`${API_STATION}/excel/export`, {
    params: {
      stations: [id],
    },
  });

//
export const fetchPoleHistory = (params: {
  scanId: string;
  poleId: number;
}): Promise<PoleHistory[]> =>
  client.get('https://66ff6db12b9aac9c997f3c22.mockapi.io/history-pole', {
    params,
  });

export const createPoleHistory = (data: DataCreatePole) =>
  client.post(`https://66ff6db12b9aac9c997f3c22.mockapi.io/history-pole`, data);

export const fetchDeviceHistory = (params: {
  scanId: string;
  deviceId: number;
}): Promise<DeviceHistory[]> =>
  client.get('https://66ff6db12b9aac9c997f3c22.mockapi.io/history-device', {
    params,
  });

export const createDeviceHistory = (data: DataCreateDevice) =>
  client.post(`https://66ff6db12b9aac9c997f3c22.mockapi.io/history-device`, data);

export const getMeasurementHistoryByScanId = (
  scanId: string,
): WrapperResponse<DataSaveMeasurements> =>
  client.get(`http://localhost:8899/api/bts/get-measurement-history-by-scan-id/${scanId}`);

export const saveMeasurements = (data: DataSaveMeasurements) =>
  client.post('http://localhost:8899/api/bts/save-measurement-history', data);
