//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { MessRequest } from '@/interfaces/mess.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMesss } from './get-all-messs';

export const updateMess = ({ data }: { data: MessRequest }) => {
  return api.post(`/mess`, data);
};

type UseCreateMessOptions = {
  mutationConfig?: MutationConfig<typeof updateMess>;
};

export const useCreateMess = ({
  mutationConfig,
}: UseCreateMessOptions = {}) => {
  const { refetch: refetchMess } = useMesss();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchMess();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateMess,
  });
};
