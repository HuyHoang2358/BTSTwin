import type { WrapperDataResponse } from '@/components/__tests__/common';
import type { PaginationResType } from '@/services/services.types';
import type { Field } from '@/services/apis/field';

export const mockApiGetFieldsSuccess: WrapperDataResponse<PaginationResType<Field>> = {
  data: {
    page: 1,
    pageSize: 10,
    total: 13,
    totalPage: 2,
    items: [
      {
        id: 15,
        name: 'Điện ThoẠi IPonE',
        description: 'string',
      },
      {
        id: 1,
        name: 'Giao thông vận tải',
        description: null,
      },
      {
        id: 2,
        name: 'Kế hoạch đầu tư',
        description: null,
      },
      {
        id: 13,
        name: 'linh vuc new',
        description: 'test lv new',
      },
      {
        id: 8,
        name: 'lv2',
        description: 'mo ta lv2',
      },
      {
        id: 9,
        name: 'lv3',
        description: 'mo ta lv3',
      },
      {
        id: 10,
        name: 'lv4',
        description: 'mo ta lv4',
      },
      {
        id: 11,
        name: 'lv5',
        description: 'mo ta lv5',
      },
      {
        id: 12,
        name: 'lv6',
        description: 'mo ta lv6',
      },
      {
        id: 14,
        name: 'lv new',
        description: 'mo ta new',
      },
    ],
  },
};

export const mockApiGetFieldsAfterCreateSuccess: WrapperDataResponse<PaginationResType<Field>> = {
  data: {
    page: 1,
    pageSize: 10,
    total: 14,
    totalPage: 2,
    items: [
      {
        id: 20,
        name: 'ten linh vuc',
        description: 'mo ta new',
      },
      {
        id: 15,
        name: 'Điện ThoẠi IPonE',
        description: 'string',
      },
      {
        id: 1,
        name: 'Giao thông vận tải',
        description: null,
      },
      {
        id: 2,
        name: 'Kế hoạch đầu tư',
        description: null,
      },
      {
        id: 13,
        name: 'linh vuc new',
        description: 'test lv new',
      },
      {
        id: 8,
        name: 'lv2',
        description: 'mo ta lv2',
      },
      {
        id: 9,
        name: 'lv3',
        description: 'mo ta lv3',
      },
      {
        id: 10,
        name: 'lv4',
        description: 'mo ta lv4',
      },
      {
        id: 11,
        name: 'lv5',
        description: 'mo ta lv5',
      },
      {
        id: 12,
        name: 'lv6',
        description: 'mo ta lv6',
      },
    ],
  },
};

export const mockApiGetFieldsAfterEditSuccess: WrapperDataResponse<PaginationResType<Field>> = {
  data: {
    page: 1,
    pageSize: 10,
    total: 14,
    totalPage: 2,
    items: [
      {
        id: 20,
        name: 'ten linh vuc edit',
        description: 'mo ta new',
      },
      {
        id: 15,
        name: 'Điện ThoẠi IPonE',
        description: 'string',
      },
      {
        id: 1,
        name: 'Giao thông vận tải',
        description: null,
      },
      {
        id: 2,
        name: 'Kế hoạch đầu tư',
        description: null,
      },
      {
        id: 13,
        name: 'linh vuc new',
        description: 'test lv new',
      },
      {
        id: 8,
        name: 'lv2',
        description: 'mo ta lv2',
      },
      {
        id: 9,
        name: 'lv3',
        description: 'mo ta lv3',
      },
      {
        id: 10,
        name: 'lv4',
        description: 'mo ta lv4',
      },
      {
        id: 11,
        name: 'lv5',
        description: 'mo ta lv5',
      },
      {
        id: 12,
        name: 'lv6',
        description: 'mo ta lv6',
      },
    ],
  },
};

export const mockApiSearchFieldsSuccess: WrapperDataResponse<PaginationResType<Field>> = {
  data: {
    page: 1,
    pageSize: 10,
    total: 2,
    totalPage: 1,
    items: [
      {
        id: 13,
        name: 'linh vuc new',
        description: 'test lv new',
      },
      {
        id: 14,
        name: 'lv new',
        description: 'mo ta new',
      },
    ],
  },
};
