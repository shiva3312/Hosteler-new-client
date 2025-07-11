//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { queryOptions, useQuery } from '@tanstack/react-query';

import { ImageSize } from '@/interfaces/enums';
import { QueryConfig } from '@/lib/api/react-query';

import { api } from '../api-client';

export const getUserProfileImage = (
  userId: string,
  size: ImageSize = ImageSize.Medium,
): Promise<{ url: string }> => {
  return api.get(`/user/${userId}/image`, {
    params: { size },
  });
};

export const getUserProfileImageQueryOptions = (
  userId: string,
  size: ImageSize = ImageSize.Medium,
) => {
  return queryOptions({
    queryKey: ['user-profile-image', userId, size],
    queryFn: () => getUserProfileImage(userId, size),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

type UseUserProfileImageOptions = {
  userId: string;
  size?: ImageSize;
  queryConfig?: QueryConfig<typeof getUserProfileImageQueryOptions>;
};

export const useUserProfileImage = ({
  userId,
  size = ImageSize.Medium,
  queryConfig,
}: UseUserProfileImageOptions) => {
  return useQuery({
    ...getUserProfileImageQueryOptions(userId, size),
    ...queryConfig,
  });
};
