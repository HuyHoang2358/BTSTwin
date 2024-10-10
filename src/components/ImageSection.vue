<template>
  <div
    v-if="modelStore.activeTool === ACTIVE_TOOL.IMAGE"
    class="flex flex-col bg-[#303030] w-[260px]"
  >
    <HeaderMenu title="Ảnh 2D">
      <!--      <a-tooltip-->
      <!--        title="Ẩn/Hiện tất cả"-->
      <!--        placement="top"-->
      <!--      >-->
      <!--        <a-button-->
      <!--          @click="onToggleAllImages"-->
      <!--          class="p-0 m-0 border-none bg-transparent flex items-center"-->
      <!--        >-->
      <!--          <IconVisible v-if="modelStore.visibleAllImages" />-->
      <!--          <IconInvisible v-else />-->
      <!--        </a-button>-->
      <!--      </a-tooltip>-->
    </HeaderMenu>
    <div class="px-3 flex flex-row items-center gap-1">
      <a-input
        :placeholder="$t('search')"
        v-model:value="searchValue"
        allow-clear
        style="background: #424242; border-radius: 2px; border-width: 0; height: 26px"
      >
        <template #prefix>
          <IconSearchInput />
        </template>
      </a-input>
    </div>
    <div class="flex flex-col flex-1 overflow-auto mt-4">
      <div
        v-for="(item, index) in filteredImages"
        :key="index"
        :class="[
          'flex flex-row items-center justify-between cursor-pointer pr-2',
          item === modelStore.selectedImage && 'bg-[#38536d]',
        ]"
        @click="onChangeImage(item)"
      >
        <a-typography-text class="text-white text-sm ml-3 py-2">
          {{ item.filename }}
        </a-typography-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useModelStore } from '@/stores/model';
import { useChangeImage } from '@/potree/hooks/useChangeImage';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import { ACTIVE_TOOL } from '@/utils/enums';
import HeaderMenu from '@/components/HeaderMenu.vue';
import { compareString } from '@/utils/helpers';
import IconVisible from '@/components/icons/IconVisible.vue';
import IconInvisible from '@/components/icons/IconInvisible.vue';

const { onChangeImage } = useChangeImage();
const searchValue = ref<string>('');
const modelStore = useModelStore();

const filteredImages = computed(() =>
  modelStore.images.filter((image) => compareString(image.filename, searchValue.value)),
);

const onToggleAllImages = () => {
  // const nextState = !modelStore.visibleAllImages;
  // modelStore.visibleAllImages = nextState;
  // if (!nextState) {
  //
  // } else {
  // }
};
</script>
