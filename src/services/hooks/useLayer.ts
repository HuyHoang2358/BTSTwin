import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  searchAddress,
  fetchSpecLayers,
  createSpecLayer,
  updateSpecLayer,
  deleteSpecLayer,
  shareSpecLayer,
  fetchBaseLayers,
  createBaseLayer,
  updateBaseLayer,
  fetchImagery,
  updateImagery,
  processTiff,
  fetchDefaultLayers,
  createDefaultLayer,
  updateDefaultLayer,
  deleteDefaultLayer,
  filterImagery,
  fetchLayersPrivate,
  createLayerPrivate,
  deleteLayerPrivate,
  fetchLayerBySlug,
} from '@/services/apis/layer';
import type { ComputedRef, Ref } from 'vue';
import type { BaseRefParams, PaginationRefParams } from '@/services/services.types';
import {
  getParamsFromBaseRefParams,
  getRoiIdsAndDistrictIdsFromRegionSelect,
} from '@/utils/helpers';
import { bodyDateFormat, defaultPage, defaultPageSize } from '@/utils/constants';
import type { SearchImagesFormState } from '@/components/home/bottom/SearchImages.vue';

export const SEARCH_ADDRESS_QUERY_KEY = 'SEARCH_ADDRESS_QUERY_KEY';
export const IMAGES_IN_LAYER_QUERY_KEY = 'IMAGES_IN_LAYER_QUERY_KEY';
export const SPEC_LAYERS_QUERY_KEY = 'SPEC_LAYERS_QUERY_KEY';
export const LAYERS_PRIVATE_QUERY_KEY = 'LAYERS_PRIVATE_QUERY_KEY';
export const BASE_LAYERS_QUERY_KEY = 'BASE_LAYERS_QUERY_KEY';
export const BASE_DEFAULT_QUERY_KEY = 'BASE_DEFAULT_QUERY_KEY';
export const LAYER_PLACES_QUERY_KEY = 'LAYER_PLACES_QUERY_KEY';
export const TIFF_PATHS_QUERY_KEY = 'TIFF_PATHS_QUERY_KEY';
export const IMAGERY_QUERY_KEY = 'IMAGERY_QUERY_KEY';
export const IMAGERY_FILTER_QUERY_KEY = 'IMAGERY_FILTER_QUERY_KEY';

export type ImageryRefParams = {
  layerIds?: ComputedRef<string[]>;
};

// export type ImageryFilterRefParams = {
//   toTime?: Ref<string>;
//   fromTime?: Ref<string>;
//   resolution?: Ref<number>;
//   provinceIds?: Ref<number[]>;
//   districtIds?: Ref<number[]>;
//   communeIds?: Ref<number[]>;
//   roiIds?: Ref<number[]>;
//   polygon?: Geometry;
// };

export type SpecLayerReactiveParams = {
  fieldId?: ComputedRef<number | undefined>;
};

export const useCreateSpecLayer = () => useMutation({ mutationFn: createSpecLayer });
export const useUpdateSpecLayer = () => useMutation({ mutationFn: updateSpecLayer });
export const useDeleteSpecLayer = () => useMutation({ mutationFn: deleteSpecLayer });
export const useCreateBaseLayer = () => useMutation({ mutationFn: createBaseLayer });
export const useCreateDefaultLayer = () => useMutation({ mutationFn: createDefaultLayer });
export const useCreateLayerPrivate = () => useMutation({ mutationFn: createLayerPrivate });
export const useDeleteLayerPrivate = () => useMutation({ mutationFn: deleteLayerPrivate });
export const useProcessTiffs = () => useMutation({ mutationFn: processTiff });
export const useUpdateImagery = () => useMutation({ mutationFn: updateImagery });
export const useUpdateBaseLayer = () => useMutation({ mutationFn: updateBaseLayer });
export const useUpdateDefaultLayer = () => useMutation({ mutationFn: updateDefaultLayer });
export const useDeleteDefaultLayer = () => useMutation({ mutationFn: deleteDefaultLayer });

export const useSearchAddress = (refParams: BaseRefParams & PaginationRefParams) =>
  useQuery({
    queryKey: [SEARCH_ADDRESS_QUERY_KEY, refParams],
    queryFn: () => searchAddress(getParamsFromBaseRefParams(refParams)),
  });

export const useSpecLayers = (refParams: BaseRefParams & PaginationRefParams) =>
  useQuery({
    queryKey: [SPEC_LAYERS_QUERY_KEY, refParams],
    queryFn: () =>
      fetchSpecLayers({
        departmentIds: refParams.filters?.value?.departmentName?.join(',') || undefined,
        ...getParamsFromBaseRefParams(refParams),
      }),
  });

