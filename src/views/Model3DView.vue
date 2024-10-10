<template>
  <a-config-provider
    :locale="viVN"
    :theme="{
      token: {
        colorPrimary: '#D0002D',
      },
      algorithm: theme.darkAlgorithm,
    }"
  >
    <div class="flex flex-col h-screen w-screen overflow-hidden">
      <HeaderHome />

      <!-- breadcrumb -->
      <div
        class="bg-[#212121] flex items-center pb-2 mt-[-2px]"
        style="border-bottom: 1px solid #353535"
      >
        <a-button
          class="m-0 p-0 w-6 h-6 bg-transparent border-none ml-2"
          @click="router.push(HOME_PAGE_PATH)"
        >
          <IconHome />
        </a-button>
        <a-typography-text
          style="color: #f6f6f6; font-size: 14px; margin-bottom: 0"
          class="ml-4"
          v-if="scanInfo?.data?.name"
        >
          Trạm {{ scanInfo?.data?.name }}
        </a-typography-text>
        <IconTickGreen
          class="ml-1"
          v-if="scanInfo?.data?.name"
        />
      </div>

      <div
        ref="container"
        class="flex flex-1 flex-row"
      >
        <LeftMenu />

        <!-- Right tool -->
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
            @contextmenu.prevent="onRightClick"
            class="flex relative"
          />
          <MeasurementTool class="absolute top-[24px] right-4 z-10" />
          <BottomTool />

          <div
            class="absolute inset-0 flex items-center justify-center z-10"
            v-if="modelStore.loadingModel"
          >
            <div class="loader" />
          </div>
          <transition name="fade">
            <div
              v-if="!!modelStore.hoverInformation"
              class="absolute top-4 left-4 z-10 bg-white flex flex-row items-center p-2 rounded-[15px]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
                focusable="false"
              >
                <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm1 11H7V7h2v5Zm0-6H7V4h2v2Z"></path>
              </svg>
              <a-typography-text class="text-[#303030] pl-2 text-xs">
                {{ modelStore.hoverInformation }}
              </a-typography-text>
            </div>
          </transition>
        </div>

        <!-- Resize button -->
        <div
          @mousedown="startResize"
          v-if="modelStore.selectedImage"
          class="bg-[#101010] flex flex-col justify-center items-center relative hover:bg-blue-600 w-1.5 cursor-ew-resize h-full"
        >
          <div class="absolute bg-[#212121] w-6 h-6 z-10 rounded rotate-90">
            <icon-resize-width />
          </div>
        </div>

        <Information :pane1-size="pane1Size" />
      </div>
    </div>
    <ModalAddInventory />
  </a-config-provider>
</template>

<script setup lang="ts">
// TODO: Import libraries
import { theme } from 'ant-design-vue';
import { computed, onUnmounted, ref } from 'vue';
import viVN from 'ant-design-vue/es/locale/vi_VN';
import * as THREE from 'three';

import { useModelStore } from '@/stores/model';
import { useInitial } from '@/potree/hooks/useInitial';
import { useRoute, useRouter } from 'vue-router';
import { useChangeImage } from '@/potree/hooks/useChangeImage';
import { checkRuleActiveTool } from '@/utils/helpers';
import { useStationScan } from '@/services/hooks/useStation';
import { HOME_PAGE_PATH } from '@/router/routePath';

import LeftMenu from '@/components/LeftMenu.vue';
import BottomTool from '@/components/BottomTool.vue';
import HeaderHome from '@/components/HeaderHome.vue';
import Information from '@/components/Information.vue';
import MeasurementTool from '@/components/MeasurementTool.vue';
import ModalAddInventory from '@/components/ModalAddInventory.vue';

import IconTickGreen from '@/components/icons/home/IconTickGreen.vue';
import IconHome from '@/components/icons/home/IconHome.vue';
import IconResizeWidth from '@/components/icon/IconResizeWidth.vue';
import type { PoleDevice } from '@/services/apis/station';

// TODO: Define variables
const pane1Size = ref(50);
const container = ref<HTMLElement | null>(null);

const modelStore = useModelStore();
let startX = 0;
let startPane1Size = 0;
const raycaster = new THREE.Raycaster();

const route = useRoute();
const router = useRouter();
const INTERSECTED = ref();

