<template>
  <div class="flex flex-col bg-[#303030] rounded-full py-3">
    <a-tooltip
      title="Xem thông tin"
      placement="right"
      color="#212121"
    >
      <a-button
        :class="['w-8 h-8 p-0 m-0 rounded-t rounded-b-none']"
        type="ghost"
        @click="modelStore.activeSubTool = null"
      >
        <select-icon v-if="checkRuleActiveTool()" />
        <select-active-icon v-else />
      </a-button>
    </a-tooltip>

    <a-tooltip
      title="Đo góc"
      placement="right"
      color="#212121"
    >
      <a-button
        :class="['w-8 h-8 p-0 m-0 rounded-t rounded-b-none']"
        type="ghost"
        @click="onMeasureAngle"
      >
        <angle-active-icon v-if="modelStore.activeSubTool === 'angle'" />
        <angle-icon v-else />
      </a-button>
    </a-tooltip>

    <a-tooltip
      title="Đo khoảng cách"
      placement="right"
      color="#212121"
    >
      <a-button
        :class="['w-8 h-8 p-0 m-0 rounded-t rounded-b-none']"
        type="ghost"
        @click="onMeasureDistance"
      >
        <distance-active-icon v-if="modelStore.activeSubTool === 'distance'" />
        <distance-icon v-else />
      </a-button>
    </a-tooltip>

    <a-tooltip
      title="Đo góc Tilt"
      placement="right"
      color="#212121"
    >
      <a-button
        :class="['w-8 h-8 p-0 m-0 rounded-t rounded-b-none']"
        type="ghost"
        @click="onMeasureHeight"
      >
        <height-active-icon v-if="modelStore.activeSubTool === 'height'" />
        <height-icon v-else />
      </a-button>
    </a-tooltip>

    <a-tooltip
      title="Đo Bán kính"
      placement="right"
      color="#212121"
    >
      <a-button
        :class="['w-8 h-8 p-0 m-0 rounded-t rounded-b-none']"
        type="ghost"
        @click="onMeasureCircle"
      >
        <circle-active-icon v-if="modelStore.activeSubTool === 'circle'" />
        <circle-icon v-else />
      </a-button>
    </a-tooltip>

    <a-tooltip
      title="Đo Phương vị"
      placement="right"
      color="#212121"
    >
      <a-button
        :class="['w-8 h-8 p-0 m-0 rounded-t rounded-b-none']"
        type="ghost"
        @click="onMeasureAzimuth"
      >
        <angle-active-icon v-if="modelStore.activeSubTool === 'azimuth'" />
        <angle-icon v-else />
      </a-button>
    </a-tooltip>

    <a-tooltip
      title="Đo diện tích"
      placement="right"
      color="#212121"
    >
      <a-button
        :class="['w-8 h-8 p-0 m-0 rounded-t rounded-b-none']"
        type="ghost"
        @click="onMeasureArea"
      >
        <area-active-icon v-if="modelStore.activeSubTool === 'area'" />
        <area-icon v-else />
      </a-button>
    </a-tooltip>

    <a-tooltip
      title="Xóa toàn bộ công cụ đo"
      placement="right"
      color="#212121"
    >
      <a-button
        :class="['w-8 h-8 p-0 m-0 rounded-t rounded-b-none']"
        type="ghost"
        @click="onRemoveAllMeasurements"
      >
        <icon-close-active class="w-full h-full p-1.5" />
      </a-button>
    </a-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import { checkRuleActiveTool } from '@/utils/helpers';

import SelectIcon from '@/components/icon/tools/selectIcon.vue';
import SelectActiveIcon from '@/components/icon/tools/selectActiveIcon.vue';
import AngleIcon from '@/components/icon/tools/angleIcon.vue';
import AngleActiveIcon from '@/components/icon/tools/angleActiveIcon.vue';
import DistanceActiveIcon from '@/components/icon/tools/distanceActiveIcon.vue';
import DistanceIcon from '@/components/icon/tools/distanceIcon.vue';
import HeightActiveIcon from '@/components/icon/tools/heightActiveIcon.vue';
import HeightIcon from '@/components/icon/tools/heightIcon.vue';
import CircleActiveIcon from '@/components/icon/tools/circleActiveIcon.vue';
import CircleIcon from '@/components/icon/tools/circleIcon.vue';
import AreaActiveIcon from '@/components/icon/tools/areaActiveIcon.vue';
import AreaIcon from '@/components/icon/tools/areaIcon.vue';
import IconCloseActive from '@/components/icon/IconCloseActive.vue';

const modelStore = useModelStore();

const onMeasureAngle = () => {
  initMeasurement();
  modelStore.activeSubTool = 'angle';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: false,
    showAngles: true,
    showArea: false,
    closed: true,
    maxMarkers: 3,
    name: 'Góc',
  });
};

const onMeasureDistance = () => {
  initMeasurement();
  modelStore.activeSubTool = 'distance';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: true,
    showArea: false,
    closed: false,
    name: 'Khoảng cách',
  });
};

const onMeasureArea = () => {
  initMeasurement();
  modelStore.activeSubTool = 'area';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: true,
    showArea: true,
    closed: true,
    name: 'Diện tích',
  });
};

const onMeasureHeight = () => {
  initMeasurement();
  modelStore.activeSubTool = 'height';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: false,
    showHeight: true,
    showArea: false,
    closed: false,
    maxMarkers: 2,
    name: 'Góc Tilt',
  });
};

const onMeasureCircle = () => {
  initMeasurement();
  modelStore.activeSubTool = 'circle';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: false,
    showHeight: false,
    showArea: false,
    showCircle: true,
    showEdges: false,
    closed: false,
    maxMarkers: 3,
    name: 'Đường Kính',
  });
};

const onMeasureAzimuth = () => {
  initMeasurement();
  modelStore.activeSubTool = 'azimuth';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: false,
    showHeight: false,
    showArea: false,
    showCircle: false,
    showEdges: false,
    showAzimuth: true,
    closed: false,
    maxMarkers: 2,
    name: 'Góc Azimuth',
  });
};
const initMeasurement = () => {
  modelStore.activeTool = 'measurements';
};

/*const onInsertAnnotation = () => {
  modelStore.activeTool = 'annotation';
  window.potreeViewer.annotationTool.startInsertion();
};

const onInsertClipVolumeInside = () => {
  modelStore.activeTool = 'clip_volume_inside';
  window.potreeViewer.volumeTool.startInsertion({ clip: true });
};*/

const onRemoveAllMeasurements = () => {
  window.potreeViewer.scene.removeAllMeasurements();
  modelStore.measurements = [];
  modelStore.activeSubTool = null;
};
</script>
