<template>
  <div class="h-10 flex items-center justify-between mx-3">
    <a-typography-text class="text-lg font-semibold text-[#E3E3E3]">
      {{ title }}
    </a-typography-text>
    <slot />
  </div>
  <a-divider
    class="m-0 border-[#404040]"
    v-if="showDivider"
  />
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  showDivider?: boolean;
}>();
</script>
