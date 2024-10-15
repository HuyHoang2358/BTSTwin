// TODO: API Detail
// Get information of all comments
import { API_COMMENT } from '@/services/apiPath';
import client from '@/services/client';
import type { WrapperResponse } from '@/services/services.types';
export interface Comment {
  id: number;
  user_id: number;
  model: string;
  model_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}
export interface DataComment {
  model_id: number;
  model: string;
  content: string | undefined;
}

export const fetchComments = (model_id: number, model: string): WrapperResponse<Comment> =>
  client.get(API_COMMENT.replace(':model_id', model_id.toString()).replace(':model', model));

export const storeComment = (data: DataComment): WrapperResponse<Comment> =>
  client.post(
    API_COMMENT.replace(':model_id', data.model_id.toString()).replace(':model', data.model),
    {
      content: data.content,
    },
  );
