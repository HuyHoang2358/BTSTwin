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
          <h1 class="text-3xl mb-1">{{ $t('admin.device.title') }}</h1>
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
      #bodyCell="{ column, index, record }: { column: ColumnType; index: number; record: Device }"
    >
      <template v-if="column.title === 'STT'">
        <span>{{ index + 1 }}</span>
      </template>
      <template v-if="column.dataIndex === 'image'">
        <a-image
          :src="storageUrl + record?.images || ''"
          alt="image"
          v-if="record.images !== '' && record.images"
          style="width: 50px; height: 50px; object-fit: contain"
          :fallback="imageFallback"
        />
      </template>
      <template v-if="column.dataIndex === 'device_category_id'">
        <span>{{ record.category?.name }}</span>
      </template>
      <template v-if="column.dataIndex === 'vendor_id'">
        <span>{{ record.vendor?.name }}</span>
      </template>
      <template v-if="column.dataIndex === 'action'">
        <div class="flex flex-row items-center gap-x-4">
          <a-button
            class="bg-[#F1F1F2] p-1.5 border-none"
            @click="showParams(record)"
            :icon="h(IconEye)"
          />

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

  <a-modal
    v-model:open="openParams"
    title="Bảng thông số kỹ thuật"
    @ok="openParams = !openParams"
  >
    <a-table
      :columns="paramColumns"
      :data-source="selectedItem?.params"
      :pagination="false"
    >
      <template #bodyCell="{ column, index }: { column: ColumnType; index: number }">
        <template v-if="column.dataIndex === 'index'">
          <p>{{ index + 1 }}</p>
        </template>
      </template>
    </a-table>
  </a-modal>

  <ModalHandleDevice
    :open="open"
    :close="() => (open = false)"
    :current-device="selectedItem"
    :vendor-options="vendorOptions"
    :category-options="categoryOptions"
  />
</template>
<script lang="ts" setup>
import { computed, h, ref, watch } from 'vue';

import IconEye from '@/components/icons/IconEye.vue';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';

import type { ComputedRef } from 'vue';
import type { ColumnType } from '@/utils/types';
import type { Device } from '@/services/apis/device';
import type { Vendor } from '@/services/apis/vendor';
import type { DeviceCategory } from '@/services/apis/devicecategory';

import { useI18n } from 'vue-i18n';
import { useTable } from '@/utils/hooks/useTable';
import { useTableSearch } from '@/utils/hooks/useTableSearch';
import { useVendors } from '@/services/hooks/useVendor';
import { useCategoryDevices } from '@/services/hooks/useCategoryDevice';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useDeleteDevice, useDevices, useMutationDeviceSuccess } from '@/services/hooks/useDevice';

import ModalHandleDevice from '@/components/admin/data/ModalHandleDevice.vue';
import { imageFallback } from '@/utils/constants';
defineProps<{
  testMode?: boolean;
}>();

const { t } = useI18n();
const { mutate: deleteDevice } = useDeleteDevice();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();
const { invalidateQueries } = useMutationDeviceSuccess();
const storageUrl = import.meta.env.VITE_STORAGE_DOMAIN;
// TODO: handle modal edit and add
const selectedItem = ref<Device>();
const open = ref<boolean>(false);
const showModal = () => {
  open.value = true;
};
const onAdd = () => {
  selectedItem.value = undefined;
  showModal();
};
const onEdit = (item: Device) => {
  selectedItem.value = item;
  showModal();
};

// TODO: Fetch info
const { perPage, page, handleTableChange, pagination, sort, filter } = useTable(
  computed(() => data.value?.data.total),
);
const { searchValue, debouncedSearch } = useTableSearch();
const { data, isLoading, refetch } = useDevices({
  perPage,
  page,
  sort,
  filter,
  searchValue: debouncedSearch,
});

watch(filter, () => {
  refetch();
});

const dataSource: ComputedRef<Device[]> = computed(() => data?.value?.data?.data || []);
const { data: vendors } = useVendors();
const { data: deviceCategories } = useCategoryDevices();

// TODO: Edit
const vendorOptions = computed(
  () =>
    vendors?.value?.data?.map((i: Vendor) => {
      return {
        text: i.name,
        label: i.name,
        value: i.id?.toString(),
      };
    }) || [],
);

const categoryOptions = computed(
  () =>
    deviceCategories?.value?.data?.map((i: DeviceCategory) => {
      return {
        text: i.name,
        label: i.name,
        value: i.id?.toString(),
      };
    }) || [],
);

// TODO: Delete device

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
    align: 'center',
    width: 50,
  },
  {
    title: t('admin.device.name'),
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: t('admin.device.image'),
    dataIndex: 'image',
    align: 'center',
  },
  {
    title: t('admin.device.category'),
    dataIndex: 'device_category_id',
    filters:
      deviceCategories?.value?.data?.map((i: DeviceCategory) => {
        return {
          text: i.name,
          value: i.id,
        };
      }) || [],
  },
  {
    title: t('admin.device.vendor'),
    dataIndex: 'vendor_id',
    filters:
      vendors?.value?.data?.map((i: Vendor) => {
        return {
          text: i.name,
          value: i.id,
        };
      }) || [],
  },
  {
    title: t('admin.device.length'),
    dataIndex: 'length',
    align: 'right',
    sorter: true,
  },
  {
    title: t('admin.device.width'),
    dataIndex: 'width',
    align: 'right',
    sorter: true,
  },
  {
    title: t('admin.device.depth'),
    dataIndex: 'depth',
    align: 'right',
    sorter: true,
  },
  {
    title: t('admin.device.weight'),
    dataIndex: 'weight',
    align: 'right',
    sorter: true,
  },
  {
    title: t('admin.device.diameter'),
    dataIndex: 'diameter',
    align: 'right',
    sorter: true,
  },

  {
    title: t('operation'),
    dataIndex: 'action',
  },
]);

const paramColumns = computed(() => [
  {
    title: t('index'),
    dataIndex: 'index',
    align: 'center',
  },
  {
    title: t('admin.pole.params.key'),
    dataIndex: 'key',
  },
  {
    title: t('admin.pole.params.value'),
    dataIndex: 'value',
  },
]);
// TODO: Modal show info
const openParams = ref(false);

// TODO: Show params:
const showParams = (record: Device) => {
  selectedItem.value = record;
  openParams.value = true;
};
</script>
