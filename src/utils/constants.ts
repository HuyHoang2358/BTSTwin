import type { ChartOptions } from 'chart.js';
import { AI_FORM, AI_FUNCTION, AI_REQUESTS, FIELD_SLUG, UPLOAD_FILE_TYPE } from '@/utils/enums';
import type { AIFunctionType } from '@/utils/types';

export const shareOptions = [
  {
    label: 'Chỉ mình tôi',
    value: 'PRIVATE',
  },
  {
    label: 'Nội bộ',
    value: 'INTERNAL',
  },
  {
    label: 'Công khai',
    value: 'PUBLIC',
  },
];

export const displayDateFormat = 'DD/MM/YYYY';

export const bodyDateFormat = 'YYYY-MM-DD';

export const responseDateFormat = 'YYYY-MM-DD';

export const activeKeyBottomHome = 'BOTTOM_HOME';

export const keyNotificationMap = 'keyNotificationMap';

export const defaultPage = 1;

export const defaultPageSize = 10;

export const coating = [
  { id: 2, name: 'road', color: '#FFAA32', vn_name: 'Đường GT', rgb: [255, 170, 50] },
  { id: 3, name: 'water', color: '#A0FFFF', vn_name: 'Mặt nước', rgb: [160, 255, 255] },
  { id: 4, name: 'forest', color: '#AAFF32', vn_name: 'Rừng, cây xanh', rgb: [170, 255, 50] },
  { id: 5, name: 'agricultural', color: '#FFFF64', vn_name: 'Vườn, ruộng', rgb: [255, 255, 100] },
  {
    id: 1,
    name: 'building',
    color: '#FFA0FF',
    vn_name: 'Công trình nhân tạo',
    rgb: [255, 160, 255],
  },
  {
    id: 0,
    name: 'ground',
    color: '#FFFFFF',
    vn_name: 'Đất trống và cây bụi',
    rgb: [255, 255, 254],
  },
];

export const objects = [
  {
    id: 2,
    name: 'building',
    color: '#FFA0FF',
    vn_name: 'Building',
    rgb: [255, 160, 255],
  },
];

export const stackedBarChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  indexAxis: 'y',
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      display: false,
      font: {
        weight: 'bold',
      },
    },
  },
  scales: {
    y: {
      ticks: {
        color: '#f2f2f2',
      },
      grid: {
        color: '#434343',
      },
      stacked: true,
    },
    x: {
      ticks: {
        color: '#f2f2f2',
      },
      grid: {
        color: '#434343',
      },
      stacked: true,
      min: 0,
      max: 100,
    },
  },
};

export const excelMineType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const debounceSearchTime = 300;

export const advanceTimersByTime = 1000;

export const imageFallback =
  'data:image/png;base64,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';

export const bottomHeightPx = 195;

export const defaultReferenceLayersOpacity = 50;

export const uploadTabs = [
  {
    label: 'GeoJSON',
    value: UPLOAD_FILE_TYPE.GEO_JSON,
  },
  {
    label: 'KMZ',
    value: UPLOAD_FILE_TYPE.KMZ,
  },
  {
    label: 'KML',
    value: UPLOAD_FILE_TYPE.KML,
  },
];

export const provinceIdHaiPhong = '20';

export const maxPageSize = 999;

export const dataTypeSpecLayer = 'ban-do-chuyen-de';
export const dataTypeVectorLayer = 'vector';

