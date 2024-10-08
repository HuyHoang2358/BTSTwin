import type { Point, WrapperResponse } from '@/services/services.types';
import client from '@/services/client';
import { API_STATION, API_STATION_SCAN, API_STATION_SCAN_IMAGE } from '@/services/apiPath';
import * as THREE from 'three';
import type { Vendor } from '@/services/apis/vendor';
import type { Commune, Country, District, Province } from '@/services/apis/address';
import type { PoleCategory } from '@/services/apis/polecategory';
import type { DeviceCategory } from '@/services/apis/devicecategory';

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
export interface Location {
  id: number;
  latitude: number;
  longitude: number;
  height: number;
}

export interface Address {
  id: number;
  detail: string | null;
  address_detail?: string;
  country: Country;
  province: Province;
  district: District;
  commune: Commune;
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
  device: Device;
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

export interface Device {
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

// end

export interface BtsDetail {
  id: number;
  name: string;
  code: string;
  station_category_id: number;
  date: string;
  status: number;
  detail: Detail;
  poles?: Pole[];
  images?: Image[];
  models?: Model[];
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

export const fetchStations = (): WrapperResponse<Station[]> => client.get(API_STATION);

export const fetchScanDetail = (id: string): WrapperResponse<Scan> =>
  client.get(`${API_STATION_SCAN}/${id}`);

export const fetchScanImages = (id: string): WrapperResponse<Image[]> =>
  client.get(API_STATION_SCAN_IMAGE.replace(':id', id));

export const fetchBTSById = (id: string): WrapperResponse<BtsDetail> =>
  client.get(`${API_STATION}/${id}`);

export const fetchReport = (id: string) =>
  client.get(`${API_STATION}/excel/export`, {
    params: {
      stations: [id],
    },
  });
