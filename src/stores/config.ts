import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { LOCAL_STORAGE_KEY, MENU_KEY } from '@/utils/enums';
import { useRoute } from 'vue-router';
import {
  ADMIN_ADMINISTRATIVE_UNITS_PAGE_PATH,
  ADMIN_APP_PAGE_PATH,
  ADMIN_DATA_TYPE_PAGE_PATH,
  ADMIN_FIELD_PAGE_PATH,
  ADMIN_LOGS_PAGE_PATH,
  ADMIN_MENU_PAGE_PATH,
  ADMIN_POSITION_PAGE_PATH,
  ADMIN_RIGHT_PAGE_PATH,
  ADMIN_SPEC_LAYERS_PAGE_PATH,
  ADMIN_UNIT_PAGE_PATH,
  ADMIN_USER_PAGE_PATH,
  ROLE_PAGE_PATH,
  ADMIN_IMAGERY_PAGE_PATH,
  ADMIN_DEFAULT_LAYER_PAGE_PATH,
  ADMIN_SATELLITE_LAYER_PAGE_PATH,
  ADMIN_AI_MODULE_CATEGORY_PAGE_PATH,
  ADMIN_AI_MODULE_LABEL_PAGE_PATH,
  ADMIN_LAYERS_PRIVATE_PAGE_PATH,
  ADMIN_RASTER_DATA_STORE_PATH,
  ADMIN_PROJECT_PAGE_PATH,
  ADMIN_MEDIA_MANAGER_PATH,

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
      case ADMIN_MENU_PAGE_PATH:
        return [MENU_KEY.MENU];
      case ADMIN_APP_PAGE_PATH:
        return [MENU_KEY.APP];
      case ADMIN_USER_PAGE_PATH:
        return [MENU_KEY.USER];
      case ADMIN_RIGHT_PAGE_PATH:
        return [MENU_KEY.RIGHT];
      case ROLE_PAGE_PATH:
        return [MENU_KEY.ROLE];
      case ADMIN_UNIT_PAGE_PATH:
        return [MENU_KEY.UNIT];
      case ADMIN_POSITION_PAGE_PATH:
        return [MENU_KEY.POSITION];
      case ADMIN_LOGS_PAGE_PATH:
        return [MENU_KEY.LOG];
      case ADMIN_DATA_TYPE_PAGE_PATH:
        return [MENU_KEY.DATA_TYPE];
      case ADMIN_FIELD_PAGE_PATH:
        return [MENU_KEY.FIELD];
      case ADMIN_ADMINISTRATIVE_UNITS_PAGE_PATH:
        return [MENU_KEY.ADMINISTRATIVE_UNITS];
      case ADMIN_SATELLITE_LAYER_PAGE_PATH:
        return [MENU_KEY.SATELLITE_LAYER];
      case ADMIN_DEFAULT_LAYER_PAGE_PATH:
        return [MENU_KEY.DEFAULT_LAYER];
      case ADMIN_SPEC_LAYERS_PAGE_PATH:
        return [MENU_KEY.LAYER_SPEC];
      case ADMIN_IMAGERY_PAGE_PATH:
        return [MENU_KEY.IMAGERY];
      case ADMIN_AI_MODULE_CATEGORY_PAGE_PATH:
        return [MENU_KEY.AI_MODULE_CATEGORY];
      case ADMIN_AI_MODULE_LABEL_PAGE_PATH:
        return [MENU_KEY.AI_MODULE_LABEL];
      case ADMIN_LAYERS_PRIVATE_PAGE_PATH:
        return [MENU_KEY.LAYER_PRIVATE];
      case ADMIN_RASTER_DATA_STORE_PATH:
        return [MENU_KEY.RASTER_STORE];
      case ADMIN_PROJECT_PAGE_PATH:
        return [MENU_KEY.PROJECT];
      case ADMIN_MEDIA_MANAGER_PATH:
        return [MENU_KEY.MEDIA];
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
