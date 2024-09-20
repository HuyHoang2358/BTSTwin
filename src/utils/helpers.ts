import { defaultPage, defaultPageSize, displayDateFormat, excelMineType } from '@/utils/constants';
import dayjs from 'dayjs';
import type {
  BaseRefParams,
  IndexRefParams,
  PaginateRefParams,
  PaginationRefParams,
} from '@/services/services.types';
import { useConfigStore } from '@/stores/config';
import { useModelStore } from '@/stores/model';

export function filterSameElement(arr: { text: string; value: string }[]) {
  const uniqueElements = new Set();

  const result: { text: string; value: string }[] = [];

  arr.forEach((item) => {
    if (!uniqueElements.has(JSON.stringify(item))) {
      uniqueElements.add(JSON.stringify(item));
      result.push(item);
    }
  });

  return result;
}

export const downloadFile = (file: Blob, fileName?: string) => {
  const url = URL.createObjectURL(
    new Blob([file], {
      type: excelMineType,
    }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${fileName || 'result'}_${dayjs().format(displayDateFormat)}`);
  document.body.appendChild(link);
  link.click();
};

const normalizeVietnamese = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const compareString = (value: string, searchValue: string, ignoreAccent: boolean = true) => {
  if (ignoreAccent) {
    value = normalizeVietnamese(value);
    searchValue = normalizeVietnamese(searchValue);
  }
  return value.toUpperCase().trim().includes(searchValue.toUpperCase().trim());
};

export const getParamsFromBaseRefParams = (params: BaseRefParams & PaginationRefParams) => ({
  page: params?.currentPage?.value ? params.currentPage?.value : defaultPage,
  size: params?.pageSize?.value || defaultPageSize,
  searchValue: params?.searchValue?.value || undefined,
  sort: params?.sort?.value || undefined,
  direction: params?.direction?.value || undefined,
});

export const getParamsFromIndexRefParams = (params: IndexRefParams & PaginateRefParams) => {
  const queryParams: any = {
    page: params?.page?.value ? params.page?.value : defaultPage,
    perPage: params?.perPage?.value || defaultPageSize,
    sort: params?.sort?.value || undefined,
    filter: params?.filter?.value || undefined,
    searchValue: params?.searchValue?.value || undefined,
  };
  // Loại bỏ các giá trị null hoặc undefined
  Object.keys(queryParams).forEach((key) => {
    if (queryParams[key] === null || queryParams[key] === undefined) {
      delete queryParams[key];
    }
  });
  return queryParams;
};

export const getRoiIdsAndDistrictIdsFromRegionSelect = (region?: string[]) => {
  const roiIds =
    region?.filter((r) => r.startsWith('roi_')).map((r) => Number(r.replace('roi_', ''))) || [];
  const districtIds =
    region
      ?.filter((r) => r.startsWith('district_'))
      .map((r) => Number(r.replace('district_', ''))) || [];

  return { roiIds, districtIds };
};

export const checkPermission = (permission: string) => {
  const configStore = useConfigStore();

  return configStore.userInfo?.scopes?.includes(permission);
};

export function formatNumber(num: number) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function checkRuleActiveTool(except?: string[]) {
  const modelStore = useModelStore();
  if (except && except.includes(modelStore.activeTool)) {
    return false;
  }

  return (
    modelStore.activeTool === 'angle' ||
    modelStore.activeTool === 'distance' ||
    modelStore.activeTool === 'area' ||
    modelStore.activeTool === 'height' ||
    modelStore.activeTool === 'circle' ||
    modelStore.activeTool === 'azimuth' ||
    modelStore.activeTool === 'clip_volume_inside' ||
    modelStore.activeTool === 'add-inventory' ||
    modelStore.activeTool === 'annotation'
  );
}

export function convertToDMS(degrees: number): string {
  const absolute = Math.abs(degrees);
  const deg = Math.floor(absolute);
  const min = Math.floor((absolute - deg) * 60);
  const sec = Math.round((absolute - deg - min / 60) * 3600);
  const direction =
    degrees >= 0 ? (degrees === degrees ? 'N/E' : 'S/W') : degrees === degrees ? 'S/W' : 'N/E';
  return `${deg}° ${min}' ${sec}" ${direction}`;
}
