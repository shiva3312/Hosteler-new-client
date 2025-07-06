//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import {
  Button,
  TextInput,
  PasswordInput,
  Checkbox,
  Box,
  Group,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { Link, useSearchParams } from 'react-router-dom'; // useSearchParams from react-router-dom

import { paths } from '@/config/paths';
import { UserLoginRequestZodSchema } from '@/interfaces/auth.interface';
import { useLogin } from '@/lib/auth'; // Assuming zod schema

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin({ onSuccess });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const form = useForm({
    validate: zodResolver(UserLoginRequestZodSchema), // Zod schema validation
    initialValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit((values) => login.mutate(values))}
    >
      <TextInput
        label="Username"
        placeholder="Enter username"
        {...form.getInputProps('username')}
      />
      <PasswordInput
        label="Password"
        placeholder="Enter password"
        mt="md"
        {...form.getInputProps('password')}
      />
      <Checkbox
        label="Remember Me"
        mt="md"
        color="blue"
        {...form.getInputProps('rememberMe', { type: 'checkbox' })}
      />
      <Button type="submit" loading={login.isPending} fullWidth mt="xl">
        Log in
      </Button>

      <Group mt="sm">
        <Link
          to={paths.auth.register.getHref(redirectTo)}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Do not have account?
        </Link>
      </Group>
    </Box>
  );
};
