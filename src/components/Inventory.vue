<template>
  <div
    v-if="modelStore.poles.length > 0 && modelStore.activeTool === ACTIVE_TOOL.INVENTORY"
    class="flex flex-col bg-[#303030] w-[260px]"
  >
    <HeaderMenu
      title="Khảo sát"
      show-divider
    />
    <BasePlateSection />
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
import { ACTIVE_TOOL } from '@/utils/enums';
import HeaderMenu from '@/components/HeaderMenu.vue';
import BasePlateSection from '@/components/BasePlateSection.vue';

const modelStore = useModelStore();
</script>
