import type {
  BaseRequestParams,
  IdParam,
  PaginationRequestParams,
  PaginationResType,
  WrapperResponse,
} from '@/services/services.types';
import client from '@/services/client';
import { API_PROJECTS, API_ROIS } from '@/services/apiPath';

export type RegionCreateData = {
  description: string;
  name: string;
  regions: {
    area: string;
    points: Point[];
  }[];
};

export type RegionUpdateData = {
  description?: string;
  name?: string;
  regions?: {
    id: number;
    area: string;
    points: Point[];
  }[];
};

export type Point = {
  lat: number;
  lng: number;
  height: number;
};

export type ROIResType = {
  id: number;
  description?: string;
  name?: string;
  regions?: {
    id: number;
    area: string;
    boundary: {
      coordinates: number[][];
    };
  }[];
};

export const createROI = (data: RegionCreateData): WrapperResponse<ROIResType> =>
  client.post(API_ROIS, data);

export const fetchROI = (
  params: BaseRequestParams & PaginationRequestParams,
): WrapperResponse<PaginationResType<ROIResType>> =>
  client.get(API_ROIS, {
    params,
  });

export const updateROI = (data: Partial<RegionUpdateData> & IdParam): WrapperResponse<ROIResType> =>
  client.put(`${API_ROIS}/${data.id}`, data);

export const deleteROI = (id: number) => client.delete(`${API_ROIS}/${id}`);
