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
          <h1 class="text-3xl mb-1">{{ $t('admin.process.title') }}</h1>
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
      #bodyCell="{ column, index, record }: { column: ColumnType; index: number; record: Process }"
    >
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'station.code'">
        <span>{{ record.station.code }}</span>
      </template>

      <template v-if="column.dataIndex === 'station.date'">
        <span>{{ record.station.date }}</span>
      </template>

      <template v-if="column.dataIndex === 'status'">
        <a-progress
          :percent="(record.steps.length / 4) * 100"
          :steps="4"
          stroke-color="#52c41a"
          :size="[50, 20]"
          :status="record.status === '0' ? 'active' : ''"
        />
      </template>
      <template v-if="column.dataIndex === 'action'"></template>
    </template>
  </a-table>
  <ModalHandleProcess
    :open="open"
    :close="() => (open = false)"
    :current-process="selectedItem"
  />
</template>
<script lang="ts" setup>
import { computed, h, ref, watch } from 'vue';

import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';

import type { ComputedRef } from 'vue';
import type { ColumnType } from '@/utils/types';

import { useI18n } from 'vue-i18n';
import { useTable } from '@/utils/hooks/useTable';
import { useTableSearch } from '@/utils/hooks/useTableSearch';

import { useProcesses } from '@/services/hooks/useProcess';
import type { Process } from '@/services/apis/process';
import ModalHandleProcess from '@/components/admin/data/ModalHandleProcess.vue';
defineProps<{
  testMode?: boolean;
}>();

const { t } = useI18n();

// TODO: handle modal edit and add
const selectedItem = ref<Process>();
const open = ref<boolean>(false);
const showModal = () => {
  open.value = true;
};

const onAdd = () => {
  selectedItem.value = undefined;
  showModal();
};

// TODO: Fetch info
const { perPage, page, handleTableChange, pagination, sort, filter } = useTable(
  computed(() => data.value?.data.total),
);
const { searchValue, debouncedSearch } = useTableSearch();
const { data, isLoading, refetch } = useProcesses({
  perPage,
  page,
  sort,
  filter,
  searchValue: debouncedSearch,
});

watch(filter, () => {
  refetch();
});

const dataSource: ComputedRef<Process[]> = computed(() => data?.value?.data?.data || []);

// TODO: Define Column in table
const columns = computed(() => [
  {
    title: t('index'),
    align: 'center',
    width: 50,
  },
  {
    title: t('admin.process.station'),
    dataIndex: 'station.code',
    sorter: true,
  },
  {
    title: t('admin.process.date'),
    dataIndex: 'station.date',
    align: 'center',
  },
  {
    title: t('admin.process.status'),
    dataIndex: 'status',
    align: 'center',
  },
]);
</script>
