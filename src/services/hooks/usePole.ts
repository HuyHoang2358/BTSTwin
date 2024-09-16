import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { getParamsFromIndexRefParams } from '@/utils/helpers';
import { createPole, deletePole, fetchPoles, updatePole } from '@/services/apis/pole';
import type { IndexRefParams, PaginateRefParams } from '@/services/services.types';


const POLE_QUERY_KEY = 'POLE_QUERY_KEY'
export const usePoles = (refParams: IndexRefParams & PaginateRefParams) =>
  useQuery({
    queryKey: [POLE_QUERY_KEY, refParams],
    queryFn: () => fetchPoles(
      {
        ...getParamsFromIndexRefParams(refParams),
      }
    )
  });

export const useCreatePole= () => useMutation({ mutationFn: createPole });
export const useUpdatePole = () => useMutation({ mutationFn: updatePole });

export const useDeletePole = () => useMutation({ mutationFn: deletePole });

export const useMutationPoleSuccess = () => {
  const queryClient = useQueryClient();
  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [POLE_QUERY_KEY] });
  };
  return { invalidateQueries };
};
