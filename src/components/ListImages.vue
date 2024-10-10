<template>
  <div class="flex flex-col">
    <div
      class="relative flex flex-col justify-center"
      v-if="modelStore.selectedImage"
    >
      <div
        ref="panzoomContainer"
        :style="styleImage"
        class="bg-[#303030] flex justify-center"
        @wheel="handleWheel"
      >
        <a-image
          :src="modelStore.selectedImage.image_url"
          alt="BTS"
          :preview="false"
          class="object-contain w-full"
          :style="styleImage"
        >
          <template #placeholder>
            <div class="relative h-full">
              <a-image
                :src="modelStore.selectedImage.preview_image_url"
                class="blur-sm object-contain"
                :preview="false"
                :style="styleImage"
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
        class="absolute h-8 flex flex-row items-center rounded-[15px] top-4 right-2 bg-[#212121]"
      >
        <div class="flex flex-row items-center ml-4">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.9555 0H2.04453C0.917156 0 0 0.917188 0 2.04456V13.9555C0 15.0828 0.917156 16 2.04453 16H13.9555C15.0828 16 16 15.0828 16 13.9554V2.04456C16 0.917188 15.0828 0 13.9555 0ZM15.0576 13.9555C15.0576 14.5632 14.5632 15.0576 13.9555 15.0576H2.04453C1.43681 15.0576 0.942406 14.5632 0.942406 13.9555V12.2365L4.04413 9.59741C4.15731 9.50109 4.32244 9.50019 4.43669 9.59506L6.37962 11.2084C6.56697 11.364 6.84197 11.3512 7.01412 11.1789L11.6307 6.55531C11.7141 6.47172 11.8114 6.46359 11.8622 6.46619C11.9128 6.46878 12.0089 6.48684 12.0833 6.57856L15.0576 10.2408L15.0576 13.9555ZM15.0576 8.74578L12.8149 5.98434C12.5925 5.71047 12.2628 5.54303 11.9104 5.52494C11.5583 5.50712 11.213 5.63969 10.9637 5.88938L6.651 10.2088L5.03881 8.87006C4.57134 8.48188 3.89622 8.48591 3.43341 8.87969L0.942406 10.9991V2.04456C0.942406 1.43684 1.43681 0.942438 2.04453 0.942438H13.9555C14.5632 0.942438 15.0576 1.43684 15.0576 2.04456V8.74578Z"
              fill="#F6F6F6"
            />
          </svg>
          <a-typography-text class="mx-2 font-medium text-[#f6f6f6]">
            {{ modelStore?.selectedImage?.filename.split('.')[0] }}
          </a-typography-text>
          <div class="w-px h-8 bg-[#4c4c4c]" />
        </div>
        <a-button
          class="m-0 p-0 w-8 h-8 border-none bg-transparent flex items-center justify-center"
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
          class="m-0 p-0 w-8 h-8 border-none bg-transparent flex items-center justify-center"
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
      <a-button
        :class="[
          'absolute bottom-0 m-0 p-0 border-none h-5 w-6 left-1/2 transform -translate-x-1/2 bg-[#282828] flex justify-center items-center',
          isExpandedList
            ? 'rotate-180 rounded-b-[10px] rounded-t-none'
            : 'rounded-t-[10px] rounded-b-none',
        ]"
        type="ghost"
        @click="isExpandedList = !isExpandedList"
      >
        <IconExpandedImage />
      </a-button>
    </div>
    <div class="pl-2 h-[30px] flex flex-row items-center justify-between">
      <div class="flex flex-row">
        <a-tooltip
          title="Tên ảnh"
          placement="top"
          color="#212121"
        >
          <div class="flex flex-row gap-1 items-center">
            <icon-camera class="w-4 h-4" />
            <a-typography-paragraph
              :ellipsis="{ rows: 1 }"
              class="text-[#888] text-sm"
              style="margin-bottom: 0"
              :content="modelStore?.selectedImage?.filename.split('.')[0]"
            />
          </div>
        </a-tooltip>
        <a-tooltip
          title="Gimbal Pitch"
          placement="top"
          color="#212121"
        >
          <div class="flex flex-row items-center ml-2">
            <icon-gimbal-pitch />
            <a-typography-paragraph
              :ellipsis="{ rows: 1 }"
              class="text-[#888] text-sm"
              style="margin-bottom: 0"
              :content="modelStore.selectedImage?.gimbal.pitch_degree"
            />
          </div>
        </a-tooltip>
        <a-tooltip
          title="Gimbal Yaw"
          placement="top"
          color="#212121"
        >
          <div class="flex flex-row items-center ml-2">
            <icon-gimbal-yaw />
            <a-typography-paragraph
              :ellipsis="{ rows: 1 }"
              class="text-[#888] text-sm"
              style="margin-bottom: 0"
              :content="modelStore.selectedImage?.gimbal.yaw_degree"
            />
          </div>
        </a-tooltip>
        <a-tooltip
          title="Ngày chụp ảnh"
          placement="top"
          color="#212121"
        >
          <div class="flex flex-row gap-1 items-center ml-2">
            <icon-date class="w-4 h-4" />
            <a-typography-paragraph
              :ellipsis="{ rows: 1 }"
              class="text-[#888] text-sm"
              style="margin-bottom: 0"
              :content="modelStore.selectedImage?.take_date"
            />
          </div>
        </a-tooltip>
      </div>
      <a-tooltip
        title="Tải ảnh"
        placement="top"
        color="#212121"
      >
        <a-button
          type="ghost"
          class="flex flex-row gap-1 items-center p-1"
          @click="
            downloadImage(
              modelStore.selectedImage?.image_url || '',
              modelStore.selectedImage?.filename || '',
            )
          "
        >
          <icon-download class="w-4 h-4" />
        </a-button>
      </a-tooltip>
    </div>
    <div
      class="overflow-auto gap-2 flex flex-row h-[198px] bg-[#303030]"
      v-if="isExpandedList"
    >
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
import IconExpandedImage from '@/components/icons/IconExpandedImage.vue';

const imageRefs = reactive<any>({});
const isExpandedList = ref(true);

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

const styleImage = computed(() => ({
  height: `calc(100vh - ${isExpandedList.value ? '228px' : '32px'} - 84px)`,
}));

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

watch(isExpandedList, () => {
  if (isExpandedList.value) {
    setTimeout(() => {
      scrollToSelectedImage(modelStore.selectedImage?.filename);
    }, 100);
  }
});

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
