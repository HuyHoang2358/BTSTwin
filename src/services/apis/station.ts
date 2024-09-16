
import client from '@/services/client';
import { API_STATION } from '@/services/apiPath';
import type { IdParam, IndexRequestParams, PaginateRequestParams, PaginateResType, WrapperResponse } from '@/services/services.types';
import type { Country, Province, District, Commune } from '@/services/apis/address';

export interface Location {
  id: number
  latitude: number
  longitude: number
  height: number
}



export interface Address {
  id: number
  detail: any
  country: Country
  province: Province
  district: District
  commune: Commune
}

export interface Station {
  id: number
  name: string
  code: string
  description: any
  location: Location
  address: Address
}

export type StationData = {
  name: string | null
  code: string | null
  description: string | null
  location_latitude: number | null
  location_longitude: number | null
  location_height: number | null
  address_detail: string | null
  address_country_id: number | null
  address_province_id: number | null
  address_district_id: number | null
  address_commune_id: number | null
};

// TODO: Functions
export const fetchStations = (
  params: IndexRequestParams & PaginateRequestParams
): WrapperResponse<PaginateResType<Station>> => client.get(API_STATION, {
  params
});

export const createStation = (data: StationData) => client.post(API_STATION, data);

export const updateStation = (data: StationData & IdParam) =>
  client.patch(`${API_STATION}/${data.id}`, data);

export const deleteStation = (id: number) => client.delete(`${API_STATION}/${id}`);

