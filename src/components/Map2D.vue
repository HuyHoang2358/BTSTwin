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

const mapContainer = ref(null);
const modelStore = useModelStore();

onMounted(() => {
  if (!mapContainer.value) return;

  // Tạo bản đồ
  modelStore.mapOl = new Map({
    target: mapContainer.value,
    layers: [googleSatelliteLayer, viettelLayer],
    view: new View({
      center: fromLonLat([107.48411048389792, 16.26963973530945]),
      zoom: 6,
    }),
  });
});
</script>
