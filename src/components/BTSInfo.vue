<template>
  <div
    v-if="modelStore.isShowBTSInfo"
    class="flex flex-col search-bts z-10 absolute p-3.5 top-[68px] rounded-sm right-3.5 w-[274px] bg-[#303030] max-h-[55%]"
  >
    <a-typography-text class="text-base font-medium text-white">
      Thông tin trạm BTS
    </a-typography-text>
    <a-descriptions
      layout="horizontal"
      :column="1"
      class="mt-4"
    >
      <a-descriptions-item
        label="Tên trạm"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedBTS?.name }}
      </a-descriptions-item>
      <a-descriptions-item
        label="Địa chỉ"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ modelStore.selectedBTS?.address?.address_detail }}
      </a-descriptions-item>
      <a-descriptions-item
        label="Tọa độ"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ convertToDMS(Number(modelStore.selectedBTS?.location?.longitude)) }}
        {{ `, ` }}
        {{ convertToDMS(Number(modelStore.selectedBTS?.location?.latitude)) }}
      </a-descriptions-item>
      <a-descriptions-item
        label="Vận hành"
        :labelStyle="descriptionStyle"
        :contentStyle="descriptionStyle"
      >
        {{ 'VTNET' }}
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>
<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import { computed } from 'vue';
import { convertToDMS } from '@/utils/helpers';

const modelStore = useModelStore();

const descriptionStyle = computed(() => ({ color: 'white', fontSize: '12px' }));
</script>
