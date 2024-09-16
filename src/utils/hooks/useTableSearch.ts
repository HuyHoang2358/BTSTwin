import { refDebounced } from '@vueuse/core';
import { debounceSearchTime, defaultPage } from '@/utils/constants';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export const useTableSearch = () => {
  const router = useRouter();
  const route = useRoute();

  const searchValue = ref<string>(route?.query?.searchValue?.toString() || '');

  const debouncedSearch = refDebounced(searchValue, debounceSearchTime);

  watch(debouncedSearch, async () => {
    await router.replace({
      query: {
        page: defaultPage?.toString(),
        searchValue: debouncedSearch.value || undefined,
      },
    });
  });

  return {
    searchValue,
    debouncedSearch,
  };
};
