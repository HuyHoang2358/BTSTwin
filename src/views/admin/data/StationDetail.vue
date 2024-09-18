<template>
  <h3 class="text-xl font-semibold m-0">Thông tin trạm</h3>
  <a-row
    :gutter="16"
    class="py-2 px-4"
  >
    <a-col
      :span="12"
      class=""
    >
      <div class="text-base">
        <div class="flex justify-between">
          <p class="font-semibold m-0">Tên trạm BTS:</p>
          <p class="m-0">{{ station?.name }}</p>
        </div>
        <div class="flex justify-between">
          <p class="font-semibold m-0">Mã trạm BTS:</p>
          <p class="m-0">{{ station?.code }}</p>
        </div>

        <div class="flex justify-between">
          <p class="font-semibold m-0">Người quản lý:</p>
          <p class="m-0">...</p>
        </div>
      </div>
    </a-col>
    <a-col
      :span="12"
      class=""
    >
      <div class="text-base">
        <div class="flex justify-between">
          <p class="font-semibold m-0">Tọa độ địa lý:</p>
        </div>

        <div class="flex justify-between">
          <p class="pl-4 m-0">Kinh độ:</p>
          <p class="m-0">{{ station?.location?.longitude }}</p>
        </div>
        <div class="flex justify-between">
          <p class="pl-4 m-0">Vĩ độ:</p>
          <p class="m-0">{{ station?.location?.latitude }}</p>
        </div>
      </div>
    </a-col>
    <a-col :span="24">
      <div class="text-base flex justify-between gap-8">
        <p class="font-semibold m-0">Địa chỉ:</p>
        <p class="m-0">
          {{
            station?.address?.detail
              ? station?.address?.detail + ', '
              : '' +
                station?.address?.commune?.name +
                ', ' +
                station?.address?.district?.name +
                ', ' +
                station?.address?.province?.name
          }}
        </p>
      </div>
    </a-col>
  </a-row>
  <a-divider style="height: 2px; background-color: #d0002d" />
  <a-row
    :gutter="16"
    class="mt-2"
  >
    <a-col
      :span="6"
      class=""
    >
      <div class="">
        <h3 class="text-xl font-semibold">Thông tin cột</h3>
        <div class="p-4 text-lg text-black">
          <a-collapse
            v-model:activeKey="activeKey"
            accordion
            class="text-green-600"
          >
            <a-collapse-panel
              v-for="pole in station?.poles"
              :key="pole.id"
              :header="`Cột: ${pole.name}`"
            >
              <div class="p-4">
                <div class="flex justify-between">
                  <p class="font-semibold">{{ t('admin.pole.category') }}:</p>
                  <p>{{ pole.category.name }}</p>
                </div>
                <div class="flex justify-between">
                  <p class="font-semibold">{{ t('admin.pole.is_roof') }}:</p>
                  <p>{{ pole.is_roof ? 'TM' : 'DD' }}</p>
                </div>
                <div class="flex justify-between">
                  <p class="font-semibold">{{ t('admin.pole.height') }}:</p>
                  <p>{{ pole.height }}m</p>
                </div>
                <div
                  class="flex justify-between"
                  v-if="pole.is_roof"
                >
                  <p class="font-semibold">{{ t('admin.pole.house_height') }}:</p>
                  <p>{{ pole.house_height }}m</p>
                </div>
                <div
                  class="flex justify-between"
                  v-if="pole.diameter_body_tube"
                >
                  <p class="font-semibold">{{ t('admin.pole.diameter_body_tube') }}:</p>
                  <p>{{ pole.diameter_body_tube }}mm</p>
                </div>
                <div
                  class="flex justify-between"
                  v-if="pole.diameter_strut_tube"
                >
                  <p class="font-semibold">{{ t('admin.pole.diameter_strut_tube') }}:</p>
                  <p>{{ pole.diameter_strut_tube }}mm</p>
                </div>
                <div
                  class="flex justify-between"
                  v-if="pole.diameter_top_tube"
                >
                  <p class="font-semibold">{{ t('admin.pole.diameter_top_tube') }}:</p>
                  <p>{{ pole.diameter_top_tube }}mm</p>
                </div>
                <div
                  class="flex justify-between"
                  v-if="pole.diameter_bottom_tube"
                >
                  <p class="font-semibold">{{ t('admin.pole.diameter_bottom_tube') }}:</p>
                  <p>{{ pole.diameter_bottom_tube }}mm</p>
                </div>
                <div
                  class="flex justify-between"
                  v-if="pole.foot_size"
                >
                  <p class="font-semibold">{{ t('admin.pole.foot_size') }}:</p>
                  <p>{{ pole.foot_size }}p></p>
                </div>
                <div
                  class="flex justify-between"
                  v-if="pole.top_size"
                >
                  <p class="font-semibold">{{ t('admin.pole.top_size') }}:</p>
                  <p>{{ pole.top_size }}</p>
                </div>
                <div class="flex justify-between">
                  <p class="font-semibold">{{ t('admin.pole.structure') }}:</p>
                  <p>{{ pole.structure }}</p>
                </div>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
      </div>
    </a-col>
    <a-col
      :span="16"
      class="w-full"
    >
      <div class="w-full">
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :loading="isStationLoading"
          class="w-full"
          size="large"
          :pagination="false"
        >
          <template #title>
            <a-row jutify="center">
              <a-col :span="14">
                <h3 class="text-xl font-semibold m-0">{{ $t('admin.device.title') }}</h3>
              </a-col>

              <a-col :span="10">
                <div class="flex flex-row justify-end gap-x-2.5">
                  <a-button
                    type="primary"
                    class="flex justify-end items-center space-x-2.5"
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
              record: any;
            }"
          >
            <template v-if="column.title === 'STT'">
              <span>{{ index + 1 }}</span>
            </template>
            <template v-if="column.dataIndex === 'category.name'">
              <span>{{ record?.category?.name }}</span>
            </template>
            <template v-if="column.dataIndex === 'image'">
              <div class="w-10 h-10 rounded-full bg-gray-200">
                <img
                  :src="storageUrl + record?.images || ''"
                  alt="image"
                  class="w-full h-full rounded-full"
                  v-if="record.images !== '' && record.images"
                />
              </div>
            </template>
            <template v-if="column.dataIndex === 'action'">
              <div class="flex flex-row items-center gap-x-4">
                <a-button
                  class="bg-[#F1F1F2] p-1.5 border-none"
                  @click="onEdit(record)"
                  :icon="h(IconEdit)"
                />

                <a-popconfirm
                  :title="$t('admin.pole-device.confirmDelete')"
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
      </div>
    </a-col>
  </a-row>
  <ModalHandlePoleDevice
    :open="open"
    :close="() => (open = false)"
    :current-pole-device="selectedItem"
    :pole-options="poleOptions"
    :refetch="refetch"
  />
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useGetStation } from '@/services/hooks/useStation';
import { computed, h, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Pole } from '@/services/apis/pole';
import IconAddCircle from '@/components/icons/IconAddCircle.vue';
import ModalHandlePoleDevice from '@/components/admin/data/ModalHandlePoleDevice.vue';
import type { ColumnType } from '@/utils/types';
import IconEdit from '@/components/icons/IconEdit.vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import { useDeleteDeviceFromPole } from '@/services/hooks/usePole';
import { useErrorHandler } from '@/services/hooks/useErrorHandler';
import { useSuccessHandler } from '@/services/hooks/useSuccessHandler';

