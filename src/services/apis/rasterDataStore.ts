import { API_RASTER_DATA_STORE, API_UNUSED_RASTER_DATA_STORE } from '@/services/apiPath';
import client from '@/services/client';
import type { IdParam, WrapperResponse } from '@/services/services.types';

export type RasterDataStore = {
  id: number;
  name: string;
  storageFolder: string;
  images: string;
  layerId: number;
  geoStoreType: string;
  geoDataPath: string;
  createdDate: string;
  updatedDate: string;
};

export type RasterDataStoreData = {
  name: string;
  storageFolder: string;
  layerId?: number;
  geoStoreType: string;
  geoDataPath: string;
};
export const fetchRasterDataStores = (): WrapperResponse<RasterDataStore[]> =>
  client.get(API_RASTER_DATA_STORE);
export const fetchUnusedRasterDataStores = (): WrapperResponse<RasterDataStore[]> =>
  client.get(API_UNUSED_RASTER_DATA_STORE);

export const createRasterDataStore = (data: RasterDataStoreData) =>
  client.post(API_RASTER_DATA_STORE, data);
export const updateRasterDataStore = (data: RasterDataStoreData & IdParam) =>
  client.put(`${API_RASTER_DATA_STORE}/${data.id}`, data);

export const deleteRasterDataStore = (id: number) =>
  client.delete(`${API_RASTER_DATA_STORE}/${id}`);

export const syncRasterDataStore = (id: number) =>
  client.post(`${API_RASTER_DATA_STORE}/reload-imagery/${id}`);
