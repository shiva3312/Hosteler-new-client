//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { ScheduleResponse } from '@/interfaces/schedule.interface';
import { api } from '@/lib/api/api-client';
import { QueryConfig } from '@/lib/api/react-query';

export const getSchedules = (
  params?: Record<string, any>,
): Promise<{
  data: ScheduleResponse[];
}> => {
  return api.get(`/schedules`, { params });
};

export const getScheduleQueryOptions = (params?: Record<string, any>) => {
  return queryOptions({
    queryKey: ['schedules', params],
    queryFn: getSchedules,
    staleTime: 1000 * 30, // 5 minutes
  });
};

type UseScheduleOptions = {
  queryConfig?: QueryConfig<typeof getScheduleQueryOptions>;
  params?: Record<string, any>;
  enabled?: boolean;
};

export const useSchedules = ({
  queryConfig,
  params,
  enabled,
}: UseScheduleOptions = {}) => {
  return useQuery({
    ...getScheduleQueryOptions(params),
    ...queryConfig,
    enabled,
  });
};
