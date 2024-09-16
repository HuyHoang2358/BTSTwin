import type {
  BaseRequestParams,
  IdParam,
  PaginationRequestParams,
  PaginationResType,
  WrapperResponse,
} from '@/services/services.types';
import client from '@/services/client';
import { SYS_API_DATA_TYPE } from '@/services/apiPath';
import type { DataNode } from 'ant-design-vue/es/vc-tree/interface';

export type DataTypeResType = {
  id: number;
  name: string;
  departmentName: string;
  departmentId: string;
  description: string;
};

export type DataTypeData = {
  departmentId: string;
  name: string;
  description: string;
  parentId:number;
};

export type DataTypeRequestParams = {
  departmentIds?: string;
  slug?: string;
};

export const createDataType = (data: DataTypeData) => client.post(SYS_API_DATA_TYPE, data);

export const fetchDataTypes = (
  params: DataTypeRequestParams & BaseRequestParams & PaginationRequestParams,
): WrapperResponse<PaginationResType<DataTypeResType>> =>
  client.get(SYS_API_DATA_TYPE, {
    params,
  });

export const fetchDataTypesTree = (
  slug: string,
): WrapperResponse<DataNode[]> => client.get(`${SYS_API_DATA_TYPE}/tree/?slug=${slug}`);

export const updateDataType = (data: DataTypeData & IdParam) =>
  client.put(`${SYS_API_DATA_TYPE}/${data.id}`, data);

export const deleteDataType = (id: string) => client.delete(`${SYS_API_DATA_TYPE}/${id}`);
