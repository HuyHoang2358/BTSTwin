import { useQuery } from '@tanstack/vue-query';

import { fetchStations } from '@/services/apis/station';

export const STATION_QUERY_KEY = 'STATION_QUERY_KEY';

export const useStations = () =>
  useQuery({
    queryKey: [STATION_QUERY_KEY],
    queryFn: fetchStations,
  });
