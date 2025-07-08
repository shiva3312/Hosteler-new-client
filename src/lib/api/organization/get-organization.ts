//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { OrganizationResponse } from '@/interfaces/organization.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getOrganizationById = (
  organization: string,
): Promise<{
  data: OrganizationResponse[];
}> => {
  return api.get(`/organization/${organization}`);
};

export const getOrganizationQueryOptions = (organization: string) => {
  return queryOptions({
    queryKey: ['organization', organization],
    queryFn: () => getOrganizationById(organization),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseOrganizationOptions = {
  organization: string;
  queryConfig?: QueryConfig<typeof getOrganizationQueryOptions>;
  enabled?: boolean;
};

export const useOrganization = ({
  organization,
  queryConfig,
  enabled,
}: UseOrganizationOptions) => {
  return useQuery({
    ...getOrganizationQueryOptions(organization),
    ...queryConfig,
    enabled,
  });
};
