<template>
  <div class="flex justify-between items-center px-4 py-2.5">
    <a-typography-text class="text-base font-medium text-[#E3E3E3]">
      {{ title }}
    </a-typography-text>
    <a-button
      type="ghost"
      @click="onClose"
      class="m-0 p-0 h-6"
    >
      <IconClose />
    </a-button>
  </div>
  <a-divider class="mt-1 mb-0 border-[#404040]" />
</template>
<script setup lang="ts">
import IconClose from '@/components/icon/IconClose.vue';

defineProps<{
  onClose: () => void;
  title: string;
}>();
</script>
