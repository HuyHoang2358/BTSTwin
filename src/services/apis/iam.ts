import type {
  BaseRequestParams,
  IdParam,
  PaginationRequestParams,
  PaginationResType,
  WrapperResponse,
} from '@/services/services.types';
import client from '@/services/client';
import {
  API_AUTHORIZATIONS,
  API_PERMISSION_GROUPS,
  API_PERMISSIONS,
  API_ROLES,
} from '@/services/apiPath';
import type { Ref } from 'vue';

export type RoleResType = {
  id: number;
  name: string;
  permissions: Permission[];
  createdDate: string;
  updatedDate: string;
};

export type RoleData = {
  name: string;
  permissionIds: number[];
};

export type PermissionGroup = {
  id: number;
  name:string;
}
export type PermissionGroupData = {
  name: string;
}

export interface PermissionGroupsResType {
  id: number;
  name: string;
  permissions: Permission[];
  createdDate: string;
  updatedDate: string;
}

export interface Authorization {
  username: string;
  name: string;
  userId: number;
  currentPermissionNumber: number;
  totalPermissionInRole: number;
  roleName: string;
}

export interface PermissionData {
  name: string;
  scope: string;
  public: boolean;
  permissionGroupId: number;
}

export interface Permission {
  id: number;
  name: string;
  scope: string;
  public: boolean;
  createdDate?: string;
  updatedDate?: string;
}

export type ChangePermissionData = {
  userId: number;
  permissionId: string;
};

// TODO: Permission
export const fetchPermissions = (): WrapperResponse<Permission[]> => client.get(API_PERMISSIONS);
export const createPermission = (data: PermissionData) => client.post(API_PERMISSIONS, data);
export const updatePermission = (data: PermissionData & IdParam) =>
  client.put(`${API_PERMISSIONS}/${data.id}`, data);
export const removePermission = (id: string) => client.delete(`${API_PERMISSIONS}/${id}`);
export const removePermissionGroup = (id: string) => client.delete(`${API_PERMISSION_GROUPS}/${id}`);



// TODO: Permission Group
export const fetchPermissionGroups = (params: {searchValue: string | undefined}): WrapperResponse<PermissionGroupsResType[]> => client.get(API_PERMISSION_GROUPS, {params});
export const createPermissionGroup = (data: PermissionGroupData) => client.post(API_PERMISSION_GROUPS, data);
export const updatePermissionGroup = (data: { name: string } & IdParam) =>
  client.put(`${API_PERMISSION_GROUPS}/${data.id}`, data);


// TODO: Role
export const fetchRoles = (
  params: BaseRequestParams & PaginationRequestParams,
): WrapperResponse<PaginationResType<RoleResType>> => client.get(API_ROLES, { params });
export const createRole = (data: RoleData) => client.post(API_ROLES, data);
export const updateRole = (data: RoleData & IdParam) => client.put(`${API_ROLES}/${data.id}`, data);
export const deleteRole = (id: string) => client.delete(`${API_ROLES}/${id}`);


// TODO: Authorizations
export const fetchAuthorizations = (
  params: BaseRequestParams & PaginationRequestParams,
): WrapperResponse<PaginationResType<Authorization>> => client.get(API_AUTHORIZATIONS, { params });

export const fetchUserPermissions = (id: Ref<number>) => client.get(`${API_AUTHORIZATIONS}/users/${id.value}`)

// TODO: Add permission for Resource
export const addPermissionToUser = (data: ChangePermissionData) =>
  client.post(`users/${data.userId}/permissions/${data.permissionId}`);

export const removePermissionToUser = (data: ChangePermissionData) =>
  client.delete(`users/${data.userId}/permissions/${data.permissionId}`);









