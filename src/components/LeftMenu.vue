<template>
  <div class="bg-[#212121] flex flex-col pt-2">
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
        <svg
          fill="white"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          <path
            d="M19 6H5a2.006 2.006 0 0 0-2 2v8a2.006 2.006 0 0 0 2 2h14a2.006 2.006 0 0 0 2-2V8a2.006 2.006 0 0 0-2-2Zm0 10H5V8h2v4h2V8h2v4h2V8h2v4h2V8h2v8Z"
          ></path>
        </svg>
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
            d="M22 13a.593.593 0 0 0 0-.08l-.06-.16a.716.716 0 0 0-.07-.09l-.09-.12-.08-.06-.13-.1-4-2.29V5.57c.01-.086.01-.174 0-.26v-.08l-.06-.16L17.3 5l-.09-.11a.24.24 0 0 0-.08-.06.41.41 0 0 0-.13-.1l-4.5-2.6a1 1 0 0 0-1 0L7 4.7a.41.41 0 0 0-.13.1.24.24 0 0 0-.08.06L6.7 5l-.07.09-.06.16v.08a1.09 1.09 0 0 0 0 .26v4.56l-4 2.29-.13.1-.08.06-.09.12a.713.713 0 0 0-.07.09l-.13.19H2a1.09 1.09 0 0 0 0 .26v5.14a1 1 0 0 0 .5.87L7 21.86l.12.05h.12c.171.04.349.04.52 0h.12l.12-.04 4-2.28 4 2.28.12.05h.12c.171.04.349.04.52 0h.12l.12-.05 4.5-2.56a1 1 0 0 0 .5-.87v-5.15a1.091 1.091 0 0 0 0-.29ZM7.5 11.87l1.79 1 .69.4-2.48 1.44L5 13.29l2.5-1.42Zm9 2.84L14 13.29l.69-.4 1.79-1 2.52 1.4-2.5 1.42Zm-1-4.58-.35.2L13 11.56V8.72l2.5-1.43v2.84ZM11 8.72v2.84l-2.15-1.23-.35-.2V7.29L11 8.72Zm1-4.57 2.48 1.42-.64.37L12 7l-1.84-1-.64-.37L12 4.15ZM4 15l2.5 1.43v2.84L4 17.85V15Zm4.5 1.43L11 15v2.84l-2.5 1.44v-2.85ZM13 15l2.5 1.43v2.84L13 17.85V15Zm4.5 4.27v-2.83L20 15v2.84l-2.5 1.43Z"
          ></path>
        </svg>
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
            d="M20 4v12H8V4h12Zm0-2H8a2.006 2.006 0 0 0-2 2v12a2.006 2.006 0 0 0 2 2h12a2.006 2.006 0 0 0 2-2V4a2.006 2.006 0 0 0-2-2Zm-8.5 9.67 1.69 2.26 2.48-3.1L19 15H9l2.5-3.33ZM2 6v14a2.006 2.006 0 0 0 2 2h14v-2H4V6H2Z"
          ></path>
        </svg>
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
            d="M21.921 14.938a.511.511 0 0 0-.176-.298L19.557 13c.047-.331.075-.665.081-1a5.512 5.512 0 0 0-.081-1l2.168-1.64a.511.511 0 0 0 .122-.64l-2.045-3.46C19.679 5 19.413 5 19.148 5l-2.516 1a9.038 9.038 0 0 0-1.739-.94l-.388-2.64a.48.48 0 0 0-.47-.42h-4.09a.528.528 0 0 0-.533.42l-.388 2.64c-.609.257-1.19.572-1.739.94L4.75 5c-.225 0-.49 0-.634.26L2.07 8.72a.488.488 0 0 0 .123.64L4.36 11a8.17 8.17 0 0 0 0 2l-2.168 1.64a.512.512 0 0 0-.123.64l2.045 3.46c.123.26.389.26.634.26l2.536-1c.541.38 1.124.696 1.739.94l.388 2.64a.513.513 0 0 0 .532.42h4.09a.517.517 0 0 0 .491-.42l.389-2.64c.6-.261 1.175-.576 1.718-.94l2.515 1c.266 0 .532 0 .676-.26l2.045-3.46a.511.511 0 0 0 .053-.342ZM12.001 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Z"
          ></path>
          <path
            fill="white"
            d="M10.864 9.095a.64.64 0 0 0-.563-.052.512.512 0 0 0-.22.16.377.377 0 0 0-.081.23v5.133c0 .082.028.162.082.231.053.07.13.125.22.16a.638.638 0 0 0 .562-.052l3.936-2.566a.461.461 0 0 0 .147-.151.368.368 0 0 0 0-.376.461.461 0 0 0-.147-.15l-3.936-2.567Z"
          ></path>
        </svg>
      </a-button>
    </a-tooltip>
    <a-tooltip
      title="Export"
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
          modelStore.activeTool === 'setting' ? 'bg-[#303030]' : 'bg-transparent',
        ]"
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
            d="M13.45 10h-2.9v3H8l4 4 4-4h-2.55v-3Z"
            fill="white"
          ></path>
          <path
            fill="white"
            d="M19.35 10.04a7.493 7.493 0 0 0-14-2A5.998 5.998 0 0 0 6 20h13a4.986 4.986 0 0 0 .35-9.96ZM19 18H6a3.997 3.997 0 0 1-.44-7.97l1.07-.11.5-.95a5.487 5.487 0 0 1 10.26 1.46l.3 1.5 1.53.11A2.984 2.984 0 0 1 19 18Z"
          ></path>
        </svg>
      </a-button>
    </a-tooltip>
  </div>
  <div
    style="height: calc(100vh - 84px)"
    class="flex"
  >
    <Inventory />
    <Evaluate />
    <Setting />
    <ImageSection />
    <Measurement />
    <Export />
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

const modelStore = useModelStore();
</script>
