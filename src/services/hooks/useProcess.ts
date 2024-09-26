import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

import type { IndexRefParams, PaginateRefParams } from '@/services/services.types';
import { getParamsFromIndexRefParams } from '@/utils/helpers';

import { createProcess, fetchProcesses } from '@/services/apis/process';

const PROCESS_QUERY_KEY = 'PROCESS_QUERY_KEY';

export const useProcesses = (refParams: IndexRefParams & PaginateRefParams) =>
  useQuery({
    queryKey: [PROCESS_QUERY_KEY, refParams],
    queryFn: () =>
      fetchProcesses({
        ...getParamsFromIndexRefParams(refParams),
      }),
  });
export const useCreateProcess = () => useMutation({ mutationFn: createProcess });

export const useMutationProcessSuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [PROCESS_QUERY_KEY] });
  };

  return { invalidateQueries };
};
