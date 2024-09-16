import type { WrapperResponse } from '@/services/services.types';
import client from '@/services/client';
import {
  API_AI_CHANGE_DETECTION_RESULT,
  API_AI_DETECT_OBJECT_RESULT,
  API_AI_MONITOR_CURRENT_STATUS,
} from '@/services/apiPath';
import type { Geometry, Layer } from '@/services/apis/layer';
import type { AI_REQUESTS } from '@/utils/enums';

export type AIChangeDetectionData = {
  layerIdBefore: number;
  layerIdAfter: number;
  referenceLayerId?: number;
  projectId?: number;
  districtIds?: number[];
  roiIds?: number[];
  request: string;
  polygon?: Geometry;
};

export type AIDetectObjectResultBody = {
  layerId: number;
  aiRequest: AI_REQUESTS;
  provinceId?: string[];
  districtIds?: string[];
  roiIds?: string[];
  polygon?: Geometry;
  referenceLayerId?: number;
};

export type AIDetectObjectResult = {
  chart: DataSets;
  layer: Layer;
};

export interface DataSets {
  labels: string[];
  datasets: DataSet[];
}

export interface DataSet {
  label: string;
  data: number[];
  backgroundColor: string;
}

export const fetchAIChangeDetectionResult = (
  data: AIChangeDetectionData,
): WrapperResponse<AIDetectObjectResult> => {
  return client.post(API_AI_CHANGE_DETECTION_RESULT, data);
};

export const fetchAIMonitorCurrentStatusResult = (
  data: AIDetectObjectResultBody,
): WrapperResponse<AIDetectObjectResult> => {
  return client.post(API_AI_MONITOR_CURRENT_STATUS, data);
};

export const fetchAIDetectObjectResult = (
  data: AIDetectObjectResultBody,
): WrapperResponse<AIDetectObjectResult> => {
  return client.post(API_AI_DETECT_OBJECT_RESULT, data);
};
