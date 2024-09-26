import client from '@/services/client';
import { API_PROCESS } from '@/services/apiPath';
import type {
  IdParam,
  IndexRequestParams,
  PaginateRequestParams,
  PaginateResType,
  WrapperResponse,
} from '@/services/services.types';

export interface ProcessStep {
  id: number;
  process_id: number;
  step_number: number;
  step_name: string;
  current_progress: number;
  total_progress: number;
  status: string;
  created_at: string;
  updated_at: string;
}
export interface Process {
  id: number;
  status: string;
  station: {
    id: number;
    code: string;
    name: string;
    station_category_id: number;
    date: string;
    status: number;
  };
  steps: ProcessStep[];
}

export interface ProcessData {
  station_code: string | null;
  date: string | null;
}
// TODO: Functions
export const fetchProcesses = (
  params: IndexRequestParams & PaginateRequestParams,
): WrapperResponse<PaginateResType<Process>> =>
  client.get(API_PROCESS, {
    params,
  });

export const createProcess = (data: ProcessData) => client.post(API_PROCESS, data);
