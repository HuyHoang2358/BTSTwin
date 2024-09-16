import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  createRasterDataStore,
  deleteRasterDataStore,
  fetchRasterDataStores,
  fetchUnusedRasterDataStores,
  syncRasterDataStore,
  updateRasterDataStore,
} from '@/services/apis/rasterDataStore';

export const RASTER_DATA_STORE_QUERY_KEY = 'RASTER_DATA_STORE_QUERY_KEY';
export const UNUSED_RASTER_DATA_STORE_QUERY_KEY = 'UNUSED_RASTER_DATA_STORE_QUERY_KEY';

export const useRasterDataStore = () =>
  useQuery({
    queryKey: [RASTER_DATA_STORE_QUERY_KEY],
    queryFn: () => fetchRasterDataStores(),
  });

export const useUnusedRasterDataStore = () =>
  useQuery({
    queryKey: [UNUSED_RASTER_DATA_STORE_QUERY_KEY],
    queryFn: () => fetchUnusedRasterDataStores(),
  });

export const useCreateRasterDataStore = () => useMutation({ mutationFn: createRasterDataStore });
export const useUpdateRasterDataStore = () => useMutation({ mutationFn: updateRasterDataStore });
export const useDeleteRasterDataStore = () => useMutation({ mutationFn: deleteRasterDataStore });
export const useSyncRasterDataStore = () => useMutation({ mutationFn: syncRasterDataStore });

export const useMutationRasterDataStoreSuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [RASTER_DATA_STORE_QUERY_KEY] });
  };

  return { invalidateQueries };
};
