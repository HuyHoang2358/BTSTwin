<template>
  <div
    class="flex h-screen w-screen dark-form overflow-hidden"
    ref="container"
  >
    <LeftMenu />
    <div
      class="overflow-auto h-full flex flex-col relative"
      :style="{ flex: pane1Size + ' 0 0' }"
      ref="pane1"
    >
      <div
        id="potree_render_area"
        @click="onPointerClick"
        @mousedown="onPointerDown"
        @mousemove="onPointerMove"
        class="w-full h-full relative"
      ></div>
      <MeasurementTool class="absolute top-[82px] right-6 z-10" />
      <BottomTool class="absolute bottom-4 left-4 z-10" />
    </div>
    <div
      @mousedown="startResize"
      v-if="modelStore.selectedImage"
      class="bg-[#101010] flex flex-col justify-center items-center relative hover:bg-blue-600 w-1.5 cursor-ew-resize h-full"
    >
      <div class="absolute bg-[#212121] w-6 h-6 z-10 rounded rotate-90">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          <path
            fill="white"
            d="M12 5.83 15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83Zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17Z"
          ></path>
        </svg>
      </div>
    </div>
    <div
      class="overflow-auto h-full flex flex-col bg-[#212121]"
      :style="{ flex: 100 - pane1Size + ' 0 0' }"
      v-if="modelStore.selectedImage"
    >
      <ListImages />
    </div>
    <Suggestion v-if="!modelStore.selectedImage && !modelStore.selectedInventory" />
    <Information v-else />
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import * as THREE from 'three';
import ListImages from '@/components/ListImages.vue';
import MeasurementTool from '@/components/MeasurementTool.vue';
import { useModelStore } from '@/stores/model';
import { useInitial } from '@/potree/hooks/useInitial';
import Suggestion from '@/components/Suggestion.vue';
import BottomTool from '@/components/BottomTool.vue';
import Information from '@/components/Information.vue';
import LeftMenu from '@/components/LeftMenu.vue';
import { useChangeImage } from '@/potree/hooks/useChangeImage';

const pane1Size = ref(50);
const container = ref(null);

const modelStore = useModelStore();
let startX = 0;
let startPane1Size = 0;
const raycaster = new THREE.Raycaster();
const INTERSECTED = ref();

const startResize = (event: any) => {
  event.preventDefault();
  startX = event.clientX;
  startPane1Size = pane1Size.value;

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', stopResize);
};

const onMouseMove = (event: any) => {
  if (container.value) {
    const deltaX = event.clientX - startX;
    const containerWidth = container.value.offsetWidth;
    const newPane1Size = startPane1Size + (deltaX / containerWidth) * 100;

    pane1Size.value = Math.max(10, Math.min(90, newPane1Size));
  }
};

const stopResize = () => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', stopResize);
};

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', stopResize);
});

const isDragging = ref(false);

const onPointerDown = () => {
  isDragging.value = false;
};

const { onChangeImage } = useChangeImage();

const onPointerClick = (evt: any) => {
  if (isDragging.value) return;

  if (
    modelStore.activeTool === 'angle' ||
    modelStore.activeTool === 'distance' ||
    modelStore.activeTool === 'area' ||
    modelStore.activeTool === 'circle' ||
    modelStore.activeTool === 'azimuth' ||
    modelStore.activeTool === 'annotation'
  ) {
    return;
  }
  if (evt.button !== 0) return;
  const viewer = window.potreeViewer;
  evt.preventDefault();
  const rect = viewer.renderer.domElement.getBoundingClientRect();
  const [x, y] = [evt.clientX, evt.clientY];
  const array = [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
  const onClickPosition = new THREE.Vector2(...array);
  const camera = viewer.scene.getActiveCamera();
  const mouse = new THREE.Vector3(onClickPosition.x * 2 - 1, -(onClickPosition.y * 2) + 1);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(viewer.scene.scene.children, true);

  if (intersects.length > 0) {
    const targetObject = intersects[0].object;
    if (targetObject.userData.key && targetObject.userData.type === 'camera_pose') {
      onChangeImage(targetObject.userData.key);
    } else if (targetObject.userData.type === 'inventory') {
      const cameraPose = targetObject.userData?.object?.camera_pose;
      if (cameraPose) {
        onChangeImage(cameraPose);
      }
    }
  } else {
    modelStore.selectedImage = null;
    modelStore.currentMeasurement = null;
    modelStore.selectedInventory = null;
  }
};

const onPointerMove = (evt: any) => {
  isDragging.value = true;

  if (
    modelStore.activeTool === 'angle' ||
    modelStore.activeTool === 'distance' ||
    modelStore.activeTool === 'area' ||
    modelStore.activeTool === 'circle' ||
    modelStore.activeTool === 'azimuth' ||
    modelStore.activeTool === 'annotation'
  ) {
    return;
  }
  const viewer = window.potreeViewer;
  evt.preventDefault();
  const rect = viewer.renderer.domElement.getBoundingClientRect();
  const [x, y] = [evt.clientX, evt.clientY];
  const array = [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
  const onClickPosition = new THREE.Vector2(...array);
  const camera = viewer.scene.getActiveCamera();
  const mouse = new THREE.Vector3(onClickPosition.x * 2 - 1, -(onClickPosition.y * 2) + 1);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(viewer.scene.scene.children, true);

  if (intersects.length > 0) {
    const targetObject = intersects[0].object;
    if (targetObject.userData.type === 'camera_pose') {
      if (INTERSECTED.value !== targetObject) {
        if (INTERSECTED.value) {
          INTERSECTED.value.material.color.setHex(INTERSECTED.value.currentColor);
        }

        INTERSECTED.value = targetObject;
        INTERSECTED.value.currentColor = targetObject.material.color.getHex();
        INTERSECTED.value.material.color.setHex(0xffffff);
      }
    } else {
      if (INTERSECTED.value !== targetObject) {
        if (INTERSECTED.value) {
          INTERSECTED.value.material.color.setHex(INTERSECTED.value.currentColor);
        }

        INTERSECTED.value = targetObject;
        INTERSECTED.value.currentColor = targetObject.material.color.getHex();
        INTERSECTED.value.material.color.setHex(0x6fe3a6);
      }
    }
  } else {
    if (INTERSECTED.value) INTERSECTED.value.material.color.setHex(INTERSECTED.value.currentColor);

    INTERSECTED.value = null;
  }
};

useInitial();
</script>
