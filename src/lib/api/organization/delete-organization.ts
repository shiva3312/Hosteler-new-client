//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import {
  getOrganizationQueryOptions,
  useOrganizations,
} from './get-all-organizations';
import { SearchQuery } from '../search-query';

export type DeleteOrganizationDTO = {
  organizationId: string;
};

export const deleteOrganization = ({
  organizationId,
}: DeleteOrganizationDTO) => {
  return api.delete(`/organization/${organizationId}`);
};

type UseDeleteOrganizationOptions = {
  mutationConfig?: MutationConfig<typeof deleteOrganization>;
};

export const useDeleteOrganization = ({
  mutationConfig,
}: UseDeleteOrganizationOptions = {}) => {
  const queryClient = useQueryClient();
  const { refetch: refetchOrganization } = useOrganizations({
    params: SearchQuery.organizationSearchQuery(),
  });
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getOrganizationQueryOptions().queryKey,
      });
      refetchOrganization();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteOrganization,
  });
};
