import type { BaseRefParams, PaginationRefParams } from '@/services/services.types';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { createAdministrative, fetchAdministrative } from '@/services/apis/administrative';
import { provinceIdHaiPhong } from '@/utils/constants';
import { getParamsFromBaseRefParams } from '@/utils/helpers';

export const ADMINISTRATIVE_QUERY_KEY = 'ADMINISTRATIVE_QUERY_KEY';

export const useCreateAdministrative = () => useMutation({ mutationFn: createAdministrative });

export const useAdministrative = (refParams: BaseRefParams & PaginationRefParams) =>
  useQuery({
    queryKey: [ADMINISTRATIVE_QUERY_KEY, refParams],
    queryFn: () =>
      fetchAdministrative({
        ...getParamsFromBaseRefParams(refParams),
        provinceId: provinceIdHaiPhong,
      }),
  });
