<template>
  <a-modal
    v-model:open="modelStore.openModalAddInventory"
    title="Thêm mới thiết bị"
    centered
    style="width: 400px"
    ok-text="Xác nhận"
    cancel-text="Hủy"
    :mask-closable="false"
    @ok="onSubmit"
    :okButtonProps="{
      disabled: !formState.device,
    }"
  >
    <a-form
      ref="formRef"
      :model="formState"
      layout="vertical"
    >
      <a-form-item
        name="template"
        label="Loại thiết bị"
        class="mb-2"
      >
        <a-select
          v-model:value="formState.template"
          placeholder="Chọn loại thiết bị"
          :loading="isLoadingCategoryDevice"
          :options="optionsCategoryDevice"
          @change="handleChangeCategoryDevice"
        />
      </a-form-item>
      <a-form-item
        name="device"
        label="Thiết bị"
        class="mb-2"
      >
        <a-select
          v-model:value="formState.device"
          placeholder="Nhập thiết bị"
          :loading="isLoadingDevices"
          :options="optionsDevice"
          show-search
          :filter-option="filterOption"
          @change="handleChangeDevice"
        />
      </a-form-item>
      <div v-if="image">
        <a-typography-text>Hình ảnh</a-typography-text>
        <div class="flex flex-row justify-center my-2">
          <a-image
            :src="image"
            alt="image"
            :fallback="imageFallback"
            :width="100"
            :height="100"
            class="object-contain"
          />
        </div>
      </div>
      <a-form-item
        label="Chiều rộng (mm)"
        class="mb-2"
      >
        <a-input-number
          :min="0"
          class="w-full"
          v-model:value="formState.width"
          placeholder="Nhập chiều rộng"
          readonly
        />
      </a-form-item>
      <a-form-item
        label="Chiều cao (mm)"
        class="mb-2"
      >
        <a-input-number
          :min="0"
          class="w-full"
          v-model:value="formState.height"
          placeholder="Nhập chiều cao"
          readonly
        />
      </a-form-item>
      <a-form-item
        label="Chiều dài (mm)"
        class="mb-2"
      >
        <a-input-number
          :min="0"
          class="w-full"
          v-model:value="formState.depth"
          placeholder="Nhập chiều dài"
          readonly
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useModelStore } from '@/stores/model';
import { useCategoryDevices } from '@/services/hooks/useCategoryDevice';
import { useDevices } from '@/services/hooks/useDevice';
import { imageFallback, maxPageSize } from '@/utils/constants';
import { compareString } from '@/utils/helpers';
import { generateUUID } from 'three/src/math/MathUtils';
import type { Device } from '@/services/apis/station';

export type FormStateData = {
  template: string;
  device: string;
  width: number;
  height: number;
  depth: number;
};

const modelStore = useModelStore();

const formRef = ref();
const image = ref();
const storageUrl = import.meta.env.VITE_STORAGE_DOMAIN;

const formState: Partial<FormStateData> = reactive({
  width: 0,
  height: 0,
  depth: 0,
});

watch(
  () => modelStore.openModalAddInventory,
  () => {
    formState.template = undefined;
    formState.device = undefined;
    formState.width = 0;
    formState.height = 0;
    formState.depth = 0;
  },
);

const { data: dataCategoryDevice, isLoading: isLoadingCategoryDevice } = useCategoryDevices();

const { data: dataDevices, isLoading: isLoadingDevices } = useDevices({
  perPage: ref(maxPageSize),
  page: ref(1),
});

const optionsCategoryDevice = computed(
  () =>
    dataCategoryDevice.value?.data?.map((item) => ({
      label: item.name,
      value: item.id?.toString(),
    })) || [],
);

const optionsDevice = computed(
  () =>
    dataDevices.value?.data?.data
      .filter((item) =>
        !formState.template ? true : item.category.id?.toString() === formState.template,
      )
      .map((item) => ({
        label: item.name,
        value: item.id?.toString(),
        ...item,
      })) || [],
);

const handleChangeCategoryDevice = () => {
  formState.device = undefined;
  image.value = undefined;
  formState.width = 0;
  formState.height = 0;
  formState.depth = 0;
};

const filterOption = (input: string, option: any) => {
  return compareString(option.label, input);
};

const handleChangeDevice = (value: string, option: any) => {
  formState.height = option.length;
  formState.width = option.width;
  formState.depth = option.depth;

  image.value = option.images ? storageUrl + option.images : undefined;
};

const onSubmit = () => {
  const dataDevice = optionsDevice.value.find((item) => item.id?.toString() === formState.device);
  if (!dataDevice) return;

  window.potreeViewer.volumeTool.startInsertion();
  const newDevice = window.potreeViewer.scene.volumes[window.potreeViewer.scene.volumes.length - 1];
  newDevice.material.opacity = 0.8;

  newDevice.scale.set(
    dataDevice.depth ? dataDevice.depth / 1000 : 1,
    dataDevice.width ? dataDevice.width / 1000 : 1,
    dataDevice.length ? dataDevice.length / 1000 : 1,
  );

  const newInventory: Device = {
    visibleMesh: true,
    visible: true,
    clip: false,
    pivot: {
      id: generateUUID(),
    },
    model: dataDevice.category.name,
    isNewDevice: true,
    name: dataDevice.name,
    newDevice,
  };

  modelStore.poles = modelStore.poles.map((item, index) =>
    index === 0
      ? {
          ...item,
          deviceCategories: item.deviceCategories.map((category) =>
            category.name === dataDevice.category.name
              ? {
                  ...category,
                  devices: item.devices.concat([newInventory]),
                }
              : category,
          ),
        }
      : item,
  );

  modelStore.selectedInventory = newInventory;
  modelStore.activeTool = 'add-inventory';

  newDevice.addEventListener('volume_select_changed', () => {
    const modelStore = useModelStore();
    modelStore.activeTool = 'add-inventory';
    modelStore.selectedImage = undefined;
    modelStore.selectedInventory = newInventory;
  });
  newDevice.addEventListener('volume_deselect_changed', () => {
    const modelStore = useModelStore();
    modelStore.selectedInventory = undefined;
  });

  modelStore.openModalAddInventory = false;
};
</script>
