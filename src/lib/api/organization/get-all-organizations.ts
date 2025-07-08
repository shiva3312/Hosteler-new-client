//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { OrganizationResponse } from '@/interfaces/organization.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getOrganizations = (
  params?: Record<string, any>,
): Promise<{
  data: OrganizationResponse[];
}> => {
  return api.get(`/organizations`, { params });
};

export const getOrganizationQueryOptions = (params?: Record<string, any>) => {
  return queryOptions({
    queryKey: ['organizations', params],
    queryFn: getOrganizations,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseOrganizationOptions = {
  queryConfig?: QueryConfig<typeof getOrganizationQueryOptions>;
  params?: Record<string, any>;
  enabled?: boolean;
};

export const useOrganizations = ({
  queryConfig,
  params,
  enabled,
}: UseOrganizationOptions = {}) => {
  return useQuery({
    ...getOrganizationQueryOptions(params),
    ...queryConfig,
    enabled,
  });
};
