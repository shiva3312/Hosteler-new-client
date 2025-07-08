//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { MessRequest } from '@/interfaces/mess/mess.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMesses } from './get-all-messes';

export const createMess = ({ data }: { data: MessRequest }) => {
  return api.post(`/mess`, data);
};

type UseCreateMessOptions = {
  mutationConfig?: MutationConfig<typeof createMess>;
};

export const useCreateMess = ({
  mutationConfig,
}: UseCreateMessOptions = {}) => {
  const { refetch: refetchMess } = useMesses();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchMess();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createMess,
  });
};
