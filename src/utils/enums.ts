import { PROCESSING_DATA_PROCESS } from '@/router/routePath';

export enum ICON_TOOL_ACTIVE {
  LAYER = 'LAYER',
  SAVED_PLACE_LIST = 'SAVED_PLACE_LIST',
  PRINTING = 'PRINTING',
  ZOOM_IN = 'ZOOM_IN',
  ZOOM_OUT = 'ZOOM_OUT',
  SEARCH = 'SEARCH',
  FULL_SCREEN = 'FULL_SCREEN',
  POLYGON = 'POLYGON',
  CARING_AREA = 'CARING_AREA',
  MEASURING_HORIZONTAL = 'MEASURING_HORIZONTAL',
  RULER = 'RULER',
  UPLOAD = 'UPLOAD',
  CHANGE_DETECTION_INFO = 'CHANGE_DETECTION_INFO',
  OBJECT_DETECTION_INFO = 'OBJECT_DETECTION_INFO',
  PLACE_INFO = 'PLACE_INFO',
}

export enum FILE_TYPE {
  SHP = '.shp',
  SHX = '.shx',
  DBF = '.dbf',
  PRJ = '.prj',
  XML = '.xml',
}

export enum LOCAL_STORAGE_KEY {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  USER_INFO = 'USER_INFO',
  LOCALE = 'LOCALE',
  SELECTED_FIELD = 'SELECTED_FIELD',
}

export enum MENU_KEY {
  MENU = 'MENU',
  APP = 'APP',
  USER = 'USER',
  ROLE = 'ROLE',
  POSITION = 'POSITION',
  PROJECT = 'PROJECT',
  RIGHT = 'RIGHT',
  UNIT = 'UNIT',
  LOG = 'LOG',
  DATA_TYPE = 'DATA_TYPE',
  FIELD = 'FIELD',
  ADMINISTRATIVE_UNITS = 'ADMINISTRATIVE_UNITS',
  SATELLITE_LAYER = 'SATELLITE_LAYER',
  DEFAULT_LAYER = 'DEFAULT_LAYER',
  LAYER_SPEC = 'LAYER_SPEC',
  LAYER_PRIVATE = 'LAYER_PRIVATE',
  IMAGERY = 'IMAGERY',
  RASTER_STORE = 'RASTER_STORE',
  CONFIG = 'CONFIG',
  MEDIA = 'MEDIA',
  AI_MODULE_CATEGORY = 'AI_MODULE_CATEGORY',
  AI_MODULE_LABEL = 'AI_MODULE_LABEL',

  // new
  CATEGORY_DEVICE = 'CATEGORY_DEVICE',
  CATEGORY_POLE = 'CATEGORY_POLE',
  CATEGORY_VENDOR = 'CATEGORY_VENDOR',
  CATEGORY_WINDY_AREA = 'CATEGORY_WINDY_AREA',
  DEVICE = 'DEVICE',
  POLE = 'POLE',
  STATION = 'STATION',
  PROCESSING_DATA_PROCESS = 'PROCESSING_DATA_PROCESS',
}

export enum UPLOAD_FILE_TYPE {
  GEO_JSON = '.geojson',
  KMZ = '.kmz',
  KML = '.kml',
}

export enum ACTIVE_FUNCTION {
  SEARCH_IMAGES = 'SEARCH_IMAGES',
  DETECT_CHANGE = 'DETECT_CHANGE',
  DETECT_OBJECT = 'DETECT_OBJECT',
  MONITOR_CURRENT_STATUS = 'MONITOR_CURRENT_STATUS',
  DEFAULT = 'DEFAULT',
}

export enum PERMISSION_TYPE {
  RIGHT = 'RIGHT',
  FUNCTION = 'FUNCTION',
}

export enum FIELD_SLUG {
  BUILD = 'xay-dung',
  INVESTMENT_PLAN = 'ke-hoach-dau-tu',
  TRANSPORTATION = 'giao-thong-van-tai',
  ENVIRONMENTAL_RESOURCES = 'tai-nguyen-moi-truong',
  AGRICULTURE = 'nong-nghiep-va-phat-trien-nong-thon',
}

export enum AI_FUNCTION {
  DETECT_CHANGE = 'DETECT_CHANGE',
  DETECT_OBJECT = 'DETECT_OBJECT',
  MONITOR_CURRENT_STATUS = 'MONITOR_CURRENT_STATUS',
}

