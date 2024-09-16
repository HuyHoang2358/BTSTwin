import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  createVendor,
  deleteVendor,
  fetchVendor,
  updateVendor
} from '@/services/apis/vendor';



const VENDOR_QUERY_KEY = 'VENDOR_QUERY_KEY'
export const useVendors = () =>
  useQuery({
    queryKey: [VENDOR_QUERY_KEY],
    queryFn: () => fetchVendor()
  });

export const useCreateVendor= () => useMutation({ mutationFn: createVendor });
export const useUpdateVendor = () => useMutation({ mutationFn: updateVendor });

export const useDeleteVendor = () => useMutation({ mutationFn: deleteVendor });

export const useMutationVendorSuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [VENDOR_QUERY_KEY] });
  };

  return { invalidateQueries };
};
