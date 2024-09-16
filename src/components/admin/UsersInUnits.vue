<template>
  <a-row
    jutify="center"
    class="mx-7"
    style="height: 60px; justify-content: center; align-items: center"
  >
    <a-col :span="12">
      <h1 class="text-2xl m-0">{{ $t('admin.unit.users') }}</h1>
    </a-col>


    <a-col :span="12">
      <div class="flex flex-row gap-x-2.5">
        <!-- Search input -->
        <a-input
          placeholder="Tìm kiếm"
          v-model:value="usersSearchValue"
        >
          <template #prefix>
            <IconSearchInput />
          </template>
        </a-input>

        <!-- Export excel -->
        <a-button
          @click="onDownload"
          class="flex flex-row items-center"
          :loading="isPendingDownload"
          v-if="!viewOnly && checkPermission(`${SERVICE_UNIT}${ACTION_EXPORT_USER_IN_UNITS}`)"
        >
          Xuất file Excel
          <IconDownloadExcel class="ml-2" />
        </a-button>
      </div>
    </a-col>
  </a-row>
  <a-table
    :columns="!viewOnly ? usersColumns : usersColumns.slice(0, usersColumns.length - 1)"
    :data-source="dataSource"
    :loading="isLoadingUsersInUnitData || isLoadingProfile"
    size="middle"
    :pagination="pagination"
    @change="handleTableChange"
    class="mx-7"
    :row-selection="
      viewOnly ? { selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange } : undefined
    "
  >
    <template #bodyCell="{ column, index, record }">
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row gap-x-4">
          <a-popconfirm
            :title="`Xác nhận xóa ${record.name || 'người dùng'} khỏi đơn vị?`"
            @confirm="onDeleteUserInUnit(record.id)"
          >
            <a-button
              class="bg-[#F1F1F2] p-1.5 border-none"
              :icon="h(IconTrashSmall)"
              v-if="checkPermission(`${SERVICE_UNIT}${ACTION_REMOVE_FROM_UNIT}`)"
            />
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>
</template>
<script setup lang="ts">
import { computed, type ComputedRef, h, reactive, ref, watch } from 'vue';
import IconTrashSmall from '@/components/icons/IconTrashSmall.vue';
import IconDownloadExcel from '@/components/icons/admin/IconDownloadExcel.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import {
  useDeleteUserInUnit,
  useDownloadUsersInUnit,
  useMutationUnitSuccess,
  useUsersInUnit,
} from '@/services/hooks/useUnit';
import { refDebounced } from '@vueuse/core';
import {
  debounceSearchTime,
  defaultPage,
  defaultPageSize,
  displayDateFormat,
  excelMineType,
  maxPageSize,
} from '@/utils/constants';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { usePositions } from '@/services/hooks/usePosition';
import type { User } from '@/services/apis/user';
import type { TablePaginationConfig, TableProps } from 'ant-design-vue';
import dayjs from 'dayjs';
import { useProfile } from '@/services/hooks/useUser';
import { checkPermission } from '@/utils/helpers';
import {
  ACTION_EXPORT_USER_IN_UNITS,
  ACTION_REMOVE_FROM_UNIT,
  SERVICE_UNIT
} from '@/utils/IAM_constants';

const props = defineProps<{
  unitIdsParams: string[];
  onChangeSelectedRowKeys?: (ids: number[]) => void;
  initialSelectedRowKeys?: number[];
  viewOnly?: boolean;
}>();

const usersSearchValue = ref<string>('');
const debouncedSearch = refDebounced(usersSearchValue, debounceSearchTime);
const currentPage = ref<number>(defaultPage);
const pageSize = ref<number>(defaultPageSize);
const titleIds = ref<string[]>();
const direction = ref<string>('');
const sort = ref<string>('');
const unitIds = ref<string[]>([]);
const state = reactive<{
  selectedRowKeys: number[];
}>({
  selectedRowKeys: props.initialSelectedRowKeys || [],
});

