import client from '@/services/client';
import { API_WINDY_AREA } from '@/services/apiPath';
import type {
  IdParam,
  IndexRequestParams,
  PaginateRequestParams,
  PaginateResType,
  WrapperResponse,
} from '@/services/services.types';

export type WindyArea = {
  id: number;
  name: string;
  color: string;
  wo: number | null;
  v3s50: number | boolean;
  v10m50: number | null;
  description: string | null;
};

export type WindyAreaData = {
  name: string | null;
  color: string | null;
  wo: number | null;
  v3s50: number | boolean;
  v10m50: number | null;
  description: string | null;
};

export const fetchWindyAreas = (
  params: IndexRequestParams & PaginateRequestParams,
): WrapperResponse<PaginateResType<WindyArea>> =>
  client.get(API_WINDY_AREA, {
    params,
  });

export const createWindyArea = (data: WindyAreaData) => client.post(API_WINDY_AREA, data);

export const updateWindyArea = (data: WindyAreaData & IdParam) =>
  client.patch(`${API_WINDY_AREA}/${data.id}`, data);

export const deleteWindyArea = (id: number) => client.delete(`${API_WINDY_AREA}/${id}`);
