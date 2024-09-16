<template>
  <a-layout-header
    :style="{ background: '#fff', padding: 0 }"
    class="flex flex-row justify-end"
  >
    <div class="flex flex-row justify-end items-center gap-x-6 pr-6">
      <a-popover
        title="Danh sách thông báo"
        trigger="click"
        placement="bottomRight"
      >
        <template #content>
          <a-list
            item-layout="horizontal"
            :data-source="data"
            style="width: 350px; max-height: 450px"
            class="overflow-auto"
            :loading="isPending"
          >
            <template #renderItem="{ item }">
              <a-list-item style="padding-left: 0; padding-right: 0">
                <a-list-item-meta :description="item?.description">
                  <template #title>
                    <p class="mb-0 text-sm">{{ item.message || 'Thông báo' }}</p>
                  </template>
                  <template #description>
                    <p class="mb-0 text-xs">{{ item.createdAt }}</p>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </template>
        <a-button
          type="ghost"
          class="w-8 h-8 m-0 p-0"
        >
          <IconBellInActive class="text-[#201C1D] group-hover:text-main" />
        </a-button>
      </a-popover>
      <a-dropdown
        placement="bottomLeft"
        :arrow="{ pointAtCenter: true }"
        trigger="click"
      >
        <a-button
          type="ghost"
          class="w-8 h-8 p-0 m-0"
        >
          <IconProfile class="text-[#201C1D]" />
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="onShowProfile">
              <div class="flex items-center my-2">
                <IconInfoAccount class="mr-3 text-[#201C1D]" />
                <a-typography-text class="text-[#201C1D] font-normal text-xs">
                  Thông tin tài khoản
                </a-typography-text>
              </div>
            </a-menu-item>
            <a-menu-item @click="onLogout">
              <div class="flex items-center my-2">
                <IconLogOutAccount class="mr-3 text-[#201C1D]" />
                <a-typography-text class="text-[#201C1D] font-normal text-xs">
                  Đăng xuất
                </a-typography-text>
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import IconLogOutAccount from '@/components/icons/home/IconLogOutAccount.vue';
import IconBellInActive from '@/components/icons/IconBellInActive.vue';
import IconProfile from '@/components/icons/IconProfile.vue';
import type { NotificationResType } from '@/services/apis/systemApi';
import IconInfoAccount from '@/components/icons/home/IconInfoAccount.vue';
import router from '@/router';
import { ADMIN_UPDATE_PROFILE } from '@/router/routePath';
import { useNotifications } from '@/services/hooks/useSystem';

const onLogout = () => {
  localStorage.clear();
  window.location.reload();
};
/*
const { data: notificationsData, isPending } = useNotifications();*/

const data = [];
/*
const data: ComputedRef<NotificationResType[]> = computed(() => {
  return notificationsData?.value?.data || [];
});
*/

const onShowProfile = () => {
  router.push(ADMIN_UPDATE_PROFILE);
};
</script>
