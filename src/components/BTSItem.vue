<template>
  <div class="flex flex-row items-center cursor-pointer mt-3">
    <div
      class="flex flex-row items-center"
      @click="ontoggleExpanded"
    >
      <IconExpanded :class="['mr-1', item.expanded && 'rotate-90']" />
      <!--      <IconBTS />-->
      <div class="w-6 h-8">
        <img
          :src="domain + item?.pole_category?.icon"
          alt="icon"
          class="w-full h-full"
        />
      </div>
    </div>

    <div class="flex flex-col w-full">
      <a-typography-title
        :level="3"
        style="color: #f6f6f6; font-size: 12px; margin-bottom: 4px"
        @click="ontoggleExpanded"
      >
        Trạm {{ item.name }}
      </a-typography-title>

      <a-typography-text
        v-if="!item.expanded"
        class="text-[#8c8c8c] text-xs"
        @click="ontoggleExpanded"
      >
        Quét {{ item.scans.length }} lần
      </a-typography-text>
      <a-button
        v-else
        :key="scanItem.id"
        v-for="scanItem in item.scans"
        class="flex flex-row items-center justify-between h-6 m-0 p-0 bg-transparent border-none"
        @click="onSelectedScanStation(scanItem.id)"
      >
        <a-typography style="color: #f6f6f6; font-size: 12px; margin-bottom: 0">
          {{ scanItem.date }}
        </a-typography>
        <IconTickGreen />
      </a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
/*import IconBTS from '@/components/icons/home/IconBTS.vue';*/
import IconExpanded from '@/components/icons/home/IconExpanded.vue';
import IconTickGreen from '@/components/icons/home/IconTickGreen.vue';

import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import { useRouter } from 'vue-router';
import { useModelStore } from '@/stores/model';
import { MODEL_3D_PAGE_PATH } from '@/router/routePath';
import type { Station } from '@/services/apis/station';
import View from 'ol/View';

const baseUrl = import.meta.env.VITE_BASE_URL;
const domain = baseUrl.slice(0, baseUrl.length - 5);

const props = defineProps<{
  item: Station;
}>();

const router = useRouter();
const modelStore = useModelStore();

// TODO: Trigger when user click on a scan station -> move to 3D page
const onSelectedScanStation = async (scanItemID: number) => {
  await router.push({
    path: MODEL_3D_PAGE_PATH,
    query: {
      id: scanItemID,
    },
  });
};

// TODO: Toggle expanded station
const ontoggleExpanded = async () => {
  // Handle for 3D mode
  if (!modelStore.is2DMode) {
    const assetId = Number(
      props.item.scans[0].models?.find((i) => i.type == 'las')?.file_path || '',
    );
    if (modelStore.mappingStationWithTileset[assetId])
      await window.cesiumViewer.zoomTo(modelStore.mappingStationWithTileset[assetId]);
  }

  // Handle for 2D mode
  if (!modelStore.isShowBTSInfo) {
    modelStore.isShowBTSInfo = true;
    // Move camera to the location of the marker
    const point = new Point(
      fromLonLat([Number(props.item.location.longitude), Number(props.item.location.latitude)]),
    );

    modelStore.mapOl?.getView().fit(point, {
      duration: 1000,
      minResolution: 5,
    });
  } else {
    modelStore.isShowBTSInfo = false;
    //
    const view = new View({
      center: fromLonLat([107.48411048389792, 16.26963973530945]),
      zoom: 6,
    });

    modelStore.mapOl?.setView(view);
  }

  // Save state to store
  modelStore.selectedBTS = modelStore.stationsData.find((i) => i.code === props.item.code);
  modelStore.stationsData = modelStore.stationsData.map((i) =>
    i.code === props.item.code ? { ...i, expanded: !i.expanded } : { ...i, expanded: false },
  );
};
</script>
