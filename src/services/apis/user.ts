import type {
  BaseRequestParams,
  IdParam,
  PaginationRequestParams,
  PaginationResType,
  WrapperResponse,
} from '@/services/services.types';
import client from '@/services/client';
import {
  API_CHANGE_PASSWORD,
  API_DOWNLOAD_USER_LIST,
  API_INSERT_FROM_EXCEL,
  API_PROFILE,
  API_USERS,
} from '@/services/apiPath';
import type { Unit } from '@/services/apis/unit';

export type UserRequestParams = {
  district?: string;
  role?: string;
  title?: string;
  unit?: string;
};

export interface User {
  id: number;
  name: string;
 /* username: string;*/
  email: string;
 /* roles: RoleResType[];
  permissions: Permission[];*/
 /* profile: Profile;
  tokens: Token[];*/
/*  createdDate: string;
  updatedDate: string;*/
}

export interface Profile {
  id: number;
  phone: string;
  address: Address;
  unit: Unit;
  title: Title;
  createdDate: string;
  updatedDate: string;
}

export interface Address {
  id: number;
  province: Province;
  district: District;
  commune: Commune;
  addressDetail: string;
  createdDate: string;
  updatedDate: string;
}

export interface Province {
  id: number;
  provinceCode: string;
  provinceName: string;
  provincePreviewImage: any;
  provinceLength: number;
  provinceArea: number;
}

export interface District {
  id: number;
  districtCode: string;
  districtName: string;
  districtPreviewImage: any;
  districtLength: number;
  districtArea: number;
}

export interface Commune {
  id: number;
  communeCode: string;
  communeName: string;
  communePreviewImage: any;
  communeLength: number;
  communeArea: number;
}

export interface Title {
  id: number;
  name: string;
  description: string;
  createdDate: string;
  updatedDate: string;
}

export interface Token {
  id: number;
  token: string;
  expireDate: string;
  createdDate: string;
  updatedDate: string;
}

export type UserData = {
  email: string;
  permissionIds?: number[];
  phone: string;
  roleIds: number[];
  titleId: string;
  unitId: string;
  username: string;
};

export interface ProfileData {
  addressDetail: string;
  communeId: string;
  districtId: string;
  email: string;
  name: string;
  phone: string;
  provinceId: string;
}

export type ChangePasswordBody = {
  confirmPassword: string;
  newPassword: string;
  oldPassword: string;
};

export const createUser = (data: UserData) => client.post(API_USERS, data);

export const fetchUsers = (
  params: UserRequestParams & BaseRequestParams & PaginationRequestParams,
): WrapperResponse<PaginationResType<User>> =>
  client.get(API_USERS, {
    params,
  });

export const updateUser = (data: UserData & IdParam) => client.put(`${API_USERS}/${data.id}`, data);

export const deleteUser = (id: number) => client.delete(`${API_USERS}/${id}`);

export const changePasswordByAdmin = (id: number) => client.put(`${API_USERS}/${id}/credential`);

export const downloadUserList = (): Promise<Blob> =>
  client.get(API_DOWNLOAD_USER_LIST, {
    responseType: 'blob',
  });

export const fetchProfile = (): WrapperResponse<User> => client.get(API_PROFILE);

export const updateProfile = (data: Partial<ProfileData>) => client.patch(API_PROFILE, data);

export const changePassword = (data: ChangePasswordBody) => client.put(API_CHANGE_PASSWORD, data);

export const insertUserFromExcel = (data: FormData) =>
  client.post(API_INSERT_FROM_EXCEL, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
