<template>
  <a-config-provider
    :locale="viVN"
    :theme="{
      token: {
        colorPrimary: '#D0002D',
      },
      algorithm: theme.darkAlgorithm,
    }"
  >
    <div class="flex flex-col w-screen h-screen">
      <HeaderHome />
      <KeepAlive>
        <component :is="current" />
      </KeepAlive>
      <Search />
      <BTSList />
      <div class="flex flex-row items-center absolute z-10 bottom-3 left-4">
        <a-button
          class="w-[54px] h-[54px] bg-transparent m-0 p-0 border-none"
          @click="onToggleBaseLayer"
        >
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
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue';
import HeaderHome from '@/components/HeaderHome.vue';
import Search from '@/components/Search.vue';
import BTSList from '@/components/BTSList.vue';
import { useModelStore } from '@/stores/model';
import Map2D from '@/components/Map2D.vue';
import Map3D from '@/components/Map3D.vue';
import viVN from 'ant-design-vue/es/locale/vi_VN';
import { theme } from 'ant-design-vue';

const current = shallowRef(Map2D);
const isViettelLayer = ref(true);

const modelStore = useModelStore();

watch(
  () => modelStore.is2DMode,
  () => {
    current.value = modelStore.is2DMode ? Map2D : Map3D;
  },
);

const onToggleBaseLayer = () => {
  const map = modelStore.mapOl; // Lấy bản đồ từ Vuex store
  if (!map) return;

  const layers = map.getLayers().getArray();

  // Thay thế lớp bản đồ
  if (isViettelLayer.value) {
    layers[0].setVisible(true);
    layers[1].setVisible(false);
  } else {
    layers[0].setVisible(false);
    layers[1].setVisible(true);
  }

  // Cập nhật trạng thái
  isViettelLayer.value = !isViettelLayer.value;
};
</script>
