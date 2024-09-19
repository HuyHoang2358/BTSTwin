<template>
  <div
    id="cesiumContainer"
    class="w-full h-full"
  />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

onMounted(async () => {
  Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZGE1ZjFkMi1lODkzLTQ1NDgtYWRjZi04OTA2Y2Y5MTRlNTciLCJpZCI6MjM5NDgyLCJpYXQiOjE3MjU1ODc3NjZ9.imrKQey9J0KQ5LbbJviN94MQHzTqr7vZUMJ3h4EX0T0';

  const viewer = new Cesium.Viewer('cesiumContainer', {
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
  viewer.scene.globe.depthTestAgainstTerrain = true;

  try {
    const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2736511);
    viewer.scene.primitives.add(tileset);
    await viewer.zoomTo(tileset);

    const extras = tileset.asset.extras;
    if (
      Cesium.defined(extras) &&
      Cesium.defined(extras.ion) &&
      Cesium.defined(extras.ion.defaultStyle)
    ) {
      tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
    }
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
