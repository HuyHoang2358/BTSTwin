import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { LOCAL_STORAGE_KEY, MENU_KEY } from '@/utils/enums';
import { useRoute } from 'vue-router';
import {
  CATEGORY_DEVICE_PATH,
  CATEGORY_POLE_PATH,
  ADMIN_PAGE_PATH,
  CATEGORY_WINDY_AREA_PATH,
  CATEGORY_VENDOR_PATH,
  DEVICE_PATH,
  POLE_PATH,
  STATION_PATH,
} from '@/router/routePath';
import type { LoginResType } from '@/services/apis/auth';

export const useConfigStore = defineStore('config', () => {
  const accessToken = ref<string | null>(localStorage.getItem(LOCAL_STORAGE_KEY.ACCESS_TOKEN));
  const isOpenModalHandleProfile = ref<boolean>(false);
  const isOpenModalSetting = ref<boolean>(false);
  const isOpenModalChangePassword = ref<boolean>(false);
  const userInfo = ref(
    localStorage.getItem(LOCAL_STORAGE_KEY.USER_INFO) &&
      JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY.USER_INFO) || ''),
  );
  const locale = ref(localStorage.getItem(LOCAL_STORAGE_KEY.LOCALE) || 'en');

  const route = useRoute();

  const getMenuKey = () => {
    switch (route?.path) {
      case `${ADMIN_PAGE_PATH}/${CATEGORY_DEVICE_PATH}`:
        return [MENU_KEY.CATEGORY_DEVICE];
      case `${ADMIN_PAGE_PATH}/${CATEGORY_POLE_PATH}`:
        return [MENU_KEY.CATEGORY_POLE];
      case `${ADMIN_PAGE_PATH}/${CATEGORY_WINDY_AREA_PATH}`:
        return [MENU_KEY.CATEGORY_WINDY_AREA];
      case `${ADMIN_PAGE_PATH}/${CATEGORY_VENDOR_PATH}`:
        return [MENU_KEY.CATEGORY_VENDOR];
      case `${ADMIN_PAGE_PATH}/${DEVICE_PATH}`:
        return [MENU_KEY.DEVICE];
      case `${ADMIN_PAGE_PATH}/${POLE_PATH}`:
        return [MENU_KEY.POLE];
      case `${ADMIN_PAGE_PATH}/${STATION_PATH}`:
        return [MENU_KEY.STATION];
      default:
        return [];
    }
  };

  watch(route, () => {
    selectedMenuKeys.value = getMenuKey();
  });

  const selectedMenuKeys = ref<MENU_KEY[]>(getMenuKey());

  function setAccessToken(newValue: string) {
    accessToken.value = newValue;
  }

  function setUserInfo(newValue: LoginResType) {
    userInfo.value = newValue;
  }

  return {
    accessToken,
    setAccessToken,
    selectedMenuKeys,
    userInfo,
    setUserInfo,
    isOpenModalHandleProfile,
    isOpenModalChangePassword,
    isOpenModalSetting,
    locale,
  };
});
