<template>
  <a-config-provider
    :locale="viVN"
    :theme="{
      token: {
        colorPrimary: '#D0002D',
      },
      algorithm: theme.defaultAlgorithm,
    }"
  >
    <a-layout has-sider>
      <MenusAdmin />
      <a-layout :style="{ marginLeft: '312px' }">
        <header>
          <HeaderAdmin />
        </header>
        <main style="height: calc(100vh - 64px); overflow: auto">
          <RouterView v-if="route.path === ADMIN_UPDATE_PROFILE" />
          <a-layout-content
            class="m-5"
            v-else
          >
            <div class="bg-white wrapper-content">
              <RouterView />
            </div>
          </a-layout-content>
        </main>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>
<script lang="ts" setup>
import { ADMIN_UPDATE_PROFILE, LOGIN_PAGE_PATH } from '@/router/routePath';
import { LOCAL_STORAGE_KEY } from '@/utils/enums';
import { computed } from 'vue';
import router from '@/router';
import viVN from 'ant-design-vue/es/locale/vi_VN';
import { theme } from 'ant-design-vue';
import HeaderAdmin from '@/views/admin/HeaderAdmin.vue';
import MenusAdmin from '@/views/admin/MenusAdmin.vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const isAuthenticate = computed(() =>
  Boolean(localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN)),
);

if (!isAuthenticate.value) {
  router.push(LOGIN_PAGE_PATH);
}
</script>
<style scoped>
.wrapper-content {
  padding: 33px 65px 33px 65px;
  border-radius: 5px;
}
</style>
