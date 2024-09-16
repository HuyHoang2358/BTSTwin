<template>
  <div class="flex flex-row items-start cursor-pointer mt-3">
    <div
      class="flex flex-row items-center"
      @click="isExpanded = !isExpanded"
    >
      <IconExpanded :class="['mr-1', isExpanded && 'rotate-90']" />
      <IconBTS />
    </div>
    <div class="flex flex-col w-full">
      <a-typography-title
        :level="3"
        style="color: #f6f6f6; font-size: 12px; margin-bottom: 4px"
        @click="isExpanded = !isExpanded"
      >
        Trạm BTS {{ item }}
      </a-typography-title>
      <a-typography-text
        v-if="!isExpanded"
        class="text-[#8c8c8c] text-xs"
      >
        Quét 2 lần
      </a-typography-text>
      <a-button
        v-else
        :key="item"
        v-for="item in ['08/08/2024', '09/08/2024']"
        class="flex flex-row items-center justify-between h-6 m-0 p-0 bg-transparent border-none"
        @click="null"
      >
        <a-typography style="color: #f6f6f6; font-size: 12px; margin-bottom: 0">
          {{ item }}
        </a-typography>
        <IconTickGreen />
      </a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import IconExpanded from '@/components/icons/home/IconExpanded.vue';
import IconBTS from '@/components/icons/home/IconBTS.vue';
import IconTickGreen from '@/components/icons/home/IconTickGreen.vue';

defineProps<{
  item: any;
}>();

const isExpanded = ref(false);
</script>
