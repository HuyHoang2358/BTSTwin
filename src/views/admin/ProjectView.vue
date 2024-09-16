<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    @change="handleTableChange"
    size="middle"
  >
    <template #title>
      <a-row jutify="center">
        <a-col :span="14">
          <h1 class="text-3xl mb-1">Quản lý dự án</h1>
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
              v-if="checkPermission( `${SERVICE_PROJECT}${ACTION_STORE}`)"
            >
              Thêm mới
            </a-button>
          </div>
        </a-col>
      </a-row>
    </template>
    <template
      #bodyCell="{ column, index, record }: { column: ColumnType; index: number; record: Project }"
    >
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'layer'">
        <span>{{ record.layer?.name }}</span>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onEdit(record)"
            :icon="h(IconEdit)"
            v-if="checkPermission(`${SERVICE_PROJECT}${ACTION_UPDATE}`)"
          />
          <a-popconfirm
            title="Xác nhận loại dữ liệu?"
            @confirm="confirm(record.id)"
            v-if="checkPermission(`${SERVICE_PROJECT}${ACTION_DESTROY}`)"
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
  <ModalHandleProject
    :close="() => (open = false)"
    :open="open"
    :selected-item="selectedItem"
  />
</template>
<script lang="ts" setup>
import { computed, h, ref, watch } from 'vue';
import type { ComputedRef } from 'vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useTableSearch } from '@/utils/hooks/useTableSearch';
import { checkPermission, compareString } from '@/utils/helpers';
import {
  useDeleteProject,
  useMutationProjectSuccess,
  useProjects,
} from '@/services/hooks/useProject';
import { type Project } from '@/services/apis/project';
import type { ColumnType } from '@/utils/types';
import ModalHandleProject from '@/components/admin/ModalHandleProject.vue';
import { useAdministrative } from '@/services/hooks/useAdministrative';
import { maxPageSize } from '@/utils/constants';
import type { TablePaginationConfig, TableProps } from 'ant-design-vue';
import { ACTION_DESTROY, ACTION_STORE, ACTION_UPDATE, SERVICE_PROJECT } from '@/utils/IAM_constants';

const open = ref<boolean>(false);
const districtId = ref<string[]>([]);
const selectedItem = ref<Project>();

const { searchValue, debouncedSearch } = useTableSearch();

const { data, isLoading, refetch } = useProjects(districtId);
const { mutate: deleteItem } = useDeleteProject();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueries } = useMutationProjectSuccess();
const { data: dataDistricts } = useAdministrative({
  pageSize: ref(maxPageSize),
});

watch(districtId, () => {
  refetch();
});

const dataSource: ComputedRef<Project[]> = computed(
  () =>
    data?.value?.data
      ?.filter(
        (item) =>
          compareString(item.projectName, debouncedSearch.value) ||
          compareString(item.investorName, debouncedSearch.value),
      )
      ?.map((item) => ({
        ...item,
      })) || [],
);

const districtOptions = computed(
  () =>
    dataDistricts?.value?.data?.items?.map((item) => ({
      text: item.districtName,
      value: item.id?.toString(),
    })) || [],
);

const showModal = () => {
  open.value = true;
};

const onAdd = () => {
  selectedItem.value = undefined;
  showModal();
};

const onEdit = (item: Project) => {
  selectedItem.value = item;
  showModal();
};

const confirm = (id: number) => {
  return new Promise((resolve) => {
    deleteItem(id, {
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

const columns = computed(() => [
  {
    title: 'STT',
  },
  {
    title: 'Tên dự án',
    dataIndex: 'projectName',
  },
  {
    title: 'Tên nhà đầu tư',
    dataIndex: 'investorName',
  },
  {
    title: 'GPMB (ha)',
    dataIndex: 'clearanceArea',
  },
  {
    title: 'Thi công (ha)',
    dataIndex: 'constructionArea',
  },
  {
    title: 'Vị trí',
    dataIndex: 'location',
    filters: districtOptions.value,
  },
  {
    title: 'Bản đồ dự án',
    dataIndex: 'layer',
  },
  {
    title: 'Bắt đầu',
    dataIndex: 'startDate',
  },
  {
    title: 'Kết thúc',
    dataIndex: 'endDate',
  },
  {
    title: 'GPMB từ',
    dataIndex: 'clearanceEndDate',
  },
  {
    title: 'GPMB đến',
    dataIndex: 'clearanceStartDate',
  },
  {
    title: 'Thi công từ',
    dataIndex: 'constructionStartDate',
  },
  {
    title: 'Thi công đến',
    dataIndex: 'constructionEndDate',
  },
  {
    title: 'Thao tác',
    dataIndex: 'action',
  },
]);

const handleTableChange: TableProps['onChange'] = async (
  pag: TablePaginationConfig,
  filtersCB: any,
  sorter: any,
) => {
  districtId.value = filtersCB.location;
};
</script>
