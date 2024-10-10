<template>
  <div class="flex flex-col bg-[#303030] rounded-full py-1">
    <a-tooltip
      title="Xem thông tin"
      placement="right"
      color="#212121"
    >
      <a-button
        class="w-8 h-8 p-0 m-0 rounded-t rounded-b-none flex flex-row items-center justify-center"
        type="ghost"
        @click="onViewInfo"
      >
        <select-icon v-if="checkRuleActiveTool()" />
        <select-active-icon v-else />
      </a-button>
    </a-tooltip>

    <a-tooltip
      title="Đo chiều dài"
      placement="right"
      color="#212121"
    >
      <a-button
        class="w-8 h-8 p-0 m-0 rounded-t rounded-b-none flex flex-row items-center justify-center group"
        type="ghost"
        @click="onMeasureDistance"
      >
        <distance-icon
          :class="[
            modelStore.activeSubTool === 'distance'
              ? 'text-[#FF0000]'
              : 'group-hover:text-[#FF0000] text-white',
          ]"
        />
      </a-button>
    </a-tooltip>

    <a-tooltip
      title="Đo diện tích"
      placement="right"
      color="#212121"
    >
      <a-button
        class="w-8 h-8 p-0 m-0 rounded-t rounded-b-none flex flex-row items-center justify-center group"
        type="ghost"
        @click="onMeasureArea"
      >
        <area-icon
          :class="[
            modelStore.activeSubTool === 'area'
              ? 'text-[#FF0000]'
              : 'group-hover:text-[#FF0000] text-white',
          ]"
        />
      </a-button>
    </a-tooltip>

    <a-tooltip
      title="Đo góc"
      placement="right"
      color="#212121"
    >
      <a-button
        class="w-8 h-8 p-0 m-0 rounded-t rounded-b-none flex flex-row items-center justify-center group"
        type="ghost"
        @click="onMeasureAngle"
      >
        <angle-icon
          :class="[
            modelStore.activeSubTool === 'angle'
              ? 'text-[#FF0000]'
              : 'group-hover:text-[#FF0000] text-white',
          ]"
        />
      </a-button>
    </a-tooltip>

    <a-tooltip
      title="Đo góc Tilt"
      placement="right"
      color="#212121"
    >
      <a-button
        class="w-8 h-8 p-0 m-0 rounded-t rounded-b-none flex flex-row items-center justify-center group"
        type="ghost"
        @click="onMeasureHeight"
      >
        <IconTilt
          :class="[
            modelStore.activeSubTool === 'height'
              ? 'text-[#FF0000]'
              : 'group-hover:text-[#FF0000] text-white',
          ]"
        />
      </a-button>
    </a-tooltip>

    <a-tooltip
      title="Đo góc Azimuth"
      placement="right"
      color="#212121"
    >
      <a-button
        class="w-8 h-8 p-0 m-0 rounded-t rounded-b-none flex flex-row items-center justify-center group"
        type="ghost"
        @click="onMeasureAzimuth"
      >
        <IconAzimuth
          :class="[
            modelStore.activeSubTool === 'azimuth'
              ? 'text-[#FF0000]'
              : 'group-hover:text-[#FF0000] text-white',
          ]"
        />
      </a-button>
    </a-tooltip>

    <a-tooltip
      title="Đo Bán kính"
      placement="right"
      color="#212121"
    >
      <a-button
        class="w-8 h-8 p-0 m-0 rounded-t rounded-b-none flex flex-row items-center justify-center group"
        type="ghost"
        @click="onMeasureCircle"
      >
        <circle-icon
          :class="[
            modelStore.activeSubTool === 'circle'
              ? 'text-[#FF0000]'
              : 'group-hover:text-[#FF0000] text-white',
          ]"
        />
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
import DistanceIcon from '@/components/icon/tools/distanceIcon.vue';
import CircleIcon from '@/components/icon/tools/circleIcon.vue';
import AreaIcon from '@/components/icon/tools/areaIcon.vue';
import IconTilt from '@/components/icon/tools/IconTilt.vue';
import IconAzimuth from '@/components/icon/tools/IconAzimuth.vue';

const modelStore = useModelStore();

const onViewInfo = () => {
  modelStore.activeSubTool = undefined;
  modelStore.hoverInformation = '';
};

const onMeasureDistance = () => {
  modelStore.activeSubTool = 'distance';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: true,
    showArea: false,
    closed: false,
    name: `Khoảng cách ${modelStore.measurements.length + 1}`,
  });
};

const onMeasureArea = () => {
  modelStore.activeSubTool = 'area';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: true,
    showArea: true,
    closed: true,
    name: `Diện tích ${modelStore.measurements.length + 1}`,
  });
};

const onMeasureAngle = () => {
  modelStore.activeSubTool = 'angle';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: false,
    showAngles: true,
    showArea: false,
    closed: true,
    maxMarkers: 3,
    name: `Góc ${modelStore.measurements.length + 1}`,
  });
};

const onMeasureHeight = () => {
  modelStore.activeSubTool = 'height';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: false,
    showHeight: true,
    showArea: false,
    closed: false,
    maxMarkers: 2,
    name: `Góc Tilt ${modelStore.measurements.length + 1}`,
  });
};

const onMeasureAzimuth = () => {
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
    name: `Góc Azimuth ${modelStore.measurements.length + 1}`,
  });
};

const onMeasureCircle = () => {
  modelStore.activeSubTool = 'circle';
  window.potreeViewer.measuringTool.startInsertion({
    showDistances: false,
    showHeight: false,
    showArea: false,
    showCircle: true,
    showEdges: false,
    closed: false,
    maxMarkers: 3,
    name: `Bán kính ${modelStore.measurements.length + 1}`,
  });
};
</script>
