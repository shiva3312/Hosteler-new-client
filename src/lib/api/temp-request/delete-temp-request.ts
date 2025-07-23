//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import {
  getTempRequestQueryOptions,
  useTempRequests,
} from './get-all-temp-requests';
// import { SearchQuery } from '../search-query';

export type DeleteTempRequestDTO = {
  tempRequestId: string;
};

export const deleteTempRequest = ({ tempRequestId }: DeleteTempRequestDTO) => {
  return api.delete(`/temp-request/${tempRequestId}`);
};

type UseDeleteTempRequestOptions = {
  mutationConfig?: MutationConfig<typeof deleteTempRequest>;
};

export const useDeleteTempRequest = ({
  mutationConfig,
}: UseDeleteTempRequestOptions = {}) => {
  const queryClient = useQueryClient();
  const { refetch: refetchTempRequest } = useTempRequests({});
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getTempRequestQueryOptions().queryKey,
      });
      refetchTempRequest();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteTempRequest,
  });
};
