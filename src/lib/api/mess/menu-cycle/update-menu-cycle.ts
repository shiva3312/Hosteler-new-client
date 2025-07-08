//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { UpdateMenuCycleRequest } from '@/interfaces/mess/menu-cycle.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMenuCycles } from './get-all-menu-cycles';

export const updateMenuCycle = ({
  menuCycleId,
  data,
}: {
  menuCycleId: string;
  data: UpdateMenuCycleRequest;
}) => {
  return api.put(`/menuCycle/${menuCycleId}`, data);
};

type UseUpdateMenuCycleOptions = {
  mutationConfig?: MutationConfig<typeof updateMenuCycle>;
};

export const useUpdateMenuCycle = ({
  mutationConfig,
}: UseUpdateMenuCycleOptions) => {
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
