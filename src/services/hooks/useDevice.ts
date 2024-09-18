import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  createDevice,
  deleteDevice,
  fetchDeviceCodes,
  fetchDevices,
  updateDevice,
} from '@/services/apis/device';
import type { IndexRefParams, PaginateRefParams } from '@/services/services.types';
import { getParamsFromIndexRefParams } from '@/utils/helpers';

const DEVICE_QUERY_KEY = 'DEVICE_QUERY_KEY';
export const useDevices = (refParams: IndexRefParams & PaginateRefParams) =>
  useQuery({
    queryKey: [DEVICE_QUERY_KEY, refParams],
    queryFn: () =>
      fetchDevices({
        ...getParamsFromIndexRefParams(refParams),
      }),
  });

export const useDeviceCodes = () =>
  useQuery({
    queryKey: [DEVICE_QUERY_KEY, 'codes'],
    queryFn: fetchDeviceCodes,
  });

export const useCreateDevice = () => useMutation({ mutationFn: createDevice });
export const useUpdateDevice = () => useMutation({ mutationFn: updateDevice });

export const useDeleteDevice = () => useMutation({ mutationFn: deleteDevice });

export const useMutationDeviceSuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [DEVICE_QUERY_KEY] });
  };

  return { invalidateQueries };
};
