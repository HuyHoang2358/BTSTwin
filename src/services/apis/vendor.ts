
import client from '@/services/client';
import { API_VENDOR } from '@/services/apiPath';
import type { IdParam, WrapperResponse } from '@/services/services.types';

export type Vendor = {
  id: number;
  name: string;
  website: string |null;
  logo: string |null;
  description: string | null;
};


export type VendorData = {
  name: string;
  website: string |null;
  logo: string |null;
  description: string | null;
};

export const fetchVendor = (): WrapperResponse<Vendor[]> => client.get(API_VENDOR, {});

export const createVendor = (data: VendorData) => client.post(API_VENDOR, data);

export const updateVendor = (data: VendorData & IdParam) =>
  client.patch(`${API_VENDOR}/${data.id}`, data);

export const deleteVendor = (id: number) => client.delete(`${API_VENDOR}/${id}`);

