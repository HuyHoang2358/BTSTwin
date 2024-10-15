<template>
  <div
    v-if="modelStore.poles.length > 0 && modelStore.activeTool === ACTIVE_TOOL.EVALUATE"
    class="flex flex-col bg-[#303030] w-[260px]"
  >
    <HeaderMenu
      title="Đánh giá thiết kế"
      show-divider
    />
    <div>
      <a-segmented
        v-model:value="splat"
        :options="splatData"
        size="middle"
        class="my-3 mx-3"
        block
      />

      <!-- Thêm thiết bị thủ công -->
      <div
        class="flex justify-between items-center px-3 pt-3"
        v-if="splat === splatData[1]"
      >
        <a-button
          class="w-full flex flex-row items-center justify-center"
          @click="onAddBox"
          type="primary"
        >
          Thêm thiết bị cho cột
        </a-button>
      </div>

      <!-- Upload file excel -->
      <div
        class="mx-3"
        v-else
      >
        <a-upload-dragger
          v-model:fileList="files"
          name="upload"
          :before-upload="beforeUpload"
          @change="handleChange"
          :custom-request="() => {}"
        >
          <template #removeIcon>
            <IconTrash class="text-[#BBBBBB]" />
          </template>
          <div class="flex flex-row items-center justify-center py-6">
            <IconUploadForm />
            <a-typography-text class="text-white text-sm font-normal ml-2">
              Tải hoặc kéo thả file
              <br />
              thiết kế của cột
            </a-typography-text>
          </div>
        </a-upload-dragger>
      </div>
    </div>
    <div class="flex flex-col overflow-auto">
      <a-tabs
        v-model:activeKey="modelStore.activePole"
        @tabClick="tabClick"
      >
        <a-tab-pane
          v-for="pole in modelStore.poles"
          :key="pole.id"
          :tab="pole.name"
        >
          <PoleItem :pole="pole" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import PoleItem from '@/components/PoleItem.vue';
import { reactive, ref, watch } from 'vue';
import IconTrash from '@/components/icons/IconTrash.vue';
import IconUploadForm from '@/components/icons/IconUploadForm.vue';
import type { UploadChangeParam } from 'ant-design-vue';
import * as XLSX from 'xlsx';
import { generateUUID } from 'three/src/math/MathUtils';
import HeaderMenu from '@/components/HeaderMenu.vue';
import { ACTIVE_TOOL } from '@/utils/enums';
import type { PoleDevice } from '@/services/apis/station';
import { useDevices } from '@/services/hooks/useDevice';
import { maxPageSize } from '@/utils/constants';

const modelStore = useModelStore();

const splatData = reactive(['Danh định', 'Thủ công']);
const splat = ref(splatData[0]);
const files = ref([]);

const jsonData = ref();

const tabClick = (value: number) => {
  modelStore.selectedPole = modelStore.poles.find((item) => item.id === value);
};

let isSetActivePole = false;

watch(
  () => modelStore.poles,
  () => {
    if (!isSetActivePole && modelStore.poles.length > 0) {
      isSetActivePole = true;
      modelStore.activePole = modelStore.poles[0].id;
    }
  },
);

const beforeUpload = (file: any) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target?.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Chuyển đổi dữ liệu thành JSON
    jsonData.value = XLSX.utils.sheet_to_json(worksheet);
  };

  reader.readAsArrayBuffer(file);
  return false; // Ngăn không cho file được upload
};

const handleChange = (info: UploadChangeParam<any>) => {
  files.value = info.fileList.map((item) => {
    return {
      ...item,
      status: 'done',
      percent: 100,
    };
  });
};

// Thêm thiết bị thủ công
const onAddBox = () => {
  modelStore.openModalAddInventory = true;
  modelStore.selectedImage = undefined;
  modelStore.selectedInventory = undefined;
  modelStore.selectedPole = undefined;
  modelStore.isSelectedBasePlate = false;
};

const { data: dataDevices } = useDevices({
  perPage: ref(maxPageSize),
  page: ref(1),
});

watch(jsonData, () => {
  console.log('jsonData', jsonData);
  const mappingByModel: Record<string, any[]> = {};
  jsonData.value.forEach((device) => {
    const newDevice = new Potree.BoxVolume();
    newDevice.position.set(device.x, device.y, device.z);
    newDevice.scale.set(
      device.width / 1000 / modelStore.gpsRatio,
      device.depth / 1000 / modelStore.gpsRatio,
      device.length / 1000 / modelStore.gpsRatio,
    );
    const azimuthRadians = (device.azimuth * Math.PI) / 180; // Chuyển đổi từ độ sang radian
    const tiltRadians = (device.tilt * Math.PI) / 180;

    // Thay đổi rotation
    newDevice.rotation.set(0, tiltRadians, azimuthRadians);

    window.potreeViewer.scene.addVolume(newDevice);

    const dataDevice = dataDevices.value?.data?.data?.find((item) => item.name === device.name);

    const newInventory: PoleDevice = {
      visibleMesh: true,
      visible: true,
      clip: false,
      id: generateUUID(),
      isNewDevice: true,
      device_info: dataDevice,
      newDevice,
    };

    newDevice.addEventListener('volume_select_changed', () => {
      const modelStore = useModelStore();
      modelStore.activeSubTool = 'add-inventory';
      modelStore.hoverInformation =
        'Đang ở chế độ thêm thiết bị, bấm vào xem thông tin để quay lại';
      modelStore.selectedImage = undefined;
      modelStore.selectedMeasurement = undefined;
      modelStore.selectedInventory = newInventory;
    });
    newDevice.addEventListener('volume_deselect_changed', () => {
      const modelStore = useModelStore();
      modelStore.selectedInventory = undefined;
    });

    mappingByModel[device.model] = !mappingByModel[device.model]
      ? [newInventory]
      : mappingByModel[device.model]?.concat([newInventory]);
  });

  modelStore.poles = modelStore.poles.map((item) =>
    item.id === modelStore.activePole
      ? {
          ...item,
          deviceCategories: item.deviceCategories.map((category) =>
            category.name && mappingByModel[category.name]
              ? {
                  ...category,
                  devices: category.devices.concat(mappingByModel[category.name]),
                }
              : category,
          ),
        }
      : item,
  );
});
</script>
