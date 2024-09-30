import { useMutation } from '@tanstack/vue-query';
import { calculate } from '@/services/apis/bts';

export const useCalculate = () => useMutation({ mutationFn: calculate });
