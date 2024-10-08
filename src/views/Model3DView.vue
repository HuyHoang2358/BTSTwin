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
          v-if="data?.data?.name"
        >
          Trạm {{ data?.data?.name }}
        </a-typography-text>
        <IconTickGreen
          class="ml-1"
          v-if="data?.data?.name"
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
            class="flex relative"
          />
          <MeasurementTool class="absolute top-[82px] right-6 z-10" />
          <BottomTool />

          <div
            class="absolute inset-0 flex items-center justify-center z-10"
            v-if="modelStore.loadingModel"
          >
            <div class="loader" />
          </div>
          <div
            v-if="!!modelStore.hoverInformation"
            class="absolute bottom-4 right-4 z-10"
          >
            <a-typography-text class="text-white">
              {{ modelStore.hoverInformation }}
            </a-typography-text>
          </div>
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

        <!-- List images -->
        <div
          class="overflow-auto flex flex-col bg-[#212121]"
          :style="{ flex: 100 - pane1Size + ' 0 0' }"
          v-if="modelStore.selectedImage"
        >
          <ListImages />
        </div>

        <!-- Information -->
        <Suggestion
          v-if="
            !modelStore.selectedImage &&
            !modelStore.selectedInventory &&
            !modelStore.isShowPoleInfo &&
            !modelStore.isSelectedBasePlate
          "
        />
        <Information v-else />
      </div>
    </div>
    <ModalAddInventory />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';
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
import HeaderHome from '@/components/HeaderHome.vue';
import IconHome from '@/components/icons/home/IconHome.vue';
import { HOME_PAGE_PATH } from '@/router/routePath';
import { useRoute, useRouter } from 'vue-router';
import IconTickGreen from '@/components/icons/home/IconTickGreen.vue';
import viVN from 'ant-design-vue/es/locale/vi_VN';
import { theme } from 'ant-design-vue';
import { checkRuleActiveTool } from '@/utils/helpers';
import ModalAddInventory from '@/components/ModalAddInventory.vue';
import { useStationScan } from '@/services/hooks/useStation';
import type { Device } from '@/services/apis/station';
import IconResizeWidth from '@/components/icon/IconResizeWidth.vue';

const pane1Size = ref(50);
const container = ref<HTMLElement | null>(null);
const router = useRouter();
const modelStore = useModelStore();
let startX = 0;
let startPane1Size = 0;
const raycaster = new THREE.Raycaster();
const INTERSECTED = ref();
const route = useRoute();

const { data } = useStationScan(
  computed(() => route.query.id as string),
  computed(() => !!route.query.id),
);

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
      const selectedInventory = targetObject.userData?.device as Device;
      const image2D = selectedInventory?.pivot.suggested_img
        ? modelStore.images.find((item) =>
            item.filename.includes(selectedInventory?.pivot.suggested_img),
          )
        : null;
      if (image2D) {
        onChangeImage(image2D);
      } else {
        modelStore.selectedImage = undefined;
      }
      modelStore.selectedPole = undefined;
      modelStore.isSelectedBasePlate = false;
      modelStore.selectedInventory = selectedInventory;
    } else if (targetObject.userData.type === 'basePlate') {
      modelStore.isSelectedBasePlate = true;
    }
  } else {
    modelStore.selectedImage = undefined;
    modelStore.currentMeasurement = undefined;
    modelStore.selectedInventory = undefined;
    modelStore.isSelectedBasePlate = false;
  }
};

const onPointerMove = (evt: any) => {
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

        modelStore.hoverInformation = `Ảnh ${targetObject.userData.data?.filename}`;
      }
    } else if (targetObject.userData.type === 'inventory') {
      const deviceData = targetObject.userData.device as Device;
      modelStore.hoverInformation = `${deviceData?.name} - ${deviceData?.category.name} - ID: ${deviceData?.pivot.id} `;
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

useInitial();

watch(
  () => modelStore.selectedImage,
  () => {
    if (modelStore.selectedImage) {
      modelStore.selectedPole = undefined;
      modelStore.isSelectedBasePlate = false;
    }
  },
);

watch(
  () => modelStore.selectedPole,
  () => {
    if (modelStore.selectedPole) {
      modelStore.selectedInventory = undefined;
      modelStore.selectedImage = undefined;
      modelStore.isSelectedBasePlate = false;
    }
  },
);

watch(
  () => modelStore.isSelectedBasePlate,
  () => {
    if (modelStore.isSelectedBasePlate) {
      modelStore.selectedInventory = undefined;
      modelStore.selectedImage = undefined;
      modelStore.selectedPole = undefined;
    }
  },
);
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
</style>
