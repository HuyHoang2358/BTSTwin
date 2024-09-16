import type { Ref } from 'vue';
import type { Point } from '@/services/apis/savedPlaceList';

export type WrapperResponse<T> = Promise<{
  data: T;
}>;


export type PinType = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  type: string;
  location: string;
  point: Point;
  height: any;
  photos: any[];
};

export type BaseRefParams = {
  searchValue?: Ref<string>;
  name?: Ref<string>;
  direction?: Ref<string | undefined>;
  sort?: Ref<string | undefined>;
  filters?: Ref<Record<string, string[]> | undefined>;
};




export type PaginationRefParams = {
  pageSize?: Ref<number>;
  currentPage?: Ref<number>;
};

export type IndexRefParams = {
  search?: Ref<string>;
  sort?: Ref<string | undefined | null>;
  filter?: Ref<Record<string, string> | undefined | null>;
  searchValue?: Ref<string | undefined>;

};

export type IndexRequestParams = {
  sort?: string;
  searchValue?: string;
  filter?: Record<string, string>;
};


export type PaginateRefParams = {
  perPage?: Ref<number>;
  page?: Ref<number>;
};


export type IdParam = {
  id: string | number;
};

export type BaseRequestParams = {
  name?: string;
  sort?: string;
  direction?: string;
  searchValue?: string;
};

export type PaginationRequestParams = {
  page: number;
  size: number;
};


export type PaginateRequestParams = {
  page: number;
  perPage: number;
};

export type PaginationResType<T> = {
  page: number;
  pageSize: number;
  total: number;
  totalPage: number;
  items: T[];
};

export type PaginateResType<T> = {
  current_page: number;
  data: T[];
  first_page_url: string;
  last_page_url: string;
  from: number;
  to:number;
  last_page: number;
  links: any;
  prev_page_url: string;
  next_page_url: string;
  path: string;
  perPage: number;
  pageSize: number;
  total: number;
};



export type BaseResponse<T> = {
  code: string;
  message: string;
  data: T
}