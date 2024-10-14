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

      <div
        id="popup"
        class="ol-popup"
      >
        <a
          id="popup-closer"
          href="#"
          class="ol-popup-closer"
        />
        <div id="popup-content" />
      </div>

      <SearchForm />

      <BTSList />

      <BTSInfo />

      <!-- Left bottom corner -->
      <div class="flex flex-row items-center absolute z-10 bottom-3 left-4">
        <a-button
          class="w-[54px] h-[54px] bg-transparent m-0 p-0 border-none rounded-full"
          @click="onToggleBaseLayer"
        >
          <a-image
            :src="layer_icon"
            class="object-contain rounded-full border-2 w-full h-full"
            :preview="false"
            alt="layer"
            style="border: 2px solid white"
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

      <!-- Right bottom corner -->
      <div class="absolute z-10 bottom-3 right-4">
        <div class="flex flex-row justify-end items-center gap-x-1">
          <div
            v-if="modelStore.windyLayerVisible"
            class="bg-[#303030] text-white text-sm"
          >
            <div class="flex justify-between items-center px-2 py-1 gap-2">
              <div class="flex justify-start items-center gap-0.5">
                <div class="w-6 h-6 p-1">
                  <IconWindy class="w-full h-full" />
                </div>
                <p class="m-0 text-sm">Bản đồ vùng gió</p>
              </div>
              <a-button
                type="ghost"
                @click="toggleWindRegionLayer"
                class="w-6 h-6 p-1 bg-none"
              >
                <IconClose class="w-full h-full" />
              </a-button>
            </div>
            <a-divider class="mt-1 mb-0 border-[#404040]" />
            <div class="py-2 px-4">
              <div
                class="flex justify-start items-center gap-3 py-0.5"
                v-for="item in dataWindy?.data?.data || []"
                :key="item.id"
              >
                <div
                  class="w-4 h-4 rounded"
                  :style="{ background: item.color }"
                ></div>
                <p class="m-0">Vùng gió {{ item.name }}</p>
              </div>
            </div>
          </div>
          <a-tooltip
            title="Bản đồ vùng gió"
            placement="top"
            color="#212121"
            v-if="!modelStore.windyLayerVisible"
          >
            <a-button
              class="p-2 w-10 h-10 bg-[#303030] m-0 text-white border-none"
              @click="toggleWindRegionLayer"
            >
              <IconWindy class="w-full h-full" />
            </a-button>
          </a-tooltip>
        </div>

        <div class="flex justify-end items-center mt-1 gap-1 text-white">
          <div class="bg-[#303030] text-left h-6 rounded text-sm flex flex-col justify-center">
            <p
              class="m-0 px-2"
              id="lat-lng-info"
            ></p>
          </div>
          <div class="w-6 h-6 bg-[#303030] p-1 rounded">
            <IconInformation class="w-full h-full" />
          </div>
        </div>
      </div>

      <!-- Hover box Station Info -->
      <div
        id="station-info"
        style="display: none"
        class="rounded bg-white p-4 text-xs absolute w-[250px]"
      ></div>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue';
import { useModelStore } from '@/stores/model';
import { useWindyAreas } from '@/services/hooks/useWindyArea';

import { theme } from 'ant-design-vue';
import { maxPageSize } from '@/utils/constants';
import viVN from 'ant-design-vue/es/locale/vi_VN';

import Map2D from '@/components/Map2D.vue';
import Map3D from '@/components/Map3D.vue';
import BTSList from '@/components/BTSList.vue';
import BTSInfo from '@/components/BTSInfo.vue';
import SearchForm from '@/components/SearchForm.vue';
import HeaderHome from '@/components/HeaderHome.vue';
import IconClose from '@/components/icon/IconClose.vue';
import IconWindy from '@/components/icon/IconWindy.vue';
import IconInformation from '@/components/icon/IconInformation.vue';

// TODO: Define global variables
const current = shallowRef(Map2D);
const isViettelLayer = ref(true);
const modelStore = useModelStore();

// TODO: Change map mode 2D - 3D
watch(
  () => modelStore.is2DMode,
  () => {
    if (!modelStore.is2DMode) {
      const overlay = modelStore.mapOl?.getOverlays().getArray()[0];
      const closer = document.getElementById('popup-closer');
      if (!closer || !overlay) return;
      overlay.setPosition(undefined);
      closer.blur();
      modelStore.isShowBTSInfo = false;
    }
    current.value = modelStore.is2DMode ? Map2D : Map3D;
  },
);

// TODO: Change Base Layer
let layer_icon = ref<string>('/images/home/layer-viettel.png');
const onToggleBaseLayer = () => {
  const map = modelStore.mapOl;
  if (!map) return;

  const layers = map.getLayers().getArray();

  if (isViettelLayer.value) {
    layers[0].setVisible(true);
    layers[1].setVisible(false);
    layer_icon.value = '/images/home/layer-map.png';
  } else {
    layers[0].setVisible(false);
    layers[1].setVisible(true);
    layer_icon.value = '/images/home/layer-viettel.png';
  }

  isViettelLayer.value = !isViettelLayer.value;
};

// TODO: Fetch windy areas
const { data: dataWindy } = useWindyAreas({
  perPage: ref(maxPageSize),
});
// TODO: Toggle Wind Region Layer
const toggleWindRegionLayer = () => {
  const map = modelStore.mapOl;

  if (!map) return;

  const layers = map.getLayers().getArray();

  layers[2].setVisible(!modelStore.windyLayerVisible);
  modelStore.windyLayerVisible = !modelStore.windyLayerVisible;
};
</script>

<style>
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 14px;
  right: 14px;
}
.ol-popup-closer:after {
  content: '✖';
}
.ol-control {
  background-color: transparent;
}
.ol-control button {
  background-color: #2f2f2f;
  color: white;
  border: none;
  margin: 0;
}
.ol-control button:hover {
  background-color: #2f2f2f;
  border: none;
  color: red;
}
.ol-control .ol-zoom-in {
  border-radius: 50px 50px 0 0;
}
.ol-control .ol-zoom-out {
  border-radius: 0 0 50px 50px;
}
</style>
