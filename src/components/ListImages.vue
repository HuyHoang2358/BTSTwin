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
          :src="modelStore.selectedImage.image_url"
          alt="BTS"
          :preview="false"
          class="object-contain"
          style="width: 100%; height: calc(100vh - 228px - 84px)"
        >
          <template #placeholder>
            <div class="relative h-full">
              <a-image
                :src="modelStore.selectedImage.preview_image_url"
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
        @click="modelStore.images && onChangeImage(modelStore.images[indexOfSelectedImage - 1])"
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
        v-if="modelStore.images && indexOfSelectedImage < modelStore.images.length - 1"
        @click="modelStore.images && onChangeImage(modelStore.images[indexOfSelectedImage + 1])"
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
      <a-tooltip
        title="Tên ảnh"
        placement="top"
        color="#212121"
      >
        <div class="flex flex-row gap-2 items-center">
          <icon-camera />
          <a-typography-text class="text-[#888] text-sm">
            &nbsp;{{ modelStore?.selectedImage?.filename.split('.')[0] }}
            <!--({{
            modelStore?.selectedImage?.id
          }})-->
          </a-typography-text>
        </div>
      </a-tooltip>
      <a-tooltip
        title="Gimbal Pitch"
        placement="top"
        color="#212121"
      >
        <div class="flex flex-row gap-1 items-center ml-2">
          <icon-gimbal-pitch />
          <a-typography-text class="text-[#888] text-sm">
            &nbsp;{{ modelStore.selectedImage?.gimbal.pitch_degree }}°
          </a-typography-text>
        </div>
      </a-tooltip>
      <a-tooltip
        title="Gimbal Yaw"
        placement="top"
        color="#212121"
      >
        <div class="flex flex-row gap-1 items-center ml-2">
          <icon-gimbal-yaw />
          <a-typography-text class="text-[#888] text-sm">
            &nbsp;{{ modelStore.selectedImage?.gimbal.yaw_degree }}°
          </a-typography-text>
        </div>
      </a-tooltip>
      <a-tooltip
        title="Ngày chụp ảnh"
        placement="top"
        color="#212121"
      >
        <div class="flex flex-row gap-2 items-center ml-2">
          <icon-date />
          <a-typography-text class="text-[#888] text-sm">
            {{ modelStore.selectedImage?.take_date }}
          </a-typography-text>
        </div>
      </a-tooltip>

      <a-button
        type="ghost"
        class="flex flex-row gap-1 items-center"
        @click="
          downloadImage(modelStore.selectedImage?.image_url, modelStore.selectedImage?.filename)
        "
      >
        <icon-download />
        <a-typography-text class="text-[#888] hover:text-red-600 text-sm">
          Tải xuống
        </a-typography-text>
      </a-button>
    </div>
    <div class="overflow-auto gap-2 flex flex-row h-[198px] bg-[#303030]">
      <div
        v-for="item in modelStore.images"
        :key="item.id"
        :ref="(el) => (imageRefs[item.filename] = el)"
        class="cursor-pointer"
      >
        <a-image
          @click="onChangeImage(item)"
          :src="item.preview_image_url"
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
import { imageFallback } from '@/utils/constants';
import IconDate from '@/components/icon/IconDate.vue';
import IconGimbalYaw from '@/components/icon/IconGimbalYaw.vue';
import IconGimbalPitch from '@/components/icon/IconGimbalPitch.vue';
import IconCamera from '@/components/icon/IconCamera.vue';
import IconDownload from '@/components/icon/IconDownload.vue';

const imageRefs = reactive<any>({});

const modelStore = useModelStore();
const { onChangeImage } = useChangeImage();

const zoomValue = ref('1');

const indexOfSelectedImage = computed(() =>
  modelStore.images
    ? modelStore.images?.findIndex((item) => item.id === modelStore.selectedImage?.id) || -1
    : -1,
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
    scrollToSelectedImage(newSelectedImage?.filename);
    panzoomInstance?.zoom(1);
    zoomValue.value = '1';
  },
);

onMounted(() => {
  if (modelStore.selectedImage) {
    scrollToSelectedImage(modelStore.selectedImage.filename);
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

const downloadImage = async (imageUrl: string, filename: string) => {
  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename; // Tên file khi tải về
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
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
