//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { getMessQueryOptions, useMesses } from './get-all-messes';

export type DeleteMessDTO = {
  messId: string;
};

export const deleteMess = ({ messId }: DeleteMessDTO) => {
  return api.delete(`/mess/${messId}`);
};

type UseDeleteMessOptions = {
  mutationConfig?: MutationConfig<typeof deleteMess>;
};

export const useDeleteMess = ({
  mutationConfig,
}: UseDeleteMessOptions = {}) => {
  const queryClient = useQueryClient();
  const { refetch: refetchMess } = useMesses();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchMess();
      queryClient.invalidateQueries({
        queryKey: getMessQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteMess,
  });
};
