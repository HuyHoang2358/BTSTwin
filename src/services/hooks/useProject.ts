import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import type { Ref } from 'vue';
import { createProject, deleteProject, fetchProject, updateProject } from '@/services/apis/project';

export const PROJECT_QUERY_KEY = 'PROJECT_QUERY_KEY';

export const useCreateProject = () => useMutation({ mutationFn: createProject });

export const useProjects = (refDistrictId: Ref<string[]>) =>
  useQuery({
    queryKey: [PROJECT_QUERY_KEY, refDistrictId],
    queryFn: () =>
      fetchProject(
        refDistrictId?.value && refDistrictId.value.length > 0
          ? refDistrictId?.value?.join(',')
          : undefined,
      ),
  });

export const useUpdateProject = () => useMutation({ mutationFn: updateProject });

export const useDeleteProject = () => useMutation({ mutationFn: deleteProject });

export const useMutationProjectSuccess = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = async () => {
    await queryClient.invalidateQueries({ queryKey: [PROJECT_QUERY_KEY] });
  };

  return { invalidateQueries };
};
