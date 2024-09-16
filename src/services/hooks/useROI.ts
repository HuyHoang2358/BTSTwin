import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { createROI, deleteROI, fetchROI, updateROI } from '@/services/apis/roi';
import { defaultPage, defaultPageSize, maxPageSize } from '@/utils/constants';
import type { BaseRefParams } from '@/services/services.types';

export const ROIS_QUERY_KEY = 'ROIS_QUERY_KEY';

export const useCreateROI = () => useMutation({ mutationFn: createROI });

export const useROIs = (refParams: BaseRefParams) =>
  useInfiniteQuery({
    queryKey: [ROIS_QUERY_KEY, refParams],
    queryFn: ({ pageParam }) =>
      fetchROI({
        page: pageParam,
        size: defaultPageSize,
        searchValue: refParams.searchValue?.value || undefined,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.page < lastPage?.data?.totalPage
        ? lastPage?.data?.page + 1
        : undefined;
    },
    initialPageParam: defaultPage,
  });

export const useAllROIs = () =>
  useQuery({
    queryKey: [ROIS_QUERY_KEY],
    queryFn: () =>
      fetchROI({
        page: defaultPage,
        size: maxPageSize,
      }),
  });

export const useMutationROISuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [ROIS_QUERY_KEY] });
  };

  return { invalidateQueries };
};

export const useUpdateROI = () => useMutation({ mutationFn: updateROI });

export const useDeleteROI = () => useMutation({ mutationFn: deleteROI });
