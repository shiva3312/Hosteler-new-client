//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { MenuCycleRequest } from '@/interfaces/mess/menu-cycle.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMenuCycles } from './get-all-menu-cycles';

export const createMenuCycle = ({ data }: { data: MenuCycleRequest }) => {
  return api.post(`/menu-cycle`, data);
};

type UseCreateMenuCycleOptions = {
  mutationConfig?: MutationConfig<typeof createMenuCycle>;
};

export const useCreateMenuCycle = ({
  mutationConfig,
}: UseCreateMenuCycleOptions = {}) => {
  const { refetch: refetchMenuCycle } = useMenuCycles();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchMenuCycle();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createMenuCycle,
  });
};
