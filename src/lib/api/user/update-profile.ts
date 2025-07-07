//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { UpdateUserRequestZodSchema } from '@/interfaces/user.interface';
import { api } from '@/lib/api/api-client';
import { useUser } from '@/lib/api/auth/auth';
import { MutationConfig } from '@/lib/api/react-query';

export type UpdateProfileInput = z.infer<typeof UpdateUserRequestZodSchema>;

export const updateProfile = ({
  userId,
  data,
}: {
  userId: string;
  data: UpdateProfileInput;
}) => {
  return api.put(`/user/${userId}`, data);
};

type UseUpdateProfileOptions = {
  mutationConfig?: MutationConfig<typeof updateProfile>;
};

export const useUpdateProfile = ({
  mutationConfig,
}: UseUpdateProfileOptions = {}) => {
  const { refetch: refetchUser } = useUser();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      refetchUser();
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateProfile,
  });
};
