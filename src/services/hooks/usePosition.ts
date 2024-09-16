import { useMutation, useQuery } from '@tanstack/vue-query';
import {
  createPosition,
  deletePosition,
  fetchPositions,
  updatePosition,
} from '@/services/apis/position';
import type { BaseRefParams, PaginationRefParams } from '@/services/services.types';
import { getParamsFromBaseRefParams } from '@/utils/helpers';

export const POSITIONS_QUERY_KEY = 'POSITIONS_QUERY_KEY';

export const useCreatePosition = () => useMutation({ mutationFn: createPosition });

export const usePositions = (refParams: BaseRefParams & PaginationRefParams) =>
  useQuery({
    queryKey: [POSITIONS_QUERY_KEY, refParams],
    queryFn: () => fetchPositions(getParamsFromBaseRefParams(refParams)),
  });

export const useUpdatePosition = () => useMutation({ mutationFn: updatePosition });

export const useDeletePosition = () => useMutation({ mutationFn: deletePosition });
