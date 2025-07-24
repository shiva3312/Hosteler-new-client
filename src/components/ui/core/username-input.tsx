//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Loader, TextInput, TextInputProps } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconAlertCircle, IconCircleCheck } from '@tabler/icons-react';

import { UsernameZodSchema } from '@/interfaces/common.interface';
import { useUsername } from '@/lib/api/auth/check-username';

interface Props extends Omit<TextInputProps, 'onChange'> {
  /**
   * Form instance to manage form state.
   * If provided, the component will use mantine form props & need not to pass other props
= {
  /**
   * Form instance to manage form state.
   * If provided, the component will use mantine form props & need not to pass other props.
   * If not provided, it will use normal props.
   * This is useful for integrating with mantine forms.
   * If you want to use this component without mantine form, pass `undefined` or `null` here.
   * @default undefined
   * @example
   * <UserUnitDropdown
   * onCustomChange?: (value: string | null) => void;
   * />
   * @example
   * <UserUnitDropdown
   *   form={form} // mantine form instance
   * />
   * @note If you are using this component with mantine form, No need to pass any other props
   */
  form?: any; // mantine form instance or Mantine form instance
  currentValue?: string | null; // Current value of the username input
  /**
   * Callbacks to handle user and unit changes.
   * If you are using this component with mantine form, No need to pass these props.
   *
   * @note If you are not using mantine form, you must provide these callbacks.
   */
  onValueChange?: (value: string | null) => void;
}

const UsernameInput = ({
  currentValue,
  onValueChange,
  form, // mantine form instance or Mantine form instance11
  ...args
}: Props) => {
  const [debounced] = useDebouncedValue(
    form.values.username ?? currentValue,
    200,
    {
      leading: true,
    },
  );

  const {
    data: username,
    isLoading,
    isSuccess,
  } = useUsername({
    username: debounced || '',
    enabled: !!debounced,
  });

  return (
    <TextInput
      rightSection={
        !(form.values.username ?? currentValue) ? undefined : isLoading ? (
          <Loader size={'xs'} />
        ) : !isSuccess ? (
          <IconAlertCircle size={'18'} color="red" />
        ) : !username?.data && form.values.username ? (
          <IconCircleCheck size={'18'} color="green" />
        ) : null
      }
      placeholder="Enter username or email"
      description="Username must be unique"
      label="Username or Email"
      value={form.values.username ?? currentValue ?? ''}
      {...(form
        ? {
            key: form.key('username'),
            ...form.getInputProps('username'),
          }
        : {
            onChange: (e) => {
              onValueChange?.(e.target.value);
            },
          })}
      error={
        !(form.values.username ?? currentValue)
          ? undefined
          : !isSuccess
            ? UsernameZodSchema.description
            : username?.data === true && !isLoading
              ? 'Username is already taken'
              : null
      }
      {...args}
    />
  );
};

export default UsernameInput;
