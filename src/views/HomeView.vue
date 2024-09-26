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
          href="#"
          id="popup-closer"
          class="ol-popup-closer"
        ></a>
        <div id="popup-content"></div>
      </div>

      <Search />

      <BTSList />

      <BTSInfo />

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

      <div class="flex flex-row items-center gap-x-1 absolute z-10 bottom-3 right-4">
        <div
          v-if="modelStore.windyLayerVisible"
          class="flex flex-row gap-1"
        >
          <div
            v-for="item in dataWindy?.data?.data || []"
            :key="item.id"
            :style="{ background: item.color }"
            class="flex w-6 h-6 rounded-full text-center items-center justify-center"
          >
            {{ item.name }}
          </div>
        </div>
        <a-tooltip
          title="Bản đồ vùng gió"
          placement="top"
          color="#212121"
        >
          <a-button
            class="w-[54px] h-[54px] bg-transparent m-0 p-0 border-none"
            @click="toggleWindRegionLayer"
          >
            <a-image
              :width="54"
              :height="54"
              src="/images/icons/windy.jpg"
              class="object-contain rounded-full"
              :preview="false"
              alt="layer"
            />
          </a-button>
        </a-tooltip>
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
import BTSInfo from '@/components/BTSInfo.vue';
import { useWindyAreas } from '@/services/hooks/useWindyArea';
import { maxPageSize } from '@/utils/constants';

const current = shallowRef(Map2D);
const isViettelLayer = ref(true);

const modelStore = useModelStore();

const { data: dataWindy } = useWindyAreas({
  perPage: ref(maxPageSize),
});

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

const onToggleBaseLayer = () => {
  const map = modelStore.mapOl;
  if (!map) return;

  const layers = map.getLayers().getArray();

  if (isViettelLayer.value) {
    layers[0].setVisible(true);
    layers[1].setVisible(false);
  } else {
    layers[0].setVisible(false);
    layers[1].setVisible(true);
  }

  isViettelLayer.value = !isViettelLayer.value;
};

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
</style>
