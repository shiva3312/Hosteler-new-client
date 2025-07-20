//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { UserRole } from '@/data/feature';
import { UpdateScheduleRequest } from '@/interfaces/schedule.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useSchedules } from './get-all-schedules';
import { SearchQuery } from '../search-query';

export const updateSchedule = ({
  scheduleId,
  data,
}: {
  scheduleId: string;
  data: UpdateScheduleRequest;
}) => {
  return api.put(`/schedule/${scheduleId}`, data);
};

type UseUpdateScheduleOptions = {
  mutationConfig?: MutationConfig<typeof updateSchedule>;
};

export const useUpdateSchedule = ({
  mutationConfig,
}: UseUpdateScheduleOptions) => {
  const { refetch: refetchSchedule } = useSchedules({
    params: SearchQuery.userSearchQuery({
      hasAllRoles: [UserRole.ADMIN],
    }),
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
