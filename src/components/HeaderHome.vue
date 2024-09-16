<template>
  <header
    class="bg-[#212121] flex flex-row justify-between items-center w-full h-[56px] pl-3.5 pr-2.5"
  >
    <a-image
      src="/icons/ViettelAI-2023.svg"
      :width="105"
      :height="37"
      :preview="false"
    />
    <div class="flex flex-row items-center dark-form">
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
        <a-badge
          :count="data?.length || 0"
          :overflow-count="99"
          class="mr-5 mt-1"
        >
          <IconNoti class="cursor-pointer" />
        </a-badge>
      </a-popover>
      <a-dropdown
        placement="bottomLeft"
        :arrow="{ pointAtCenter: true }"
        trigger="click"
      >
        <a-button class="bg-transparent m-0 p-0 border-none">
          <div class="flex items-center">
            <IconProfile class="text-white mr-2" />
            <div class="flex flex-col">
              <a-typography-text class="text-[#FAFAFA] text-xs font-medium">
                {{ profileData?.data?.name || 'Tên người dùng' }}
              </a-typography-text>
              <a-typography-text
                class="text-[#7D7D7D] text-start text-xs text-[10px] font-medium whitespace-nowrap overflow-hidden w-12 overflow-ellipsis"
              >
                {{ profileData?.data?.profile?.title?.name || 'Vai trò' }}
              </a-typography-text>
            </div>
          </div>
        </a-button>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="onNavigateToDashBoard">
              <div class="flex items-center my-2">
                <IconInfoAccount class="mr-3 text-[#201C1D]" />
                <a-typography-text class="text-[#201C1D] font-normal text-xs">
                  Trang quản trị hệ thống
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
  </header>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue';
import { useConfigStore } from '@/stores/config';
import { useProfile } from '@/services/hooks/useUser';
import IconProfile from '@/components/icons/IconProfile.vue';
import IconNoti from '@/components/icons/home/IconNoti.vue';
import { useNotifications } from '@/services/hooks/useSystem';
import type { NotificationResType } from '@/services/apis/systemApi';
import IconLogOutAccount from '@/components/icons/home/IconLogOutAccount.vue';
import IconInfoAccount from '@/components/icons/home/IconInfoAccount.vue';
import { useRouter } from 'vue-router';
import { ADMIN_USER_PAGE_PATH } from '@/router/routePath';

const configStore = useConfigStore();
const router = useRouter();

const isEnableProfile = computed(() => !!configStore.accessToken);
const { data: profileData } = useProfile(isEnableProfile);

const onLogout = () => {
  localStorage.clear();
  window.location.reload();
};

const notificationsData = []
/*const { data: notificationsData, isPending } = useNotifications();

const data: ComputedRef<NotificationResType[]> = computed(() => {
  return notificationsData?.value?.data || [];
});*/

const onNavigateToDashBoard = () => {
  router.push(ADMIN_USER_PAGE_PATH);
};
</script>
