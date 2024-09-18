<template>
  <div
    v-if="modelStore.objectGroupArray.length > 0 && modelStore.activeTool === 'inventory'"
    class="flex flex-col bg-[#303030] w-[260px]"
  >
    <div class="flex justify-between items-center px-3 py-4">
      <a-typography-text class="text-base text-[#888]">Thiết bị</a-typography-text>
      <a-button
        class="p-0 border-none"
        ghost
        @click="onAddBox"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          <path
            fill="white"
            d="M14 9H9v5H7V9H2V7h5V2h2v5h5v2Z"
          ></path>
        </svg>
      </a-button>
    </div>
    <div class="px-3 mb-4">
      <a-input
        :placeholder="$t('search')"
        v-model:value="searchValue"
        allow-clear
        style="border: 1px solid #424242"
      >
        <template #prefix>
          <IconSearchInput />
        </template>
      </a-input>
    </div>
    <div class="flex flex-1 overflow-auto">
      <a-collapse
        v-model:activeKey="activeKey"
        :bordered="false"
        class="w-full"
      >
        <template #expandIcon="{ isActive }">
          <caret-right-outlined
            :rotate="isActive ? 90 : 0"
            style="color: white"
          />
        </template>
        <a-collapse-panel
          :header="`${key} (${modelStore.objectGroup[key].length} thiết bị)`"
          v-for="key in modelStore.objectGroupArray"
          :key="key"
        >
          <div
            v-for="(item, index) in modelStore.objectGroup[key].filter(() =>
              compareString(key, searchValue),
            )"
            :key="index"
            :class="[
              'flex flex-row items-center justify-between cursor-pointer',
              item.id === modelStore.selectedInventory?.id && 'bg-[#38536d]',
            ]"
            @click="onClickInventory(item)"
          >
            <div class="flex flex-row items-center">
              <div class="w-1 h-[28px] bg-[#69f0ae] mr-7" />
              <a-typography-text class="text-white text-sm">
                {{ key }} {{ index + 1 }}
              </a-typography-text>
            </div>
            <div class="pr-2">
              <a-button
                @click="onToggleBoxMeshInventory(item, key)"
                ghost
                class="p-0 m-0 border-none"
              >
                <svg
                  v-if="!item.visibleMesh"
                  width="16"
                  height="16"
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid meet"
                  focusable="false"
                >
                  <path
                    fill="#888888"
                    d="m1 2.13.64-.63 9.11 9.11-.64.64L9 10.12a5.78 5.78 0 0 1-2.5 1.38 6.23 6.23 0 0 1-4.5-6V3.13l-1-1ZM6.5.5l4.5 2v3a6.24 6.24 0 0 1-.89 3.2L3.33 1.91 6.5.5Z"
                  ></path>
                </svg>
                <svg
                  v-else
                  width="16"
                  height="16"
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid meet"
                  focusable="false"
                >
                  <path
                    fill="#888888"
                    d="M10.5 5.5a6.23 6.23 0 0 1-4.5 6 6.23 6.23 0 0 1-4.5-6v-3L6 .5l4.5 2v3Z"
                  ></path>
                </svg>
              </a-button>
              <a-button
                @click="onToggleRemoveInventory(item, key)"
                ghost
                class="p-0 m-0 border-none ml-2"
              >
                <svg
                  v-if="item.clip"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid meet"
                  focusable="false"
                >
                  <path
                    fill="#888888"
                    d="M8 4.46a3.11 3.11 0 0 1 3.19 3A3 3 0 0 1 11 8.6l1.86 1.76A7.15 7.15 0 0 0 15 7.49a7.53 7.53 0 0 0-7-4.55 7.87 7.87 0 0 0-2.54.42l1.38 1.31A3.19 3.19 0 0 1 8 4.46ZM1.64 2.8l1.45 1.38.29.28A7.2 7.2 0 0 0 1 7.49 7.53 7.53 0 0 0 8 12c.953.003 1.9-.17 2.79-.51l.27.26 1.86 1.77.81-.77L2.45 2l-.81.8Zm3.52 3.35 1 .94a1.75 1.75 0 0 0 0 .4A1.86 1.86 0 0 0 8 9.3a2 2 0 0 0 .42 0l1 .94a3.24 3.24 0 0 1-1.4.32 3.11 3.11 0 0 1-3.18-3 2.93 2.93 0 0 1 .32-1.41Zm2.74-.47 2 1.91v-.1A1.87 1.87 0 0 0 8 5.67l-.1.01Z"
                  ></path>
                </svg>
                <svg
                  v-else
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid meet"
                  focusable="false"
                >
                  <path
                    fill="#888888"
                    d="M8 3a8 8 0 0 0-7 5 8 8 0 0 0 7 5 8 8 0 0 0 7-5 8 8 0 0 0-7-5Zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
                  ></path>
                  <path
                    fill="#888888"
                    d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                  ></path>
                </svg>
              </a-button>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
  <ModalAddInventory />
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { useModelStore } from '@/stores/model';
import { CaretRightOutlined } from '@ant-design/icons-vue';
import { ref, watch } from 'vue';
import IconSearchInput from '@/components/icons/home/IconSearchInput.vue';
import { compareString } from '@/utils/helpers';
import type { Inventory } from '@/services/apis/bts';
import { useChangeImage } from '@/potree/hooks/useChangeImage';
import ModalAddInventory from '@/components/ModalAddInventory.vue';

const activeKey = ref<string[]>([]);
const searchValue = ref<string>('');

const modelStore = useModelStore();

watch(
  () => modelStore.objectGroupArray,
  () => {
    activeKey.value = modelStore.objectGroupArray.map((item) => item) || [];
  },
);

const onAddBox = () => {
  modelStore.openModalAddInventory = true;
  modelStore.activeTool = undefined;
};

const { onChangeImage } = useChangeImage();

const onClickInventory = (object: Inventory) => {
  modelStore.selectedInventory = object;
  const image2D = object?.image2D;
  if (image2D) {
    onChangeImage(image2D);
  } else {
    modelStore.selectedImage = undefined;
    onMoveToInventory(object);
  }
};

const onMoveToInventory = (object: Inventory) => {
  const vertices = JSON.parse(object.vertices);
  const antennaVertices = vertices.map((item: any) => new THREE.Vector3(item[0], item[1], item[2]));

  // Compute bounding box
  const box = new THREE.Box3().setFromPoints(antennaVertices);

  // Create geometry for the bounding box
  if (box.getSize(new THREE.Vector3()).length() > 0) {
    let node = new THREE.Object3D();
    node.boundingBox = box;
    window.potreeViewer.zoomTo(node, 2, 500);
  }
};

const onToggleBoxMeshInventory = (object: any, key: string) => {
  const nextState = !object.boxMesh.visible;
  modelStore.objectGroup = {
    ...modelStore.objectGroup,
    [key]: modelStore.objectGroup[key].map((item: any) =>
      object.id !== item.id ? item : { ...item, visibleMesh: nextState },
    ),
  };
  object.boxMesh.visible = nextState;
};

const onToggleRemoveInventory = (object: any, key: string) => {
  const nextState = !object.volume.clip;
  modelStore.objectGroup = {
    ...modelStore.objectGroup,
    [key]: modelStore.objectGroup[key].map((item: any) =>
      object.id !== item.id ? item : { ...item, clip: nextState },
    ),
  };
  object.volume.clip = nextState;
};
</script>
