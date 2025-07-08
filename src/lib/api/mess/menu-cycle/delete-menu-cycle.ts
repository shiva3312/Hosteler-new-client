//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { getMenuCycleQueryOptions } from './get-all-menu-cycles';

export type DeleteMenuCycleDTO = {
  menuCycleId: string;
};

export const deleteMenuCycle = ({ menuCycleId }: DeleteMenuCycleDTO) => {
  return api.delete(`/menuCycle/${menuCycleId}`);
};

type UseDeleteMenuCycleOptions = {
  mutationConfig?: MutationConfig<typeof deleteMenuCycle>;
};

export const useDeleteMenuCycle = ({
  mutationConfig,
}: UseDeleteMenuCycleOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getMenuCycleQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteMenuCycle,
  });
};
