<template>
  <div class="search-form absolute top-[68px] z-10 left-3.5">
    <a-input
      placeholder="Tìm kiếm vị trí trên bản đồ"
      v-model:value="searchValue"
      allow-clear
      class="w-[274px]"
      style="background: #303030; border-radius: 2px"
    >
      <template #prefix>
        <IconSearchInput />
      </template>
    </a-input>
  </div>
</template>
<script setup lang="ts">
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import { ref } from 'vue';

const searchValue = ref<string>('');
</script>
