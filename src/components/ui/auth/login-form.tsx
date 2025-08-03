//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import {
  Button,
  TextInput,
  PasswordInput,
  Checkbox,
  Box,
  Group,
  Text,
  Anchor,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { Link, useSearchParams } from 'react-router-dom';

import { paths } from '@/config/paths';
import { UserLoginRequestZodSchema } from '@/interfaces/auth.interface';
import { useLogin } from '@/lib/api/auth/auth';

import { useNotifications } from '../core/notifications';

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin({ onSuccess });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const { addNotification } = useNotifications();

  const form = useForm({
    validate: zodResolver(UserLoginRequestZodSchema),
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
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <TextInput
        label="Username"
        placeholder="Enter your username"
        withAsterisk
        {...form.getInputProps('username')}
      />
      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        withAsterisk
        {...form.getInputProps('password')}
      />
      <Group justify="space-between" mt="xs">
        <Checkbox
          label="Remember Me"
          color="blue"
          {...form.getInputProps('rememberMe', { type: 'checkbox' })}
        />
        <Anchor
          component={Link}
          // to={paths.auth.forgotPassword.getHref()}
          size="sm"
          color="blue"
          underline="always"
          to={''}
          onClick={() => {
            addNotification({
              type: 'warning',
              title: 'Forgot Password is disabled',
              message: 'Please contact Admin to reset your password.',
            });
          }}
        >
          Forgot password?
        </Anchor>
      </Group>
      <Button
        type="submit"
        loading={login.isPending}
        fullWidth
        mt="md"
        // gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
        // variant="gradient"
        style={{ fontWeight: 600, letterSpacing: 0.5 }}
      >
        Log in
      </Button>
      <Group justify="center" mt="sm">
        <Text size="sm" c="dimmed">
          Don&apos;t have an account?{' '}
          <Anchor
            component={Link}
            to={paths.auth.register.getHref(redirectTo)}
            color="blue"
            underline="always"
          >
            Register
          </Anchor>
        </Text>
      </Group>
    </Box>
  );
};
