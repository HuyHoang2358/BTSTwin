<template>
  <div
    ref="mapContainer"
    class="w-full h-full"
  />
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { XYZ } from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import View from 'ol/View';
import Select from 'ol/interaction/Select';
import { click } from 'ol/events/condition';
import { MODEL_3D_PAGE_PATH } from '@/router/routePath';
import { useModelStore } from '@/stores/model';
import { useRouter } from 'vue-router';

const mapContainer = ref(null);
const router = useRouter();

onMounted(() => {
  if (!mapContainer.value) return;

  // Tạo bản đồ
  const map = new Map({
    target: mapContainer.value,
    layers: [
      new TileLayer({
        source: new XYZ({
          url: 'https://api-maps.viettel.vn/gateway/mapservice/v1/styles/vtmap/{z}/{x}/{y}.png?access_token=4474ace29cd4d4fa14847303d2a6d6f0',
        }),
      }),
      // Thêm lớp marker
      new VectorLayer({
        source: new VectorSource({
          features: [
            new Feature({
              geometry: new Point(fromLonLat([-77.0364, 38.8951])), // Chuyển đổi tọa độ
              name: 'Marker',
            }),
          ],
        }),
        style: new Style({
          image: new Icon({
            src: '/images/icons/bts.jpg', // Đường dẫn đến icon của bạn
            scale: 0.1, // Thay đổi kích thước icon nếu cần
          }),
        }),
      }),
    ],
    view: new View({
      center: [0, 0],
      zoom: 2,
    }),
  });

  // Thêm sự kiện click cho marker
  const select = new Select({
    condition: click,
    layers: [map.getLayers().item(1)], // Chọn lớp marker
  });

  map.addInteraction(select);

  select.on('select', (e) => {
    const feature = e.selected[0];
    if (feature) {
      router.push(MODEL_3D_PAGE_PATH);
    }
  });
});
</script>
