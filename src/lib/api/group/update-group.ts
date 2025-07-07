//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { UpdateGroupRequest } from '@/interfaces/group.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useGroups } from './get-all-groups';

export const updateGroup = ({
  groupId,
  data,
}: {
  groupId: string;
  data: UpdateGroupRequest;
}) => {
  return api.put(`/group/${groupId}`, data);
};

type UseUpdateGroupOptions = {
  groupId: string;
  mutationConfig?: MutationConfig<typeof updateGroup>;
};

export const useUpdateGroup = ({ mutationConfig }: UseUpdateGroupOptions) => {
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
