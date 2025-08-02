//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api/api-client';
import { commonQueryKey, QueryConfig } from '@/lib/api/react-query';

export const validateTempRequestLink = (
  unitName: string,
  token: string,
): Promise<{
  data: boolean;
}> => {
  return api.get(`/temp-request/validate/${unitName}/${token}`);
};

export const getTempRequestQueryOptions = (unitName: string, token: string) => {
  return queryOptions({
    queryKey: [
      ...commonQueryKey(),
      'validate-temp-request-link',
      unitName,
      token,
    ],
    queryFn: () => validateTempRequestLink(unitName, token),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseTempRequestOptions = {
  unitName: string;
  token: string;
  queryConfig?: QueryConfig<typeof getTempRequestQueryOptions>;
  enabled?: boolean;
};

export const useValidateTempRequestLink = ({
  unitName,
  token,
  queryConfig,
  enabled = true,
}: UseTempRequestOptions) => {
  return useQuery({
    ...getTempRequestQueryOptions(unitName, token),
    ...queryConfig,
    enabled,
  });
};
