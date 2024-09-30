import { useQuery } from '@tanstack/vue-query';

import { fetchBTSById, fetchStations } from '@/services/apis/station';
import type { ComputedRef } from 'vue';

export const STATION_QUERY_KEY = 'STATION_QUERY_KEY';
export const BTS_DETAIL_QUERY_KEY = 'BTS_DETAIL_QUERY_KEY';

export const useStations = () =>
  useQuery({
    queryKey: [STATION_QUERY_KEY],
    queryFn: fetchStations,
  });

export const useBTSDetail = (idComputed: ComputedRef<string>, enabled: ComputedRef<boolean>) =>
  useQuery({
    queryKey: [BTS_DETAIL_QUERY_KEY, idComputed],
    queryFn: () => fetchBTSById(idComputed.value),
    enabled,
  });
