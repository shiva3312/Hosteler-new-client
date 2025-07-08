//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { OrganizationRequest } from '@/interfaces/organization.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useOrganizations } from './get-all-organizations';

export const createOrganization = ({ data }: { data: OrganizationRequest }) => {
  return api.post(`/organization`, data);
};

type UseCreateOrganizationOptions = {
  mutationConfig?: MutationConfig<typeof createOrganization>;
};

export const useCreateOrganization = ({
  mutationConfig,
}: UseCreateOrganizationOptions = {}) => {
  const { refetch: refetchOrganization } = useOrganizations();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchOrganization();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createOrganization,
  });
};
