import { useMutation } from '@tanstack/vue-query';
import { login } from '@/services/apis/auth';

export const useLogin = () => useMutation({ mutationFn: login });
