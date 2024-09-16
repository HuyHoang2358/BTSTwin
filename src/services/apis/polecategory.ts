
import client from '@/services/client';
import {API_POLE_CATEGORY } from '@/services/apiPath';
import type { IdParam, WrapperResponse } from '@/services/services.types';

export type PoleCategory = {
  id: number;
  name: string;
  code:string;
  description: string | null;
};


export type PoleCategoryData = {
  name: string;
  code:string;
  description?: string | null;
};

export const fetchPoleCategories = (): WrapperResponse<PoleCategory[]> => client.get(API_POLE_CATEGORY, {});

export const createPoleCategory = (data: PoleCategoryData) => client.post(API_POLE_CATEGORY, data);

export const updatePoleCategory = (data: PoleCategoryData & IdParam) =>
  client.patch(`${API_POLE_CATEGORY}/${data.id}`, data);

export const deletePoleCategory = (id: number) => client.delete(`${API_POLE_CATEGORY}/${id}`);