export const useLayersPrivate = () =>
  useQuery({
    queryKey: [LAYERS_PRIVATE_QUERY_KEY],
    queryFn: fetchLayersPrivate,
  });

export const useBaseLayers = (refParams: BaseRefParams & PaginationRefParams) =>
  useQuery({
    queryKey: [BASE_LAYERS_QUERY_KEY, refParams],
    queryFn: () => fetchBaseLayers(getParamsFromBaseRefParams(refParams)),
  });

export const useDefaultLayers = (refParams: BaseRefParams & PaginationRefParams) =>
  useQuery({
    queryKey: [BASE_DEFAULT_QUERY_KEY, refParams],
    queryFn: () => fetchDefaultLayers(getParamsFromBaseRefParams(refParams)),
  });

export const useGetLayerBySlug = (slug: string) =>
  useQuery({
    queryKey: [LAYER_PLACES_QUERY_KEY, slug],
    queryFn: () => fetchLayerBySlug(slug),
  });

export const useImagery = (refParams: BaseRefParams & PaginationRefParams) =>
  useQuery({
    queryKey: [IMAGERY_QUERY_KEY, refParams],
    queryFn: () =>
      fetchImagery({
        ...getParamsFromBaseRefParams(refParams),
        layerIds: refParams.filters?.value?.layerName?.join(',') || undefined,
      }),
  });

export const useInfiniteImagery = (refParams: ImageryRefParams, enabled: ComputedRef<boolean>) =>
  useInfiniteQuery({
    queryKey: [IMAGERY_QUERY_KEY, refParams],
    queryFn: ({ pageParam }) =>
      fetchImagery({
        page: pageParam,
        size: 20,
        layerIds: refParams.layerIds?.value.join(',') || undefined,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.page < lastPage?.data?.totalPage
        ? lastPage?.data?.page + 1
        : undefined;
    },
    initialPageParam: defaultPage,
    enabled,
  });

export const useInfiniteImageryFilter = (data?: Ref<SearchImagesFormState>) =>
  useInfiniteQuery({
    queryKey: [IMAGERY_FILTER_QUERY_KEY, data],
    queryFn: ({ pageParam }) => {
      const { districtIds, roiIds } = getRoiIdsAndDistrictIdsFromRegionSelect(data?.value?.region);

      return filterImagery({
        page: pageParam,
        size: 20,
        resolution: data?.value?.resolution ? Number(data?.value?.resolution) : undefined,
        dates: data?.value?.expire
          ? data?.value?.expire.map((item) => item.format(bodyDateFormat)).join(',')
          : undefined,
        districtIds: districtIds.length > 0 ? districtIds : undefined,
        roiIds: roiIds.length > 0 ? roiIds : undefined,
        polygon: data?.value?.polygon || undefined,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.page < lastPage?.data?.totalPage
        ? lastPage?.data?.page + 1
        : undefined;
    },
    initialPageParam: defaultPage,
  });

export const useShareSpecLayer = () => useMutation({ mutationFn: shareSpecLayer });

export const useInfinitySpecLayers = (
  reactiveParams: BaseRefParams & PaginationRefParams & SpecLayerReactiveParams,
) =>
  useInfiniteQuery({
    queryKey: [SPEC_LAYERS_QUERY_KEY, reactiveParams],
    queryFn: ({ pageParam }) =>
      fetchSpecLayers({
        page: pageParam,
        size: reactiveParams.pageSize?.value ? reactiveParams.pageSize?.value : defaultPageSize,
        searchValue: reactiveParams.searchValue?.value || undefined,
        departmentIds: reactiveParams.fieldId?.value
          ? reactiveParams.fieldId?.value?.toString()
          : undefined,
      }),
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.page < lastPage?.data?.totalPage
        ? lastPage?.data?.page + 1
        : undefined;
    },
    initialPageParam: defaultPage,
  });

export const useMutationLayerSuccess = () => {
  const queryClient = useQueryClient();

  const invalidateSpecLayerQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [SPEC_LAYERS_QUERY_KEY] });
    await queryClient.invalidateQueries({ queryKey: [BASE_LAYERS_QUERY_KEY] });
    await queryClient.invalidateQueries({ queryKey: [TIFF_PATHS_QUERY_KEY] });
  };

  const invalidateImageryQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [IMAGERY_QUERY_KEY] });
  };

  const invalidateDefaultLayerQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [BASE_DEFAULT_QUERY_KEY] });
  };

  const invalidateLayerPrivateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [LAYERS_PRIVATE_QUERY_KEY] });
  };

  return {
    invalidateSpecLayerQueries,
    invalidateImageryQueries,
    invalidateLayerPrivateQueries,
    invalidateDefaultLayerQueries,
  };
};
