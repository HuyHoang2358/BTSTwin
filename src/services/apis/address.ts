import client from '@/services/client';
import {
  API_ADDRESS_COMMUNE,
  API_ADDRESS_COUNTRY,
  API_ADDRESS_DISTRICT,
  API_ADDRESS_PROVINCE,
} from '@/services/apiPath';
import type { WrapperResponse } from '@/services/services.types';
import type { Ref } from 'vue';

export interface Address {
  id: number;
  detail: string | null;
  address_detail?: string;
  country: Country;
  province: Province;
  district: District;
  commune: Commune;
}

export interface Country {
  id: number;
  name: string;
  code: string;
  phone_code: string;
  currency: string;
  language: string;
}

export interface Province {
  id: number;
  name: string;
  code: string;
  slug: string;
  country_id: number;
}

export interface District {
  id: number;
  name: string;
  code: string;
  slug: string;
  province_id: number;
}

export interface Commune {
  id: number;
  name: string;
  code: string;
  slug: string;
  district_id: number;
  windy_area_id: number;
}

// TODO: Functions
export const fetchCountries = (): WrapperResponse<Country[]> => client.get(API_ADDRESS_COUNTRY);
export const fetchProvinces = (country_id: Ref<string>): WrapperResponse<Province[]> =>
  client.get(API_ADDRESS_PROVINCE, {
    params: {
      filter: {
        'country_id.in': country_id.value,
      },
    },
  });

export const fetchDistricts = (province_id: Ref<string>): WrapperResponse<District[]> =>
  client.get(API_ADDRESS_DISTRICT, {
    params: {
      filter: {
        'province_id.in': province_id.value,
      },
    },
  });

export const fetchCommunes = (district_id: Ref<string>): WrapperResponse<Commune[]> =>
  client.get(API_ADDRESS_COMMUNE, {
    params: {
      filter: {
        'district_id.in': district_id.value,
      },
    },
  });
