import type { BaseResponse, WrapperResponse } from '@/services/services.types';
import client from '@/services/client';
import { API_LOGIN } from '@/services/apiPath';

export type Credentials = {
  email?: string;
  password?: string;
};

export interface LoginResType {
    access_token: string;
    token_type: string;
    expires_in: number;
    profile: {
      id: number;
      name: string;
      email: string;
    }
}

export const login = (credentials: Credentials): WrapperResponse<BaseResponse<LoginResType>> => {
  return client.post(API_LOGIN, credentials);
};
