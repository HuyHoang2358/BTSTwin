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
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZDIzMjBlNi05MTE1LTQ5NDgtYjI0OC0zNDViYTI0ZmI3MDQiLCJpZCI6MTgxOTA4LCJpYXQiOjE3MDE0MTU1NDF9.DtW0mm1U-qaC0uXMGeWY9lwEL-4whtaBAqVr5bfAiz4';

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
    const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2716355);
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
