import { useMutation, useQuery } from '@tanstack/vue-query';

import { fetchBTSById, fetchReport, fetchStations } from '@/services/apis/station';
import type { ComputedRef, Ref } from 'vue';
import { downloadUserList } from '@/services/apis/user';

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

export const useDownloadUserList = () => useMutation({ mutationFn: downloadUserList });


export const useStationReport =  () =>
  useMutation({ mutationFn: (id:string)=> fetchReport(id) });
