<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView />
</template>

<script lang="ts">
import { notification } from 'ant-design-vue';

notification.config({
  placement: 'topRight',
  rtl: true,
});
</script>
