//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { UpdateOrganizationRequest } from '@/interfaces/organization.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useOrganizations } from './get-all-organizations';
import { SearchQuery } from '../search-query';

export const updateOrganization = ({
  organizationId,
  data,
}: {
  organizationId: string;
  data: UpdateOrganizationRequest;
}) => {
  return api.put(`/organization/${organizationId}`, data);
};

type UseUpdateOrganizationOptions = {
  mutationConfig?: MutationConfig<typeof updateOrganization>;
};

export const useUpdateOrganization = ({
  mutationConfig,
}: UseUpdateOrganizationOptions) => {
  const { refetch: refetchOrganization } = useOrganizations({
    params: SearchQuery.organizationSearchQuery(),
  });
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchOrganization();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateOrganization,
  });
};
