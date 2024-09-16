<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    size="middle"
    @change="handleTableChange"
    :pagination="pagination"
  >
    <template #title>
      <a-row jutify="center">
        <a-col :span="12">
          <h1 class="text-3xl mb-1">Danh sách nhật ký hệ thống</h1>
        </a-col>
        <a-col :span="12">
          <div class="flex flex-row gap-x-2.5">
            <a-input
              placeholder="Tìm kiếm"
              v-model:value="searchValue"
            >
              <template #prefix>
                <IconSearchInput />
              </template>
            </a-input>

            <a-range-picker
              v-model:value="timeRange"
              :placeholder="[$t('startDate'), $t('endDate')]"
              :format="displayDateFormat"
              class="w-[800px]"
            >
              <template #suffixIcon>
                <IconDatePicker />
              </template>
            </a-range-picker>
          </div>
        </a-col>
      </a-row>
    </template>
    <template #bodyCell="{ column, index, record }">
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'delete'">
        <div class="flex flex-row items-center gap-x-4">
          <a-popconfirm
            title="Xác nhận xóa nhật ký?"
            @confirm="confirm(record.id)"
          >
            <a-button
              class="bg-[#F1F1F2] p-1.5 border-none"
              :icon="h(IconTrash)"
              v-if="checkPermission(`${SERVICE_LOG}${ACTION_DESTROY}`)"
            />
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { type ComputedRef, h } from 'vue';
import { computed, ref, watch } from 'vue';
import { useDeleteLog, useLogs, useMutationSystemSuccess } from '@/services/hooks/useSystem';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import type { LogItem } from '@/services/apis/systemApi';
import type { TablePaginationConfig, TableProps } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import { bodyDateFormat, defaultPage, defaultPageSize, displayDateFormat } from '@/utils/constants';
import { checkPermission, filterSameElement } from '@/utils/helpers';
import IconDatePicker from '@/components/icons/IconDatePicker.vue';
import { type Dayjs } from 'dayjs';
import IconTrash from '@/components/icons/IconTrash.vue';
import { useI18n } from 'vue-i18n';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { ACTION_DESTROY, SERVICE_LOG } from '@/utils/IAM_constants';
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const searchValue = ref<string>('');
const timeRange = ref<Dayjs[]>();
const startDate = ref<string>('');
const endDate = ref<string>('');
const direction = ref<string>('');
const sort = ref<string>('');
const userIds = ref<string[]>();
const action = ref<string[]>();
const ips = ref<string[]>();
const roles = ref<string[]>();
const currentPage = ref(route.query.p ? Number(route.query.p) : defaultPage);
const pageSize = ref(route.query.size ? Number(route.query.size) : defaultPageSize);
const { handleSuccess } = useSuccessHandler();
const { onError } = useErrorHandler();
const { invalidateQueriesLogs} = useMutationSystemSuccess();
const {mutate: deleteLog} = useDeleteLog();

const { data, isLoading } = useLogs({
  searchValue: searchValue,
  startDate: startDate,
  endDate: endDate,
  sort: sort,
  direction: direction,
  userIds: userIds,
  currentPage,
  pageSize,
  action,
  ips,
  roles,
});

const dataSource: ComputedRef<LogItem[]> = computed(() => data?.value?.data?.items || []);

const pagination = computed(() => ({
  total: data?.value?.data?.total,
  current: currentPage.value,
  pageSize: pageSize.value,
  showSizeChanger: true,
}));

watch(searchValue, () => {
  router.replace({
    query: {
      ...route.query,
      searchValue: searchValue.value || undefined,
    },
  });
});

watch(timeRange, () => {
  if (timeRange.value) {
    startDate.value = timeRange.value[0].format(bodyDateFormat);
    endDate.value = timeRange.value[1].format(bodyDateFormat);
    router.replace({
      query: {
        ...route.query,
        startDate: timeRange.value[0].format(bodyDateFormat) || undefined,
        endDate: timeRange.value[1].format(bodyDateFormat) || undefined,
      },
    });
  }
});

const handleTableChange: TableProps['onChange'] = (
  pag: TablePaginationConfig,
  filters: any,
  sorter: any,
) => {
  currentPage.value = pag.current || defaultPage;

  userIds.value = filters?.name;
  sort.value = sorter.field;
  action.value = filters.action;
  ips.value = filters.ip;
  roles.value = filters.roleName;
  direction.value = sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '';

  if (pageSize.value !== pag.pageSize) {
    pageSize.value = pag.pageSize || defaultPage;
    router.replace({
      query: {
        ...route.query,
        p: defaultPage,
        size: pag.pageSize,
      },
    });
    return;
  }

  router.replace({
    query: {
      ...route.query,
      p: pag.current?.toString(),
    },
  });
};

const userIdFilters = computed(
  () =>
    dataSource.value.map((i) => ({
      text: i.userId,
      value: i.userId,
    })) || [],
);

const actionFilters = computed(
  () =>
    dataSource.value.map((i) => ({
      text: i.action,
      value: i.action,
    })) || [],
);

const ipFilters = computed(
  () =>
    dataSource.value.map((i) => ({
      text: i.ip,
      value: i.ip,
    })) || [],
);

const roleFilters = computed(
  () =>
    dataSource.value.map((i) => ({
      text: i.roleName,
      value: i.roleName,
    })) || [],
);

const confirm = (id: string) => {
  return new Promise((resolve) => {
    deleteLog(id, {
      onSuccess(data) {
        handleSuccess(data);
        invalidateQueriesLogs();
        resolve(true);
      },
      onError(error) {
        onError(error);
        resolve(true);
      },
    });
  });
};
const columns = computed(() => [
  {
    title: 'STT',
    width: 80,
    align: 'center',
  },
  {
    title: 'Thời gian',
    dataIndex: 'createdAt',
  },
  {
    title: 'Tên đăng nhập',
    dataIndex: 'userId',
    filters: filterSameElement(userIdFilters.value),
  },
  {
    title: 'Hoạt động',
    dataIndex: 'action',
    filters: filterSameElement(actionFilters.value),
  },
  {
    title: 'Nội dung',
    dataIndex: 'message',
  },
  {
    title: 'IP',
    dataIndex: 'ip',
    filters: filterSameElement(ipFilters.value),
  },
  {
    title: 'Vai trò',
    dataIndex: 'roleName',
    filters: filterSameElement(roleFilters.value),
  },
  {
    title: t('operation'),
    dataIndex: 'delete',
  },
]);
</script>
