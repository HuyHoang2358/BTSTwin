<template>
  <a-tooltip
    :title="title"
    placement="right"
    color="#212121"
  >
    <a-button
      @click="
        modelStore.activeTool === activeTool
          ? (modelStore.activeTool = ACTIVE_TOOL.BLANK)
          : (modelStore.activeTool = activeTool)
      "
      :class="[
        'p-0 border-none rounded-none h-10 group flex justify-center items-center',
        modelStore.activeTool === activeTool ? 'bg-[#303030]' : 'bg-transparent',
      ]"
      style="width: 40px"
    >
      <template #icon>
        <slot />
      </template>
    </a-button>
  </a-tooltip>
</template>
<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import { ACTIVE_TOOL } from '@/utils/enums';

defineProps<{
  title: string;
  activeTool: ACTIVE_TOOL;
}>();

const modelStore = useModelStore();
</script>
