
import client from '@/services/client';
import { API_DEVICE_CATEGORY } from '@/services/apiPath';
import type { IdParam, WrapperResponse } from '@/services/services.types';

export type DeviceCategory = {
  id: number;
  name: string;
  slug?: string;
  description: string | null;
};


export type DeviceCategoryData = {
  name: string;
  description: string | null;
};

export const fetchDeviceCategories = (): WrapperResponse<DeviceCategory[]> => client.get(API_DEVICE_CATEGORY, {});

export const createDeviceCategory = (data: DeviceCategoryData) => client.post(API_DEVICE_CATEGORY, data);

export const updateDeviceCategory = (data: DeviceCategoryData & IdParam) =>
  client.patch(`${API_DEVICE_CATEGORY}/${data.id}`, data);

export const deleteDeviceCategory = (id: number) => client.delete(`${API_DEVICE_CATEGORY}/${id}`);

