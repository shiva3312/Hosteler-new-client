//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Title, Text, Box } from '@mantine/core';

export function DrawerTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <Box>
      <Title order={4} c={'blue'}>
        {title}
      </Title>
      {subtitle && (
        <Text size="sm" c="dimmed" mt={4}>
          {subtitle}
        </Text>
      )}
    </Box>
  );
}
