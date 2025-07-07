//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MessResponse } from '@/interfaces/mess.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMess = (): Promise<{
  data: MessResponse[];
}> => {
  return api.get(`/messs`);
};

export const getMessQueryOptions = () => {
  return queryOptions({
    queryKey: ['messs'],
    queryFn: getMess,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMessOptions = {
  queryConfig?: QueryConfig<typeof getMessQueryOptions>;
};

export const useMesss = ({ queryConfig }: UseMessOptions = {}) => {
  return useQuery({
    ...getMessQueryOptions(),
    ...queryConfig,
  });
};
