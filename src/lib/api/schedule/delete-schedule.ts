//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { getScheduleQueryOptions, useSchedules } from './get-all-schedules';
import { SearchQuery } from '../search-query';

export type DeleteScheduleDTO = {
  scheduleId: string;
};

export const deleteSchedule = ({ scheduleId }: DeleteScheduleDTO) => {
  return api.delete(`/schedule/${scheduleId}`);
};

type UseDeleteScheduleOptions = {
  mutationConfig?: MutationConfig<typeof deleteSchedule>;
};

export const useDeleteSchedule = ({
  mutationConfig,
}: UseDeleteScheduleOptions = {}) => {
  const queryClient = useQueryClient();
  const { refetch: refetchSchedule } = useSchedules({
    params: SearchQuery.userSearchQuery({}),
  });
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getScheduleQueryOptions().queryKey,
      });
      refetchSchedule();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteSchedule,
  });
};
