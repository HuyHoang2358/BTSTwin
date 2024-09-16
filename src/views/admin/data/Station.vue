<template>
  <a-table
    :columns="columns"
    :data-source="dataSource"
    :loading="isLoading"
    size="middle"
    :scroll="{y: 520 }"
    @change="handleTableChange"
    :pagination="pagination"
    data-test="table"
  >
    <template #title>
      <a-row jutify="center">
        <a-col :span="14">
          <h1 class="text-3xl mb-1">{{ $t('admin.station.title') }}</h1>
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
      #bodyCell="{ column, index, record }: { column: ColumnType; index: number; record: Station }"
    >
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'address'">
        <span>{{record.address.commune.name + ", " + record.address.district.name + ", " + record.address.province.name}}</span>
      </template>
      <template v-if="column.dataIndex === 'location'">
        <p class="m-0">{{t('admin.station.latitude') + ": " + record.location.latitude }}</p>
        <p class="m-0">{{t('admin.station.longitude') + ": " + record.location.longitude }}</p>
      </template>
      <template v-if="column.dataIndex === 'poles'">
        <span> 1</span>
      </template>
      <template v-if="column.dataIndex === 'owner'">
        <span>Nguyễn văn X</span>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="onEdit(record)"
            :icon="h(IconEdit)"
          />
          <a-popconfirm
            :title="$t('admin.device.confirmDelete')"
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




  <ModalHandleStation
    :open="open"
    :close="() => (open = false)"
    :current-station="selectedItem"
  />
</template>
<script lang="ts" setup>
import { computed, h, ref, watch } from 'vue';

import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';

import type { ComputedRef } from 'vue';
import type { ColumnType } from '@/utils/types';

import { useI18n } from 'vue-i18n';
import { useTable } from '@/utils/hooks/useTable';
import { useTableSearch } from '@/utils/hooks/useTableSearch';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useDeleteDevice } from '@/services/hooks/useDevice';

import { useMutationStationSuccess, useStations } from '@/services/hooks/useStation';
import type { Station } from '@/services/apis/station';
import ModalHandleStation from '@/components/admin/data/ModalHandleStation.vue';
defineProps<{
  testMode?: boolean;
}>();

const { t } = useI18n();
const { mutate: deleteDevice } = useDeleteDevice();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueries } = useMutationStationSuccess();
// TODO: handle modal edit and add
const selectedItem = ref<Station>();
const open = ref<boolean>(false);
const showModal = () => {open.value = true;};
const onAdd = () => {selectedItem.value = undefined;showModal();}
const onEdit = (item: Station) => {selectedItem.value = item;showModal();};


// TODO: Fetch info
const { perPage, page, handleTableChange, pagination, sort, filter } = useTable(
  computed(() => data.value?.data.total),
);
const { searchValue, debouncedSearch } = useTableSearch();
const { data, isLoading, refetch } = useStations({
  perPage,
  page,
  sort,
  filter,
  searchValue: debouncedSearch,
});

watch(filter, () => {
  refetch();
});


const dataSource: ComputedRef<Station[]> = computed(() => data?.value?.data?.data || []);

// TODO: Delete Station
const confirm = (id: number) => {
  return new Promise((resolve) => {
    deleteDevice(id, {
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
    align: "center",
    width: 50
  },
  {
    title: t('admin.station.code'),
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: t('admin.station.name'),
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: t('admin.station.address'),
    dataIndex: 'address',
  },
  {
    title: t('admin.station.location'),
    dataIndex: 'location',
  },
  {
    title: t('admin.station.pole'),
    dataIndex: 'poles',
    align: "center",
  },
  {
    title: t('admin.station.owner'),
    dataIndex: 'owner',
  },
  {
    title: t('operation'),
    dataIndex: 'action',
  },
]);
</script>
