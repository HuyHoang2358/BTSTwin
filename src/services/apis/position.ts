import type {
  BaseRequestParams,
  IdParam,
  PaginationRequestParams,
  PaginationResType,
  WrapperResponse,
} from '@/services/services.types';
import client from '@/services/client';
import { API_POSITIONS } from '@/services/apiPath';

export interface PositionResType {
  id: string;
  name: string;
  description: string;
}

export type PositionData = {
  description: string;
  name: string;
};

export const createPosition = (data: PositionData) => client.post(API_POSITIONS, data);

export const fetchPositions = (
  params: BaseRequestParams & PaginationRequestParams,
): WrapperResponse<PaginationResType<PositionResType>> =>
  client.get(API_POSITIONS, { params: params });

export const updatePosition = (data: PositionData & IdParam) =>
  client.put(`${API_POSITIONS}/${data.id}`, data);

export const deletePosition = (id: string) => client.delete(`${API_POSITIONS}/${id}`);
