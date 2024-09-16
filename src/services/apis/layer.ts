import client from '@/services/client';
import {
  API_BASE_LAYERS,
  API_DEFAULT_LAYERS,
  API_IMAGERY,
  API_LAYERS_PRIVATE,
  API_SEARCH_ADDRESS,
  API_SPEC_LAYERS,
} from '@/services/apiPath';
import type {
  BaseRequestParams,
  IdParam,
  PaginationRequestParams,
  PaginationResType,
  PinType,
  WrapperResponse,
} from '@/services/services.types';

export interface DetectObjectResType {
  labels: string[];
  data: {
    objectType: string;
    number: number;
  }[];
}

export interface Feature {
  type: string;
  id: string;
  geometry: Geometry;
  geometry_name: string;
  properties: Properties;
  bbox: number[];
}

export interface Geometry {
  type: string;
  coordinates: number[][][];
}

export interface Properties {
  area: string;
  change_type: string;
  commune: string;
  deforest_area: string;
  district: string;
  latitude: string;
  location_on_image: string;
  longitude: string;
  province: string;
  satellite_image_after_filename: string;
  satellite_image_after_id: string;
  satellite_image_before_filename: string;
  satellite_image_before_id: string;
  scene_image: string;
  time_period_after: string;
  time_period_before: string;
  uuid: string;
}

export type Layer = {
  id: number;
  name: string;
  slug: string;
  description: string;
  previewImagePath: string;
  source: string;
  validFrom: string;
  validTo: string;
  resolution: string;
  sharing: string;
  layerTable: LayerTable;
  layerUsers: LayerUser[];
  layerParams: LayerParam[];
  layerComponentFiles: LayerComponentFile[];
  layerStyles: any[];
  createdAt: string;
  updatedAt: string;
  public: boolean;
  deleted: boolean;
  layerURL: string;
  dataCategoryResponse: DataCategoryResponse;
  previewImageURL: string;
  takePhotoDate: string;
  imagery: Imagery[];
};

export interface LayerTable {
  id: number;
  tableName: string;
  createdAt: string;
  updatedAt: string;
}

export interface LayerUser {
  id: number;
  idOfUser: number;
  scope: string;
  createdAt: string;
  updatedAt: string;
}

export interface LayerParam {
  id: number;
  key: string;
  value: string;
}

export interface LayerComponentFile {
  id: number;
  name: string;
  filePath: string;
  createdAt: string;
  updatedAt: string;
  fileURL: string;
}

export interface DataCategoryResponse {
  id: number;
  name: string;
  departmentId: number;
  departmentName: string;
  description: string;
}

export type BaseLayerData = {
  description: string;
  rasterDataStoreId: string;
  name: string;
  source: string;
};

export type DefaultLayerData = {
  description: string;
  layerUrl: string;
  name: string;
  subDomains?: string;
  previewImagePath: string;
};
export type PrivateLayerData = {
  tableName: string;
  dataCategoryId: string;
};

export type ImageryData = {
  name?: string;
  satellite?: string;
};

export interface Imagery {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  imageryPath: string;
  previewImagePath: string;
  takePhotoDate: string;
  status: string;
  description: string;
  resolution: number;
  satellite: string;
  layerName: string;
  footprint: Footprint;
}

export interface Footprint {
  coordinates: number[][];
}

export type ImageryParams = {
  layerIds?: string;
};

export type FilterImageryData = {
  dates?: string;
  resolution?: number;
  provinceIds?: number[];
  districtIds?: number[];
  communeIds?: number[];
  roiIds?: number[];
  polygon?: Geometry;
};

export type SpecLayerParams = {
  departmentIds?: string;
};

export const createSpecLayer = (data: FormData) =>
  client.post(API_SPEC_LAYERS, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updateSpecLayer = ({ id, formData }: { id: number; formData: FormData }) =>
  client.put(`${API_SPEC_LAYERS}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteSpecLayer = (id: number) => client.delete(`${API_SPEC_LAYERS}/${id}`);
export const deleteLayerPrivate = (id: number) => client.delete(`${API_LAYERS_PRIVATE}/${id}`);

export const processTiff = (id: number) => client.put(`${API_BASE_LAYERS}/${id}/handle-file-tif`);

export const createBaseLayer = (data: BaseLayerData): WrapperResponse<Layer> =>
  client.post(API_BASE_LAYERS, data);

export const createDefaultLayer = (data: DefaultLayerData): WrapperResponse<Layer> =>
  client.post(API_DEFAULT_LAYERS, data);

export const createLayerPrivate = (data: PrivateLayerData): WrapperResponse<Layer> =>
  client.post(API_LAYERS_PRIVATE, data);

export const updateImagery = (data: ImageryData & IdParam) =>
  client.put(`${API_IMAGERY}/${data.id}`, data);

export const updateBaseLayer = ({ id, data }: { id: number; data: Partial<BaseLayerData> }) =>
  client.put(`${API_BASE_LAYERS}/${id}`, data);

export const updateDefaultLayer = ({ id, data }: { id: number; data: Partial<BaseLayerData> }) =>
  client.put(`${API_DEFAULT_LAYERS}/${id}`, data);

export const deleteDefaultLayer = (id: number) => client.delete(`${API_DEFAULT_LAYERS}/${id}`);

export const shareSpecLayer = ({ id, userIds }: { id: number; userIds: number[] }) =>
  client.post(`${API_SPEC_LAYERS}/${id}/share`, {
    userIds,
  });

export const searchAddress = (
  params: BaseRequestParams & PaginationRequestParams,
): WrapperResponse<PaginationResType<PinType>> =>
  client.get(API_SEARCH_ADDRESS, {
    params,
  });

export const fetchSpecLayers = (
  params: BaseRequestParams & PaginationRequestParams & SpecLayerParams,
): WrapperResponse<PaginationResType<Layer>> =>
  client.get(API_SPEC_LAYERS, {
    params,
  });

export const fetchLayersPrivate = (): WrapperResponse<Layer[]> => client.get(API_LAYERS_PRIVATE);

export const fetchBaseLayers = (
  params: BaseRequestParams & PaginationRequestParams,
): WrapperResponse<PaginationResType<Layer>> =>
  client.get(API_BASE_LAYERS, {
    params,
  });

export const fetchDefaultLayers = (
  params: BaseRequestParams & PaginationRequestParams,
): WrapperResponse<Layer[]> =>
  client.get(API_DEFAULT_LAYERS, {
    params,
  });

export const fetchLayerBySlug = (slug: string): WrapperResponse<Layer> =>
  client.get(`${API_SPEC_LAYERS}/slug/${slug}`);

export const fetchImagery = (
  params: BaseRequestParams & PaginationRequestParams & ImageryParams,
): WrapperResponse<PaginationResType<Imagery>> =>
  client.get(API_IMAGERY, {
    params,
  });

export const filterImagery = (
  data: BaseRequestParams & PaginationRequestParams & FilterImageryData,
): WrapperResponse<PaginationResType<Imagery>> => client.post(`${API_IMAGERY}/filter`, data);
