import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useModelStore = defineStore('model', () => {
  const is2DMode = ref<boolean>(true);
  const objectGroup = ref<any>({});
  const currentMeasurement = ref<any>();
  const measurements = ref<any[]>([]);
  const activeTool = ref();
  const selectedInventory = ref();
  const selectedImage = ref();
  const inventoryMetaData = ref<any>();
  const scale = ref<number>(1);
  const tranX = ref<number>(0);
  const tranY = ref<number>(0);

  const objectGroupArray = computed(() => Object.keys(objectGroup.value));

  return {
    objectGroup,
    objectGroupArray,
    currentMeasurement,
    measurements,
    activeTool,
    selectedInventory,
    selectedImage,
    inventoryMetaData,
    tranX,
    tranY,
    scale,
    is2DMode,
  };
});
