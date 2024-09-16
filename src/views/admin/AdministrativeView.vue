<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    :pagination="pagination"
    @change="handleTableChange"
    size="middle"
  >
    <template #title>
      <div class="flex flex-row justify-between">
        <div class="w-1/2">
          <h1 class="text-3xl mb-1">Danh sách đơn vị hành chính</h1>

        </div>

        <div class="w-1/3">
          <div class="flex flex-row gap-x-2.5">
            <a-input
              placeholder="Tìm kiếm"
              v-model:value="searchValue"
            >
              <template #prefix>
                <IconSearchInput />
              </template>
            </a-input>
          </div>
        </div>

      </div>
    </template>
    <template #bodyCell="{ column, index, record }">
      <template v-if="column.title === $t('index')">
        <span>{{ (currentPage - 1) * pageSize + index + 1 }}</span>
      </template>

      <template v-if="column.dataIndex === 'communeName'">
        <div class="h-64 overflow-y-scroll">
          <span
            v-for="(item, index) in record.communeNames"
            :key="index"
          >
          {{ item }}
          <br />
        </span>
        </div>
      </template>

      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center gap-x-4"></div>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import type { AdministrativeResType } from '@/services/apis/administrative';
import { useAdministrative } from '@/services/hooks/useAdministrative';
import { useTable } from '@/utils/hooks/useTable';
import { useTableSearch } from '@/utils/hooks/useTableSearch';

const { pageSize, currentPage, handleTableChange, pagination, sort, direction } = useTable(
  computed(() => data.value?.data.total),
);
const { searchValue, debouncedSearch } = useTableSearch();

const { data, isLoading } = useAdministrative({
  searchValue: debouncedSearch,
  pageSize,
  currentPage,
  sort,
  direction,
});

const dataSource: ComputedRef<AdministrativeResType[]> = computed(() => {
  return (
    data?.value?.data.items.map((i) => {
      return {
        ...i,
        key: i?.id,
      };
    }) || []
  );
});

const columns = [
  {
    title: 'STT',
    dataIndex: 'indexOfParent',
    width: 60,
  },
  {
    title: 'Tên Quận/Huyện',
    dataIndex: 'districtName',
  },
  {
    title: 'Tên Xã/Phường',
    dataIndex: 'communeName',
  },
  // {
  //   title: 'Thao tác',
  //   dataIndex: 'action',
  // },
];
</script>
