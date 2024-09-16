<template>
  <div
    class="flex flex-col search-bts z-10 absolute p-3.5 top-[112px] rounded-sm left-3.5 w-[274px] bg-[#303030] max-h-[55%]"
  >
    <a-typography-text class="text-xs font-medium text-white">Trạm BTS</a-typography-text>
    <div class="mt-4 flex flex-row items-center gap-1">
      <a-input
        placeholder="Tìm kiếm vị trí trên bản đồ"
        v-model:value="searchValue"
        allow-clear
        style="background: #424242; border-radius: 2px; border-width: 0; height: 26px"
      >
        <template #prefix>
          <IconSearchInput />
        </template>
      </a-input>
      <a-button class="m-0 p-0 w-[26px] h-[26px] border-none bg-[#424242] rounded-sm">
        <IconFilter />
      </a-button>
    </div>
    <div class="flex flex-col flex-1 overflow-auto mt-1 pr-2">
      <BTSItem
        v-for="item in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
        :key="item"
        :item="item"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import { ref } from 'vue';
import BTSItem from '@/components/BTSItem.vue';
import IconFilter from '@/components/icons/home/IconFilter.vue';

const searchValue = ref<string>('');
</script>
