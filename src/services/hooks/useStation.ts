import { useMutation, useQuery } from '@tanstack/vue-query';
import {
  createDeviceHistory,
  createPoleHistory,
  fetchDeviceHistory,
  fetchPoleHistory,
  fetchScanDetail,
  fetchScanImages,
  fetchReport,
  fetchStations,
  saveMeasurements,
  getMeasurementHistoryByScanId,
} from '@/services/apis/station';
import type { ComputedRef } from 'vue';

export const STATION_QUERY_KEY = 'STATION_QUERY_KEY';
export const STATION_SCAN_IMAGE_QUERY_KEY = 'STATION_SCAN_IMAGE_QUERY_KEY';
export const STATION_SCAN_QUERY_KEY = 'STATION_SCAN_QUERY_KEY';
export const HISTORY_POLE_LIST_QUERY_KEY = 'HISTORY_POLE_LIST_QUERY_KEY';
export const HISTORY_DEVICE_LIST_QUERY_KEY = 'HISTORY_DEVICE_LIST_QUERY_KEY';
export const HISTORY_MEASUREMENT_QUERY_KEY = 'HISTORY_MEASUREMENT_QUERY_KEY';

export const useStations = () =>
  useQuery({
    queryKey: [STATION_QUERY_KEY],
    queryFn: fetchStations,
  });

export const useStationScan = (idComputed: ComputedRef<string>, enabled: ComputedRef<boolean>) =>
  useQuery({
    queryKey: [STATION_SCAN_QUERY_KEY, idComputed],
    queryFn: () => fetchScanDetail(idComputed.value),
    enabled,
  });

export const useStationScanImages = (
  idComputed: ComputedRef<string>,
  enabled: ComputedRef<boolean>,
) =>
  useQuery({
    queryKey: [STATION_SCAN_IMAGE_QUERY_KEY, idComputed],
    queryFn: () => fetchScanImages(idComputed.value),
    enabled,
  });

export const useStationReport = () => useMutation({ mutationFn: fetchReport });

export const usePoleHistory = (
  paramsComputed: { id: ComputedRef<string>; poleId: ComputedRef<number> },
  enabled: ComputedRef<boolean>,
) =>
  useQuery({
    queryKey: [HISTORY_POLE_LIST_QUERY_KEY, paramsComputed],
    queryFn: () =>
      fetchPoleHistory({
        scanId: paramsComputed.id.value,
        poleId: paramsComputed.poleId.value,
      }),
    enabled,
    retry: 1,
  });

export const useCreatePoleHistory = () => useMutation({ mutationFn: createPoleHistory });

export const useDeviceHistory = (
  paramsComputed: { id: ComputedRef<string>; deviceId: ComputedRef<number> },
  enabled: ComputedRef<boolean>,
) =>
  useQuery({
    queryKey: [HISTORY_DEVICE_LIST_QUERY_KEY, paramsComputed],
    queryFn: () =>
      fetchDeviceHistory({
        scanId: paramsComputed.id.value,
        deviceId: paramsComputed.deviceId.value,
      }),
    enabled,
    retry: 1,
  });

export const useMeasurementHistoryByScanId = (
  id: ComputedRef<string>,
  enabled: ComputedRef<boolean>,
) =>
  useQuery({
    queryKey: [HISTORY_MEASUREMENT_QUERY_KEY, id],
    queryFn: () => getMeasurementHistoryByScanId(id.value),
    enabled,
  });

export const useCreateDeviceHistory = () => useMutation({ mutationFn: createDeviceHistory });
export const useSaveMeasurements = () => useMutation({ mutationFn: saveMeasurements });