// TODO: DEFINE VARIABLES
const { t } = useI18n();
const route = useRoute();
const storageUrl = import.meta.env.VITE_STORAGE_DOMAIN;

const {
  data,
  isLoading: isStationLoading,
  refetch,
} = useGetStation(
  computed(() => route.query.id as string),
  computed(() => !!route.query.id),
);

const station = computed(() => data?.value?.data);

// TODO: DEVICE TABLE
const columns = computed(() => [
  {
    title: t('index'),
    align: 'center',
    fixed: 'left',
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
    dataIndex: 'category.name',
    align: 'left',
  },
  {
    title: t('admin.device.quantity'),
    dataIndex: 'quantity',
    align: 'center',
  },
  {
    title: t('admin.pole.name'),
    dataIndex: 'pole',
  },
  {
    title: t('operation'),
    dataIndex: 'action',
  },
]);

const dataSource = computed(() => {
  let devices: any[] = [];
  station.value?.poles?.forEach((pole: Pole) => {
    pole.devices?.forEach((device: any) => {
      // if device is not exist in devices then push it else increase quantity
      //const index = devices.findIndex((i: any) => i.id === device.id && i.pole_id === pole.id);
      //if (index === -1) {
      devices.push({
        ...device,
        id: device.pivot.id,
        quantity: 1,
        pole: pole.name,
        pole_id: pole.id,
      });
      //} else {
      //  devices[index].quantity += 1;
      //}
    });
  });
  console.log('devices', devices);
  return devices;
});

// TODO: handle modal edit and add
const selectedItem = ref();
const open = ref<boolean>(false);
const showModal = () => {
  open.value = true;
};

const onAdd = () => {
  selectedItem.value = undefined;
  showModal();
};

const onEdit = (item: any) => {
  selectedItem.value = item;
  showModal();
};

const poleOptions = computed(
  () =>
    station?.value?.poles?.map((i: Pole) => {
      return {
        text: i.name,
        label: i.name,
        value: i.id?.toString(),
      };
    }) || [],
);
// TODO: Remove device from pole
const { mutate: deleteDeviceFromPole } = useDeleteDeviceFromPole();
const { onError } = useErrorHandler();
const { handleSuccess } = useSuccessHandler();

const confirm = (id: number) => {
  return new Promise((resolve) => {
    deleteDeviceFromPole(id, {
      onSuccess(data) {
        handleSuccess(data);
        refetch();
        resolve(true);
      },
      onError(error) {
        onError(error);
        resolve(true);
      },
    });
  });
};

// TODO: Collapse info pole
const activeKey = ref([station.value?.poles?.[0]?.id || '']);
</script>
<style>
.ant-collapse-header-text {
  color: black !important;
  font-weight: 500 !important;
  font-size: 16px !important;
}
.ant-table-title {
  padding: 0 0 20px 0 !important;
}
</style>
