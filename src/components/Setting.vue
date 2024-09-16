<template>
  <div
    v-if="modelStore.activeTool === 'setting'"
    class="bg-[#303030] w-[260px] overflow-auto"
  >
    <div class="flex justify-between items-center px-3 py-4">
      <a-typography-text class="text-base text-[#888]">Cài đặt</a-typography-text>
    </div>
    <div class="px-3">
      <div>
        <a-typography-text class="text-white">
          Point budget: {{ formatNumber(pointBudget) }}
        </a-typography-text>
        <a-slider
          v-model:value="pointBudget"
          :min="100000"
          :max="10000000"
          :step="100000"
        />
      </div>
      <a-checkbox
        v-model:checked="lightingChecked"
        class="text-white mt-2"
      >
        Eye-Dome-Lighting
      </a-checkbox>
      <div class="mt-2">
        <a-typography-text class="text-white">Background:</a-typography-text>
        <a-segmented
          v-model:value="background"
          :options="backgroundData"
          size="small"
          class="mt-2"
          block
        />
      </div>
      <div class="mt-2">
        <a-typography-text class="text-white">Splat Quality:</a-typography-text>
        <a-segmented
          v-model:value="splat"
          :options="splatData"
          size="small"
          class="mt-2"
          block
        />
      </div>
      <div class="mt-2">
        <a-typography-text class="text-white">Point size: {{ pointSize }}</a-typography-text>
        <a-slider
          v-model:value="pointSize"
          :min="0"
          :max="3"
          :step="0.01"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import { reactive, ref, watch } from 'vue';
import { formatNumber } from '@/utils/helpers';

const pointBudget = ref<number>(1000000);
const pointSize = ref<number>(1);
const lightingChecked = ref(true);
const backgroundData = reactive(['skybox', 'gradient', 'black', 'white']);
const background = ref('black');
const splatData = reactive(['Thấp', 'Cao']);
const splat = ref(splatData[1]);

const modelStore = useModelStore();

watch(pointBudget, () => {
  window.potreeViewer.setPointBudget(pointBudget.value);
});

watch(lightingChecked, () => {
  window.potreeViewer.setEDLRadius(lightingChecked.value);
});

watch(background, () => {
  window.potreeViewer.setBackground(background.value);
});

watch(splat, () => {
  if (splat.value === 'Thấp') {
    window.potreeViewer.useHQ = false;
  } else if (splat.value === 'Cao') {
    window.potreeViewer.useHQ = true;
  }
});

watch(pointSize, () => {});
</script>
