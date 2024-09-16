import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { getParamsFromIndexRefParams } from '@/utils/helpers';
import type { IndexRefParams, PaginateRefParams } from '@/services/services.types';
import { createWindyArea, deleteWindyArea, fetchWindyAreas, updateWindyArea } from '@/services/apis/windyArea';


const WINDY_AREA_QUERY_KEY = 'WINDY_AREA_QUERY_KEY'
export const useWindyAreas = (refParams: IndexRefParams & PaginateRefParams) =>
  useQuery({
    queryKey: [WINDY_AREA_QUERY_KEY, refParams],
    queryFn: () => fetchWindyAreas(
      {
        ...getParamsFromIndexRefParams(refParams),
      }
    )
  });

export const useCreateWindyArea= () => useMutation({ mutationFn: createWindyArea });
export const useUpdateWindyArea = () => useMutation({ mutationFn: updateWindyArea });

export const useDeleteWindyArea = () => useMutation({ mutationFn: deleteWindyArea });

export const useMutationWindyAreaSuccess = () => {
  const queryClient = useQueryClient();
  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [WINDY_AREA_QUERY_KEY] });
  };
  return { invalidateQueries };
};
