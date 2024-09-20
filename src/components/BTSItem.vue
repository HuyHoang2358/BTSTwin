<template>
  <div class="flex flex-row items-start cursor-pointer mt-3">
    <div
      class="flex flex-row items-center"
      @click="ontoggleExpanded"
    >
      <IconExpanded :class="['mr-1', item.expanded && 'rotate-90']" />
      <IconBTS />
    </div>
    <div class="flex flex-col w-full">
      <a-typography-title
        :level="3"
        style="color: #f6f6f6; font-size: 12px; margin-bottom: 4px"
        @click="ontoggleExpanded"
      >
        Trạm {{ item.station }}
      </a-typography-title>
      <a-typography-text
        v-if="!item.expanded"
        class="text-[#8c8c8c] text-xs"
        @click="ontoggleExpanded"
      >
        Quét {{ item.items.length }} lần
      </a-typography-text>
      <a-button
        v-else
        :key="scanItem.id"
        v-for="scanItem in item.items"
        class="flex flex-row items-center justify-between h-6 m-0 p-0 bg-transparent border-none"
        @click="onSelectedScanStation(scanItem)"
      >
        <a-typography style="color: #f6f6f6; font-size: 12px; margin-bottom: 0">
          {{ scanItem.createdAt }}
        </a-typography>
        <IconTickGreen />
      </a-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import IconExpanded from '@/components/icons/home/IconExpanded.vue';
import IconBTS from '@/components/icons/home/IconBTS.vue';
import IconTickGreen from '@/components/icons/home/IconTickGreen.vue';
import type { Bts, StationItems } from '@/services/apis/bts';
import { useRouter } from 'vue-router';
import { MODEL_3D_PAGE_PATH } from '@/router/routePath';
import { useModelStore } from '@/stores/model';

const props = defineProps<{
  item: StationItems;
}>();

const router = useRouter();
const modelStore = useModelStore();

const onSelectedScanStation = async (scanItem: Omit<Bts, 'station'>) => {
  await router.push({
    path: MODEL_3D_PAGE_PATH,
    query: {
      id: scanItem.id,
    },
  });
};

const ontoggleExpanded = async () => {
  if (!modelStore.is2DMode && modelStore.mappingStationWithTileset[props.item.items[0].assetId]) {
    await window.cesiumViewer.zoomTo(
      modelStore.mappingStationWithTileset[props.item.items[0].assetId],
    );
  }
  modelStore.btsData = modelStore.btsData.map((i) =>
    i.station === props.item.station ? { ...i, expanded: !i.expanded } : { ...i, expanded: false },
  );
};
</script>
