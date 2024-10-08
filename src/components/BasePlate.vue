<template>
  <div
    class="w-[285px] bg-[#303030] overflow-auto flex flex-col"
    style="height: calc(100vh - 84px)"
  >
    <HeaderInformation
      title="Base plate"
      :on-close="() => (modelStore.isSelectedBasePlate = false)"
    />

    <div class="p-3 flex flex-col">
      <a-typography-text>Chiều dài (m)</a-typography-text>
      <a-input-number
        v-model:value="modelStore.heightBasePlateValue"
        :min="1"
        :max="100"
        class="w-full my-2"
      />
      <a-typography-text>Chiều rộng (m)</a-typography-text>
      <a-input-number
        v-model:value="modelStore.widthBasePlateValue"
        :min="1"
        :max="100"
        class="w-full my-2"
      />
      <a-typography-text>Vị trí (z)</a-typography-text>
      <a-input-number
        v-model:value="modelStore.positionValue"
        :min="-50"
        :max="50"
        class="w-full my-2"
      />
      <div class="w-full flex flex-col">
        <a-slider
          v-model:value="modelStore.positionValue"
          :min="-50"
          :max="50"
          :step="0.01"
        />
      </div>
      <a-button
        type="primary"
        class="mt-4"
        @click="onReset"
      >
        Cài đặt về ban đầu
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import { useModelStore } from '@/stores/model';
import { heightBasePlate, widthBasePlate } from '@/utils/constants';
import HeaderInformation from '@/components/HeaderInformation.vue';

const modelStore = useModelStore();

onMounted(() => {
  if (!modelStore.basePlate) return;
  modelStore.positionValue = modelStore.basePlate.position.z; // Cập nhật vị trí
});

// Watch các giá trị và cập nhật basePlate
watch(
  () => modelStore.widthBasePlateValue,
  (newValue) => {
    if (modelStore.basePlate && newValue) {
      modelStore.basePlate.scale.x = newValue / widthBasePlate; // Cập nhật tỉ lệ chiều rộng
    }
  },
);

watch(
  () => modelStore.heightBasePlateValue,
  (newValue) => {
    if (modelStore.basePlate && newValue) {
      modelStore.basePlate.scale.y = newValue / heightBasePlate; // Cập nhật tỉ lệ chiều dài
    }
  },
);

watch(
  () => modelStore.positionValue,
  (newValue) => {
    if (modelStore.basePlate && newValue) {
      modelStore.basePlate.position.z = newValue; // Cập nhật vị trí z
    }
  },
);

const onReset = () => {
  modelStore.positionValue = modelStore.zPlaneHistory;
  modelStore.heightBasePlateValue = heightBasePlate;
  modelStore.widthBasePlateValue = widthBasePlate;
};
</script>
