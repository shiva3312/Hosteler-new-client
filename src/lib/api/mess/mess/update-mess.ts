//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { UpdateMessRequest } from '@/interfaces/mess/mess.interface';
import { api } from '@/lib/api/api-client';
import { MutationConfig } from '@/lib/api/react-query';

import { useMesses } from './get-all-messes';

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
  mutationConfig?: MutationConfig<typeof updateMess>;
};

export const useUpdateMess = ({ mutationConfig }: UseUpdateMessOptions) => {
  const { refetch: refetchMess } = useMesses();

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
