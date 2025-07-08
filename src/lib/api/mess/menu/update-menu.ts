//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { UpdateMenuRequest } from '@/interfaces/mess/menu.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMenues } from './get-all-menues';

export const updateMenu = ({
  menuId,
  data,
}: {
  menuId: string;
  data: UpdateMenuRequest;
}) => {
  return api.put(`/menu/${menuId}`, data);
};

type UseUpdateMenuOptions = {
  mutationConfig?: MutationConfig<typeof updateMenu>;
};

export const useUpdateMenu = ({ mutationConfig }: UseUpdateMenuOptions) => {
  const { refetch: refetchMenu } = useMenues();

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
