import { createRouter, createWebHistory } from 'vue-router';
import {
  ADMIN_PAGE_PATH,
  LOGIN_PAGE_PATH,
  HOME_PAGE_PATH,
  MODEL_3D_PAGE_PATH,
  CATEGORY_DEVICE_PATH,
  CATEGORY_POLE_PATH,
  DEVICE_PATH,
  CATEGORY_VENDOR_PATH,
  POLE_PATH,
  CATEGORY_WINDY_AREA_PATH,
  STATION_PATH,
  STATION_DETAIL_PATH,
  PROCESSING_DATA_PROCESS,
} from '@/router/routePath';

import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import DashBoard from '@/views/admin/DashBoard.vue';
import UpdateAccount from '@/views/admin/UpdateAccount.vue';
import LogView from '@/views/admin/LogView.vue';
import Model3DView from '@/views/Model3DView.vue';

import CategoryDevice from '@/views/admin/category/CategoryDevice.vue';
import CategoryPole from '@/views/admin/category/CategoryPole.vue';
import Device from '@/views/admin/data/Device.vue';
import Vendor from '@/views/admin/category/Vendor.vue';
import Pole from '@/views/admin/data/Pole.vue';
import WindyArea from '@/views/admin/category/WindyArea.vue';
import Station from '@/views/admin/data/Station.vue';
import StationDetail from '@/views/admin/data/StationDetail.vue';
import ProcessView from '@/views/admin/data/ProcessView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: HOME_PAGE_PATH,
      name: 'home',
      component: HomeView,
    },
    {
      path: MODEL_3D_PAGE_PATH,
      name: 'model-view',
      component: Model3DView,
    },
    {
      path: LOGIN_PAGE_PATH,
      name: 'auth-login',
      component: LoginView,
    },
    {
      path: ADMIN_PAGE_PATH,
      component: DashBoard,
      meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: CATEGORY_DEVICE_PATH,
          component: CategoryDevice,
        },
        {
          path: CATEGORY_POLE_PATH,
          component: CategoryPole,
        },
        {
          path: CATEGORY_VENDOR_PATH,
          component: Vendor,
        },
        {
          path: CATEGORY_WINDY_AREA_PATH,
          component: WindyArea,
        },
        {
          path: DEVICE_PATH,
          component: Device,
        },

        {
          path: POLE_PATH,
          component: Pole,
        },
        {
          path: STATION_PATH,
          component: Station,
        },
        {
          name: 'station-detail',
          path: STATION_DETAIL_PATH,
          component: StationDetail,
        },
        {
          path: PROCESSING_DATA_PROCESS,
          component: ProcessView,
        },

        {
          path: 'log',
          component: LogView,
        },
        {
          path: 'profile',
          component: UpdateAccount,
        },
      ],
    },
  ],
});

export default router;
