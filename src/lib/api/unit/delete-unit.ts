//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { getUnitQueryOptions } from './get-all-units';

export type DeleteUnitDTO = {
  unitId: string;
};

export const deleteUnit = ({ unitId }: DeleteUnitDTO) => {
  return api.delete(`/unit/${unitId}`);
};

type UseDeleteUnitOptions = {
  mutationConfig?: MutationConfig<typeof deleteUnit>;
};

export const useDeleteUnit = ({
  mutationConfig,
}: UseDeleteUnitOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getUnitQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteUnit,
  });
};
