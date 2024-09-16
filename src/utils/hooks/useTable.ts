import { computed, type Ref, ref, watch } from 'vue';
import { defaultPage, defaultPageSize } from '@/utils/constants';
import { useRoute, useRouter } from 'vue-router';
import type { TablePaginationConfig, TableProps } from 'ant-design-vue';

/*export const useTable = (total: Ref<number | undefined>) => {
  const route = useRoute();
  const router = useRouter();

  const filters = ref<Record<string, string[]>>();
  const sort = ref<string>();
  const direction = ref<string>();

  const currentPage = ref(route.query.p ? Number(route.query.p) : defaultPage);
  const pageSize = ref(route.query.size ? Number(route.query.size) : defaultPageSize);

  watch(
    () => route.query.s,
    () => {
      currentPage.value = defaultPage;
    },
  );

  const handleTableChange: TableProps['onChange'] = async (
    pag: TablePaginationConfig,
    filtersCB: any,
    sorter: any,
  ) => {
    currentPage.value = pag.current || defaultPage;
    direction.value = sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : undefined;
    sort.value = sorter.field;
    filters.value = filtersCB;
    if (pageSize.value !== pag.pageSize) {
      pageSize.value = pag.pageSize || defaultPageSize;
      currentPage.value = defaultPage;
      await router.replace({
        query: {
          ...route.query,
          p: defaultPage,
          size: pag.pageSize,
        },
      });
      return;
    }

    await router.replace({
      query: {
        ...route.query,
        p: pag.current?.toString(),
      },
    });
  };

  const pagination = computed(() => ({
    total: total.value,
    current: currentPage.value,
    pageSize: pageSize.value,
    showSizeChanger: true,
  }));

  return {
    pageSize,
    currentPage,
    filters,
    direction,
    sort,
    pagination,
    handleTableChange,
  };
};*/


export const useTable = (total: Ref<number | undefined>) => {
  const route = useRoute();
  const router = useRouter();

  const filter = ref<Record<string, string>>();
  const sort = ref<string>();
  const direction = ref<string>();

  const page = ref(route.query.page ? Number(route.query.page) : defaultPage);
  const perPage = ref(route.query.perPage ? Number(route.query.perPage) : defaultPageSize);

  watch(
    () => route.query.s,
    () => {
      page.value = defaultPage;
    },
  );

  const handleTableChange: TableProps['onChange'] = async (
    pag: TablePaginationConfig,
    filtersCB: any,
    sorter: any,
  ) => {

    // TODO: Filter
    filter.value = Object.keys(filtersCB).reduce((acc:any, key:string)=>{
      acc[`${key}.in`] = filtersCB[key]?.join(',') || '';
      return acc;
    }, {})

    page.value = pag.current || defaultPage;

    // TODO: Sort value
    sort.value  = sorter.order ? (sorter.order === 'ascend' ? '' : '-') : '' ;
    sort.value =  sorter.field ? sort.value + sorter.field + ',' : '';



    if (perPage.value !== pag.pageSize) {
      perPage.value = pag.pageSize || defaultPageSize;
      page.value = defaultPage;
      await router.replace({
        query: {
          ...route.query,
          page: defaultPage,
          perPage:  pag.pageSize,
        },
      });
      return;
    }

    await router.replace({
      query: {
        ...route.query,
        page: pag.current?.toString(),
      },
    });
  };

  const pagination = computed(() => ({
    total: total.value,
    current: page.value,
    perPage: perPage.value,
    showSizeChanger: true,
  }));

  return {
    perPage,
    page,
    filter,
    direction,
    sort,
    pagination,
    handleTableChange,
  };
};

