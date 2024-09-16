import type {
  BaseRequestParams,
  PaginationRequestParams,
  PaginationResType,
  WrapperResponse,
} from '@/services/services.types';
import client from '@/services/client';
import { SYS_API_CREATE_ADMINISTRATIVE, SYS_API_GET_ADMINISTRATIVE } from '@/services/apiPath';

export type AdministrativeResType = {
  id: string;
  provinceId: any;
  provinceName: any;
  districtCode: string;
  districtName: string;
  districtPreviewImage: any;
  districtLength: number;
  districtArea: number;
  districtGeometry: any;
  communeNames: string[];
};

export type AdministrativeData = {
  name: string;
  parentId?: string;
  file?: any[];
};

export type AdministrativeRequestParams = {
  provinceId?: string;
};

export const createAdministrative = (data: FormData) =>
  client.post(SYS_API_CREATE_ADMINISTRATIVE, data);

export const fetchAdministrative = (
  params: AdministrativeRequestParams & BaseRequestParams & PaginationRequestParams,
): WrapperResponse<PaginationResType<AdministrativeResType>> =>
  client.get(SYS_API_GET_ADMINISTRATIVE, {
    params,
  });
