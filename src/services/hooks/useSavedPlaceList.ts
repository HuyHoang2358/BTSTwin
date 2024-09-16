import type { ComputedRef } from 'vue';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  addNoteToPlace,
  addPlaceToSavedPlaceList,
  createSavedPlaceList,
  deleteSavedPlaceList,
  fetchNote,
  fetchPlaceDetail,
  fetchPlacesInLocation,
  fetchSavedPlaceLists,
  fetchSavedPlaceListsOfPlace,
  removePlaceFromSavedPlaceList,
  updateSavedPlaceList,
} from '@/services/apis/savedPlaceList';

export const SAVED_PLACE_LISTS_QUERY_KEY = 'SAVED_PLACE_LISTS_QUERY_KEY';
export const LOCATIONS_QUERY_KEY = 'LOCATION_QUERY_KEY';
export const SAVED_PLACE_LISTS_OF_PLACE_QUERY_KEY = 'SAVED_PLACE_LISTS_OF_PLACE_QUERY_KEY';

export const useSavedPlaceLists = () =>
  useQuery({
    queryKey: [SAVED_PLACE_LISTS_QUERY_KEY],
    queryFn: fetchSavedPlaceLists,
  });

export const usePlaceDetail = () =>
  useMutation({
    mutationFn: fetchPlaceDetail,
  });

export const useSavedPlaceListsOfPlace = (
  placeId: ComputedRef<number>,
  enabled: ComputedRef<boolean>,
) =>
  useQuery({
    queryKey: [SAVED_PLACE_LISTS_OF_PLACE_QUERY_KEY],
    queryFn: () => fetchSavedPlaceListsOfPlace(placeId.value),
    enabled,
  });

export const useNote = () =>
  useMutation({
    mutationFn: fetchNote,
  });

export const useAddNoteToPlace = () =>
  useMutation({
    mutationFn: addNoteToPlace,
  });

export const useAddPlaceToSavedPlaceList = () =>
  useMutation({
    mutationFn: addPlaceToSavedPlaceList,
  });

export const useRemovePlaceFromSavedPlaceList = () =>
  useMutation({
    mutationFn: removePlaceFromSavedPlaceList,
  });

export const usePlacesInLocation = (
  selectedSavedPlaceListId: number,
  enabled: ComputedRef<boolean>,
) =>
  useQuery({
    queryKey: [LOCATIONS_QUERY_KEY, selectedSavedPlaceListId],
    queryFn: () => fetchPlacesInLocation(selectedSavedPlaceListId),
    enabled,
  });

export const useUpdateSavedPlaceList = () => useMutation({ mutationFn: updateSavedPlaceList });

export const useCreateSavedPlaceList = () => useMutation({ mutationFn: createSavedPlaceList });

export const useDeleteSavedPlaceList = () => useMutation({ mutationFn: deleteSavedPlaceList });

export const useMutationSavedPlaceListSuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [SAVED_PLACE_LISTS_QUERY_KEY] });
  };

  const invalidateLocationQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [LOCATIONS_QUERY_KEY] });
    await queryClient.invalidateQueries({ queryKey: [SAVED_PLACE_LISTS_OF_PLACE_QUERY_KEY] });
  };

  return { invalidateQueries, invalidateLocationQueries };
};
