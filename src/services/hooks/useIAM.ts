import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  addPermissionToUser,
  createPermission, createPermissionGroup,
  createRole,
  deleteRole,
  fetchAuthorizations,
  fetchPermissionGroups,
  fetchPermissions,
  fetchRoles, fetchUserPermissions,
  removePermission, removePermissionGroup, removePermissionToUser,
  updatePermission,
  updatePermissionGroup,
  updateRole
} from '@/services/apis/iam';
import type { BaseRefParams, PaginationRefParams } from '@/services/services.types';
import { getParamsFromBaseRefParams } from '@/utils/helpers';
import type { ComputedRef, Ref } from 'vue';
import type { ImageryRefParams } from '@/services/hooks/useLayer';

export const PERMISSION_GROUPS_QUERY_KEY = 'PERMISSION_GROUPS_QUERY_KEY';
export const AUTHORIZATIONS_QUERY_KEY = 'AUTHORIZATIONS_QUERY_KEY';
export const PERMISSIONS_QUERY_KEY = 'PERMISSIONS_QUERY_KEY';
export const ROLES_QUERY_KEY = 'ROLES_QUERY_KEY';
export const USER_PERMISSIONS_KEY = 'USER_PERMISSIONS_KEY';

// TODO: Permission Group
export const usePermissionGroups = (refParams: { searchValue?: Ref<string> }) =>
  useQuery({
    queryKey: [PERMISSION_GROUPS_QUERY_KEY, refParams],
    queryFn: () => fetchPermissionGroups({searchValue: refParams?.searchValue?.value}),
  });
export const useCreatePermissionGroup = () => useMutation({mutationFn: createPermissionGroup})
export const useUpdatePermissionGroup = () => useMutation({ mutationFn: updatePermissionGroup });
export const useRemovePermissionGroup = () => useMutation({ mutationFn: removePermissionGroup });

// TODO: Permission
export const usePermissions = () =>
  useQuery({
    queryKey: [PERMISSIONS_QUERY_KEY, ],
    queryFn: fetchPermissions,
  });
export const useCreatePermission = () => useMutation({ mutationFn: createPermission });
export const useUpdatePermission = () => useMutation({ mutationFn: updatePermission });
export const useRemovePermission = () => useMutation({ mutationFn: removePermission });

// TODO: Role
export const useRoles = (refParams: BaseRefParams & PaginationRefParams) =>
  useQuery({
    queryKey: [ROLES_QUERY_KEY, refParams],
    queryFn: () => fetchRoles(getParamsFromBaseRefParams(refParams)),
  });
export const useCreateRole = () => useMutation({ mutationFn: createRole });
export const useUpdateRole = () => useMutation({ mutationFn: updateRole });
export const useDeleteRole = () => useMutation({ mutationFn: deleteRole });


// TODO: Authorizations
export const useAuthorizations = (refParams: BaseRefParams & PaginationRefParams) =>
  useQuery({
    queryKey: [AUTHORIZATIONS_QUERY_KEY, refParams],
    queryFn: () => fetchAuthorizations(getParamsFromBaseRefParams(refParams)),
  });
export const useUserPermissions = (id: Ref<number>, enabled: ComputedRef<boolean>) =>
  useQuery({
    queryKey: [USER_PERMISSIONS_KEY, id],
    queryFn: () => fetchUserPermissions(id),
    enabled,
  })
// add permission for User
export const useAddPermissionToUser = () => useMutation({ mutationFn: addPermissionToUser });
// Remove permission from User
export const useRemovePermissionFromUser = () => useMutation({ mutationFn: removePermissionToUser });



// TODO: IAM handle success
export const useMutationIAMSuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueriesPermissionGroup = async () => {
    await queryClient.invalidateQueries({ queryKey: [PERMISSION_GROUPS_QUERY_KEY] });
  };

  const invalidateQueriesRoles = async () => {
    await queryClient.invalidateQueries({ queryKey: [ROLES_QUERY_KEY] });
  };

  const invalidateQueriesAuthorizations = async () => {
    await queryClient.invalidateQueries({ queryKey: [AUTHORIZATIONS_QUERY_KEY] });
  };

  return {
    invalidateQueriesPermissionGroup,
    invalidateQueriesRoles,
    invalidateQueriesAuthorizations,
  };
};




