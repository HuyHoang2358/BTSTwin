
import client from '@/services/client';
import { API_DEVICE } from '@/services/apiPath';
import type {
  IdParam,
  IndexRequestParams,
  PaginateRequestParams, PaginateResType,
  WrapperResponse
} from '@/services/services.types';
import type { DeviceCategory } from '@/services/apis/devicecategory';
import type { Vendor } from '@/services/apis/vendor';

export type DeviceParam = {
  id?: number;
  key: string;
  value: string;
}
export type Device = {
  id: number;
  name: string;
  slug?: string;
  images: string | null;
  model_url: string | null;
  length: number;
  width: number;
  depth: number;
  weight: number;
  diameter: number;
  description: string | null;
  category: DeviceCategory;
  vendor: Vendor;
  params: DeviceParam[] | null;
};


export type DeviceData = {
  name: string | null;
  images: string | null;
  model_url: string | null;
  length: number | null;
  width: number | null;
  depth: number | null;
  weight: number | null;
  diameter: number | null;
  description: string | null;
  device_category_id:number | string | null;
  vendor_id: number | string |null;
  params: DeviceParam[];
};

export const fetchDevices = (
  params: IndexRequestParams & PaginateRequestParams
): WrapperResponse<PaginateResType<Device>> => client.get(API_DEVICE, {
  params
});

export const createDevice = (data: DeviceData) => client.post(API_DEVICE, data);

export const updateDevice = (data: DeviceData & IdParam) =>
  client.patch(`${API_DEVICE}/${data.id}`, data);

export const deleteDevice = (id: number) => client.delete(`${API_DEVICE}/${id}`);

