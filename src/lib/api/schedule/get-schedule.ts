//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { ScheduleResponse } from '@/interfaces/schedule.interface';
import { api } from '@/lib/api/api-client';
import { commonQueryKey, QueryConfig } from '@/lib/api/react-query';

export const getScheduleById = (
  schedule: string,
): Promise<{
  data: ScheduleResponse[];
}> => {
  return api.get(`/schedule/${schedule}`);
};

export const getScheduleQueryOptions = (schedule: string) => {
  return queryOptions({
    queryKey: [...commonQueryKey(), 'schedule', schedule],
    queryFn: () => getScheduleById(schedule),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

type UseScheduleOptions = {
  schedule: string;
  queryConfig?: QueryConfig<typeof getScheduleQueryOptions>;
  enabled?: boolean;
};

export const useSchedule = ({
  schedule,
  queryConfig,
  enabled,
}: UseScheduleOptions) => {
  return useQuery({
    ...getScheduleQueryOptions(schedule),
    ...queryConfig,
    enabled,
  });
};
