//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { UpdateMessRequest } from '@/interfaces/mess.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMesss } from './get-all-messs';

export const updateMess = ({
  messId,
  data,
}: {
  messId: string;
  data: UpdateMessRequest;
}) => {
  return api.put(`/mess/${messId}`, data);
};

type UseUpdateMessOptions = {
  messId: string;
  mutationConfig?: MutationConfig<typeof updateMess>;
};

export const useUpdateMess = ({ mutationConfig }: UseUpdateMessOptions) => {
  const { refetch: refetchMess } = useMesss();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchMess();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateMess,
  });
};
