<template>
  <div
    class="flex flex-col search-bts z-10 absolute p-3.5 top-[112px] rounded-sm left-3.5 w-[274px] bg-[#303030] max-h-[55%]"
  >
    <a-typography-text class="text-xs font-medium text-white">Trạm BTS</a-typography-text>
    <div class="mt-4 flex flex-row items-center gap-1">
      <a-input
        placeholder="Tìm kiếm vị trí trên bản đồ"
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
    <div class="flex flex-col flex-1 overflow-auto mt-1 pr-2">
      <BTSItem
        v-for="item in modelStore.btsData"
        :key="item.station"
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
import { useBTS } from '@/services/hooks/useBTS';
import type { StationItems } from '@/services/apis/bts';
import { useModelStore } from '@/stores/model';
import VectorLayer from 'ol/layer/Vector';
import { Feature } from 'ol';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { Icon, Style } from 'ol/style';
import { click } from 'ol/events/condition';
import { Select } from 'ol/interaction';

const { data } = useBTS();
const modelStore = useModelStore();

interface Accumulator {
  [station: string]: StationItems;
}

watch(data, () => {
  const transformedData = data.value?.data?.reduce((acc: Accumulator, item) => {
    if (!acc[item.station]) {
      acc[item.station] = {
        station: item.station,
        expanded: false,
        items: [],
      };
    }
    // Xóa các thuộc tính không cần thiết trước khi thêm vào mảng items
    const { station, ...rest } = item;
    acc[item.station].items.push(rest);
    return acc;
  }, {});

  modelStore.btsData = transformedData ? Object.values(transformedData) : [];
});

watch([() => modelStore.mapOl, () => modelStore.btsData], () => {
  if (modelStore.mapOl && modelStore.btsData.length > 0) {
    const vectorLayer = modelStore.mapOl
      .getLayers()
      .getArray()
      .find((layer) => layer instanceof VectorLayer);

    if (!vectorLayer) {
      const features = modelStore.btsData.map((item) => {
        return new Feature({
          geometry: new Point(fromLonLat([item.items[0].geom.x, item.items[0].geom.y])), // Chuyển đổi tọa độ
          name: item.station,
        });
      });

      // Nếu lớp vector chưa tồn tại, tạo mới
      const newVectorLayer = new VectorLayer({
        source: new VectorSource({
          features,
        }),
        style: new Style({
          image: new Icon({
            src: '/images/icons/bts.png', // Đường dẫn đến icon của bạn
            scale: 0.5, // Thay đổi kích thước icon nếu cần
          }),
        }),
      });

      modelStore.mapOl.addLayer(newVectorLayer);

      // Thêm sự kiện click cho marker
      const select = new Select({
        condition: click,
        layers: [newVectorLayer], // Chọn lớp marker
      });

      modelStore.mapOl.addInteraction(select);

      select.on('select', (e) => {
        const selectedFeatures = e.target.getFeatures();
        selectedFeatures.forEach((feature: any) => {
          const point = feature.getGeometry();
          modelStore.mapOl?.getView().fit(point, {
            duration: 500,
            minResolution: 5,
          });

          modelStore.btsData = modelStore.btsData.map((i) =>
            i.station === feature.values_.name
              ? { ...i, expanded: !i.expanded }
              : { ...i, expanded: false },
          );
        });
      });
    }
  }
});

const searchValue = ref<string>('');
</script>
