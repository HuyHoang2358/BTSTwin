import { useMutation, useQuery } from '@tanstack/vue-query';
import { fetchComments, storeComment } from '@/services/apis/comment';
import type { ComputedRef } from 'vue';

export const COMMENT_QUERY_KEY = 'COMMENT_QUERY_KEY';

export const useComments = (model: string, model_id: ComputedRef<number>) =>
  useQuery({
    queryKey: [COMMENT_QUERY_KEY],
    queryFn: () => fetchComments(model_id.value, model),
  });

export const useStoreComment = () => useMutation({ mutationFn: storeComment });
