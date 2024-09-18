import { useQuery } from '@tanstack/vue-query';
import {
  fetchBTS,
  fetchBTSById,
  fetchImage2DByBtsId,
  fetchInventoryByBtsId,
} from '@/services/apis/bts';
import type { ComputedRef } from 'vue';

export const BTS_QUERY_KEY = 'BTS_QUERY_KEY';
export const BTS_DETAIL_QUERY_KEY = 'BTS_DETAIL_QUERY_KEY';
export const BTS_GET_INVENTORY_QUERY_KEY = 'BTS_GET_INVENTORY_QUERY_KEY';
export const BTS_GET_IMAGE_2D_QUERY_KEY = 'BTS_GET_IMAGE_2D_QUERY_KEY';

export const useBTS = () =>
  useQuery({
    queryKey: [BTS_QUERY_KEY],
    queryFn: fetchBTS,
  });

export const useBTSDetail = (idComputed: ComputedRef<string>, enabled: ComputedRef<boolean>) =>
  useQuery({
    queryKey: [BTS_DETAIL_QUERY_KEY, idComputed],
    queryFn: () => fetchBTSById(idComputed.value),
    enabled,
  });

export const useGetInventory = (idComputed: ComputedRef<string>, enabled: ComputedRef<boolean>) =>
  useQuery({
    queryKey: [BTS_GET_INVENTORY_QUERY_KEY, idComputed],
    queryFn: () => fetchInventoryByBtsId(idComputed.value),
    enabled,
  });

export const useGetImage2D = (idComputed: ComputedRef<string>, enabled: ComputedRef<boolean>) =>
  useQuery({
    queryKey: [BTS_GET_IMAGE_2D_QUERY_KEY, idComputed],
    queryFn: () => fetchImage2DByBtsId(idComputed.value),
    enabled,
  });
