//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { MenuCycleRequest } from '@/interfaces/menuCycle.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMenuCycles } from './get-all-menuCycles';

export const updateMenuCycle = ({ data }: { data: MenuCycleRequest }) => {
  return api.post(`/menuCycle`, data);
};

type UseCreateMenuCycleOptions = {
  mutationConfig?: MutationConfig<typeof updateMenuCycle>;
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
    mutationFn: updateMenuCycle,
  });
};
