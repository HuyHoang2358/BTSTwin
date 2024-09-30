<template>
  <div
    class="bg-[#303030] w-[260px] overflow-auto"
    v-if="modelStore.activeTool === 'export'"
  >
    <div class="flex justify-between items-center px-3 py-4">
      <a-typography-text class="text-base text-[#888]">Xuất báo cáo</a-typography-text>
    </div>
    <div class="mx-3">
      <a-button
        type="primary"
        class="w-full"
      >
        Xuất báo cáo excel
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelStore } from '@/stores/model';

const modelStore = useModelStore();
</script>
