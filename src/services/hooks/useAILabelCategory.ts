import { useQuery } from '@tanstack/vue-query';
import { aiLabelCategories } from '@/services/apis/aiLabelCategory';

export const AI_LABEL_CATEGORY_QUERY_KEY = 'AI_LABEL_CATEGORY_QUERY_KEY';

export const useAILabelCategory = () =>
  useQuery({
    queryKey: [AI_LABEL_CATEGORY_QUERY_KEY],
    queryFn: () => aiLabelCategories(),
  });