<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    @change="handleTableChange"
    :pagination="pagination"
    size="middle"
  >
    <template #title>
      <a-row jutify="center">
        <a-col :span="14">
          <h1 class="text-3xl mb-1">Quản lý loại dữ liệu bản đồ chuyên đề</h1>
        </a-col>
        <a-col :span="10">
          <div class="flex flex-row gap-x-2.5">
            <a-input
              placeholder="Tìm kiếm"
              v-model:value="searchValue"
              allow-clear
            >
              <template #prefix>
                <IconSearchInput />
              </template>
            </a-input>
            <a-button
              type="primary"
              class="flex justify-center items-center space-x-2.5"
              :icon="h(IconAddCircle)"
              @click="onAdd"
              v-if="checkPermission(`${SERVICE_DATA_CATEGORY}${ACTION_STORE}`)"
            >
              Thêm mới
            </a-button>
          </div>
        </a-col>
      </a-row>
    </template>
    <template #bodyCell="{ column, index, record }">
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onEdit(record)"
            :icon="h(IconEdit)"
            v-if="checkPermission(`${SERVICE_DATA_CATEGORY}${ACTION_UPDATE}`)"
          />
          <a-popconfirm
            title="Xác nhận loại dữ liệu?"
            @confirm="confirm(record.id)"
            v-if="checkPermission(`${SERVICE_DATA_CATEGORY}${ACTION_DESTROY}`)"
          >
            <a-button
              class="bg-[#F1F1F2] p-1.5 border-none"
              :icon="h(IconTrash)"
            />
          </a-popconfirm>
        </div>
      </template>
    </template>
  </a-table>
  <ModalHandleDataType
    :close="() => (open = false)"
    :open="open"
    :current-data-type="currentDataType"
  />
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import type { ComputedRef } from 'vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useQueryClient } from '@tanstack/vue-query';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import ModalHandleDataType from '@/components/admin/ModalHandleDataType.vue';
import {
  DATA_TYPES_QUERY_KEY,
  useDataTypes,
  useDeleteDataType,
} from '@/services/hooks/useDataType';
import type { DataTypeResType } from '@/services/apis/dataType';
import { useTable } from '@/utils/hooks/useTable';
import { useTableSearch } from '@/utils/hooks/useTableSearch';
import { useGetAllFields } from '@/services/hooks/useField';
import { dataTypeSpecLayer } from '@/utils/constants';
import { checkPermission } from '@/utils/helpers';
import {
  ACTION_DESTROY,
  ACTION_STORE,
  ACTION_UPDATE,
  SERVICE_DATA_CATEGORY
} from '@/utils/IAM_constants';

const open = ref<boolean>(false);
const currentDataType = ref<DataTypeResType>();

const { pageSize, currentPage, handleTableChange, pagination, sort, direction, filters } = useTable(
  computed(() => data.value?.data.total),
);
const { searchValue, debouncedSearch } = useTableSearch();

const { data, isLoading } = useDataTypes({
  searchValue: debouncedSearch,
  direction,
  sort,
  currentPage,
  pageSize,
  filters,
  slug: ref(dataTypeSpecLayer),
});

const { data: fieldsData } = useGetAllFields();
const { mutate: deleteField } = useDeleteDataType();
const queryClient = useQueryClient();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const dataSource: ComputedRef<DataTypeResType[]> = computed(
  () =>
    data?.value?.data?.items.map((item) => ({
      ...item,
      children: undefined,
    })) || [],
);

const showModal = () => {
  open.value = true;
};

const onAdd = () => {
  currentDataType.value = undefined;
  showModal();
};

const onEdit = (item: DataTypeResType) => {
  currentDataType.value = item;
  showModal();
};

const confirm = (id: string) => {
  return new Promise((resolve) => {
    deleteField(id, {
      onSuccess(data) {
        handleSuccess(data);
        queryClient.invalidateQueries({ queryKey: [DATA_TYPES_QUERY_KEY] });
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
  },
  {
    title: 'Tên loại dữ liệu',
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: 'Lĩnh vực',
    dataIndex: 'departmentName',
    filters:
      fieldsData?.value?.data?.map((item) => ({
        text: item.name,
        value: item.id,
      })) || [],
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
  },
  {
    title: 'Thao tác',
    dataIndex: 'action',
  },
]);
</script>
