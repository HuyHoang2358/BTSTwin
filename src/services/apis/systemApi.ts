import {
  API_DOWNLOAD_USERS_IN_UNIT,
  API_GET_NOTIFICATIONS,
  API_LOGS,
  API_MEDIA_MANAGER, API_PROJECTS,
  API_UNITS_FROM_EXCEL
} from '@/services/apiPath';
import client from '@/services/client';
import type { BaseRequestParams, WrapperResponse } from '@/services/services.types';
import type { UsersInUnitsRequestParams } from '@/services/apis/unit';

export type LogRequestParams = {
  userIds?: string;
  searchValue?: string;
  sort?: string;
  direction?: string;
  page: string;
  size: string;
  action?: string;
  ips?: string;
  roles?: string;
  startDate?: string;
  endDate?: string;
};

export type NotificationResType = {
  id: string;
  userId: string;
  description: string;
  isSeen: boolean;
  title: string;
};

export type LogResType = {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  items: LogItem[];
};

export type LogItem = {
  action: string;
  id: number;
  userId: string;
  level: string;
  message: string;
  ip: string;
  roleName: string;
  createdAt: string;
  updatedAt: string;
};

export const fetchNotifications = (): WrapperResponse<NotificationResType[]> =>
  client.get(API_GET_NOTIFICATIONS);

export const fetchLogs = (params: LogRequestParams): WrapperResponse<LogResType> =>
  client.get(API_LOGS, {
    params,
  });

export const deleteLog = (id: string) => client.delete(`${API_LOGS}/${id}`);


export const fetchMediaFiles = () => client.get(API_MEDIA_MANAGER);

export const uploadMediaFile = (data: FormData): Promise<Blob> =>
  client.post(API_MEDIA_MANAGER, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
export const deleteMediaFile = (name: string) => client.delete(`${API_MEDIA_MANAGER}?name=${name}`);

