//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Fieldset as MantineFieldset, FieldsetProps } from '@mantine/core';
import { ReactNode } from 'react';

import { Legend } from './legend';

type CustomFieldsetProps = {
  children: ReactNode;
} & FieldsetProps;

export function GenericFieldset({ children, ...props }: CustomFieldsetProps) {
  return (
    <MantineFieldset
      variant="default"
      {...props}
      legend={<Legend>{props.legend}</Legend>}
    >
      {children}
    </MantineFieldset>
  );
}
