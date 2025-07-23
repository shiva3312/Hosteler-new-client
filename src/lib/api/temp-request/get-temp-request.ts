//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { TempRequestResponse } from '@/interfaces/temp-request.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getTempRequestById = (
  tempRequest: string,
): Promise<{
  data: TempRequestResponse;
}> => {
  return api.get(`/temp-request/${tempRequest}`);
};

export const getTempRequestQueryOptions = (tempRequest: string) => {
  return queryOptions({
    queryKey: ['temp-request', tempRequest],
    queryFn: () => getTempRequestById(tempRequest),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseTempRequestOptions = {
  tempRequest: string;
  queryConfig?: QueryConfig<typeof getTempRequestQueryOptions>;
  enabled?: boolean;
};

export const useTempRequest = ({
  tempRequest,
  queryConfig,
  enabled,
}: UseTempRequestOptions) => {
  return useQuery({
    ...getTempRequestQueryOptions(tempRequest),
    ...queryConfig,
    enabled,
  });
};
