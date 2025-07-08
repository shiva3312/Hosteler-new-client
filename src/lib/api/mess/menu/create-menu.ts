//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { MenuRequest } from '@/interfaces/mess/menu.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMenues } from './get-all-menues';

export const createMenu = ({ data }: { data: MenuRequest }) => {
  return api.post(`/menu`, data);
};

type UseCreateMenuOptions = {
  mutationConfig?: MutationConfig<typeof createMenu>;
};

export const useCreateMenu = ({
  mutationConfig,
}: UseCreateMenuOptions = {}) => {
  const { refetch: refetchMenu } = useMenues();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchMenu();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createMenu,
  });
};
