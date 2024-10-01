<template>
  <div
    v-if="modelStore.poles.length > 0 && modelStore.activeTool === 'inventory'"
    class="flex flex-col bg-[#303030] w-[260px]"
  >
    <a-typography-text class="ml-3 mt-2 text-lg font-semibold text-[#E3E3E3]">
      Khảo sát
    </a-typography-text>
    <a-divider class="mt-1 mb-0 border-[#404040]" />

    <div class="flex flex-col overflow-auto">
      <PoleItem
        v-for="pole in modelStore.poles"
        :pole="pole"
        :key="pole.pivot.id"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import PoleItem from '@/components/PoleItem.vue';

const modelStore = useModelStore();
</script>
