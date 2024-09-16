import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  createAILabel,
  deleteAILabel,
  fetchAILabels,
  fetchAll,
  updateAILabel,
} from '@/services/apis/aiLabel';
import type { ComputedRef, Ref } from 'vue';

export const AI_LABEL_QUERY_KEY = 'AI_LABEL_QUERY_KEY';
export const GET_ALL_AI_LABEL_QUERY_KEY = 'GET_ALL_AI_LABEL_QUERY_KEY';
export const useAILabel = (categorySlug: Ref<string>, enable: ComputedRef<boolean>) =>
  useQuery({
    enabled: enable,
    queryKey: [AI_LABEL_QUERY_KEY, categorySlug],
    queryFn: () => fetchAILabels(categorySlug),
  });

export const useGetAllAiLabel = () =>
  useQuery({
    queryKey: [GET_ALL_AI_LABEL_QUERY_KEY],
    queryFn: fetchAll,
  });

export const useCreateAILabel = () => useMutation({ mutationFn: createAILabel });
export const useUpdateAILabel = () => useMutation({ mutationFn: updateAILabel });
export const useDeleteAILabel = () => useMutation({ mutationFn: deleteAILabel });

export const useMutationAILabelSuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [AI_LABEL_QUERY_KEY] });
  };

  return { invalidateQueries };
};
