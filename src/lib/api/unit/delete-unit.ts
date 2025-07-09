//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { UserRole } from '@/data/feature';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { getUnitQueryOptions, useUnits } from './get-all-units';
import { SearchQuery } from '../search-query';

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
  const { refetch: refetchUnit } = useUnits({
    params: SearchQuery.userSearchQuery({
      hasAllRoles: [UserRole.ADMIN],
    }),
  });
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getUnitQueryOptions().queryKey,
      });
      refetchUnit();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteUnit,
  });
};
