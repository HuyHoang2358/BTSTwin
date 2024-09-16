import { useQuery } from '@tanstack/vue-query';


import { fetchCommunes, fetchCountries, fetchDistricts, fetchProvinces } from '@/services/apis/address';
import type { Ref } from 'vue';


const ADDRESS_COUNTRY_QUERY_KEY = 'ADDRESS_COUNTRY_QUERY_KEY'
const ADDRESS_PROVINCE_QUERY_KEY = 'ADDRESS_PROVINCE_QUERY_KEY'
const ADDRESS_DISTRICT_QUERY_KEY = 'ADDRESS_DISTRICT_QUERY_KEY'
const ADDRESS_COMMUNE_QUERY_KEY = 'ADDRESS_COMMUNE_QUERY_KEY'

export const useAddressCountries = () =>
  useQuery({
    queryKey: [ADDRESS_COUNTRY_QUERY_KEY],
    queryFn:  fetchCountries
  });

export const useAddressProvinces = (country_id: Ref<string>) =>
  useQuery({
    queryKey: [ADDRESS_PROVINCE_QUERY_KEY, country_id],
    queryFn: () => fetchProvinces(country_id)
  });

export const useAddressDistricts = (province_id: Ref<string>) =>
  useQuery({
    queryKey: [ADDRESS_DISTRICT_QUERY_KEY, province_id],
    queryFn: () => fetchDistricts(province_id)
  });

export const useAddressCommunes = (district_id: Ref<string>) =>
  useQuery({
    queryKey: [ADDRESS_COMMUNE_QUERY_KEY, district_id],
    queryFn: () => fetchCommunes(district_id)
  });