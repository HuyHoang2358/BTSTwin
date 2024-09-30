import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import Map from 'ol/Map';
import type { StationItems } from '@/services/apis/bts';
import type { InventoryDetail } from '@/potree/hooks/useInitial';
import { Cesium3DTileset } from 'cesium';
import type VectorSource from 'ol/source/Vector';
import { Mesh } from 'three';
import { heightBasePlate, widthBasePlate } from '@/utils/constants';
import type { Device, Image, Pole, Station } from '@/services/apis/station';

export const useModelStore = defineStore('model', () => {
  const mapOl = ref<Map>();
  const is2DMode = ref<boolean>(true);
  const objectGroup = ref<Record<string, InventoryDetail[]>>();
  const newInventories = ref<any>([]);
  const currentMeasurement = ref<any>();
  const measurements = ref<any[]>([]);
  const activeTool = ref();
  const selectedInventory = ref<Device>();
  const selectedPole = ref<Pole>();
  const selectedImage = ref<Image>();
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
  const vectorSource = ref<VectorSource>();
  const basePlate = ref<Mesh>();
  const isSelectedBasePlate = ref(false);
  const selectedBTS = ref<Station>();
  const mappingStationWithTileset = ref<Record<number, Cesium3DTileset>>({});
  const positionValue = ref<number>(0);
  const widthBasePlateValue = ref<number>(widthBasePlate);
  const heightBasePlateValue = ref<number>(heightBasePlate);
  const zPlaneHistory = ref(0);
  const poles = ref<Pole[]>([]);
  const images = ref<Image[]>([]);

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
    vectorSource,
    selectedPole,
    basePlate,
    isSelectedBasePlate,
    positionValue,
    widthBasePlateValue,
    heightBasePlateValue,
    zPlaneHistory,
    stationsData,
    poles,
    images,
  };
});
