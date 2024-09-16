import type { BaseRefParams, PaginationRefParams } from '@/services/services.types';
import { useMutation, useQuery } from '@tanstack/vue-query';
import {
  createDataType,
  deleteDataType,
  fetchDataTypes,
  fetchDataTypesTree,
  updateDataType,
} from '@/services/apis/dataType';
import { getParamsFromBaseRefParams } from '@/utils/helpers';
import type { Ref } from 'vue';

export const DATA_TYPES_QUERY_KEY = 'DATA_TYPES_QUERY_KEY';
export const DATA_TYPES_TREE_QUERY_KEY = 'DATA_TYPES_TREE_QUERY_KEY';

type dataTypeRefParams = {
  slug: Ref<string>;
};

export const useCreateDataType = () => useMutation({ mutationFn: createDataType });

export const useDataTypes = (refParams: dataTypeRefParams & BaseRefParams & PaginationRefParams) =>
  useQuery({
    queryKey: [DATA_TYPES_QUERY_KEY, refParams],
    queryFn: () =>
      fetchDataTypes({
        ...getParamsFromBaseRefParams(refParams),
        departmentIds: refParams?.filters?.value?.departmentName?.join(',') || undefined,
        slug: refParams.slug.value || undefined,
      }),
  });

export const useDataTypesTree = (refParams: dataTypeRefParams) =>
  useQuery({
    queryKey: [DATA_TYPES_TREE_QUERY_KEY, refParams],
    queryFn: () => fetchDataTypesTree(refParams.slug.value?.toString()),
  });

export const useUpdateDataType = () => useMutation({ mutationFn: updateDataType });

export const useDeleteDataType = () => useMutation({ mutationFn: deleteDataType });
