<template>
  <div
    class="w-[285px] bg-[#303030] overflow-auto"
    v-if="modelStore.selectedInventory"
    style="height: calc(100vh - 84px)"
  >
    <div class="flex justify-between items-center px-3.5 pt-3.5 pb-1">
      <a-typography-text class="text-base font-medium text-white">
        Thông tin thiết bị
      </a-typography-text>
      <div>
        <a-button
          type="ghost"
          @click="onCloseDeviceInformation"
        >
          <IconClose />
        </a-button>
      </div>
    </div>
    <a-divider class="mt-1 mb-0 border-[#404040]" />
    <div class="p-3.5">
      <a-typography class="text-[#F4F4F4] text-lg mb-2">
        {{ modelStore.selectedInventory?.name }}
      </a-typography>
      <NewDevice v-if="modelStore.selectedInventory.isNewDevice" />
      <DeviceInfo v-else />
    </div>
  </div>
  <Pole v-if="modelStore.selectedPole" />
  <BasePlate v-if="modelStore.isSelectedBasePlate" />
</template>

<script lang="ts" setup>
import { useModelStore } from '@/stores/model';
import NewDevice from '@/components/NewDevice.vue';
import BasePlate from '@/components/BasePlate.vue';
import Pole from '@/components/Pole.vue';
import DeviceInfo from '@/components/DeviceInfo.vue';
import IconClose from '@/components/icon/IconClose.vue';

const modelStore = useModelStore();

const onCloseDeviceInformation = () => {
  modelStore.selectedInventory = undefined;
  window.potreeViewer.inputHandler.deselectAll();
};
</script>
