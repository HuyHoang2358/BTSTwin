<template>
  <a-popover
    placement="top"
    trigger="click"
  >
    <template #title>
      <span>Cài đặt</span>
    </template>
    <template #content>
      <div class="w-[300px]">
        <div>
          <a-typography-text class="text-white">
            Số lượng điểm: {{ formatNumber(pointBudget) }}
          </a-typography-text>
          <a-slider
            v-model:value="pointBudget"
            :min="100000"
            :max="50000000"
            :step="100000"
          />
        </div>
        <div class="mt-2">
          <a-typography-text class="text-white">
            Kích thước điểm: {{ pointSize }} px
          </a-typography-text>
          <a-slider
            v-model:value="pointSize"
            :min="0.1"
            :max="10"
            :step="0.1"
          />
        </div>
        <div class="mt-2">
          <a-typography-text class="text-white">
            Màu nền:
          </a-typography-text>
          <a-segmented
            v-model:value="background"
            :options="backgroundData"
            size="small"
            class="mt-2"
            block
          />
        </div>
        <div class="mt-2">
          <a-typography-text class="text-white">
            Chất lượng:
          </a-typography-text>
          <a-segmented
            v-model:value="splat"
            :options="splatData"
            size="small"
            class="mt-2"
            block
          />
        </div>
        <div class="mt-2">
          <a-typography-text class="text-white">
            Đơn vị đo:
          </a-typography-text>
          <a-segmented
            v-model:value="unit"
            :options="unitData"
            size="small"
            class="mt-2"
            block
          />
        </div>
        <a-checkbox
          v-model:checked="lightingChecked"
          class="text-white mt-2"
        >
          Bật chiếu sáng
        </a-checkbox>
      </div>
    </template>
    <a-button class="p-0 w-8 flex items-center justify-center border-none bg-transparent">
      <icon-setting />
    </a-button>
  </a-popover>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { formatNumber } from '@/utils/helpers';
import { budgetPointValue, EDLRadius, pointSizeValue } from '@/utils/constants';
import IconSetting from '@/components/icons/IconSetting.vue';

const pointBudget = ref<number>(budgetPointValue);
const pointSize = ref<number>(pointSizeValue);
const lightingChecked = ref(EDLRadius);
const backgroundData = reactive(['skybox', 'gradient', 'black', 'white']);
const background = ref('black');
const splatData = reactive(['Thấp', 'Cao']);
const splat = ref(splatData[0]);
const unitData = reactive(['m', 'cm', 'mm']);
const unit = ref(unitData[2]);

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

watch(pointSize, () => {
  if (window.potreeViewer.scene.pointclouds) {
    window.potreeViewer.scene.pointclouds[0].material.size = pointSize.value;
  }
});

watch(unit, (newValue) => {
  window.potreeViewer.setLengthDisplayUnit(newValue);
});
</script>
