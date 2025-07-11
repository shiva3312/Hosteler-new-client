//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api/api-client';

import { MutationConfig } from '../react-query';

export const uploadImage = ({
  userId,
  file,
}: {
  userId: string;
  file: File;
}) => {
  const formData = new FormData();
  formData.append('file', file);

  return api.post(`/user/${userId}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UseUploadImageOptions = {
  mutationConfig?: MutationConfig<typeof uploadImage>;
};

export const useUploadImage = ({
  mutationConfig,
}: UseUploadImageOptions = {}) => {
  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) =>
      uploadImage({ userId, file }),
    ...mutationConfig,
  });
};
