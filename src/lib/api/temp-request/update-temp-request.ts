//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { UpdateTempRequestRequest } from '@/interfaces/temp-request.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useTempRequests } from './get-all-temp-requests';
// import { SearchQuery } from '../search-query';

export const updateTempRequest = ({
  tempRequestId,
  data,
}: {
  tempRequestId: string;
  data: UpdateTempRequestRequest;
}) => {
  return api.put(`/temp-request/${tempRequestId}`, data);
};

type UseUpdateTempRequestOptions = {
  mutationConfig?: MutationConfig<typeof updateTempRequest>;
};

export const useUpdateTempRequest = ({
  mutationConfig,
}: UseUpdateTempRequestOptions) => {
  const { refetch: refetchTempRequest } = useTempRequests({});

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchTempRequest();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateTempRequest,
  });
};
