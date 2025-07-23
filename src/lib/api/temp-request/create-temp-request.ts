//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { TempRequestRequest } from '@/interfaces/temp-request.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useTempRequests } from './get-all-temp-requests';
// import { SearchQuery } from '../search-query';

export const updateTempRequest = ({ data }: { data: TempRequestRequest }) => {
  return api.post(`/temp-request`, data);
};

type UseCreateTempRequestOptions = {
  mutationConfig?: MutationConfig<typeof updateTempRequest>;
};

export const useCreateTempRequest = ({
  mutationConfig,
}: UseCreateTempRequestOptions = {}) => {
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
