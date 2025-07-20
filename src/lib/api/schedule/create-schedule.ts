//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { ScheduleRequest } from '@/interfaces/schedule.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useSchedules } from './get-all-schedules';
import { SearchQuery } from '../search-query';

export const updateSchedule = ({ data }: { data: ScheduleRequest }) => {
  return api.post(`/schedule`, data);
};

type UseCreateScheduleOptions = {
  mutationConfig?: MutationConfig<typeof updateSchedule>;
};

export const useCreateSchedule = ({
  mutationConfig,
}: UseCreateScheduleOptions = {}) => {
  const { refetch: refetchSchedule } = useSchedules({
    params: SearchQuery.userSearchQuery({}),
  });

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchSchedule();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateSchedule,
  });
};