export enum AI_REQUESTS {
  THEO_DOI_BIEN_DONG_XAY_DUNG = 'Theo dõi biến động xây dựng',
  PHAT_HIEN_CONG_TRINH_VI_PHAM = 'Phát hiện công trình vi phạm',
  THEO_DOI_TIEN_DO_DU_AN = 'Theo dõi tiến độ dự án',
  GIAM_SAT_HIEN_TRANG_KHU_VUC_THU_HUT_DAU_TU = 'Giám sát hiện trạng khu vực thu hút đầu tư',
  PHAT_HIEN_BIEN_DONG_HANH_LANG_GIAO_THONG = 'Phát hiện biến động hành lang giao thông',
  GIAM_SAT_HIEN_TRANG_HANH_LANG_GIAO_THONG = 'Giám sát hiện trạng hành lang giao thông',
  PHAT_HIEN_THAY_DOI_TAI_CAC_DAO = 'Phát hiện thay đổi tại các đảo',
  PHAT_HIEN_BIEN_DONG_HANH_LANG_BO_BIEN = 'Phát hiện biến động hành lang bờ biển',
  QUAN_LY_DU_AN_LAN_BIEN = 'Quản lý dự án lấn biển',
  PHAT_HIEN_BIEN_DONG_XAY_DUNG_CONG_TRINH_BIEN = 'Phát hiện biến động xây dựng công trình biển',
  PHAT_HIEN_LAN_CHIEM_DAT_SU_DUNG_DAT_SAI_MUC_DICH = 'Phát hiện lấn chiếm đất, sử dụng đất sai mục đích',
  THEO_DOI_TIEN_DO_THUC_HIEN_DU_AN_TIEN_DO_DUA_DAT_VAO_SU_DUNG = 'Theo dõi tiến độ thực hiện dự án, tiến độ đưa đất vào sử dụng',
  PHAT_HIEN_LONG_BE_NUOI_TRONG_THUY_HAI_SAN = 'Phát hiện lồng bè nuôi trồng thủy, hải sản',
  GIAM_SAT_HIEN_TRANG_CAC_DAO = 'Giám sát hiện trạng các đảo',
  GIAM_SAT_HIEN_TRANG_SU_DUNG_DAT = 'Giám sát hiện trạng sử dụng đất',
  GIAM_SAT_HIEN_TRANG_KHU_VUC_KHAI_THAC_KHOANG_SAN = 'Giám sát hiện trạng khu vực khai thác khoáng sản',
  GIAM_SAT_HIEN_TRANG_CAC_KHU_VUC_KHAI_THAC_KHOANG_SAN = 'Giám sát hiện trạng các khu vực khai thác khoáng sản',
  GIAM_SAT_BIEN_DONG_DIEN_TICH_DO_CHE_PHU_CUA_CAC_LOAI_RUNG = 'Giám sát biến động diện tích, độ che phủ của các loại rừng',
  GIAM_SAT_HIEN_TRANG_VA_BIEN_DONG_KHU_VUC_NUOI_TRONG_THUY_SAN = 'Giám sát hiện trạng và biến động khu vực nuôi trồng thủy sản',
  PHAT_BIEN_BIEN_DONG_CAC_VUNG_SAN_XUAT_NONG_NGHIEP_TAP_TRUNG = 'Phát biện biến động các vùng sản xuất nông nghiệp tập trung',
  GIAM_SAT_DIEN_TICH_DO_CHE_PHU_CUA_CAC_LOAI_RUNG = 'Giám sát diện tích, độ che phủ của các loại rừng',
  GIAM_SAT_HIEN_TRANG_CONG_TRINH_THUY_LOI_DE_DIEU_BAI_SONG = 'Giám sát hiện trạng công trình thủy lợi, đê điều, bãi sông',
  GIAM_SAT_KHU_VUC_THEO_NHOM_CAY_TRONG = 'Giám sát khu vực theo nhóm cây trồng',
  KHU_VUC_DAT_RUONG_BO_HOANG = 'Khu vực đất ruộng bỏ hoang',
}

export enum AI_FORM {
  SPEC_LAYER = 'Bản đồ chuyên đề',
  PROJECT = 'Dự án',
}
