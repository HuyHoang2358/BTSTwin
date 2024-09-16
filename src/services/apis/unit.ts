import type {
  BaseRequestParams,
  IdParam,
  PaginationRequestParams,
  PaginationResType,
  WrapperResponse,
} from '@/services/services.types';
import client from '@/services/client';
import {
  API_DOWNLOAD_USERS_IN_UNIT,
  API_GET_UNIT_TREE,
  API_GET_USERS_UNITS,
  API_UNITS,
  API_UNITS_FROM_EXCEL,
  SYS_API_DELETE_USER_IN_UNIT,
} from '@/services/apiPath';
import type { DataNode } from 'ant-design-vue/es/vc-tree/interface';
import type { User } from '@/services/apis/user';

export type UnitData = {
  parentId?: string;
  name: string;
};

export type UsersInUnitsRequestParams = {
  unitIds: string;
  titleIds?: string;
};

export type Unit = {
  id: number;
  parentId: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export const createUnit = (data: UnitData) => client.post(API_UNITS, data);

export const fetchUnits = (): WrapperResponse<Unit[]> => client.get(API_UNITS);

export const fetchUnitTree = (): WrapperResponse<DataNode[]> => client.get(API_GET_UNIT_TREE);

export const updateUnit = (params: Partial<UnitData> & IdParam) =>
  client.put(`${API_UNITS}/${params.id}`, params);

export const deleteUnit = (unitId: string) => client.delete(`${API_UNITS}/${unitId}`);

export const fetchUsersInUnits = (
  params: UsersInUnitsRequestParams & BaseRequestParams & PaginationRequestParams,
): WrapperResponse<PaginationResType<User>> =>
  client.get(API_GET_USERS_UNITS, {
    params,
  });

export const deleteUserUnit = (userId: number) =>
  client.post(
    SYS_API_DELETE_USER_IN_UNIT,
    {},
    {
      params: {
        userId,
      },
    },
  );

export const insertUnitsFromExcel = (data: FormData): Promise<Blob> =>
  client.post(API_UNITS_FROM_EXCEL, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const downloadErrorFile = (url: string): Promise<Blob> =>
  client.get(url, { responseType: 'blob' });

export const downloadUsersInUnit = (
  params: UsersInUnitsRequestParams & BaseRequestParams,
): Promise<Blob> =>
  client.get(API_DOWNLOAD_USERS_IN_UNIT, {
    responseType: 'blob',
    params,
  });
