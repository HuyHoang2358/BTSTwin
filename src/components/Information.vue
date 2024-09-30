<template>
  <div
    class="w-[285px] bg-[#303030] p-6 overflow-auto"
    v-if="modelStore.selectedInventory"
    style="height: calc(100vh - 84px)"
  >
    <a-typography class="text-[#f2f2f2] text-lg mb-2">
      {{ modelStore.selectedInventory?.name }}
    </a-typography>
    <NewDevice v-if="modelStore.selectedInventory.isNewDevice" />
    <DeviceInfo v-else />
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

const modelStore = useModelStore();
</script>
