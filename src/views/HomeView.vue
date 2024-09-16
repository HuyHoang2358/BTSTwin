<template>
  <div class="flex flex-col w-screen h-screen">
    <HeaderHome />

    <KeepAlive>
      <component :is="current"></component>
    </KeepAlive>
    <Search />
    <BTSList />
    <div class="flex flex-row items-center absolute z-10 bottom-3 left-4">
      <a-button class="w-[54px] h-[54px] bg-transparent m-0 p-0 border-none">
        <a-image
          :width="54"
          :height="54"
          src="/images/home/layer-map.png"
          class="object-contain"
          :preview="false"
          alt="layer"
        />
      </a-button>
      <div class="ml-2">
        <a-button
          :class="[
            'w-8 h-8 m-0 p-0 pl-2.5 border-none rounded-l-2xl rounded-r-none ',
            modelStore.is2DMode ? 'text-[#ee0033] bg-[#3e3e3e]' : 'text-white bg-[#303030]',
          ]"
          style="font-weight: 500"
          @click="modelStore.is2DMode = true"
        >
          2D
        </a-button>
        <a-button
          :class="[
            'w-8 h-8 m-0 p-0 pr-2.5 border-none rounded-r-2xl rounded-l-none',
            !modelStore.is2DMode ? 'text-[#ee0033] bg-[#3e3e3e]' : 'text-white bg-[#303030]',
          ]"
          style="font-weight: 500"
          @click="modelStore.is2DMode = false"
        >
          3D
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, watch } from 'vue';
import HeaderHome from '@/components/HeaderHome.vue';
import Search from '@/components/Search.vue';
import BTSList from '@/components/BTSList.vue';
import { useModelStore } from '@/stores/model';
import Map2D from '@/components/Map2D.vue';
import Map3D from '@/components/Map3D.vue';

const current = shallowRef(Map2D);

const modelStore = useModelStore();

watch(
  () => modelStore.is2DMode,
  () => {
    current.value = modelStore.is2DMode ? Map2D : Map3D;
  },
);
</script>

<style></style>
