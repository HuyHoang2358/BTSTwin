import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import Map from 'ol/Map';
import type { Image2D, StationItems } from '@/services/apis/bts';
import type { InventoryDetail } from '@/potree/hooks/useInitial';
import { Cesium3DTileset } from 'cesium';
import type { Station } from '@/services/apis/station';

export const useModelStore = defineStore('model', () => {
  const mapOl = ref<Map>();
  const is2DMode = ref<boolean>(true);
  const objectGroup = ref<Record<string, InventoryDetail[]>>();
  const newInventories = ref<any>([]);
  const currentMeasurement = ref<any>();
  const measurements = ref<any[]>([]);
  const activeTool = ref();
  const selectedInventory = ref<InventoryDetail>();
  const selectedImage = ref<Image2D>();
  const scale = ref<number>(1);
  const tranX = ref<number>(0);
  const tranY = ref<number>(0);
  const hoverInformation = ref('');
  const btsData = ref<StationItems[]>([]);
  const openModalAddInventory = ref<boolean>(false);
  const loadingModel = ref<boolean>(true);
  const potreeVolumes = ref<any[]>([]);
  const windyLayerVisible = ref(false);
  const isShowBTSInfo = ref(false);
  const selectedBTS = ref<Station>();
  const mappingStationWithTileset = ref<Record<number, Cesium3DTileset>>({});

  // Hoangth33
  const stationsData = ref<Station[]>([]);

  const objectGroupArray = computed(() =>
    objectGroup.value ? Object.keys(objectGroup.value) : [],
  );

  return {
    objectGroup,
    objectGroupArray,
    currentMeasurement,
    measurements,
    activeTool,
    selectedInventory,
    selectedImage,
    tranX,
    tranY,
    scale,
    is2DMode,
    mapOl,
    hoverInformation,
    btsData,
    openModalAddInventory,
    loadingModel,
    newInventories,
    potreeVolumes,
    windyLayerVisible,
    isShowBTSInfo,
    selectedBTS,
    mappingStationWithTileset,
    stationsData,
  };
});
