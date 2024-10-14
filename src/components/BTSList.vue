<template>
  <div
    class="flex flex-col search-bts z-10 absolute p-3.5 top-[112px] rounded-sm left-3.5 w-[274px] bg-[#303030] max-h-[55%]"
  >
    <a-typography-text class="text-xs font-medium text-white">TRẠM BTS</a-typography-text>

    <!-- Searching -->
    <div class="mt-4 flex flex-row items-center gap-1">
      <a-input
        v-model:value="searchValue"
        placeholder="Tìm kiếm trạm"
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

    <!-- List -->
    <div
      v-if="isLoading && modelStore.stationsData.length === 0"
      class="h-[80px] flex flex-row items-center justify-center"
    >
      <a-spin :spinning="true" />
    </div>
    <div
      v-if="!isLoading"
      class="flex flex-col flex-1 overflow-auto mt-1 pr-2"
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
import { ref, watch } from 'vue';
import { fromLonLat, toLonLat } from 'ol/proj';
import { click } from 'ol/events/condition';
import { useModelStore } from '@/stores/model';
import { compareString } from '@/utils/helpers';
import { useStations } from '@/services/hooks/useStation';

import BTSItem from '@/components/BTSItem.vue';
import IconFilter from '@/components/icons/home/IconFilter.vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';

import { Feature, Overlay } from 'ol';
import { Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';
import { Select } from 'ol/interaction';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
const baseUrl = import.meta.env.VITE_BASE_URL;
const domain = baseUrl.slice(0, baseUrl.length - 5);
const modelStore = useModelStore();
const searchValue = ref<string>('');

// TODO: Fetch list of BTS stations
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
// TODO: Add BTS stations to map
watch([() => modelStore.mapOl, () => modelStore.stationsData], () => {
  if (modelStore.mapOl && modelStore.stationsData.length > 0) {
    // Tạo các điểm trạm BTS
    const features = modelStore.stationsData.map((item) => {
      return new Feature({
        geometry: new Point(
          fromLonLat([Number(item.location.longitude), Number(item.location.latitude)]),
        ), // Chuyển đổi tọa độ
        name: item.code, // Tên theo mã trạm
      });
    });

    // Tạo style mặc định cho marker
    const defaultStyle = new Style({
      image: new Icon({
        src: '/images/icons/bts.png',
        scale: 0.5,
      }),
    });

    // Tạo mới lớp vector chứa các marker trên
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

    // TODO: Click Event
    modelStore.mapOl.addInteraction(select);
    select.on('select', (e) => {
      window.triggerStationClick = true;
      const selectedFeatures = e.target.getFeatures();
      selectedFeatures.forEach((feature: Feature) => {
        const point = feature.getGeometry(); // Get location information
        modelStore.mapOl?.getView().fit(point, {
          duration: 500,
          minResolution: 5,
        }); // move to the location of the marker

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

    // TODO: Hover Event
    const infoOverlay = new Overlay({
      element: document.getElementById('station-info'), // Reference to the info box in the DOM
      positioning: 'bottom-center',
      offset: [0, -15],
    });
    modelStore.mapOl.addOverlay(infoOverlay);
    modelStore.mapOl.on('pointermove', (e) => {
      if (e.dragging) return; // Avoid hover during map drag
      if (modelStore.mapOl) {
        const pixel = modelStore.mapOl.getEventPixel(e.originalEvent);
        const feature = modelStore.mapOl.forEachFeatureAtPixel(pixel, (feature) => feature);

        // get coordinate lat, long
        const [longitude, latitude] = toLonLat(modelStore.mapOl.getCoordinateFromPixel(pixel));
        const latLngInfo = document.getElementById('lat-lng-info');
        if (latLngInfo) latLngInfo.innerText = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

        if (feature) {
          const coordinates = feature.getGeometry()?.getCoordinates();

          const infoBox = document.getElementById('station-info');
          const btsInfo = modelStore.stationsData.find((i) => i.code === feature.values_.name);
          if (infoBox && btsInfo) {
            infoBox.innerHTML = `
            <div class="flex justify-start gap-4">
              <div class="w-12 h-12 rounded bg-[#F2F2F2] flex justify-center items-center p-1">
                <img
                  src="${domain}${btsInfo?.pole_category?.icon}"
                  alt="icon"
                  class="w-full h-full"
                />
              </div>
              <div>
                <p class="m-0 font-semibold">Trạm ${btsInfo.name}</p>
                <p class="m-0">${btsInfo.address.province.name}</p>
              </div>
            </div>
            <div class="grid grid-cols-5 mt-4">
              <div class="col-span-2">
                <span>Mã cột:</span>
              </div>
              <div class="col-span-3">
                <span class="font-semibold">${btsInfo.code}</span>
              </div>
              <div class="col-span-2">
                <span>Tọa độ:</span>
              </div>
              <div class="col-span-3">
                <span class="font-semibold">${btsInfo.location.latitude}, ${btsInfo.location.longitude}</span>
              </div>
              <div class="col-span-2">
                <span>Vị trí xây dựng:</span>
              </div>
              <div class="col-span-3">
                <span class="font-semibold">${btsInfo.address.address_detail}</span>
              </div>

            </div>
          `;
            infoBox.style.display = 'inline-block';
            infoOverlay.setPosition(coordinates); // Show the overlay at marker location
          }

          // Change cursor to pointer
          modelStore.mapOl.getTargetElement().style.cursor = 'pointer';
        } else {
          // Reset cursor and overlay if not hovering
          modelStore.mapOl.getTargetElement().style.cursor = '';
          infoOverlay.setPosition(undefined); // Hide the info overlay

          // Reset all marker styles to default
          newVectorLayer
            .getSource()
            ?.getFeatures()
            .forEach((feature) => {
              feature.setStyle(defaultStyle);
            });
        }
      }
    });
  }
});

// TODO: Clear search value when change mode
watch(
  () => modelStore.is2DMode,
  () => {
    if (!modelStore.is2DMode) {
      searchValue.value = '';
    }
  },
);
</script>
