import type {
  BaseRequestParams,
  IdParam,
  PaginationRequestParams,
  PaginationResType,
  WrapperResponse,
} from '@/services/services.types';
import client from '@/services/client';
import { API_FIELD } from '@/services/apiPath';
import type { FIELD_SLUG } from '@/utils/enums';

export type Field = {
  id: number;
  name: string;
  slug: FIELD_SLUG;
  previewImage?: string;
  description: string | null;
  locked: boolean;
};

export type FieldData = {
  description: string;
  name: string;
  previewImage: string;
  locked: boolean;
};

export const createField = (data: FieldData) => client.post(API_FIELD, data);

export const fetchFields = (
  params: BaseRequestParams & PaginationRequestParams,
): WrapperResponse<PaginationResType<Field>> =>
  client.get(API_FIELD, {
    params,
  });

export const fetchAllFields = (): WrapperResponse<Field[]> => client.get(API_FIELD);

export const updateField = (data: FieldData & IdParam) =>
  client.put(`${API_FIELD}/${data.id}`, data);

export const deleteField = (id: number) => client.delete(`${API_FIELD}/${id}`);
