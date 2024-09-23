<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    size="middle"
    @change="handleTableChange"
    :pagination="pagination"
    data-test="table"
  >
    <template #title>
      <a-row jutify="center">
        <a-col :span="14">
          <h1 class="text-3xl mb-1">{{ $t('admin.category.windyArea.title') }}</h1>
        </a-col>

        <a-col :span="10">
          <div class="flex flex-row gap-x-2.5">
            <!-- Search -->
            <a-input
              :placeholder="$t('search')"
              v-model:value="searchValue"
              data-test="search-input"
              allow-clear
            >
              <template #prefix>
                <IconSearchInput />
              </template>
            </a-input>
            <!-- Add -->
            <a-button
              type="primary"
              class="flex justify-center items-center space-x-2.5"
              :icon="h(IconAddCircle)"
              @click="onAdd"
            >
              {{ $t('add') }}
            </a-button>
          </div>
        </a-col>
      </a-row>
    </template>
    <template
      #bodyCell="{
        column,
        index,
        record,
      }: {
        column: ColumnType;
        index: number;
        record: WindyArea;
      }"
    >
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'color'">
        <div
          class="w-10 h-6 rounded-full"
          :style="getColor(record.color)"
        ></div>
      </template>

      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center gap-x-4">
          <!-- Edit -->
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onEdit(record)"
            :icon="h(IconEdit)"
          />
          <!-- Delete -->
          <a-popconfirm
            :title="$t('admin.category.windyArea.confirmDelete')"
            @confirm="confirm(record.id)"
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

  <ModalHandleWindyArea
    :open="open"
    :close="() => (open = false)"
    :current-windyArea="selectedItem"
  />
</template>
<script lang="ts" setup>
import { computed, h, ref, watch } from 'vue';

import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import ModalHandleWindyArea from '@/components/admin/category/ModalHandleWindyArea.vue';

import type { ComputedRef } from 'vue';
import type { ColumnType } from '@/utils/types';
import type { WindyArea } from '@/services/apis/windyArea';

import { useI18n } from 'vue-i18n';
import { useTable } from '@/utils/hooks/useTable';
import { useTableSearch } from '@/utils/hooks/useTableSearch';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import {
  useDeleteWindyArea,
  useMutationWindyAreaSuccess,
  useWindyAreas,
} from '@/services/hooks/useWindyArea';

defineProps<{
  testMode?: boolean;
}>();

const { t } = useI18n();
const { mutate: deleteWindyArea } = useDeleteWindyArea();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueries } = useMutationWindyAreaSuccess();

// TODO: handle modal edit and add
const selectedItem = ref<WindyArea>();
const open = ref<boolean>(false);
const showModal = () => {
  open.value = true;
};
const onAdd = () => {
  selectedItem.value = undefined;
  showModal();
};
const onEdit = (item: WindyArea) => {
  selectedItem.value = item;
  showModal();
};

// TODO: Fetch info
const { perPage, page, handleTableChange, pagination, sort, filter } = useTable(
  computed(() => data.value?.data.total),
);
const { searchValue, debouncedSearch } = useTableSearch();
const { data, isLoading, refetch } = useWindyAreas({
  perPage,
  page,
  sort,
  filter,
  searchValue: debouncedSearch,
});
watch(filter, () => {
  refetch();
});

const dataSource: ComputedRef<WindyArea[]> = computed(() => data?.value?.data?.data || []);

// TODO: Delete WindyArea

const confirm = (id: number) => {
  return new Promise((resolve) => {
    deleteWindyArea(id, {
      onSuccess(data) {
        handleSuccess(data);
        invalidateQueries();
        resolve(true);
      },
      onError(error) {
        onError(error);
        resolve(true);
      },
    });
  });
};

// TODO: Define Column in table
const columns = computed(() => [
  {
    title: t('index'),
    align: 'center',
    fixed: 'left',
    width: 50,
  },
  {
    title: t('admin.category.windyArea.name'),
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: t('admin.category.windyArea.color'),
    dataIndex: 'color',
    align: 'center',
  },
  {
    title: t('admin.category.windyArea.wo'),
    dataIndex: 'wo',
    align: 'center',
    sorter: true,
  },
  {
    title: t('admin.category.windyArea.v3s50'),
    dataIndex: 'v3s50',
    align: 'center',
    sorter: true,
  },
  {
    title: t('admin.category.windyArea.v10m50'),
    dataIndex: 'v10m50',
    align: 'center',
    sorter: true,
  },
  {
    title: t('admin.category.windyArea.description'),
    dataIndex: 'description',
    align: 'center',
  },
  {
    title: t('operation'),
    dataIndex: 'action',
  },
]);
const getColor = (color: string) => {
  return `background-color:${color}`;
};
</script>
