import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  createPoleCategory,
  deletePoleCategory,
  fetchPoleCategories,
  updatePoleCategory
} from '@/services/apis/polecategory';



const POLE_CATEGORY_QUERY_KEY = 'POLE_CATEGORY_QUERY_KEY'
export const useCategoryPoles = () =>
  useQuery({
    queryKey: [POLE_CATEGORY_QUERY_KEY],
    queryFn: () => fetchPoleCategories()
  });

export const useCreatePoleCategory= () => useMutation({ mutationFn: createPoleCategory });
export const useUpdatePoleCategory = () => useMutation({ mutationFn: updatePoleCategory });

export const useDeletePoleCategory = () => useMutation({ mutationFn: deletePoleCategory });

export const useMutationPoleCategorySuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [POLE_CATEGORY_QUERY_KEY] });
  };

  return { invalidateQueries };
};
