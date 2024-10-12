<template>
  <div class="absolute bottom-4 left-4 z-10">
    <img
      src="/potree/build/potree/resources/icons/left.svg"
      style="width: 32px; height: 32px"
      class="button-measure-icon"
      title="Góc nhìn bên trái"
      alt="Left view"
      @click="onLeftView"
    >
    <img
      src="/potree/build/potree/resources/icons/right.svg"
      style="width: 32px; height: 32px"
      class="button-measure-icon"
      title="Góc nhìn bên phải"
      alt="Right view"
      @click="onRightView"
    >
    <img
      src="/potree/build/potree/resources/icons/front.svg"
      style="width: 32px; height: 32px"
      class="button-measure-icon"
      title="Góc nhìn chính diện"
      alt="Front view"
      @click="onFrontView"
    >
    <img
      src="/potree/build/potree/resources/icons/back.svg"
      style="width: 32px; height: 32px"
      class="button-measure-icon"
      title="Góc nhìn đằng sau"
      alt="Back view"
      @click="onBackView"
    >
    <img
      src="/potree/build/potree/resources/icons/top.svg"
      style="width: 32px; height: 32px"
      class="button-measure-icon"
      title="Góc nhìn từ trên xuống"
      alt="Top view"
      @click="onTopView"
    >
    <img
      src="/potree/build/potree/resources/icons/bottom.svg"
      style="width: 32px; height: 32px"
      class="button-measure-icon"
      title="Góc nhìn từ dưới lên"
      alt="Bottom view"
      @click="onBottomView"
    >
  </div>

  <div class="absolute flex flex-row bottom-4 left-[220px] z-10 bg-[#212121] rounded-full">
    <Setting />
  </div>

  <div
    class="absolute flex flex-row bottom-4 left-[260px] z-10 bg-[#212121] rounded-l-2xl rounded-r-2xl"
  >
    <a-button
      class="p-0 w-8 flex items-center justify-center border-none bg-transparent"
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
        />
      </svg>
    </a-button>
    <a-button
      class="p-0 w-8 flex items-center justify-center border-none bg-transparent"
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
        />
      </svg>
    </a-button>
  </div>
</template>
<script setup lang="ts">
import Setting from '@/components/Setting.vue';

const onLeftView = () => window.potreeViewer.setLeftView();
const onRightView = () => window.potreeViewer.setRightView();
const onFrontView = () => window.potreeViewer.setFrontView();
const onBackView = () => window.potreeViewer.setBackView();
const onTopView = () => window.potreeViewer.setTopView();
const onBottomView = () => window.potreeViewer.setBottomView();

const onZoomOut = () => {
  // window.potreeViewer.setFOV(window.potreeViewer.getFOV() + 10);
};

const onZoomIn = () => {
  // window.potreeViewer.setFOV(window.potreeViewer.getFOV() - 10);
};
</script>
