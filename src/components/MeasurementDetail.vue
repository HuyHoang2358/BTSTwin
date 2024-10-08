<template>
  <div class="flex flex-row mt-2">
    <div class="w-1/3">
      <a-typography>{{ label }}</a-typography>
    </div>
    <div class="w-2/3">
      <a-typography>
        {{ value }}
      </a-typography>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
}>();
</script>
