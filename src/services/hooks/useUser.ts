import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  changePassword,
  changePasswordByAdmin,
  createUser,
  deleteUser,
  downloadUserList,
  fetchProfile,
  fetchUsers,
  insertUserFromExcel,
  updateProfile,
  updateUser,
} from '@/services/apis/user';
import type { BaseRefParams, PaginationRefParams } from '@/services/services.types';
import { getParamsFromBaseRefParams } from '@/utils/helpers';
import type { ComputedRef } from 'vue';

export const USERS_QUERY_KEY = 'USERS_QUERY_KEY';
export const PROFILE_QUERY_KEY = 'PROFILE_QUERY_KEY';

export const useCreateUser = () => useMutation({ mutationFn: createUser });

export const useUsers = (refParams: BaseRefParams & PaginationRefParams) =>
  useQuery({
    queryKey: [USERS_QUERY_KEY, refParams],
    queryFn: () =>
      fetchUsers({
        ...getParamsFromBaseRefParams(refParams),
        district: refParams?.filters?.value?.district?.join(',') || undefined,
        title: refParams?.filters?.value?.title?.join(',') || undefined,
        unit: refParams?.filters?.value?.unit?.join(',') || undefined,
        role: refParams?.filters?.value?.role?.join(',') || undefined,
      }),
  });

export const useUpdateUser = () => useMutation({ mutationFn: updateUser });

export const useDeleteUser = () => useMutation({ mutationFn: deleteUser });

export const useMutationUserSuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY] });
  };

  return { invalidateQueries };
};

export const useChangePasswordByAdmin = () => useMutation({ mutationFn: changePasswordByAdmin });

export const useDownloadUserList = () => useMutation({ mutationFn: downloadUserList });

export const useInsertUserFromExcel = () => useMutation({ mutationFn: insertUserFromExcel });

export const useProfile = (enabled?: ComputedRef<boolean>) =>
  useQuery({
    queryFn: fetchProfile,
    queryKey: [PROFILE_QUERY_KEY],
    enabled,
  });

export const useUpdateProfile = () => useMutation({ mutationFn: updateProfile });

export const useChangePassword = () => useMutation({ mutationFn: changePassword });
