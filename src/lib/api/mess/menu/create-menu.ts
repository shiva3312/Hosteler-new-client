//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { MenuRequest } from '@/interfaces/menu.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMenus } from './get-all-menus';

export const updateMenu = ({ data }: { data: MenuRequest }) => {
  return api.post(`/menu`, data);
};

type UseCreateMenuOptions = {
  mutationConfig?: MutationConfig<typeof updateMenu>;
};

export const useCreateMenu = ({
  mutationConfig,
}: UseCreateMenuOptions = {}) => {
  const { refetch: refetchMenu } = useMenus();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchMenu();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateMenu,
  });
};
