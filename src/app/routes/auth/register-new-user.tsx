//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Center, Text } from '@mantine/core';
import { useParams } from 'react-router';

import { LoaderWrapper } from '@/components/layouts/loader-wrapper';
import { RegisterUserByLink } from '@/components/ui/user/user-public-link-form';
import { useValidateTempRequestLink } from '@/lib/api/temp-request/validate-temp-request-link';

function RegisterNewUserByLink() {
  const { token: encodedToken, unitName: encodedUnitName } = useParams();
  const {
    data: tempRequests,
    isLoading,
    isSuccess,
  } = useValidateTempRequestLink({
    unitName: encodedUnitName || '',
    token: encodedToken || '',
    enabled: !!encodedToken && !!encodedUnitName,
  });

  if (!encodedToken || !encodedUnitName) {
    return (
      <Center h={'100vh'}>
        <Text size="xl" color="red">
          Invalid or missing token or unit name
        </Text>
      </Center>
    );
  }

  if (isSuccess && !tempRequests.data) {
    return (
      <Center h={'100vh'}>
        <Text size="xl" color="red">
          Invalid or expired registration link
        </Text>
      </Center>
    );
  }

  return (
    <LoaderWrapper
      isLoading={isLoading}
      loadingText="Validating your registration link..."
      h={'100vh'}
    >
      <RegisterUserByLink />
    </LoaderWrapper>
  );
}

export default RegisterNewUserByLink;