const { mutate: deleteUserInUnit } = useDeleteUserInUnit();
const { handleSuccess } = useSuccessHandler();
const { onError } = useErrorHandler();
const { invalidateQueries } = useMutationUnitSuccess();
const { data: positionsData } = usePositions({
  pageSize: ref(maxPageSize),
});
const { mutate: downloadUserList, isPending: isPendingDownload } = useDownloadUsersInUnit();

watch(
  () => props.unitIdsParams,
  () => {
    unitIds.value = props.unitIdsParams;
  },
);

const isCheckedUnits = computed(() => Boolean(unitIds.value && unitIds.value.length !== 0));

const { data: profileData, isLoading: isLoadingProfile } = useProfile();
const {
  data: usersInUnitData,
  isLoading: isLoadingUsersInUnitData,
  refetch: fetchUsersInUnit,
} = useUsersInUnit(
  {
    unitIds,
    pageSize,
    currentPage,
    sort,
    direction,
    titleIds,
    searchValue: debouncedSearch,
  },
  isCheckedUnits,
);

watch(debouncedSearch, () => {
  fetchUsersInUnit();
});

const dataSource: ComputedRef<User[]> = computed(
  () =>
    usersInUnitData?.value?.data?.items
      .map((item) => ({ ...item, key: item.id }))
      .filter((item) => (props.viewOnly ? item.id !== profileData.value?.data?.id : true)) || [],
);

const pagination = computed(() => ({
  total: usersInUnitData?.value?.data?.total,
  current: currentPage.value,
  pageSize: pageSize.value,
  showSizeChanger: true,
}));

const onSelectChange = (selectedRowKeys: number[]) => {
  state.selectedRowKeys = selectedRowKeys;
  props.onChangeSelectedRowKeys && props.onChangeSelectedRowKeys(selectedRowKeys);
};

const onDeleteUserInUnit = async (id: number) => {
  return new Promise((resolve) => {
    deleteUserInUnit(id, {
      onSuccess(data) {
        invalidateQueries();
        handleSuccess(data);
        resolve(true);
      },
      onError(error) {
        onError(error);
        resolve(true);
      },
    });
  });
};

const handleTableChange: TableProps['onChange'] = (
  pag: TablePaginationConfig,
  filters: any,
  sorter: any,
) => {
  currentPage.value = pag.current || defaultPage;
  titleIds.value = filters?.titleName;
  sort.value = sorter.field;
  direction.value = sorter.order ? (sorter.order === 'ascend' ? 'asc' : 'desc') : '';

  if (pageSize.value !== pag.pageSize) {
    pageSize.value = pag.pageSize || defaultPage;
    fetchUsersInUnit();
    return;
  }

  fetchUsersInUnit();
};

const usersColumns = computed(() => [
  {
    title: 'STT',
  },
  {
    title: 'Họ và tên',
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    sorter: true,
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phone',
  },
  {
    title: 'Chức danh',
    dataIndex: 'titleName',
    filters:
      positionsData?.value?.data?.items.map((i) => {
        return {
          text: i.name,
          label: i.name,
          value: i.id?.toString(),
        };
      }) || [],
    filterSearch: true,
  },
  {
    title: 'Thao tác',
    dataIndex: 'action',
  },
]);

const onDownload = () => {
  downloadUserList(
    {
      searchValue: debouncedSearch?.value || undefined,
      titleIds: titleIds?.value?.join(',') || undefined,
      unitIds: unitIds?.value.join(',') || '',
      sort: sort?.value || undefined,
      direction: direction?.value || undefined,
    },
    {
      onError,
      onSuccess(data) {
        const url = URL.createObjectURL(
          new Blob([data], {
            type: excelMineType,
          }),
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Danh_sách_người_dùng_${dayjs().format(displayDateFormat)}`);
        document.body.appendChild(link);
        link.click();
      },
    },
  );
};
</script>
