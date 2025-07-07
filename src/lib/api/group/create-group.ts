//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { GroupRequest } from '@/interfaces/group.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useGroups } from './get-all-groups';

export const updateGroup = ({ data }: { data: GroupRequest }) => {
  return api.post(`/group`, data);
};

type UseCreateGroupOptions = {
  mutationConfig?: MutationConfig<typeof updateGroup>;
};

export const useCreateGroup = ({
  mutationConfig,
}: UseCreateGroupOptions = {}) => {
  const { refetch: refetchGroup } = useGroups();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchGroup();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateGroup,
  });
};
