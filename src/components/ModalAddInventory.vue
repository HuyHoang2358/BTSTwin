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
        label="Chiều dài (mm)"
        class="mb-2"
      >
        <a-input-number
          :min="0"
          class="w-full"
          v-model:value="formState.height"
          placeholder="Nhập chiều dài"
          readonly
        />
      </a-form-item>
      <a-form-item
        label="Chiều sâu (mm)"
        class="mb-2"
      >
        <a-input-number
          :min="0"
          class="w-full"
          v-model:value="formState.depth"
          placeholder="Nhập chiều sâu"
          readonly
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { computed, reactive, ref, watch } from 'vue';
import { imageFallback, maxPageSize } from '@/utils/constants';
import { useModelStore } from '@/stores/model';
import { compareString } from '@/utils/helpers';
import { generateUUID } from 'three/src/math/MathUtils';
import { useDevices } from '@/services/hooks/useDevice';
import { useCategoryDevices } from '@/services/hooks/useCategoryDevice';
import type { PoleDevice } from '@/services/apis/station';

// TODO: FormStateData
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
    image.value = undefined;
    formState.width = 0;
    formState.height = 0;
    formState.depth = 0;
  },
);

// TODO: Fetch category device and device
const { data: dataCategoryDevice, isLoading: isLoadingCategoryDevice } = useCategoryDevices();
const { data: dataDevices, isLoading: isLoadingDevices } = useDevices({
  perPage: ref(maxPageSize),
  page: ref(1),
});

// TODO: Prepare Category Device and Device options
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

// TODO: Handle change category device
const handleChangeCategoryDevice = () => {
  formState.device = undefined;
  image.value = undefined;
  formState.width = 0;
  formState.height = 0;
  formState.depth = 0;
};

// TODO: Filter option for device by input code
const filterOption = (input: string, option: any) => {
  return compareString(option.label, input);
};

// TODO: Handle change device
const handleChangeDevice = (value: string, option: any) => {
  formState.height = option.length;
  formState.width = option.width;
  formState.depth = option.depth;

  image.value = option.images ? storageUrl + option.images : undefined;
};

// TODO: Confirm add new device
const onSubmit = () => {
  // Find device by id
  const dataDevice = optionsDevice.value.find((item) => item.id?.toString() === formState.device);
  if (!dataDevice) return;

  // Insert new device to potree Viewer
  window.potreeViewer.volumeTool.startInsertion();
  const newDevice = window.potreeViewer.scene.volumes[window.potreeViewer.scene.volumes.length - 1];
  newDevice.material.opacity = 0.8;

  newDevice.scale.set(
    dataDevice.depth ? dataDevice.depth / 1000 / modelStore.gpsRatio : 1,
    dataDevice.width ? dataDevice.width / 1000 / modelStore.gpsRatio : 1,
    dataDevice.length ? dataDevice.length / 1000 / modelStore.gpsRatio : 1,
  );

  const newInventory: PoleDevice = {
    visibleMesh: true,
    visible: true,
    clip: false,
    id: generateUUID(),
    isNewDevice: true,
    newDevice,
    device_info: dataDevice,
  };

  // If not exist newDevice category, add new category devices

  let isExistCategory = false;
  modelStore.poles.forEach((pole) => {
    const categories = pole.deviceCategories;
    categories.forEach((category) => {
      if (category.name === dataDevice.category.name) {
        isExistCategory = true;
      }
    });
  });
  if (!isExistCategory) {
    modelStore.poles = modelStore.poles.map((item) =>
      item.id === modelStore.activePole
        ? {
            ...item,
            deviceCategories: item.deviceCategories.concat([
              {
                name: dataDevice.category.name,
                devices: [newInventory],
              },
            ]),
          }
        : item,
    );
  } else {
    modelStore.poles = modelStore.poles.map((item) =>
      item.id === modelStore.activePole
        ? {
            ...item,
            deviceCategories: item.deviceCategories.map((category) =>
              category.name === dataDevice.category.name
                ? {
                    ...category,
                    devices: category.devices.concat([newInventory]),
                  }
                : category,
            ),
          }
        : item,
    );
  }

  // Thêm khi category tồn tại

  modelStore.selectedInventory = newInventory;
  modelStore.activeSubTool = 'add-inventory';
  modelStore.hoverInformation =
    'Nhấp chuột vào thiết bị để điều chỉnh vị trí, bấm vào xem thông tin để quay lại';

  // Event click on device
  newDevice.addEventListener('volume_select_changed', () => {
    const modelStore = useModelStore();
    modelStore.activeSubTool = 'add-inventory';
    modelStore.hoverInformation = 'Đang ở chế độ thêm thiết bị, bấm vào xem thông tin để quay lại';
    modelStore.selectedImage = undefined;
    modelStore.selectedMeasurement = undefined;
    modelStore.selectedInventory = newInventory;
  });

  // Event click out device
  newDevice.addEventListener('volume_deselect_changed', () => {
    const modelStore = useModelStore();
    modelStore.selectedInventory = undefined;
    checkPointsInBoundingBox(newDevice);
  });
  modelStore.openModalAddInventory = false;
};

const checkPointsInBoundingBox = (boxVolume) => {
  const pointCloud = window.potreeViewer.scene.pointclouds[0];
  const points = pointCloud.pcoGeometry.root.geometry.attributes.position.array;
  let newPoints = [];
  for (let i = 0; i < points.length; i += 3) {
    let position = new THREE.Vector3(points[i], points[i + 1], points[i + 2]);
    position.applyMatrix4(pointCloud.matrixWorld);
    newPoints.push(position.x);
    newPoints.push(position.y);
    newPoints.push(position.z);
  }

  let box = boxVolume.boundingBox.clone().applyMatrix4(boxVolume.matrixWorld);
  let isInside = false;
  for (let i = 0; i < newPoints.length; i += 3) {
    let point = new THREE.Vector3(newPoints[i], newPoints[i + 1], newPoints[i + 2]);
    if (box.containsPoint(point)) {
      isInside = true;
      break;
    }
  }

  // Check có bị giao với các thiết bị khác không
  if (!isInside) {
    for (let i = 0; i < window.potreeViewer.scene.volumes.length - 1; i++) {
      let volume = window.potreeViewer.scene.volumes[i];
      if (volume !== boxVolume) {
        let boxx = volume.boundingBox.clone().applyMatrix4(volume.matrixWorld);
        console.log('boxx', boxx);
        if (boxx.intersectsBox(box)) {
          isInside = true;
          break;
        }
      }
    }
  }

  // đổi màu
  if (isInside) boxVolume.material.color = new THREE.Color(0xff0000);
  else boxVolume.material.color = new THREE.Color(0x00ff00);
};
</script>
