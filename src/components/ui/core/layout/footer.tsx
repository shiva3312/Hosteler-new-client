//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Box, Text } from '@mantine/core';

export function Footer() {
  return (
    <Box
      component="footer"
      style={{
        textAlign: 'center',
        padding: '24px 0',
        color: '#888',
        background: '#f8fafc',
        borderTop: '1px solid #e9ecef',
        // marginTop: 40, // Remove this line
      }}
    >
      <Text size="sm">
        © {new Date().getFullYear()} Hostelease. All rights reserved. |{' '}
        <a
          href="mailto:contact@hostelease.com"
          style={{ color: '#228be6', textDecoration: 'underline' }}
        >
          Contact Us
        </a>
      </Text>
    </Box>
  );
}
