//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { getMenuQueryOptions } from './get-all-menus';

export type DeleteMenuDTO = {
  menuId: string;
};

export const deleteMenu = ({ menuId }: DeleteMenuDTO) => {
  return api.delete(`/menu/${menuId}`);
};

type UseDeleteMenuOptions = {
  mutationConfig?: MutationConfig<typeof deleteMenu>;
};

export const useDeleteMenu = ({
  mutationConfig,
}: UseDeleteMenuOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getMenuQueryOptions().queryKey,
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteMenu,
  });
};