export const aiFunction = {
  [FIELD_SLUG.BUILD]: {
    [AI_FUNCTION.DETECT_CHANGE]: {
      [AI_REQUESTS.THEO_DOI_BIEN_DONG_XAY_DUNG]: {},
    },
    [AI_FUNCTION.DETECT_OBJECT]: {
      [AI_REQUESTS.PHAT_HIEN_CONG_TRINH_VI_PHAM]: {
        [AI_FORM.SPEC_LAYER]: {
          required: true,
          placeholder: 'Ranh giới các khu vực cấm xây dựng',
        },
      },
    },
  },
  [FIELD_SLUG.INVESTMENT_PLAN]: {
    [AI_FUNCTION.DETECT_CHANGE]: {
      [AI_REQUESTS.THEO_DOI_TIEN_DO_DU_AN]: {
        [AI_FORM.PROJECT]: {
          required: false,
        },
      },
    },
    [AI_FUNCTION.MONITOR_CURRENT_STATUS]: {
      [AI_REQUESTS.GIAM_SAT_HIEN_TRANG_KHU_VUC_THU_HUT_DAU_TU]: {
        [AI_FORM.SPEC_LAYER]: {
          required: false,
          placeholder: 'Ranh giới khu vực dự kiến thu hút đầu tư',
        },
      },
    },
  },
  [FIELD_SLUG.TRANSPORTATION]: {
    [AI_FUNCTION.DETECT_CHANGE]: {
      [AI_REQUESTS.PHAT_HIEN_BIEN_DONG_HANH_LANG_GIAO_THONG]: {
        [AI_FORM.SPEC_LAYER]: {
          required: false,
          placeholder: 'Ranh giới hành lang giao thông',
        },
      },
    },
    [AI_FUNCTION.MONITOR_CURRENT_STATUS]: {
      [AI_REQUESTS.GIAM_SAT_HIEN_TRANG_HANH_LANG_GIAO_THONG]: {
        [AI_FORM.SPEC_LAYER]: {
          required: false,
          placeholder: 'Ranh giới hành lang giao thông',
        },
      },
    },
  },
  [FIELD_SLUG.ENVIRONMENTAL_RESOURCES]: {
    [AI_FUNCTION.DETECT_CHANGE]: {
      [AI_REQUESTS.PHAT_HIEN_THAY_DOI_TAI_CAC_DAO]: {
        [AI_FORM.SPEC_LAYER]: {
          required: false,
          placeholder: 'Ranh giới các đảo',
        },
      },
      [AI_REQUESTS.PHAT_HIEN_BIEN_DONG_HANH_LANG_BO_BIEN]: {
        [AI_FORM.SPEC_LAYER]: {
          required: false,
          placeholder: 'Ranh giới hành lang bảo vệ bờ biển',
        },
      },
      [AI_REQUESTS.QUAN_LY_DU_AN_LAN_BIEN]: {
        [AI_FORM.SPEC_LAYER]: {
          required: false,
          placeholder: 'Ranh giới dự án lấn biển',
        },
      },
      [AI_REQUESTS.PHAT_HIEN_BIEN_DONG_XAY_DUNG_CONG_TRINH_BIEN]: {},
      [AI_REQUESTS.PHAT_HIEN_LAN_CHIEM_DAT_SU_DUNG_DAT_SAI_MUC_DICH]: {
        [AI_FORM.SPEC_LAYER]: {
          required: false,
          placeholder: 'Bản đồ quy hoạch sử dụng đất',
        },
      },
      [AI_REQUESTS.THEO_DOI_TIEN_DO_THUC_HIEN_DU_AN_TIEN_DO_DUA_DAT_VAO_SU_DUNG]: {
        [AI_FORM.SPEC_LAYER]: {
          required: true,
          placeholder: 'Ranh giới các dự án',
        },
      },
    },
    [AI_FUNCTION.DETECT_OBJECT]: {
      [AI_REQUESTS.PHAT_HIEN_LONG_BE_NUOI_TRONG_THUY_HAI_SAN]: {},
    },
    [AI_FUNCTION.MONITOR_CURRENT_STATUS]: {
      [AI_REQUESTS.GIAM_SAT_HIEN_TRANG_CAC_DAO]: {},
      [AI_REQUESTS.GIAM_SAT_HIEN_TRANG_SU_DUNG_DAT]: {},
      [AI_REQUESTS.GIAM_SAT_HIEN_TRANG_KHU_VUC_KHAI_THAC_KHOANG_SAN]: {
        [AI_FORM.SPEC_LAYER]: {
          required: false,
          placeholder: 'Ranh giới khu vực khai thác khoáng sản',
        },
      },
      [AI_REQUESTS.GIAM_SAT_HIEN_TRANG_CAC_KHU_VUC_KHAI_THAC_KHOANG_SAN]: {
        [AI_FORM.SPEC_LAYER]: {
          required: false,
          placeholder: 'Ranh giới các khu vực khai thác khoáng sản',
        },
      },
    },
  },
  [FIELD_SLUG.AGRICULTURE]: {
    [AI_FUNCTION.DETECT_CHANGE]: {
      [AI_REQUESTS.GIAM_SAT_BIEN_DONG_DIEN_TICH_DO_CHE_PHU_CUA_CAC_LOAI_RUNG]: {
        [AI_FORM.SPEC_LAYER]: {
          required: false,
          placeholder: 'Bản đồ 3 loại rừng',
        },
      },
      [AI_REQUESTS.GIAM_SAT_HIEN_TRANG_VA_BIEN_DONG_KHU_VUC_NUOI_TRONG_THUY_SAN]: {},
      [AI_REQUESTS.PHAT_BIEN_BIEN_DONG_CAC_VUNG_SAN_XUAT_NONG_NGHIEP_TAP_TRUNG]: {
        [AI_FORM.SPEC_LAYER]: {
          required: false,
          placeholder: 'Ranh giới vùng nông nghiệp tập trung (cây trồng)',
        },
      },
    },
    [AI_FUNCTION.MONITOR_CURRENT_STATUS]: {
      [AI_REQUESTS.GIAM_SAT_DIEN_TICH_DO_CHE_PHU_CUA_CAC_LOAI_RUNG]: {
        [AI_FORM.SPEC_LAYER]: {
          required: false,
          placeholder: 'Bản đồ 3 loại rừng',
        },
      },
      [AI_REQUESTS.GIAM_SAT_HIEN_TRANG_CONG_TRINH_THUY_LOI_DE_DIEU_BAI_SONG]: {},
      [AI_REQUESTS.GIAM_SAT_KHU_VUC_THEO_NHOM_CAY_TRONG]: {},
      [AI_REQUESTS.KHU_VUC_DAT_RUONG_BO_HOANG]: {
        [AI_FORM.SPEC_LAYER]: {
          required: false,
          placeholder: 'Ranh giới đất lúa theo bản đồ hiện trạng sử dụng đất',
        },
      },
    },
  },
} as AIFunctionType;

