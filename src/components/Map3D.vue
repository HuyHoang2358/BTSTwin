<template>
  <div
    id="cesiumContainer"
    class="w-full h-full"
  />
  <div
    class="absolute inset-0 flex items-center justify-center z-10"
    v-if="loading"
  >
    <div class="loader" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { useModelStore } from '@/stores/model';

const modelStore = useModelStore();
const loading = ref(true);

onMounted(async () => {
  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZGE1ZjFkMi1lODkzLTQ1NDgtYWRjZi04OTA2Y2Y5MTRlNTciLCJpZCI6MjM5NDgyLCJpYXQiOjE3MjU1ODc3NjZ9.imrKQey9J0KQ5LbbJviN94MQHzTqr7vZUMJ3h4EX0T0';

  window.cesiumViewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: await Cesium.CesiumTerrainProvider.fromIonAssetId(1),
    baseLayerPicker: false, // remove button baseLayerPicker
    vrButton: false, // remove button view by VR mode
    geocoder: false,
    navigationHelpButton: false,
    // terrain: Terrain.fromWorldTerrain({
    //   // requestWaterMask: true, // Request to server get water tile
    //   // requestVertexNormals: true,
    // }),
    shadows: false,
    timeline: false,
    sceneModePicker: false, // type show map
    animation: false,
    fullscreenButton: false,
    homeButton: false,
    infoBox: false,
    selectionIndicator: false,
    navigationInstructionsInitiallyVisible: false,
    // baseLayer: false,
    contextOptions: {
      webgl: {
        preserveDrawingBuffer: true,
      },
    },
  });
  window.cesiumViewer.scene.globe.depthTestAgainstTerrain = true;

  if (modelStore.stationsData.length === 0) return;

  const assetIds: number[] = [];

  for (const item of modelStore.stationsData) {
    const firstItem = item.scans[0];
    const assetId = Number(firstItem.models.find((i) => i.type == 'las')?.file_path || '');
    assetId && assetIds.push(assetId);
  }

  if (assetIds.length === 0) return;

  try {
    for (const id of assetIds) {
      const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(id);
      window.cesiumViewer.scene.primitives.add(tileset);
      const extras = tileset.asset.extras;
      if (
        Cesium.defined(extras) &&
        Cesium.defined(extras.ion) &&
        Cesium.defined(extras.ion.defaultStyle)
      ) {
        tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
      }

      modelStore.mappingStationWithTileset = {
        ...modelStore.mappingStationWithTileset,
        [id]: tileset,
      };
    }

    const firstAssetId = assetIds[0];
    await window.cesiumViewer.zoomTo(modelStore.mappingStationWithTileset[firstAssetId]);
    modelStore.stationsData = modelStore.stationsData.map((i) =>
      Number(i.scans[0].models.find((i) => i.type == 'las') || '') === firstAssetId
        ? { ...i, expanded: true }
        : { ...i, expanded: false },
    );
    loading.value = false;
  } catch (error) {
    console.error(error);
  }
});
</script>

<style>
#cesiumContainer {
  width: 100vw;
  height: 100vh;
}
</style>
