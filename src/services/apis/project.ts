import type { IdParam, WrapperResponse } from '@/services/services.types';
import client from '@/services/client';
import { API_FIELD, API_PROJECTS } from '@/services/apiPath';
import type { FIELD_SLUG } from '@/utils/enums';
import type { Layer } from '@/services/apis/layer';

export type Field = {
  id: number;
  name: string;
  slug: FIELD_SLUG;
  previewImage?: string;
  description: string | null;
};

export type ProjectData = {
  clearanceArea: number;
  constructionArea: number;
  clearanceEndDate: string;
  clearanceStartDate: string;
  constructionEndDate: string;
  constructionStartDate: string;
  endDate: string;
  investorName: string;
  layerId: number;
  projectName: string;
  startDate: string;
};

export interface Project {
  id: number;
  createdAt: string;
  updatedAt: string;
  investorName: string;
  projectName: string;
  location: string;
  clearanceArea: number;
  constructionArea: number;
  startDate: string;
  endDate: string;
  clearanceStartDate: string;
  clearanceEndDate: string;
  constructionStartDate: string;
  constructionEndDate: string;
  layer: Layer;
}

export const createProject = (data: ProjectData) => client.post(API_PROJECTS, data);

export const fetchProject = (district?: string): WrapperResponse<Project[]> =>
  client.get(API_PROJECTS, {
    params: { district },
  });

export const updateProject = (data: ProjectData & IdParam) =>
  client.put(`${API_PROJECTS}/${data.id}`, data);

export const deleteProject = (id: number) => client.delete(`${API_PROJECTS}/${id}`);
