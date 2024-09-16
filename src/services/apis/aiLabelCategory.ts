import { API_AI_MODULE_LABEL_CATEGORY } from '@/services/apiPath';
import client from '@/services/client';
import type { WrapperResponse } from '@/services/services.types';

export type AILabelCategory = {
  id: number;
  name: string;
  slug: string;
  resolution: string;
  aiLabels: [];
}
export const aiLabelCategories = (): WrapperResponse<AILabelCategory[]> => client.get(API_AI_MODULE_LABEL_CATEGORY)