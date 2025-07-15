//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Box, Center, Text } from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router';

import { LoginForm } from '@/components/ui/auth/login-form';
import { paths } from '@/config/paths';
import { useMe } from '@/lib/api/user/get-me';

const LoginRoute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const { refetch } = useMe();
  return (
    <Box w={400} mx="auto" mt={100} p={20}>
      <Center my={'md'}>
        <Text fz={'h2'} fw={'bold'}>
          Log in to your account
        </Text>
      </Center>

      <LoginForm
        onSuccess={() => {
          refetch();
          navigate(
            `${redirectTo ? `${redirectTo}` : paths.app.dashboard.getHref()}`,
            {
              replace: true,
            },
          );
        }}
      />
    </Box>
  );
};

export default LoginRoute;
