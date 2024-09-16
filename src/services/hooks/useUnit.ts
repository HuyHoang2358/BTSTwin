import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  createUnit,
  deleteUnit,
  deleteUserUnit,
  downloadUsersInUnit,
  fetchUnits,
  fetchUnitTree,
  fetchUsersInUnits,
  insertUnitsFromExcel,
  updateUnit,
} from '@/services/apis/unit';
import type { ComputedRef, Ref } from 'vue';
import type { BaseRefParams, PaginationRefParams } from '@/services/services.types';
import { defaultPage, defaultPageSize } from '@/utils/constants';

export const UNITS_QUERY_KEY = 'UNITS_QUERY_KEY';
export const UNIT_TREE_QUERY_KEY = 'UNIT_TREE_QUERY_KEY';
export const USERS_IN_UNIT_QUERY_KEY = 'USERS_IN_UNIT_QUERY_KEY';

export const useCreateUnit = () => useMutation({ mutationFn: createUnit });

export const useUnits = () =>
  useQuery({
    queryKey: [UNITS_QUERY_KEY],
    queryFn: fetchUnits,
  });

export const useUnitTree = () =>
  useQuery({
    queryKey: [UNIT_TREE_QUERY_KEY],
    queryFn: fetchUnitTree,
  });

export const useUpdateUnit = () => useMutation({ mutationFn: updateUnit });

export const useDeleteUnit = () => useMutation({ mutationFn: deleteUnit });

export type UserInUnitRefParams = {
  unitIds: Ref<string[]>;
  titleIds?: Ref<string[] | undefined>;
};

export const useUsersInUnit = (
  params: UserInUnitRefParams & BaseRefParams & PaginationRefParams,
  enabled: ComputedRef<boolean>,
) =>
  useQuery({
    queryKey: [USERS_IN_UNIT_QUERY_KEY, params],
    queryFn: () =>
      fetchUsersInUnits({
        page: params?.currentPage?.value ? params.currentPage.value : defaultPage,
        size: params?.pageSize?.value || defaultPageSize,
        searchValue: params?.searchValue?.value || undefined,
        titleIds: params?.titleIds?.value?.join(',') || undefined,
        unitIds: params?.unitIds?.value.join(',') || '',
        sort: params?.sort?.value || undefined,
        direction: params?.direction?.value || undefined,
      }),
    enabled,
  });

export const useDeleteUserInUnit = () => useMutation({ mutationFn: deleteUserUnit });

export const useMutationUnitSuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [UNITS_QUERY_KEY] }),
      queryClient.invalidateQueries({ queryKey: [UNIT_TREE_QUERY_KEY] }),
      queryClient.invalidateQueries({ queryKey: [USERS_IN_UNIT_QUERY_KEY] }),
    ]);
  };
  return { invalidateQueries };
};

export const useInsertUnitFromExcel = () => useMutation({ mutationFn: insertUnitsFromExcel });

export const useDownloadUsersInUnit = () => useMutation({ mutationFn: downloadUsersInUnit });