// TODO: get scan info to show in breadcrumb
const { data: scanInfo } = useStationScan(
  computed(() => route.query.id as string),
  computed(() => !!route.query.id),
);

// TODO: Init 3D environment
useInitial();

const startResize = (event: MouseEvent) => {
  event.preventDefault();
  startX = event.clientX;
  startPane1Size = pane1Size.value;

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', stopResize);
};

const onMouseMove = (event: MouseEvent) => {
  if (container.value) {
    const deltaX = event.clientX - startX;
    const containerWidth = container.value.offsetWidth;
    const newPane1Size = startPane1Size + (deltaX / containerWidth) * 100;

    pane1Size.value = Math.max(10, Math.min(75, newPane1Size));
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

const onPointerClick = (evt: MouseEvent) => {
  evt.preventDefault();

  if (isDragging.value) return;
  if (checkRuleActiveTool()) return;
  if (evt.button !== 0) return;

  const viewer = window.potreeViewer;
  const rect = viewer.renderer.domElement.getBoundingClientRect();
  const [x, y] = [evt.clientX, evt.clientY];
  const array = [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
  const onClickPosition = new THREE.Vector2(...array);
  const camera = viewer.scene.getActiveCamera();
  const mouse = new THREE.Vector2(onClickPosition.x * 2 - 1, -(onClickPosition.y * 2) + 1);

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(viewer.scene.scene.children, true);

  if (intersects.length > 0) {
    const targetObject = intersects[0].object;

    if (targetObject.userData.data && targetObject.userData.type === 'camera_pose') {
      onChangeImage(targetObject.userData.data);
    } else if (targetObject.userData.type === 'inventory') {
      const selectedInventory = targetObject.userData?.poleDevice as PoleDevice;
      const image2D = selectedInventory?.suggested_img
        ? modelStore.images.find((item) => item.filename.includes(selectedInventory?.suggested_img))
        : null;
      if (image2D) {
        onChangeImage(image2D);
      } else {
        modelStore.selectedImage = undefined;
      }
      modelStore.selectedPole = undefined;
      modelStore.selectedMeasurement = undefined;
      modelStore.isSelectedBasePlate = false;
      modelStore.selectedInventory = selectedInventory;
    } else if (targetObject.userData.type === 'basePlate') {
      modelStore.isSelectedBasePlate = true;
    }
  } else {
    modelStore.selectedImage = undefined;
    modelStore.selectedMeasurement = undefined;
    modelStore.selectedInventory = undefined;
    modelStore.isSelectedBasePlate = false;
  }
};

const onPointerMove = (evt: MouseEvent) => {
  isDragging.value = true;

  if (checkRuleActiveTool()) {
    return;
  }
  const viewer = window.potreeViewer;
  evt.preventDefault();
  const rect = viewer.renderer.domElement.getBoundingClientRect();
  const [x, y] = [evt.clientX, evt.clientY];
  const array = [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
  const onClickPosition = new THREE.Vector2(...array);
  const camera = viewer.scene.getActiveCamera();
  const mouse = new THREE.Vector2(onClickPosition.x * 2 - 1, -(onClickPosition.y * 2) + 1);

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

        // modelStore.hoverInformation = `Ảnh ${targetObject.userData.data?.filename}`;
      }
    } else if (targetObject.userData.type === 'inventory') {
      const deviceData = targetObject.userData.poleDevice as PoleDevice;
      modelStore.hoverInformation = `${deviceData?.device_info.name} - ${deviceData?.device_info.category.name} - ID: ${deviceData?.id} `;
    } else if (targetObject.userData.type === 'basePlate') {
      if (INTERSECTED.value)
        INTERSECTED.value.material.color.setHex(INTERSECTED.value.currentColor);

      INTERSECTED.value = null;
      modelStore.hoverInformation = '';
    }
  } else {
    if (INTERSECTED.value) INTERSECTED.value.material.color.setHex(INTERSECTED.value.currentColor);

    INTERSECTED.value = null;
    modelStore.hoverInformation = '';
  }
};

const onRightClick = (event: MouseEvent) => {
  event.preventDefault();
  if (modelStore.activeSubTool === 'distance' || modelStore.activeSubTool === 'area') {
    modelStore.hoverInformation = '';
    modelStore.activeSubTool = undefined;
    modelStore.isDrawing = false;
  }
};
</script>

<style>
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #ee0033;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1.5s ease;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
