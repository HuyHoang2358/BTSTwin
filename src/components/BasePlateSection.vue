<template>
  <div
    :class="[
      'px-3 h-10 flex justify-between items-center ',
      modelStore.isSelectedBasePlate && 'bg-[#38536d]',
    ]"
  >
    <div
      class="flex items-center cursor-pointer w-full"
      @click="modelStore.isSelectedBasePlate = !modelStore.isSelectedBasePlate"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <path
          fill="white"
          d="m12.95 6.52-.86-.61-1.22-.86-.86-.61-2.02-1.43-2.01 1.45-.86.62-1.21.87-.86.62-2.04 1.47L3.06 9.5l.86.61 1.22.86.86.61 2.02 1.43 2.01-1.45.86-.62 1.21-.87.86-.62L15 7.98l-2.05-1.46Zm-1.72 0-1.17.85-1.21-.87 1.16-.84 1.22.86ZM9.21 7.99 8 8.87 6.79 8 8 7.12l1.21.87ZM7.99 4.22l1.16.83-1.16.84-1.16-.83 1.16-.83v-.01ZM5.97 5.67l1.17.84-1.21.88-1.17-.84 1.21-.87v-.01ZM2.72 8.01l1.18-.85L5.08 8l-1.17.85-1.19-.84Zm2.05 1.45 1.17-.85 1.21.87-1.16.84-1.22-.86Zm3.24 2.3-1.16-.83 1.16-.84 1.16.83-1.16.83v.01Zm2.02-1.45-1.17-.84 1.21-.88 1.17.84-1.21.87v.01Zm2.07-1.49-1.18-.84 1.17-.85 1.19.84-1.18.85Z"
        />
      </svg>
      <a-typography-text class="ml-2 text-base font-semibold text-[#E3E3E3]">
        Base plate
      </a-typography-text>
    </div>
    <a-button
      ghost
      class="p-0 m-0 border-none ml-2 flex items-center"
      @click="modelStore.basePlateChecked = !modelStore.basePlateChecked"
    >
      <svg
        v-if="modelStore.basePlateChecked"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <path
          fill="#888888"
          d="M8 3a8 8 0 0 0-7 5 8 8 0 0 0 7 5 8 8 0 0 0 7-5 8 8 0 0 0-7-5Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
        />
        <path
          fill="#888888"
          d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
        />
      </svg>
      <svg
        v-else
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        <path
          fill="#888888"
          d="M8 4.46a3.11 3.11 0 0 1 3.19 3A3 3 0 0 1 11 8.6l1.86 1.76A7.15 7.15 0 0 0 15 7.49a7.53 7.53 0 0 0-7-4.55 7.87 7.87 0 0 0-2.54.42l1.38 1.31A3.19 3.19 0 0 1 8 4.46ZM1.64 2.8l1.45 1.38.29.28A7.2 7.2 0 0 0 1 7.49 7.53 7.53 0 0 0 8 12c.953.003 1.9-.17 2.79-.51l.27.26 1.86 1.77.81-.77L2.45 2l-.81.8Zm3.52 3.35 1 .94a1.75 1.75 0 0 0 0 .4A1.86 1.86 0 0 0 8 9.3a2 2 0 0 0 .42 0l1 .94a3.24 3.24 0 0 1-1.4.32 3.11 3.11 0 0 1-3.18-3 2.93 2.93 0 0 1 .32-1.41Zm2.74-.47 2 1.91v-.1A1.87 1.87 0 0 0 8 5.67l-.1.01Z"
        />
      </svg>
    </a-button>
  </div>
  <a-divider class="m-0 border-[#404040]" />
</template>
<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import { watch } from 'vue';

const modelStore = useModelStore();

watch(
  () => modelStore.basePlateChecked,
  (newValue) => {
    if (!newValue) {
      modelStore.isSelectedBasePlate = false;
    }

    if (!modelStore.basePlate) return;
    modelStore.basePlate.visible = newValue;
    if (modelStore.northDirection) {
      modelStore.northDirection.visible = newValue;
    }

    modelStore.isShowNorthDirection = newValue;
    if (newValue) {
      modelStore.basePlate?.material.color.setHex(0xbf0606);
    } else {
      modelStore.basePlate?.material.color.setHex(0x095888);
    }
  },
);
</script>
