//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { MessResponse } from '@/interfaces/mess.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getMessById = (
  mess: string,
): Promise<{
  data: MessResponse[];
}> => {
  return api.get(`/mess/${mess}`);
};

export const getMessQueryOptions = (mess: string) => {
  return queryOptions({
    queryKey: ['mess'],
    queryFn: () => getMessById(mess),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseMessOptions = {
  mess: string;
  queryConfig?: QueryConfig<typeof getMessQueryOptions>;
};

export const useMesss = ({ mess, queryConfig }: UseMessOptions) => {
  return useQuery({
    ...getMessQueryOptions(mess),
    ...queryConfig,
  });
};
