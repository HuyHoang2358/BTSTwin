<template>
  <div class="search-address absolute top-[68px] z-10 left-3.5 w-[274px]">
    <a-select
      v-model:value="state.value"
      label-in-value
      placeholder="Tìm kiếm địa điểm trên bản đồ"
      show-search
      style="width: 100%"
      :filter-option="false"
      :not-found-content="state.fetching ? undefined : null"
      :options="state.data"
      @search="fetchUser"
      @change="handleChange"
      allow-clear
    >
      <template
        v-if="state.fetching"
        #notFoundContent
      >
        <div class="flex flex-row items-center justify-center py-4">
          <a-spin size="small" />
        </div>
      </template>
    </a-select>
  </div>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue';
import { debounce } from 'lodash-es';
import { GeoJSON } from 'ol/format';
import { useModelStore } from '@/stores/model';
let lastFetchId = 0;

const modelStore = useModelStore();

const state = reactive({
  data: [],
  value: [],
  fetching: false,
});

const fetchUser = debounce((value) => {
  lastFetchId += 1;
  const fetchId = lastFetchId;
  state.data = [];
  state.fetching = true;
  fetch(
    `https://nominatim.openstreetmap.org/search.php?q=${value}&polygon_geojson=1&accept-language=vi%2Cen&format=jsonv2`,
  )
    .then((response) => response.json())
    .then((body) => {
      if (fetchId !== lastFetchId) {
        // for fetch callback order
        return;
      }
      const data = body.map((item) => ({
        label: item.display_name,
        value: item.osm_id?.toString(),
        ...item,
      }));
      state.data = data;
      state.fetching = false;
    });
}, 300);

watch(state.value, () => {
  state.data = [];
  state.fetching = false;
});

const handleChange = (value: any, option: any) => {
  if (!modelStore.vectorSource) {
    return;
  }

  modelStore.vectorSource.clear(); // Xóa các đối tượng cũ

  if (!value) {
    return;
  }

  let geoJsonFeature;
  if (option.geojson) {
    geoJsonFeature = {
      type: 'Feature',
      geometry: {
        type: option.geojson.type,
        coordinates: option.geojson.coordinates,
      },
      properties: {
        name: option.label,
      },
    };

    // Thêm feature mới vào vectorSource
    modelStore.vectorSource.addFeature(
      new GeoJSON().readFeatures(geoJsonFeature, { featureProjection: 'EPSG:3857' })[0],
    );

    // Fit map view to the new feature
    const extent = modelStore.vectorSource.getExtent();
    modelStore.mapOl?.getView().fit(extent, { duration: 500 });
  } else {
    console.error('Dữ liệu không hợp lệ');
  }
};
</script>
