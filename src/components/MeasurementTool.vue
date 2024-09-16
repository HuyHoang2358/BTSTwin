<template>
  <div class="flex flex-col">
    <a-button
      :class="[
        'w-8 h-8 p-0 m-0 rounded-t rounded-b-none',
        !(
          modelStore.activeTool === 'angle' ||
          modelStore.activeTool === 'distance' ||
          modelStore.activeTool === 'area' ||
          modelStore.activeTool === 'circle' ||
          modelStore.activeTool === 'azimuth' ||
          modelStore.activeTool === 'annotation'
        )
          ? 'bg-[#38536d]'
          : 'bg-[#19282c]',
      ]"
      style="border-color: #7a8184"
      @click="modelStore.activeTool = null"
    >
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
          d="M9.07 14.03a.997.997 0 0 1 1.33.48l2.3 4.99 1.8-.85-2.31-4.98a.993.993 0 0 1 .48-1.33l.28-.08 2.3-.45L7 4.88v10.78l1.82-1.47.25-.16Zm3.57 7.7a.99.99 0 0 1-1.33-.47l-2.18-4.74-2.51 2.02a.957.957 0 0 1-.62.22 1 1 0 0 1-1-1v-15a1 1 0 0 1 1.64-.77l.01-.01 11.49 9.64a1 1 0 0 1-.44 1.75l-3.16.62 2.2 4.73a.967.967 0 0 1-.48 1.32l-3.62 1.69Z"
        ></path>
      </svg>
    </a-button>
    <img
      src="/icons/angle.png"
      style="width: 32px; height: 32px"
      :class="['button-icon', modelStore.activeTool === 'angle' && 'bg-[#38536d]']"
      title="Đo góc"
      @click="onMeasureAngle"
      alt="angle"
    />
    <img
      src="/icons/distance.svg"
      style="width: 32px; height: 32px"
      :class="['button-icon', modelStore.activeTool === 'distance' && 'bg-[#38536d]']"
      title="Đo khoảng cách"
      @click="onMeasureDistance"
      alt="distance"
    />
    <img
      src="/icons/height.svg"
      style="width: 32px; height: 32px"
      :class="['button-icon', modelStore.activeTool === 'height' && 'bg-[#38536d]']"
      title="Đo chiều cao"
      @click="onMeasureHeight"
      alt="height"
    />
    <img
      src="/icons/circle.svg"
      style="width: 32px; height: 32px"
      :class="['button-icon', modelStore.activeTool === 'circle' && 'bg-[#38536d]']"
      title="Đo vòng tròn"
      @click="onMeasureCircle"
      alt="circle"
    />
    <img
      src="/icons/azimuth.svg"
      style="width: 32px; height: 32px"
      title="Phương vị"
      :class="['button-icon', modelStore.activeTool === 'azimuth' && 'bg-[#38536d]']"
      @click="onMeasureAzimuth"
      alt="azimuth"
    />
    <img
      src="/icons/area.svg"
      style="width: 32px; height: 32px"
      :class="['button-icon', modelStore.activeTool === 'area' && 'bg-[#38536d]']"
      title="Đo diện tích"
      @click="onMeasureArea"
      alt="area"
    />
    <img
      src="/icons/annotation.svg"
      style="width: 32px; height: 32px"
      :class="['button-icon', modelStore.activeTool === 'annotation' && 'bg-[#38536d]']"
      title="Ghi chú"
      @click="onInsertAnnotation"
      alt="annotation"
    />
    <img
      src="/icons/reset_tools.svg"
      style="width: 32px; height: 32px"
      class="button-icon rounded-b"
      title="Xóa toàn bộ công cụ đo"
      @click="onRemoveAllMeasurements"
      alt="reset_tools"
    />
  </div>
</template>

<script setup lang="ts">
import { useModelStore } from '@/stores/model';

const modelStore = useModelStore();

const onMeasureAngle = () => {
  modelStore.activeTool = 'angle';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: false,
    showAngles: true,
    showArea: false,
    closed: true,
    maxMarkers: 3,
    name: 'Angle',
  });
};

const onMeasureDistance = () => {
  modelStore.activeTool = 'distance';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: true,
    showArea: false,
    closed: false,
    name: 'Distance',
  });
};

const onMeasureArea = () => {
  modelStore.activeTool = 'area';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: true,
    showArea: true,
    closed: true,
    name: 'Area',
  });
};

const onMeasureHeight = () => {
  modelStore.activeTool = 'height';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: false,
    showHeight: true,
    showArea: false,
    closed: false,
    maxMarkers: 2,
    name: 'Height',
  });
};

const onMeasureCircle = () => {
  modelStore.activeTool = 'circle';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: false,
    showHeight: false,
    showArea: false,
    showCircle: true,
    showEdges: false,
    closed: false,
    maxMarkers: 3,
    name: 'Circle',
  });
};

const onMeasureAzimuth = () => {
  modelStore.activeTool = 'azimuth';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: false,
    showHeight: false,
    showArea: false,
    showCircle: false,
    showEdges: false,
    showAzimuth: true,
    closed: false,
    maxMarkers: 2,
    name: 'Azimuth',
  });
};

const onInsertAnnotation = () => {
  modelStore.activeTool = 'annotation';
  window.potreeViewer.annotationTool.startInsertion();
};

const onRemoveAllMeasurements = () => {
  window.potreeViewer.scene.removeAllMeasurements();
  modelStore.measurements = [];
};
</script>
