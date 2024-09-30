<template>
  <div
    v-if="modelStore.activeTool === 'images'"
    class="flex flex-col bg-[#303030] w-[260px]"
  >
    <div class="flex justify-between items-center px-3 py-4">
      <a-typography-text class="text-base text-[#888]">
        Hình ảnh
        <br />
        {{ modelStore.images.length }} item(s)
      </a-typography-text>
    </div>
    <div class="px-3 mb-4">
      <a-input
        :placeholder="$t('search')"
        v-model:value="searchValue"
        allow-clear
        style="border: 1px solid #424242"
      >
        <template #prefix>
          <IconSearchInput />
        </template>
      </a-input>
    </div>
    <div class="flex flex-col flex-1 overflow-auto">
      <div
        v-for="(item, index) in modelStore.images"
        :key="index"
        :class="[
          'flex flex-row items-center justify-between cursor-pointer pr-2',
          item === modelStore.selectedImage && 'bg-[#38536d]',
        ]"
        @click="onChangeImage(item)"
      >
        <a-typography-text class="text-white text-sm ml-3">
          {{ item.filename }}
        </a-typography-text>
        <a-button
          @click="null"
          ghost
          class="p-0 m-0 border-none"
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
              fill="#888888"
              d="M8 3a8 8 0 0 0-7 5 8 8 0 0 0 7 5 8 8 0 0 0 7-5 8 8 0 0 0-7-5Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
            ></path>
            <path
              fill="#888888"
              d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
            ></path>
          </svg>
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import { ref } from 'vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import { useChangeImage } from '@/potree/hooks/useChangeImage';

const searchValue = ref<string>('');

const modelStore = useModelStore();
const { onChangeImage } = useChangeImage();
</script>
