//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { OrganizationResponse } from '@/interfaces/organization.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getOrganization = (): Promise<{
  data: OrganizationResponse[];
}> => {
  return api.get(`/organizations`);
};

export const getOrganizationQueryOptions = () => {
  return queryOptions({
    queryKey: ['organizations'],
    queryFn: getOrganization,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseOrganizationOptions = {
  queryConfig?: QueryConfig<typeof getOrganizationQueryOptions>;
};

export const useOrganizations = ({
  queryConfig,
}: UseOrganizationOptions = {}) => {
  return useQuery({
    ...getOrganizationQueryOptions(),
    ...queryConfig,
  });
};
