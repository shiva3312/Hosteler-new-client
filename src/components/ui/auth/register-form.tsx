//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { TextInput, PasswordInput, Button, Box, Group } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { Link, useSearchParams } from 'react-router-dom';

import { paths } from '@/config/paths';
import { UserRegisterRequestZodSchema } from '@/interfaces/auth.interface';
import { useRegister } from '@/lib/api/auth/auth';

type RegisterFormProps = {
  onSuccess: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const register = useRegister({ onSuccess });
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  const form = useForm({
    validate: zodResolver(UserRegisterRequestZodSchema),
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <Box
      component="form"
      onSubmit={form.onSubmit((values) => {
        register.mutate({
          username: values.username,
          password: values.password,
        });
      })}
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

      <PasswordInput
        label="Confirm Password"
        placeholder="Re-enter password"
        mt="md"
        {...form.getInputProps('confirmPassword')}
      />

      <Button type="submit" fullWidth mt="xl" loading={register.isPending}>
        Register
      </Button>
      <Group mt="sm">
        <Link
          to={paths.auth.login.getHref(redirectTo)}
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Already have an account?
        </Link>
      </Group>
    </Box>
  );
};
