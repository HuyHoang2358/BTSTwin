<template>
  <div
    class="flex flex-col search-bts z-10 absolute p-3.5 top-[112px] rounded-sm left-3.5 w-[274px] bg-[#303030] max-h-[55%]"
  >
    <a-typography-text class="text-xs font-medium text-white">Trạm BTS</a-typography-text>
    <div class="mt-4 flex flex-row items-center gap-1">
      <a-input
        placeholder="Tìm kiếm trạm"
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
    <div
      v-if="isLoading && modelStore.stationsData.length === 0"
      class="h-[80px] flex flex-row items-center justify-center"
    >
      <a-spin :spinning="true"></a-spin>
    </div>
    <div
      class="flex flex-col flex-1 overflow-auto mt-1 pr-2"
      v-if="!isLoading"
    >
      <BTSItem
        v-for="item in modelStore.stationsData.filter((i) =>
          compareString(`tram ${i.code}`, searchValue),
        )"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import { ref, watch } from 'vue';
import BTSItem from '@/components/BTSItem.vue';
import IconFilter from '@/components/icons/home/IconFilter.vue';
import { useStations } from '@/services/hooks/useStation';
import { useModelStore } from '@/stores/model';
import VectorLayer from 'ol/layer/Vector';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import { click } from 'ol/events/condition';
import { Select } from 'ol/interaction';
import { compareString } from '@/utils/helpers';

const modelStore = useModelStore();
const { data, isLoading } = useStations();

watch(data, () => {
  modelStore.stationsData =
    data.value?.data?.map((i) => {
      return {
        ...i,
        expanded: false,
      };
    }) || [];
});

watch([() => modelStore.mapOl, () => modelStore.stationsData], () => {
  if (modelStore.mapOl && modelStore.stationsData.length > 0) {
    const features = modelStore.stationsData.map((item) => {
      return new Feature({
        geometry: new Point(
          fromLonLat([Number(item.location.longitude), Number(item.location.latitude)]),
        ), // Chuyển đổi tọa độ
        name: item.code,
      });
    });

    // Thêm tương tác hover
    const defaultStyle = new Style({
      image: new Icon({
        src: '/images/icons/bts.png',
        scale: 0.5,
      }),
    });

    // Nếu lớp vector chưa tồn tại, tạo mới
    const newVectorLayer = new VectorLayer({
      source: new VectorSource({
        features,
      }),
      style: defaultStyle,
    });

    modelStore.mapOl.addLayer(newVectorLayer);

    // Thêm sự kiện click cho marker
    const select = new Select({
      condition: click,
      layers: [newVectorLayer], // Chọn lớp marker
    });

    modelStore.mapOl.addInteraction(select);

    select.on('select', (e) => {
      window.triggerStationClick = true;
      const selectedFeatures = e.target.getFeatures();
      selectedFeatures.forEach((feature: any) => {
        const point = feature.getGeometry();
        modelStore.mapOl?.getView().fit(point, {
          duration: 500,
          minResolution: 5,
        });

        modelStore.stationsData = modelStore.stationsData.map((i) =>
          i.code === feature.values_.name ? { ...i, expanded: true } : { ...i, expanded: false },
        );
      });
      const overlay = modelStore.mapOl?.getOverlays().getArray()[0];
      const closer = document.getElementById('popup-closer');
      if (!closer || !overlay) return;
      overlay.setPosition(undefined);
      closer.blur();

      if (e.selected.length === 0) {
        modelStore.isShowBTSInfo = false;
      } else {
        modelStore.isShowBTSInfo = true;

        modelStore.selectedBTS = modelStore.stationsData.find(
          (i) => i.code === e.selected[0].values_.name,
        );
      }
    });
  }
});

const searchValue = ref<string>('');

watch(
  () => modelStore.is2DMode,
  () => {
    if (!modelStore.is2DMode) {
      searchValue.value = '';
    }
  },
);
</script>
