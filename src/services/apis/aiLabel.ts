import { API_AI_MODULE_LABEL, API_AI_MODULE_LABEL_BY_CATEGORY } from '@/services/apiPath';
import client from '@/services/client';
import type { IdParam, WrapperResponse } from '@/services/services.types';
import type { Ref } from 'vue';

export type AILabel = {
  id: number;
  name: string;
  aiCategory: {
    id: number;
    name: string;
    slug: string;
    resolution: string;
  };
  aiCategoryId: number;
  aiClass: number;
  status: boolean;
  color: string;
  createdDate: string;
  updatedDate: string;
};

export type AILabelData = {
  name: string;
  aiClass: number;
  color: string;
  status: boolean;
  aiCategoryId: number;
};

export const fetchAILabels = (categorySlug: Ref<string>): WrapperResponse<AILabel[]> =>
  client.get(API_AI_MODULE_LABEL_BY_CATEGORY + categorySlug.value);

export const createAILabel = (data: AILabelData) => client.post(API_AI_MODULE_LABEL, data);

export const updateAILabel = (data: AILabelData & IdParam) =>
  client.put(`${API_AI_MODULE_LABEL}/${data.id}`, data);

export const deleteAILabel = (id: string) => client.delete(`${API_AI_MODULE_LABEL}/${id}`);

export const fetchAll = (): WrapperResponse<AILabel[]> => client.get(API_AI_MODULE_LABEL);
