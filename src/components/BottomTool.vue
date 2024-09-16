<template>
  <li id="navigation">
    <img
      src="/icons/left.svg"
      style="width: 32px; height: 32px"
      class="button-icon"
      title="Góc nhìn bên trái"
      alt="Left view"
      @click="onLeftView"
    />
    <img
      src="/icons/right.svg"
      style="width: 32px; height: 32px"
      class="button-icon"
      title="Góc nhìn bên phải"
      alt="Right view"
      @click="onRightView"
    />
    <img
      src="/icons/front.svg"
      style="width: 32px; height: 32px"
      class="button-icon"
      title="Góc nhìn chính diện"
      alt="Front view"
      @click="onFrontView"
    />
    <img
      src="/icons/back.svg"
      style="width: 32px; height: 32px"
      class="button-icon"
      title="Góc nhìn đằng sau"
      alt="Back view"
      @click="onBackView"
    />
    <img
      src="/icons/top.svg"
      style="width: 32px; height: 32px"
      class="button-icon"
      title="Góc nhìn từ trên xuống"
      alt="Top view"
      @click="onTopView"
    />
    <img
      src="/icons/bottom.svg"
      style="width: 32px; height: 32px"
      class="button-icon"
      title="Góc nhìn từ dưới lên"
      alt="Bottom view"
      @click="onBottomView"
    />
  </li>
</template>
<script setup lang="ts">
const onLeftView = () => window.potreeViewer.setLeftView();
const onRightView = () => window.potreeViewer.setRightView();
const onFrontView = () => window.potreeViewer.setFrontView();
const onBackView = () => window.potreeViewer.setBackView();
const onTopView = () => window.potreeViewer.setTopView();
const onBottomView = () => window.potreeViewer.setBottomView();
</script>
