//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api/api-client';
import { commonQueryKey, QueryConfig } from '@/lib/api/react-query';

export const getUsernameById = (
  username: string,
): Promise<{
  data: boolean;
}> => {
  return api.get(`/check-username/${username}`);
};

export const getUsernameQueryOptions = (username: string) => {
  return queryOptions({
    queryKey: [...commonQueryKey(), 'auth', username],
    queryFn: () => getUsernameById(username),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseUsernameOptions = {
  username: string;
  queryConfig?: QueryConfig<typeof getUsernameQueryOptions>;
  enabled?: boolean;
};

export const useUsername = ({
  username,
  queryConfig,
  enabled,
}: UseUsernameOptions) => {
  return useQuery({
    ...getUsernameQueryOptions(username),
    ...queryConfig,
    enabled: enabled !== undefined ? enabled : true,
  });
};
