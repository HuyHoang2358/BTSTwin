<template>
  <a-layout-sider class="slider">
    <!-- Logo Admin -->
    <div class="py-3.5 flex flex-row justify-center items-center relative">
      <div class="absolute left-4">
        <a
          class="group h-10 w-10 m-0 p-0"
          :href="HOME_PAGE_PATH"
        >
          <IconHomeAdmin class="text-[#454545] group-hover:text-[#EE0033]" />
        </a>
      </div>
      <img
        src="/images/auth/logo-viettel.png"
        alt="logo-viettel"
        class="logo"
      />
    </div>

    <a-divider class="h-px bg-[#373737] m-0 p-0" />

    <a-menu
      v-model:selectedKeys="configStore.selectedMenuKeys"
      theme="dark"
      mode="inline"
      class="mt-20"
      v-model:openKeys="openKeys"
    >
      <!-- Quản trị hệ thống -->
      <!--      <a-sub-menu key="system">
        <template #title>
          <span class="ml-4 font-medium font-sarabun text-lg text-main">
            {{ $t('admin.menus.systemManagement') }}
          </span>
        </template>
        <MenuItem
          :path="ADMIN_USER_PAGE_PATH"
          :menu-key="MENU_KEY.USER"
          :title="$t('admin.menus.user')"
        >
          <IconUser />
        </MenuItem>
        <MenuItem
          :path="ADMIN_MENU_PAGE_PATH"
          :menu-key="MENU_KEY.MENU"
          :title="$t('admin.menus.permission')"
        >
          <IconFunction />
        </MenuItem>

        <MenuItem
          :path="ROLE_PAGE_PATH"
          :menu-key="MENU_KEY.ROLE"
          :title="$t('admin.menus.role')"
        >
          <IconRole />
        </MenuItem>
        <MenuItem
          :path="ADMIN_RIGHT_PAGE_PATH"
          :menu-key="MENU_KEY.RIGHT"
          :title="$t('admin.menus.right')"
        >
          <IconRight />
        </MenuItem>
        <MenuItem
          :path="ADMIN_LOGS_PAGE_PATH"
          :menu-key="MENU_KEY.LOG"
          :title="$t('admin.menus.log')"
        >
          <IconLog />
        </MenuItem>
      </a-sub-menu>-->

      <!-- Quản lý danh mục -->
      <a-sub-menu key="index">
        <template #title>
          <span class="ml-4 font-medium font-sarabun text-lg text-main">
            {{ t('admin.menus.categoryManagement') }}
          </span>
        </template>
        <!-- Quản lý danh mục thiết b-->
        <MenuItem
          :path="`${ADMIN_PAGE_PATH}/${CATEGORY_DEVICE_PATH}`"
          :menu-key="MENU_KEY.CATEGORY_DEVICE"
          :title="t('admin.menus.deviceCategory')"
        >
          <IconCategory />
        </MenuItem>

        <MenuItem
          :path="`${ADMIN_PAGE_PATH}/${CATEGORY_POLE_PATH}`"
          :menu-key="MENU_KEY.CATEGORY_POLE"
          :title="t('admin.menus.poleCategory')"
        >
          <IconDatabase />
        </MenuItem>

        <MenuItem
          :path="`${ADMIN_PAGE_PATH}/${CATEGORY_WINDY_AREA_PATH}`"
          :menu-key="MENU_KEY.CATEGORY_WINDY_AREA"
          :title="t('admin.menus.windyAreaManager')"
        >
          <IconDatabase />
        </MenuItem>

        <MenuItem
          :path="`${ADMIN_PAGE_PATH}/${CATEGORY_VENDOR_PATH}`"
          :menu-key="MENU_KEY.CATEGORY_VENDOR"
          :title="t('admin.menus.vendorManager')"
        >
          <IconDatabase />
        </MenuItem>
      </a-sub-menu>

      <!-- Quản lý dữ liệu -->
      <a-sub-menu key="data">
        <template #title>
          <span class="ml-4 font-medium font-sarabun text-lg text-main">
            {{ $t('admin.menus.dataManagement') }}
          </span>
        </template>

        <MenuItem
          :path="`${ADMIN_PAGE_PATH}/${DEVICE_PATH}`"
          :menu-key="MENU_KEY.DEVICE"
          :title="t('admin.menus.deviceManager')"
        >
          <IconCategoryAILabel />
        </MenuItem>
        <MenuItem
          :path="`${ADMIN_PAGE_PATH}/${POLE_PATH}`"
          :menu-key="MENU_KEY.POLE"
          :title="t('admin.menus.PoleManager')"
        >
          <IconMap />
        </MenuItem>
        <MenuItem
          :path="`${ADMIN_PAGE_PATH}/${STATION_PATH}`"
          :menu-key="MENU_KEY.STATION"
          :title="t('admin.menus.StationManager')"
        >
          <IconThirdPartyLayer />
        </MenuItem>
      </a-sub-menu>
      <!-- Cấu hình hệ thống -->
      <!--      <a-menu-item-->
      <!--        :key="MENU_KEY.CONFIG"-->
      <!--        :id="MENU_KEY.CONFIG"-->
      <!--      >-->
      <!--        <router-link-->
      <!--          :to="'#'"-->
      <!--          class="font-medium font-sarabun text-lg text-main"-->
      <!--        >-->
      <!--          {{ t('admin.menus.config') }}-->
      <!--        </router-link>-->
      <!--      </a-menu-item>-->
    </a-menu>
  </a-layout-sider>
</template>

<script setup lang="ts">
import {
  HOME_PAGE_PATH,
  ADMIN_PAGE_PATH,
  CATEGORY_DEVICE_PATH,
  CATEGORY_POLE_PATH,
  DEVICE_PATH,
  CATEGORY_VENDOR_PATH,
  POLE_PATH,
  CATEGORY_WINDY_AREA_PATH,
  STATION_PATH,
} from '@/router/routePath';

import { MENU_KEY } from '@/utils/enums';
import MenuItem from '@/views/admin/MenuItem.vue';
import IconHomeAdmin from '@/components/icons/home/IconHomeAdmin.vue';
import IconCategory from '@/components/icons/admin/IconCategory.vue';
import IconDatabase from '@/components/icons/admin/IconDatabase.vue';
import IconMap from '@/components/icons/admin/IconMap.vue';
import IconThirdPartyLayer from '@/components/icons/IconThirdPartyLayer.vue';
import IconCategoryAILabel from '@/components/icons/IconCategoryAILabel.vue';
import { ref } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const configStore = useConfigStore();
const openKeys = ref(['system', 'index', 'data', 'aiModule']);
</script>

<style scoped>
.slider {
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
}

.logo {
  width: 138px;
  height: 54px;
}
</style>
