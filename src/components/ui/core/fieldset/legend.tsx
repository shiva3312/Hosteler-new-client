//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Text } from '@mantine/core';
import { ReactNode } from 'react';

type CustomFieldsetProps = {
  children: ReactNode;
};

export function Legend(props: CustomFieldsetProps) {
  return (
    <Text fw={600} size="sm" c="blue.7">
      {props.children}
    </Text>
  );
}
