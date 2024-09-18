<template>
  <div class="flex flex-col">
    <div
      class="relative flex flex-col justify-center"
      v-if="modelStore.selectedImage"
    >
      <div
        ref="panzoomContainer"
        style="height: calc(100vh - 228px - 84px)"
        class="bg-[#303030] flex justify-center"
        @wheel="handleWheel"
      >
        <a-image
          :src="modelStore.selectedImage.imageUrl"
          alt="BTS"
          :preview="false"
          class="object-contain"
          style="width: 100%; height: calc(100vh - 228px - 84px)"
        >
          <template #placeholder>
            <div class="relative h-full">
              <a-image
                :src="modelStore.selectedImage.previewImageUrl"
                class="blur-sm object-contain"
                :preview="false"
                style="width: 100%; height: calc(100vh - 228px - 84px)"
              />
              <div class="loader-line absolute bottom-0 w-full" />
            </div>
          </template>
        </a-image>
      </div>
      <a-button
        ghost
        class="absolute left-2 w-12 h-12 m-0 p-0 border-none"
        v-if="indexOfSelectedImage > 0"
        @click="dataImage2D?.data && onChangeImage(dataImage2D?.data[indexOfSelectedImage - 1])"
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          <path
            fill="white"
            d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z"
          ></path>
        </svg>
      </a-button>
      <a-button
        ghost
        class="absolute right-2 w-12 h-12 m-0 p-0 border-none"
        v-if="dataImage2D?.data && indexOfSelectedImage < dataImage2D?.data?.length - 1"
        @click="dataImage2D?.data && onChangeImage(dataImage2D?.data[indexOfSelectedImage + 1])"
      >
        <svg
          class="rotate-180"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          <path
            fill="white"
            d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z"
          ></path>
        </svg>
      </a-button>
      <div
        class="absolute h-8 px-4 flex flex-row items-center rounded-[15px] top-4 right-4 bg-[#212121]"
      >
        <a-button
          class="m-0 p-0 w-4 h-4 border-none bg-transparent"
          @click="onZoomOut"
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
              d="M14 9H2V7h12v2Z"
            ></path>
          </svg>
        </a-button>
        <a-select
          v-model:value="zoomValue"
          size="small"
          style="width: 74px"
          class="mx-4"
          :options="[
            { label: 'x1', value: '1' },
            { label: 'x2', value: '2' },
            { label: 'x3', value: '3' },
            { label: 'x4', value: '4' },
            { label: 'x5', value: '5' },
            { label: 'x6', value: '6' },
            { label: 'x7', value: '7' },
            { label: 'x8', value: '8' },
            { label: 'x9', value: '9' },
            { label: 'x10', value: '10' },
          ]"
          @change="handleZoomChange"
        ></a-select>
        <a-button
          class="m-0 p-0 w-4 h-4 border-none bg-transparent"
          @click="onZoomIn"
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
    </div>
    <div class="pl-2 h-[30px] flex flex-row items-center">
      <div class="flex flex-row items-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          <path
            fill="#888"
            d="M20 5h-3.17L15 3H9L7.17 5H4a2.006 2.006 0 0 0-2 2v12a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V7a2.006 2.006 0 0 0-2-2Zm0 14H4V7h4.05l1.83-2h4.24l1.83 2H20v12ZM12 8a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8a3 3 0 1 1 3-3 3.008 3.008 0 0 1-3 3Z"
          ></path>
        </svg>
        <a-typography-text class="text-[#888] text-sm">
          &nbsp;{{ modelStore?.selectedImage?.fileName.split('.')[0] }} ({{
            modelStore?.selectedImage?.id
          }})
        </a-typography-text>
      </div>
      <a-tooltip
        title="Gimbal Pitch"
        placement="top"
        color="#212121"
      >
        <div class="flex flex-row items-center ml-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
          >
            <path
              fill="#888"
              d="m19 2-3 4h2c0 .49-.136 12-12 12v-2l-4 3 4 3v-2C19.84 20 20 6.14 20 6h2l-3-4Z"
            ></path>
            <path
              fill="#888"
              d="M4 14h5a2 2 0 0 0 2-2h2V6h-2a2 2 0 0 0-2-2H8v3.011a2.5 2.5 0 1 1-3 0V4H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2Z"
            ></path>
            <path
              fill="#888"
              d="M6.5 10.5A1.497 1.497 0 0 0 7 7.592V2H6v5.592a1.496 1.496 0 0 0 .5 2.908Z"
            ></path>
          </svg>
          <a-typography-text class="text-[#888] text-sm">
            &nbsp;{{ modelStore.selectedImage?.gimbalPitchDegree }}°
          </a-typography-text>
        </div>
      </a-tooltip>
      <a-tooltip
        title="Gimbal Yaw"
        placement="top"
        color="#212121"
      >
        <div class="flex flex-row items-center ml-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            focusable="false"
          >
            <path
              fill="#888"
              d="M4 7V2h1l2 3V2h1v5H7L5 4v3H4Z"
            ></path>
            <path
              fill="#888"
              d="m19 13.74-1.17-1.62-6.76 4.47a5.15 5.15 0 0 0-4.54-2.68 2.428 2.428 0 0 0-.47 0V9H4v13h2.54L19 13.74ZM6.06 15.92c.156-.02.314-.02.47 0a3 3 0 0 1 2.84 1.84l-3.31 2.2v-4.04Z"
            ></path>
            <path
              fill="#888"
              d="M16.41 7.59a17 17 0 0 0-6.17-3l-.29 1a15.84 15.84 0 0 1 5.74 2.8L14 10h4V6l-1.59 1.59Z"
            ></path>
          </svg>
          <a-typography-text class="text-[#888] text-sm">
            &nbsp;{{ modelStore.selectedImage?.gimbalYawDegree }}°
          </a-typography-text>
        </div>
      </a-tooltip>
      <div class="flex flex-row items-center ml-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
          focusable="false"
        >
          <path
            fill="#888"
            d="M13 5v8H3V5h10Zm0-1H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1Z"
          ></path>
          <path
            fill="#888"
            d="M6 2H4v2h2V2Z"
          ></path>
          <path
            fill="#888"
            d="M12 2h-2v2h2V2Z"
          ></path>
          <path
            fill="#888"
            d="M7 7H5v2h2V7Z"
          ></path>
          <path
            fill="#888"
            d="M11 7H9v2h2V7Z"
          ></path>
          <path
            fill="#888"
            d="M7 10H5v2h2v-2Z"
          ></path>
          <path
            fill="#888"
            d="M11 10H9v2h2v-2Z"
          ></path>
          <path
            fill="#888"
            d="M13 5H3v1h10V5Z"
          ></path>
        </svg>
        <a-typography-text class="text-[#888] text-sm">
          &nbsp;{{ modelStore.selectedImage?.updatedAt }}
        </a-typography-text>
      </div>
    </div>
    <div class="overflow-auto gap-2 flex flex-row h-[198px] bg-[#303030]">
      <div
        v-for="item in dataImage2D?.data"
        :key="item.id"
        :ref="(el) => (imageRefs[item.fileName] = el)"
        class="cursor-pointer"
      >
        <a-image
          @click="onChangeImage(item)"
          :src="item.previewImageUrl"
          alt="bts-image"
          style="width: 172px; height: 172px"
          :preview="false"
          :class="
            item.id === modelStore.selectedImage?.id && 'border-2 border-solid border-red-500'
          "
          :fallback="imageFallback"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelStore } from '@/stores/model';
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useChangeImage } from '@/potree/hooks/useChangeImage';
import Panzoom from '@panzoom/panzoom';
import type { PanzoomObject } from '@panzoom/panzoom/src/types';
import { useRoute } from 'vue-router';
import { useGetImage2D } from '@/services/hooks/useBTS';
import { imageFallback } from '@/utils/constants';

