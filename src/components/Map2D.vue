<template>
  <div
    ref="mapContainer"
    class="w-full h-full"
  />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Map from 'ol/Map';
import View from 'ol/View';
import { useModelStore } from '@/stores/model';
import { googleSatelliteLayer, viettelLayer } from '@/utils/constants';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import { TileWMS } from 'ol/source';
import { Overlay } from 'ol';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

const mapContainer = ref(null);
const modelStore = useModelStore();

onMounted(() => {
  const container = document.getElementById('popup');
  const content = document.getElementById('popup-content');
  const closer = document.getElementById('popup-closer');

  if (!container || !closer) return;

  closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

  const overlay = new Overlay({
    element: container,
    autoPan: {
      animation: {
        duration: 250,
      },
    },
  });

  if (!mapContainer.value) return;

  const wmsSource = new TileWMS({
    url: 'https://geoserver.viettelai.vn/geoserver/vspace/wms',
    params: {
      LAYERS: 'vspace:BD Vung gio Viet Nam',
      TILED: true,
    },
    serverType: 'geoserver',
    crossOrigin: 'anonymous',
  });

  const windyLayer = new TileLayer({
    source: wmsSource,
    visible: modelStore.windyLayerVisible,
  });

  const view = new View({
    center: fromLonLat([107.48411048389792, 16.26963973530945]),
    zoom: 6,
  });

  const vectorSource = new VectorSource();
  const vectorLayer = new VectorLayer({
    source: vectorSource,
  });

  modelStore.vectorSource = vectorSource;

  modelStore.mapOl = new Map({
    target: mapContainer.value,
    layers: [googleSatelliteLayer, viettelLayer, windyLayer, vectorLayer],
    view,
    overlays: [overlay],
  });

  modelStore.mapOl.on('singleclick', function (evt) {
    const modelStore = useModelStore();
    if (window.triggerStationClick) {
      window.triggerStationClick = false;
      return;
    }

    if (!modelStore.windyLayerVisible) return;
    if (!modelStore.is2DMode) return;

    const viewResolution = view.getResolution();
    if (!viewResolution) return;
    const url = wmsSource.getFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:3857', {
      INFO_FORMAT: 'application/json',
      QUERY_LAYERS: 'vspace:shapefile_gio_v1',
    });

    if (!url) return;

    fetch(url)
      .then((response) => response.json())
      .then((res) => {
        if (res.numberReturned === 0) {
          overlay.setPosition(undefined);
          closer.blur();
          return;
        }

        const coordinate = evt.coordinate;

        if (!content) return;

        const properties = res.features[0].properties;

        content.innerHTML = `<div>
                                   <p class="font-medium">Thông tin vùng gió</p>
                                   <p class="text-sm">${properties.tenxa || ''}, ${properties.tenhuyen}, ${properties.tentinh}</p>
                                   <p class="text-sm">Vùng gió: ${properties.vunggio}</p>
                                </div>`;
        overlay.setPosition(coordinate);
      });
  });
});
</script>
