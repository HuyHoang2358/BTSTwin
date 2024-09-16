import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

import type { IndexRefParams, PaginateRefParams } from '@/services/services.types';
import { getParamsFromIndexRefParams } from '@/utils/helpers';
import { createStation, deleteStation, fetchStations, updateStation } from '@/services/apis/station';



const STATION_QUERY_KEY = 'STATION_QUERY_KEY'
export const useStations = (refParams: IndexRefParams & PaginateRefParams) =>
  useQuery({
    queryKey: [STATION_QUERY_KEY, refParams],
    queryFn: () => fetchStations(
      {
        ...getParamsFromIndexRefParams(refParams),
      }
    )
  });

export const useCreateStation= () => useMutation({ mutationFn: createStation });
export const useUpdateStation = () => useMutation({ mutationFn: updateStation });

export const useDeleteStation = () => useMutation({ mutationFn: deleteStation });

export const useMutationStationSuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [STATION_QUERY_KEY] });
  };

  return { invalidateQueries };
};
