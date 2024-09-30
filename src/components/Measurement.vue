<template>
  <div
    class="bg-[#303030] w-[260px] overflow-auto"
    v-if="modelStore.activeTool === 'measurements'"
  >
    <div class="flex justify-between items-center px-3 py-4">
      <a-typography-text class="text-base text-[#888]">
        Đo đạc
        <br />
        {{ modelStore.measurements.length }} item(s)
      </a-typography-text>
    </div>
    <div
      v-for="(item, index) in modelStore.measurements"
      :key="index"
      :class="[
        'flex flex-row items-center justify-between cursor-pointer pr-2',
        item.id === modelStore.currentMeasurement && 'bg-[#38536d]',
      ]"
      @click="onMoveToMeasurement(item)"
    >
      <div class="flex flex-row items-center">
        <img
          :src="item.icon"
          class="w-6 h-6 ml-3"
          alt="tool"
        />
        <a-typography-text class="text-white text-sm ml-3">
          {{ item.name }} {{ index + 1 }}
        </a-typography-text>
      </div>
      <a-button
        @click="onToggleMeasurement(item)"
        ghost
        class="p-0 m-0 border-none"
      >
        <svg
          v-if="!item.visible"
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
</template>

<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import * as THREE from 'three';

const modelStore = useModelStore();

const onMoveToMeasurement = (object: any) => {
  let points = object.points.map((p: any) => p.position);
  let box = new THREE.Box3().setFromPoints(points);
  if (box.getSize(new THREE.Vector3()).length() > 0) {
    let node = new THREE.Object3D();
    node.boundingBox = box;
    window.potreeViewer.zoomTo(node, 2, 500);
  }
};

const onToggleMeasurement = (object: any) => {
  object.visible = !object.visible;
};
</script>
