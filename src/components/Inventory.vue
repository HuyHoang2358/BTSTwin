<template>
  <div
    v-if="modelStore.objectGroupArray.length > 0 && modelStore.activeTool === 'inventory'"
    class="flex flex-col bg-[#303030] w-[260px]"
  >
    <div class="flex justify-between items-center px-3 py-4">
      <a-typography-text class="text-base text-[#888]">Thiết bị</a-typography-text>
      <a-button
        class="p-0 border-none"
        ghost
        @click="onAddBox"
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
            d="M14 9H9v5H7V9H2V7h5V2h2v5h5v2Z"
          ></path>
        </svg>
      </a-button>
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
    <div
      class="flex flex-1 overflow-auto"
      v-if="modelStore.objectGroup"
    >
      <a-collapse
        v-model:activeKey="activeKey"
        :bordered="false"
        class="w-full"
      >
        <template #expandIcon="{ isActive }">
          <caret-right-outlined
            :rotate="isActive ? 90 : 0"
            style="color: white"
          />
        </template>
        <a-collapse-panel
          :header="`${category} (${modelStore.objectGroup[category].length} thiết bị)`"
          v-for="category in modelStore.objectGroupArray"
          :key="category"
        >
          <InventoryItem
            v-for="(item, index) in modelStore.objectGroup[category].filter(() =>
              compareString(category, searchValue),
            )"
            :key="index"
            :item="item"
            :category="category"
            :index="index"
          />
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import { CaretRightOutlined } from '@ant-design/icons-vue';
import { ref, watch } from 'vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import { compareString } from '@/utils/helpers';
import InventoryItem from '@/components/InventoryItem.vue';

const activeKey = ref<string[]>([]);
const searchValue = ref<string>('');

const modelStore = useModelStore();

watch(
  () => modelStore.objectGroupArray,
  () => {
    activeKey.value = modelStore.objectGroupArray.map((item) => item) || [];
  },
);

const onAddBox = () => {
  modelStore.openModalAddInventory = true;
  modelStore.activeTool = undefined;
  modelStore.selectedImage = undefined;
  modelStore.selectedInventory = undefined;
};
</script>