const imageRefs = reactive<any>({});

const modelStore = useModelStore();
const { onChangeImage } = useChangeImage();

const route = useRoute();

const zoomValue = ref('1');

const indexOfSelectedImage = computed(() =>
  dataImage2D?.value?.data
    ? dataImage2D?.value.data?.findIndex((item) => item.id === modelStore.selectedImage?.id) || -1
    : -1,
);

const { data: dataImage2D } = useGetImage2D(
  computed(() => route.query.id as string),
  computed(() => !!route.query.id),
);

const panzoomContainer = ref<HTMLElement | null>(null);
let panzoomInstance: PanzoomObject | null = null;

onMounted(() => {
  if (panzoomContainer.value) {
    // Khởi tạo Panzoom với các tùy chọn
    panzoomInstance = Panzoom(panzoomContainer.value, {
      contain: 'outside',
      startScale: 1,
      maxScale: 10,
    });

    // Thêm sự kiện wheel để zoom
    const parentElement = panzoomContainer.value.parentElement;
    if (parentElement) {
      parentElement.addEventListener('wheel', panzoomInstance.zoomWithWheel.bind(panzoomInstance));
    }
  }
});

onUnmounted(() => {
  if (panzoomContainer.value && panzoomInstance) {
    // Xóa sự kiện wheel khi component bị huỷ
    const parentElement = panzoomContainer.value.parentElement;
    if (parentElement) {
      parentElement.removeEventListener(
        'wheel',
        panzoomInstance.zoomWithWheel.bind(panzoomInstance),
      );
    }
  }
});

const scrollToSelectedImage = (image: any) => {
  if (imageRefs[image]) {
    imageRefs[image].scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }
};

watch(
  () => modelStore.selectedImage,
  (newSelectedImage) => {
    scrollToSelectedImage(newSelectedImage?.fileName);
    panzoomInstance?.zoom(1);
    zoomValue.value = '1';
  },
);

onMounted(() => {
  if (modelStore.selectedImage) {
    scrollToSelectedImage(modelStore.selectedImage.fileName);
  }
});

const handleWheel = (event: MouseEvent) => {
  event.preventDefault(); // Ngăn chặn hành vi mặc định của scroll

  const scale = panzoomInstance?.getScale();
  if (scale) {
    zoomValue.value = scale.toFixed(1).toString();
  }
};

const handleZoomChange = (value: string) => {
  panzoomInstance?.zoom(Number(value));
};

const onZoomOut = () => {
  panzoomInstance?.zoomOut();
  const scale = panzoomInstance?.getScale();
  if (scale) {
    zoomValue.value = scale.toFixed(1).toString();
  }
};

const onZoomIn = () => {
  panzoomInstance?.zoomIn();
  const scale = panzoomInstance?.getScale();
  if (scale) {
    zoomValue.value = scale.toFixed(1).toString();
  }
};
</script>

<style>
.loader-line {
  height: 3px;
  overflow: hidden;
  background-color: #ddd;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
}

.loader-line:before {
  content: '';
  position: absolute;
  left: -50%;
  height: 3px;
  width: 40%;
  background-color: #ee0033;
  -webkit-animation: lineAnim 1s linear infinite;
  -moz-animation: lineAnim 1s linear infinite;
  animation: lineAnim 1s linear infinite;
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
}

@keyframes lineAnim {
  0% {
    left: -40%;
  }
  50% {
    left: 20%;
    width: 80%;
  }
  100% {
    left: 100%;
    width: 100%;
  }
}
</style>
