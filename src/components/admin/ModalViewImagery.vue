<template>
  <a-drawer
    :open="open"
    :title="title"
    @close="props.close"
    width="800"
    :get-container="getContainer"
  >
    <a-table
      :dataSource="dataSource"
      :columns="columns"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'status'">
          <span>
            <a-tag :color="!record?.status ? 'volcano' : 'green'">
              {{ !record.status ? 'Không hợp lệ' : 'Hợp lệ' }}
            </a-tag>
          </span>
        </template>
      </template>
    </a-table>
  </a-drawer>
</template>
<script lang="ts" setup>
import { computed, watch } from 'vue';
import type { DrawerProps } from 'ant-design-vue/es/drawer';
import { type RasterDataStore } from '@/services/apis/rasterDataStore';

const props = defineProps<
  {
    close: () => void;
    currentRasterDataStore?: RasterDataStore;
  } & Pick<DrawerProps, 'getContainer' | 'open'>
>();

const title = computed(() => 'Danh sách ảnh');

const columns = [
  {
    title: 'Tên',
    dataIndex: 'name',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
  },
];

const dataSource = computed(() =>
  props.currentRasterDataStore?.images ? JSON.parse(props.currentRasterDataStore?.images) : [],
);

watch(dataSource, () => {
  console.log('dataSource', dataSource);
});
</script>
