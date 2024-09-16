import { defineStore } from 'pinia';
import type { OptionType } from '@/DTP/libs/dtp.types';
import { computed, ref } from 'vue';
import { ImageryLayer } from 'cesium';
import type { Layer } from '@/services/apis/layer';

export const useLayerStore = defineStore('layerStore', () => {
  // state define ------------------------------------------------------------------------------------------------------
  const baseImageryLayers = ref<Map<number, ImageryLayer>>(new Map());
  const infoImageryLayers = ref<Map<number, ImageryLayer>>(new Map());
  const imageryLayers = ref<Map<number, ImageryLayer>>(new Map());
  const layers = ref<Layer[]>([]);
  const resolutionOptions = ref<OptionType[]>([]);
  const selectingResolution = ref<string>('');
  const layersDisplayed = ref<Layer[]>([]);
  const selectedBaseLayerId = ref();
  const selectedBaseLayerName = ref();
  const isShowLayersDisplayed = computed(() => layersDisplayed.value.length !== 0);

  const imageryLayersArray = computed(() => Array.from(imageryLayers.value));
  const baseImageryLayersArray = computed(() => Array.from(baseImageryLayers.value));
  const infoImageryLayersArray = computed(() => Array.from(infoImageryLayers.value));

  // action define -----------------------------------------------------------------------------------------------------
  const layerPeriodOptions = computed(() =>
    layers.value
      .filter((item) => item.resolution === selectingResolution.value)
      .map((layer) => ({
        ...layer,
        label: layer.name,
        value: layer.id?.toString(),
      })),
  );

  const setSelectingResolution = (newValue: string) => {
    selectingResolution.value = newValue;
  };

  const getLayerInfoById = (id: number) => {
    return layers.value.find((layer) => layer.id === id);
  };

  function showLayersDisplayed(item: Layer) {
    layersDisplayed.value = layersDisplayed.value.concat([item]);
  }

  function removeLayerDisplayed(layerId: number) {
    layersDisplayed.value = layersDisplayed.value.filter((i) => i.id !== layerId);
  }

  function removeAllLayerDisplayed() {
    layersDisplayed.value = [];
  }

  return {
    imageryLayers,
    layers,
    layerPeriodOptions,
    resolutionOptions,
    setSelectingResolution,
    selectingResolution,
    getLayerInfoById,
    baseImageryLayers,
    imageryLayersArray,
    layersDisplayed,
    isShowLayersDisplayed,
    showLayersDisplayed,
    removeLayerDisplayed,
    removeAllLayerDisplayed,
    baseImageryLayersArray,
    selectedBaseLayerId,
    selectedBaseLayerName,
    infoImageryLayers,
    infoImageryLayersArray,
  };
});
