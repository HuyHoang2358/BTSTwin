<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    size="middle"
    :pagination="pagination"
    @change="handleTableChange"
  >
    <template #title>
      <a-row jutify="center">
        <a-col :span="14">
          <h1 class="text-3xl mb-1">Quản lý chức danh</h1>
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
              v-if="checkPermission(`${SERVICE_TITLE}${ACTION_STORE}`)"
            >
              Thêm mới
            </a-button>
          </div>
        </a-col>
      </a-row>
    </template>
    <template #bodyCell="{ column, index, record }">
      <template v-if="column.title === $t('index')">
        <span>{{ (currentPage - 1) * pageSize + index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onEdit(record)"
            :icon="h(IconEdit)"
            v-if="checkPermission(`${SERVICE_TITLE}${ACTION_UPDATE}`)"
          />
          <a-popconfirm
            title="Xác nhận xóa chức danh?"
            @confirm="confirm(record.id)"
            v-if="checkPermission(`${SERVICE_TITLE}${ACTION_DESTROY}`)"
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
  <ModalHandlePosition
    :close="() => (open = false)"
    :open="open"
    :current-position="currentPosition"
  />
</template>
<script lang="ts" setup>
import { ref, h, computed } from 'vue';
import type { ComputedRef } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import ModalHandlePosition from '@/components/admin/ModalHandlePosition.vue';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import type { PositionResType } from '@/services/apis/position';
import { POSITIONS_QUERY_KEY, useDeletePosition, usePositions } from '@/services/hooks/usePosition';
import { useTable } from '@/utils/hooks/useTable';
import { useTableSearch } from '@/utils/hooks/useTableSearch';
import { checkPermission } from '@/utils/helpers';
import { ACTION_DESTROY, ACTION_STORE, ACTION_UPDATE, SERVICE_TITLE } from '@/utils/IAM_constants';

const open = ref<boolean>(false);
const currentPosition = ref<PositionResType>();

const columns = [
  {
    title: 'STT',
  },
  {
    title: 'Tên chức danh',
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
  },
  {
    title: 'Thao tác',
    dataIndex: 'action',
  },
];

const { pageSize, currentPage, handleTableChange, pagination, sort, direction } = useTable(
  computed(() => data.value?.data.total),
);
const { searchValue, debouncedSearch } = useTableSearch();

const { data, isLoading } = usePositions({
  searchValue: debouncedSearch,
  sort,
  pageSize,
  currentPage,
  direction,
});

const queryClient = useQueryClient();
const { mutate: deletePosition } = useDeletePosition();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const dataSource: ComputedRef<PositionResType[]> = computed(() => data?.value?.data?.items || []);

const showModal = () => {
  open.value = true;
};

const onAdd = () => {
  currentPosition.value = undefined;
  showModal();
};

const onEdit = (item: PositionResType) => {
  currentPosition.value = item;
  showModal();
};

const confirm = (id: string) => {
  return new Promise((resolve) => {
    deletePosition(id, {
      onSuccess(data) {
        handleSuccess(data);
        queryClient.invalidateQueries({ queryKey: [POSITIONS_QUERY_KEY] });
        resolve(true);
      },
      onError(error) {
        onError(error);
        resolve(true);
      },
    });
  });
};
</script>