export const imageryParams = {
  service: 'WMS',
  request: 'GetMap',
  format: 'image/png',
  transparent: true,
};

export const layerSlug = {
  districts: 'districts',
  places: 'places',
  region: 'region',
};

const scopes = [
  'DepartmentService.store',
  'RoiService.store',
  'UserService.update',
  'LandUseLandCoverService.searchLandUseLandCover',
  'NotificationService.destroyNotification',
  'LayerVectorService.destroyPrivateLayerVector',
  'ImageryService.filterImagery',
  'SystemConfigService.update',
  'ObjectDetectionResultService.destroyObjectDetectionResultByImageryId',
  'LayerRasterService.updateLayerRaster',
  'PermissionGroupService.search',
  'ChangeDetectionResultService.processLayer',
  'NoteService.getNoteByPlaceId',
  'UserService.resetPassword',
  'ImageryService.updateImagery',
  'PermissionGroupService.update',
  'LayerVectorService.searchLayerVector',
  'LayerVectorService.searchPrivateLayerVector',
  'AiLabelService.searchAiLabelById',
  'UnitService.destroy',
  'UserService.getInRole',
  'DepartmentService.destroy',
  'SavedPlaceListService.createSavePlaceList',
  'LayerThirdPartyService.storeLayerThirdParty',
  'UserService.destroy',
  'SystemConfigService.search',
  'UserService.search',
  'SavedPlaceListService.deleteSavedPlaceList',
  'RoleService.destroy',
  'ChangeDetectionResultService.destroyByLayerId',
  'PermissionGroupService.get',
  'RoleService.update',
  'LandUseLandCoverService.processLandUseLandCoverLayer',
  'UserService.destroyRole',
  'PermissionService.store',
  'LandUseLandCoverService.destroyLandUseLandCoverByLayerId',
  'PlaceService.searchPlace',
  'SavedPlaceListService.getPlacesInSavedList',
  'UnitService.import',
  'PlaceService.getSavedPlaces',
  'SystemConfigService.destroy',
  'RoiService.search',
  'ChangeDetectionResultService.searchChangeDetectionResult',
  'ObjectDetectionResultService.searchObjectDetectionResult',
  'AdministrativeUnitService.exportGeoJson',
  'ObjectDetectionResultService.destroyObjectDetectionResultByLayerId',
  'LayerVectorService.updateLayerVector',
  'AiLabelService.searchAllAiLabel',
  'LandUseLandCoverService.storeLandUseLandCover',
  'DepartmentService.import',
  'LayerVectorService.publicLayerVector',
  'RoleService.search',
  'DataCategoryService.destroy',
  'UnitService.search',
  'AiCategoryService.searchAllAiCategory',
  'UserService.storePermission',
  'ObjectDetectionResultService.detectObject',
  'UnitService.removeUnitUser',
  'RoleService.store',
  'LandUseLandCoverService.destroyLandUseLandCoverByImageryId',
  'DataCategoryService.store',
  'RoiService.update',
  'UnitService.update',
  'NotificationService.getNotificationById',
  'UnitService.getTree',
  'AiLabelService.destroyAiLabel',
  'UserService.import',
  'SystemConfigService.store',
  'PlaceService.storeFixLocation',
  'ProfileService.changePassword',
  'NotificationService.updateNotification',
  'LayerVectorService.cancelSharing',
  'LayerRasterService.getLayerRasterById',
  'PermissionService.search',
  'LayerRasterService.destroyLayerRaster',
  'ProfileService.update',
  'UserService.destroyPermission',
  'UnitService.getCategory',
  'ObjectDetectionResultService.monitorObjectDetectionResult',
  'AiLabelService.updateAiLabel',
  'LogService.search',
  'LayerThirdPartyService.updateLayerThirdParty',
  'SavedPlaceListService.deletePlaceFromSavedList',
  'AuthorizationService.search',
  'RasterStoreService.searchRasterStore',
  'UserService.storeRole',
  'UnitService.exportUnitUser',
  'LayerRasterService.storeLayerRaster',
  'LayerVectorService.getLayerVectorById',
  'PermissionGroupService.destroy',
  'AiLabelService.searchAiLabelBySlug',
  'PhotoService.uploadSingleImage',
  'AiLayerService.publishChangeDetectionResult',
  'ImageryService.searchImagery',
  'ObjectDetectionResultService.storeObjectDetectionResponse',
  'LayerVectorService.getLayerVectorSlug',
  'LayerVectorService.storeLayerVector',
  'LayerThirdPartyService.searchAllLayerThirdParty',
  'UserService.store',
  'UnitService.searchUnitUser',
  'NotificationService.readAllNotification',
  'SavedPlaceListService.addPlaceToSavedList',
  'PermissionService.update',
  'LayerVectorService.getFeatureInfo',
  'TitleService.destroy',
  'PlaceService.storePlace',
  'UserConfigService.update',
  'PermissionService.get',
  'PlaceService.upsertNotePlace',
  'TitleService.update',
  'LayerVectorService.shareLayerVector',
  'DepartmentService.search',
  'PermissionGroupService.store',
  'UserService.export',
  'UserService.getInPermission',
  'RasterStoreService.destroyRasterStore',
  'RoleService.getDetail',
  'AdministrativeUnitService.search',
  'DataCategoryService.update',
  'RasterStoreService.updateRasterStore',
  'NotificationService.storeNotification',
  'SavedPlaceListService.updateSavedPlaceList',
  'SavedPlaceListService.getAllSavedPlaceLists',
  'LandUseLandCoverService.searchLandUseLandCoverInRoi',
  'RasterStoreService.storeRasterStore',
  'LayerThirdPartyService.importLayerThirdParty',
  'LayerRasterService.searchLayerRaster',
  'AiLabelService.storeAiLabel',
  'AdministrativeUnitService.exportXlsx',
  'DataCategoryService.searchTree',
  'RoiService.destroy',
  'NotificationService.getUserNotification',
  'DepartmentService.update',
  'TitleService.store',
  'LayerVectorService.destroyLayerVector',
  'TitleService.search',
  'PermissionService.destroy',
  'PlaceService.getPlaceDetail',
  'ChangeDetectionResultService.destroyByImageryId',
  'ProfileService.get',
  'RasterStoreService.searchAllRasterStore',
  'UserService.getProfile',
  'DataCategoryService.search',
  'UnitService.store',
  'LayerThirdPartyService.destroyLayerThirdParty',
  'LogService.destroy',
];
