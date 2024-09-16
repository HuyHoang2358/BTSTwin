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
        <a-col :span="14">
          <h1 class="text-3xl mb-1">Danh sách ảnh viễn thám</h1>
        </a-col>
        <a-col :span="10">
          <div class="flex flex-row gap-x-2.5">
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
          </div>
        </a-col>
      </a-row>
    </template>
    <template
      #bodyCell="{ column, index, record }: { record: Imagery; index: number; column: ColumnType }"
    >
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.title === $t('admin.spec.previewImage') && record.previewImagePath">
        <a-image
          :width="100"
          :height="100"
          :src="record.previewImagePath"
          :fallback="imageFallback"
          class="object-contain"
          :alt="record.name"
        />
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center justify-end gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onUpdate(record)"
            :icon="h(IconEdit)"
            :id="`edit-${record.id}`"
            v-if="checkPermission(`${SERVICE_IMAGERY}${ACTION_UPDATE}`)"
          />
        </div>
      </template>
    </template>
  </a-table>
  <ModalHandleImagery
    :close="() => (open = false)"
    :open="open"
    :selected-item="selectedItem"
    :get-container="testMode ? false : 'body'"
  />
</template>
<script lang="ts" setup>
import { computed, h, ref } from 'vue';
import type { ComputedRef } from 'vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import { useTable } from '@/utils/hooks/useTable';
import { useTableSearch } from '@/utils/hooks/useTableSearch';
import { useI18n } from 'vue-i18n';
import { imageFallback, maxPageSize } from '@/utils/constants';
import { useBaseLayers, useImagery } from '@/services/hooks/useLayer';
import type { Imagery } from '@/services/apis/layer';
import type { ColumnType } from '@/utils/types';
import ModalHandleImagery from '@/components/admin/ModalHandleImagery.vue';
import { checkPermission } from '@/utils/helpers';
import { ACTION_UPDATE, SERVICE_IMAGERY } from '@/utils/IAM_constants';

defineProps<{
  testMode?: boolean;
}>();

const { t } = useI18n();

const { data: dataBaseLayers } = useBaseLayers({
  pageSize: ref(maxPageSize),
});

const columns = computed(() => [
  {
    title: t('index'),
  },
  {
    title: t('admin.spec.previewImage'),
  },
  {
    title: 'Tên ảnh',
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: 'Độ phân giải',
    dataIndex: 'resolution',
    sorter: true,
  },
  {
    title: 'Vệ tinh',
    dataIndex: 'satellite',
    sorter: true,
  },
  {
    title: 'Ngày chụp',
    dataIndex: 'takePhotoDate',
  },
  {
    title: 'Tên lớp bản đồ',
    dataIndex: 'layerName',
    filters:
      dataBaseLayers?.value?.data?.items.map((i) => {
        return {
          text: i.name,
          value: i.id?.toString(),
        };
      }) || [],
  },
  {
    title: t('operation'),
    dataIndex: 'action',
  },
]);

const open = ref<boolean>(false);
const selectedItem = ref<Imagery>();

const { pageSize, currentPage, handleTableChange, pagination, sort, direction, filters } = useTable(
  computed(() => data.value?.data.total),
);
const { searchValue, debouncedSearch } = useTableSearch();

const { data, isLoading } = useImagery({
  searchValue: debouncedSearch,
  sort,
  direction,
  currentPage,
  pageSize,
  filters,
});

const dataSource: ComputedRef<Imagery[]> = computed(() => data?.value?.data.items || []);

const onUpdate = (item: Imagery) => {
  selectedItem.value = item;
  open.value = true;
};
</script>
