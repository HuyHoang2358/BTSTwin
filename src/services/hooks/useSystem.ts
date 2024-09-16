import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  deleteLog,
  deleteMediaFile,
  fetchLogs,
  fetchMediaFiles,
  fetchNotifications,
  uploadMediaFile
} from '@/services/apis/systemApi';
import type { Ref } from 'vue';
import { PROJECT_QUERY_KEY } from '@/services/hooks/useProject';
import { downloadUsersInUnit, insertUnitsFromExcel } from '@/services/apis/unit';
import { deleteProject } from '@/services/apis/project';

export const NOTIFICATIONS_QUERY_KEY = 'NOTIFICATIONS_QUERY_KEY';
export const LOGS_QUERY_KEY = 'LOGS_QUERY_KEY';
export const MEDIA_QUERY_KEY = 'MEDIA_QUERY_KEY';

export const useLogs = (params: {
  searchValue: Ref<string>;
  startDate: Ref<string>;
  endDate: Ref<string>;
  sort: Ref<string>;
  direction: Ref<string>;
  userIds: Ref<string[] | undefined>;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  action: Ref<string[] | undefined>;
  ips: Ref<string[] | undefined>;
  roles: Ref<string[] | undefined>;
}) =>
  useQuery({
    queryKey: [LOGS_QUERY_KEY, params],
    queryFn: () =>
      fetchLogs({
        searchValue: params?.searchValue.value,
        startDate: params?.startDate.value,
        endDate: params?.endDate.value,
        userIds: params?.userIds.value?.join(',') || undefined,
        sort: params?.sort.value || undefined,
        direction: params?.direction.value || undefined,
        page: params.currentPage.value?.toString(),
        size: params.pageSize.value?.toString(),
        action: params.action.value?.join(',') || undefined,
        ips: params.ips.value?.join(',') || undefined,
        roles: params.roles.value?.join(',') || undefined,
      }),
    retry: 2,
  });

export const useDeleteLog = () => useMutation({
  mutationFn: deleteLog
});
export const useNotifications = () =>
  useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY],
    queryFn: fetchNotifications,
    retry: 2,
  });

export const useMutationSystemSuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueriesLogs = async () => {
    await queryClient.invalidateQueries({ queryKey: [LOGS_QUERY_KEY] });
  };


  return {
    invalidateQueriesLogs,
  };
};

export const useMedia= () =>
  useQuery({
    queryKey: [MEDIA_QUERY_KEY],
    queryFn: fetchMediaFiles,
    retry: 2,
  });

export const useMutationMediaSuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [MEDIA_QUERY_KEY] });
  };

  return { invalidateQueries };
};

export const useUploadMediaFile = () => useMutation({ mutationFn: uploadMediaFile });

export const useDeleteMediaFile = () => useMutation({ mutationFn: deleteMediaFile });
