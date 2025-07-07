//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Box, Center, Text } from '@mantine/core';
import { useNavigate, useSearchParams } from 'react-router';

import { RegisterForm } from '@/components/ui/auth/register-form';
import { paths } from '@/config/paths';

const RegisterRoute = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo');

  return (
    <Box w={400} mx="auto" mt={100} p={20}>
      <Center my={'md'}>
        <Text fz={'h2'} fw={'bold'}>
          Register your account
        </Text>
      </Center>
      <RegisterForm
        onSuccess={() => {
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

export default RegisterRoute;
