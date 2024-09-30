<template>
  <div
    v-if="modelStore.poles.length > 0 && modelStore.activeTool === 'inventory'"
    class="flex flex-col bg-[#303030] w-[260px]"
  >
    <a-typography-title
      level="3"
      style="font-size: 16px; color: white"
      class="ml-3 mt-4"
    >
      Khảo sát
    </a-typography-title>
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
