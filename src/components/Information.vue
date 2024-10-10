<template>
  <div
    class="overflow-auto flex flex-col bg-[#212121]"
    :style="{ flex: 100 - pane1Size + ' 0 0' }"
    v-if="modelStore.selectedImage"
  >
    <ListImages />
  </div>
  <div
    class="w-[285px] bg-[#303030] overflow-auto"
    v-if="modelStore.selectedInventory"
    style="height: calc(100vh - 84px)"
  >
    <HeaderInformation
      title="Thông tin thiết bị"
      :on-close="onCloseDeviceInformation"
    />
    <div class="px-4 py-2.5">
      <NewDevice v-if="modelStore.selectedInventory.isNewDevice" />
      <DeviceInfo v-else />
    </div>
  </div>
  <Pole v-if="modelStore.selectedPole" />
  <MeasureInfo
    v-if="modelStore.selectedMeasurement && modelStore.activeTool === ACTIVE_TOOL.MEASUREMENT"
  />
  <BasePlate v-if="modelStore.isSelectedBasePlate" />
  <Suggestion
    v-if="
      !modelStore.selectedInventory &&
      !modelStore.selectedPole &&
      !(modelStore.selectedMeasurement && modelStore.activeTool === ACTIVE_TOOL.MEASUREMENT) &&
      !modelStore.isSelectedBasePlate &&
      !modelStore.selectedImage
    "
  />
</template>

<script lang="ts" setup>
import { useModelStore } from '@/stores/model';
import NewDevice from '@/components/NewDevice.vue';
import BasePlate from '@/components/BasePlate.vue';
import Pole from '@/components/Pole.vue';
import DeviceInfo from '@/components/DeviceInfo.vue';
import HeaderInformation from '@/components/HeaderInformation.vue';
import MeasureInfo from '@/components/MeasureInfo.vue';
import Suggestion from '@/components/Suggestion.vue';
import { watch } from 'vue';
import ListImages from '@/components/ListImages.vue';
import { ACTIVE_TOOL } from '@/utils/enums';

defineProps<{
  pane1Size: number;
}>();

const modelStore = useModelStore();

const onCloseDeviceInformation = () => {
  modelStore.selectedInventory = undefined;
  window.potreeViewer.inputHandler.deselectAll();
};

watch(
  () => modelStore.selectedPole,
  () => {
    if (modelStore.selectedPole) {
      modelStore.selectedInventory = undefined;
      modelStore.isSelectedBasePlate = false;
      modelStore.selectedMeasurement = undefined;
    }
  },
);

watch(
  () => modelStore.isSelectedBasePlate,
  () => {
    if (modelStore.isSelectedBasePlate) {
      modelStore.selectedInventory = undefined;
      modelStore.selectedPole = undefined;
      modelStore.selectedMeasurement = undefined;
    }
  },
);

watch(
  () => modelStore.activeTool,
  () => {
    if (modelStore.activeTool !== ACTIVE_TOOL.MEASUREMENT) {
      modelStore.selectedMeasurement = undefined;
    }
  },
);
</script>
