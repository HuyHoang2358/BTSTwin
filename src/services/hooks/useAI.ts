import { useMutation } from '@tanstack/vue-query';
import {
  fetchAIChangeDetectionResult,
  fetchAIDetectObjectResult,
  fetchAIMonitorCurrentStatusResult,
} from '@/services/apis/ai';

export const useAIChangeDetectionResult = () =>
  useMutation({
    mutationFn: fetchAIChangeDetectionResult,
  });

export const useAIMonitorCurrentStatusResult = () =>
  useMutation({
    mutationFn: fetchAIMonitorCurrentStatusResult,
  });

export const useAIDetectObjectResult = () =>
  useMutation({
    mutationFn: fetchAIDetectObjectResult,
  });
