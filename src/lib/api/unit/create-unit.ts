//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { UserRole } from '@/data/feature';
import { UnitRequest } from '@/interfaces/unit.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useUnits } from './get-all-units';
import { SearchQuery } from '../search-query';

export const updateUnit = ({ data }: { data: UnitRequest }) => {
  return api.post(`/unit`, data);
};

type UseCreateUnitOptions = {
  mutationConfig?: MutationConfig<typeof updateUnit>;
};

export const useCreateUnit = ({
  mutationConfig,
}: UseCreateUnitOptions = {}) => {
  const { refetch: refetchUnit } = useUnits({
    params: SearchQuery.userSearchQuery({
      hasAllRoles: [UserRole.ADMIN],
    }),
  });

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchUnit();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateUnit,
  });
};
