import type { BaseRefParams, PaginationRefParams } from '@/services/services.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  createField,
  deleteField,
  fetchAllFields,
  fetchFields,
  updateField,
} from '@/services/apis/field';
import { getParamsFromBaseRefParams } from '@/utils/helpers';

export const SYS_FIELDS_QUERY_KEY = 'SYS_FIELDS_QUERY_KEY';

export const useCreateField = () => useMutation({ mutationFn: createField });

export const useFields = (refParams: BaseRefParams & PaginationRefParams) =>
  useQuery({
    queryKey: [SYS_FIELDS_QUERY_KEY, refParams],
    queryFn: () => fetchFields(getParamsFromBaseRefParams(refParams)),
  });

export const useGetAllFields = (params?: BaseRefParams & PaginationRefParams) =>
  useQuery({
    queryKey: [SYS_FIELDS_QUERY_KEY, params],
    queryFn: () => fetchAllFields(),
  });

export const useUpdateField = () => useMutation({ mutationFn: updateField });

export const useDeleteField = () => useMutation({ mutationFn: deleteField });

export const useMutationFieldSuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [SYS_FIELDS_QUERY_KEY] });
  };

  return { invalidateQueries };
};
