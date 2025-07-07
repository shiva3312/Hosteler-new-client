//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { getGroupQueryOptions } from './get-all-groups';

export type DeleteGroupDTO = {
  groupId: string;
};

export const deleteGroup = ({ groupId }: DeleteGroupDTO) => {
  return api.delete(`/group/${groupId}`);
};

type UseDeleteGroupOptions = {
  mutationConfig?: MutationConfig<typeof deleteGroup>;
};

export const useDeleteGroup = ({
  mutationConfig,
}: UseDeleteGroupOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getGroupQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteGroup,
  });
};
