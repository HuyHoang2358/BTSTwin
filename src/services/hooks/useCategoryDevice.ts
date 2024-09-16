import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  createDeviceCategory,
  deleteDeviceCategory,
  fetchDeviceCategories,
  updateDeviceCategory
} from '@/services/apis/devicecategory';



const DEVICE_CATEGORY_QUERY_KEY = 'DEVICE_CATEGORY_QUERY_KEY'
export const useCategoryDevices = () =>
  useQuery({
    queryKey: [DEVICE_CATEGORY_QUERY_KEY],
    queryFn: () => fetchDeviceCategories()
  });

export const useCreateDeviceCategory= () => useMutation({ mutationFn: createDeviceCategory });
export const useUpdateDeviceCategory = () => useMutation({ mutationFn: updateDeviceCategory });

export const useDeleteDeviceCategory = () => useMutation({ mutationFn: deleteDeviceCategory });

export const useMutationDeviceCategorySuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [DEVICE_CATEGORY_QUERY_KEY] });
  };

  return { invalidateQueries };
};
