import client from '@/services/client';
import { API_POLE } from '@/services/apiPath';
import type {
  IdParam,
  IndexRequestParams,
  PaginateRequestParams,
  PaginateResType,
  WrapperResponse,
} from '@/services/services.types';
import type { PoleCategory } from '@/services/apis/polecategory';
import type { Device } from '@/services/apis/device';

export type PoleParam = {
  id?: number;
  key: string;
  value: string;
};
export type Pole = {
  id: number;
  name: string;
  station_code: string | null;
  height: number | null;
  is_roof: number | boolean;
  house_height: number | null;
  category: PoleCategory;
  size: string | null;
  diameter_body_tube: number | null;
  diameter_strut_tube: number | null;
  diameter_top_tube: number | null;
  diameter_bottom_tube: number | null;
  foot_size: string | null;
  top_size: string | null;
  structure: string | null;
  description: string | null;
  params: PoleParam[] | null;
  devices?: Device[];
};

export type PoleData = {
  name: string | null;
  station_code: string | null;
  height: number | null;
  is_roof: number | boolean;
  house_height: number | null;
  size: string | null;
  diameter_body_tube: number | null;
  diameter_strut_tube: number | null;
  diameter_top_tube: number | null;
  diameter_bottom_tube: number | null;
  foot_size: string | null;
  top_size: string | null;
  structure: string | null;
  description: string | null;
  params: PoleParam[];
  pole_category_id: number | string | null;
};

export type PoleDeviceData = {
  pole_id: number | null;
  device_id: number | null;
  attached_at: number | null;
  x: number | null;
  y: number | null;
  z: number | null;
  alpha: number | null;
  beta: number | null;
  gama: number | null;
};

export const fetchPoles = (
  params: IndexRequestParams & PaginateRequestParams,
): WrapperResponse<PaginateResType<Pole>> =>
  client.get(API_POLE, {
    params,
  });

export const createPole = (data: PoleData) => client.post(API_POLE, data);

export const updatePole = (data: PoleData & IdParam) =>
  client.patch(`${API_POLE}/${data.id}`, data);

export const deletePole = (id: number) => client.delete(`${API_POLE}/${id}`);
export const deleteDeviceFromPole = (id: number) =>
  client.delete(`${API_POLE}/${id}/delete-device`);

export const addDeviceToPole = (data: PoleDeviceData) =>
  client.post(`${API_POLE}/add-device`, data);

export const updateDeviceInPole = (data: PoleDeviceData & IdParam) =>
  client.patch(`${API_POLE}/${data.id}/edit-device`, data);
