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
} from '@/router/routePath';

import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import DashBoard from '@/views/admin/DashBoard.vue';
import AdministrativeView from '@/views/admin/AdministrativeView.vue';
import UpdateAccount from '@/views/admin/UpdateAccount.vue';
import LogView from '@/views/admin/LogView.vue';
import DataTypeView from '@/views/admin/DataTypeView.vue';
import FieldView from '@/views/admin/FieldView.vue';
import SpecLayerView from '@/views/admin/SpecLayerView.vue';
import ImageryView from '@/views/admin/ImageryView.vue';
import SatelliteLayerView from '@/views/admin/SatelliteLayerView.vue';
import DefaultLayerView from '@/views/admin/DefaultLayerView.vue';
import LabelCategoryView from '@/views/admin/AIModule/LabelCategoryView.vue';
import LabelAIView from '@/views/admin/AIModule/LabelAIView.vue';
import RasterDataStoreView from '@/views/admin/RasterDataStoreView.vue';
import PrivateLayerView from '@/views/admin/PrivateLayerView.vue';
import ChangeDetectionResultView from '@/views/admin/AIModule/ChangeDetectionResultView.vue';
import ObjectDetectionResultView from '@/views/admin/AIModule/ObjectDetectionResultView.vue';
import ProjectView from '@/views/admin/ProjectView.vue';
import MediaManagerView from '@/views/admin/MediaManagerView.vue';
import Model3DView from '@/views/Model3DView.vue';

import CategoryDevice from '@/views/admin/category/CategoryDevice.vue';
import CategoryPole from '@/views/admin/category/CategoryPole.vue';
import Device from '@/views/admin/data/Device.vue';
import Vendor from '@/views/admin/category/Vendor.vue';
import Pole from '@/views/admin/data/Pole.vue';
import WindyArea from '@/views/admin/category/WindyArea.vue';
import Station from '@/views/admin/data/Station.vue';
import StationDetail from '@/views/admin/data/StationDetail.vue';

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
          path: 'log',
          component: LogView,
        },
        {
          path: 'data-type',
          component: DataTypeView,
        },
        {
          path: 'field',
          component: FieldView,
        },
        {
          path: 'administrative',
          component: AdministrativeView,
        },
        {
          path: 'profile',
          component: UpdateAccount,
        },
        {
          path: 'satellite-layer',
          component: SatelliteLayerView,
        },
        {
          path: 'default-layer',
          component: DefaultLayerView,
        },
        {
          path: 'spec-layer',
          component: SpecLayerView,
        },
        {
          path: 'layer-private',
          component: PrivateLayerView,
        },
        {
          path: 'imagery',
          component: ImageryView,
        },
        {
          path: 'raster-store',
          component: RasterDataStoreView,
        },
        {
          path: 'ai-module/categories',
          component: LabelCategoryView,
        },
        {
          path: 'ai-module/labels',
          component: LabelAIView,
        },
        {
          path: 'ai-module/change-detection-result',
          component: ChangeDetectionResultView,
        },
        {
          path: 'ai-module/object-detection-result',
          component: ObjectDetectionResultView,
        },
        {
          path: 'ai-module/land-use-cover-result',
          component: ChangeDetectionResultView,
        },
        {
          path: 'project',
          component: ProjectView,
        },
        {
          path: 'media-manager',
          component: MediaManagerView,
        },
      ],
    },
  ],
});

export default router;
