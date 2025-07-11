//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Box, Loader, Text } from '@mantine/core';
import React from 'react';

const FullPageSpinner: React.FC<{ message?: string }> = ({
  message = 'Loading...',
}) => {
  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa', // Optional: Add a background color
      }}
    >
      <Loader size="xl" />
      <Text mt="md" size="lg" fw={500}>
        {message}
      </Text>
    </Box>
  );
};

export default FullPageSpinner;
