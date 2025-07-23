//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Center, CenterProps, Loader, Stack, Text } from '@mantine/core';
import React from 'react';

interface LoaderWrapperProps extends CenterProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string; // Optional text to display while loading
  loaderType?: 'avatar' | 'default';
}

export function LoaderWrapper({
  isLoading,
  children,
  loadingText = 'Loading, please wait...', // Default loading text
  loaderType = 'default', // Default loader type
  ...props
}: LoaderWrapperProps) {
  const avatarLoader = {
    css: {
      size: 'xs',
      color: 'blue',
    },
    loaderText: '',
  };

  const style =
    loaderType === 'avatar'
      ? avatarLoader
      : {
          css: { size: 'lg', color: 'blue' },
          loaderText: loadingText,
        };

  if (isLoading) {
    return (
      <Center style={{ height: '100%' }} {...props}>
        <Stack align="center" gap="sm">
          <Loader {...style.css} /> {/* Apply the loader style here */}
          {!!style.loaderText && (
            <Text size="md" color="dimmed">
              {loadingText}
            </Text>
          )}
        </Stack>
      </Center>
    );
  }

  return <>{children}</>;
}
