//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Avatar, AvatarProps, Box } from '@mantine/core';
import React from 'react';

import { env } from '@/config/env';
import { Gender, ImageSize } from '@/interfaces/enums';

interface UserProfileImageProps extends AvatarProps {
  url?: string;
  type?: ImageSize; // default to medium
  alt?: string;
  modifyUrl?: boolean; // Optional prop to modify URL
  dicebearImage?: { id?: string; gender?: Gender };
  outline?: boolean; // Optional prop to control outline
}

export const UserProfileImage: React.FC<UserProfileImageProps> = ({
  url,
  alt,
  // size = 100, // Default size for Avatar
  type = ImageSize.Medium, // Default to medium size
  // Optional prop to modify URL based on type - setting it to true will modify the image URL to fetch
  modifyUrl = true, // Optional prop to modify URL
  // on fallback, // Optional callback for error handling
  dicebearImage,
  outline = false, // Optional prop to control outline
  ...props
}) => {
  const placeHolderImage = `https://api.dicebear.com/7.x/open-peeps/svg?seed=${dicebearImage?.id}&gender=${dicebearImage?.gender}`;

  const size =
    type === ImageSize.Icon
      ? 30
      : type === ImageSize.Small
        ? 45
        : type === ImageSize.Medium
          ? 100
          : type === ImageSize.Large
            ? 150
            : type === ImageSize.Original
              ? 200
              : 200; // Default size for Avatar

  //NOTE: No large size image in backend, so we adjust the type for URL modification
  type = type === ImageSize.Large ? ImageSize.Original : type; // Adjust type for URL modification

  const imageUrl = modifyUrl
    ? `${env.API_URL}${url?.replace(ImageSize.Medium, type)}`
    : url;

  return (
    <Box>
      <Avatar
        src={url ? imageUrl : placeHolderImage} // Updated to use template literal
        alt={alt || 'No Image'}
        size={size}
        radius={size}
        mx="auto"
        style={{
          outline: outline
            ? '4px solid var(--mantine-color-blue-5)'
            : undefined,
        }}
        {...props}
      />
    </Box>
  );
};
