<template>
  <div class="bg-[#212121] flex flex-col">
    <a-tooltip
      title="Đo lường"
      placement="right"
      color="#212121"
    >
      <a-button
        @click="
          modelStore.activeTool === 'measurements'
            ? (modelStore.activeTool = undefined)
            : (modelStore.activeTool = 'measurements')
        "
        :class="[
          'p-0 border-none rounded-none w-10 h-10',
          modelStore.activeTool === 'measurements' ? 'bg-[#303030]' : 'bg-transparent',
        ]"
      >
        <icon-measurement class="w-full h-full p-2" />
      </a-button>
    </a-tooltip>
    <a-tooltip
      title="Khảo sát"
      placement="right"
      color="#212121"
    >
      <a-button
        @click="
          modelStore.activeTool === 'inventory'
            ? (modelStore.activeTool = undefined)
            : (modelStore.activeTool = 'inventory')
        "
        :class="[
          'p-0 border-none rounded-none w-10 h-10',
          modelStore.activeTool === 'inventory' ? 'bg-[#303030]' : 'bg-transparent',
        ]"
      >
        <icon3-d-model class="w-full h-full p-2" />
      </a-button>
    </a-tooltip>
    <a-tooltip
      title="Đánh giá"
      placement="right"
      color="#212121"
    >
      <a-button
        @click="
          modelStore.activeTool === 'evaluate'
            ? (modelStore.activeTool = undefined)
            : (modelStore.activeTool = 'evaluate')
        "
        :class="[
          'p-0 border-none rounded-none w-10 h-10',
          modelStore.activeTool === 'evaluate' ? 'bg-[#303030]' : 'bg-transparent',
        ]"
      >
        <svg
          class="w-full h-full p-2"
          width="24"
          height="24"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          <path
            d="M8 2 5.836 7h4.328L8 2Z"
            fill="white"
          ></path>
          <path
            fill="white"
            d="M10.597 8h-1.09l1.931 4.46-3.052-1.277L8 11.021l-.386.162-3.052 1.277L6.493 8h-1.09L3 13.552l.473.448L8 12.105 12.527 14l.473-.448L10.597 8Z"
          ></path>
        </svg>
      </a-button>
    </a-tooltip>
    <a-tooltip
      title="Hình ảnh"
      placement="right"
      color="#212121"
    >
      <a-button
        @click="
          modelStore.activeTool === 'images'
            ? (modelStore.activeTool = undefined)
            : (modelStore.activeTool = 'images')
        "
        :class="[
          'p-0 border-none rounded-none w-10 h-10',
          modelStore.activeTool === 'images' ? 'bg-[#303030]' : 'bg-transparent',
        ]"
      >
        <icon-image class="w-full h-full p-2" />
      </a-button>
    </a-tooltip>

    <a-tooltip
      title="Báo cáo"
      placement="right"
      color="#212121"
    >
      <a-button
        @click="
          modelStore.activeTool === 'export'
            ? (modelStore.activeTool = undefined)
            : (modelStore.activeTool = 'export')
        "
        :class="[
          'p-0 border-none rounded-none w-10 h-10',
          modelStore.activeTool === 'export' ? 'bg-[#303030]' : 'bg-transparent',
        ]"
      >
        <icon-report class="w-full h-full p-2" />
      </a-button>
    </a-tooltip>
    <a-tooltip
      title="Cài đặt"
      placement="right"
      color="#212121"
    >
      <a-button
        @click="
          modelStore.activeTool === 'setting'
            ? (modelStore.activeTool = undefined)
            : (modelStore.activeTool = 'setting')
        "
        :class="[
          'p-0 border-none rounded-none w-10 h-10',
          modelStore.activeTool === 'setting' ? 'bg-[#303030]' : 'bg-transparent',
        ]"
      >
        <icon-setting class="w-full h-full p-2" />
      </a-button>
    </a-tooltip>
  </div>
  <div
    style="height: calc(100vh - 84px)"
    class="flex"
  >
    <Measurement />
    <Inventory />
    <Evaluate />
    <ImageSection />
    <Export />
    <Setting />
  </div>
</template>

<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import Inventory from '@/components/Inventory.vue';
import Measurement from '@/components/Measurement.vue';
import ImageSection from '@/components/ImageSection.vue';
import Setting from '@/components/Setting.vue';
import Evaluate from '@/components/Evaluate.vue';
import Export from '@/components/Export.vue';
import IconImage from '@/components/icon/IconImage.vue';
import Icon3DModel from '@/components/icon/Icon3DModel.vue';
import IconMeasurement from '@/components/icon/IconMeasurement.vue';
import IconReport from '@/components/icon/IconReport.vue';
import IconSetting from '@/components/icon/IconSetting.vue';

const modelStore = useModelStore();
</script>
