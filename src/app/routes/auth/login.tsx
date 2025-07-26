//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Box, Card, Center, Text } from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router';

import { LoginForm } from '@/components/ui/auth/login-form';
import { SinglePageLayout } from '@/components/ui/core/layout/single-page-layout';
import { paths } from '@/config/paths';
import { getToken } from '@/lib/api/auth/auth';
import { useMe } from '@/lib/api/user/get-me';

const LoginRoute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');
  const { refetch } = useMe({
    enabled: !!getToken(), // Disable automatic fetching
  });

  return (
    <SinglePageLayout>
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Center mb={4}>
            <Text fz="xl" fw={700} c="blue">
              Welcome Back!
            </Text>
          </Center>
          <Center mb="md">
            <Text size="sm" c="dimmed" ta={'center'}>
              Sign in to access your hostel dashboard and manage your account.
            </Text>
          </Center>
          <LoginForm
            onSuccess={() => {
              refetch();
              navigate(
                `${redirectTo ? `${redirectTo}` : paths.app.dashboard.getHref()}`,
                { replace: true },
              );
            }}
          />
        </Card>
      </Box>
    </SinglePageLayout>
  );
};

export default LoginRoute;
