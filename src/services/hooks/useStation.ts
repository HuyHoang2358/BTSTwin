import { useMutation, useQuery } from '@tanstack/vue-query';

import {
  fetchBTSById,
  fetchReport,
  fetchScanDetail,
  fetchScanImages,
  fetchStations,
} from '@/services/apis/station';
import type { ComputedRef } from 'vue';

export const STATION_QUERY_KEY = 'STATION_QUERY_KEY';
export const BTS_DETAIL_QUERY_KEY = 'BTS_DETAIL_QUERY_KEY';
export const STATION_SCAN_IMAGE_QUERY_KEY = 'STATION_SCAN_IMAGE_QUERY_KEY';
export const STATION_SCAN_QUERY_KEY = 'STATION_SCAN_QUERY_KEY';
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

export const useBTSDetail = (idComputed: ComputedRef<string>, enabled: ComputedRef<boolean>) =>
  useQuery({
    queryKey: [BTS_DETAIL_QUERY_KEY, idComputed],
    queryFn: () => fetchBTSById(idComputed.value),
    enabled,
  });

export const useStationReport = () => useMutation({ mutationFn: (id: string) => fetchReport(id) });
