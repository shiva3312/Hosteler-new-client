//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Container, Title, Text, Button, Group } from '@mantine/core';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { paths } from '@/config/paths';
import { getToken } from '@/lib/api/auth/auth';

function LandingPage() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate(paths.auth.login.getHref());
  };

  const handleRegisterRedirect = () => {
    navigate(paths.auth.register.getHref());
  };

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard or home page
    const token = getToken();
    if (token) {
      navigate(paths.app.dashboard.getHref());
    }
  }, [navigate]);

  return (
    <Container size="lg" style={{ padding: '80px 0', textAlign: 'center' }}>
      <Title order={1} mb="xl">
        Welcome to Our Platform
      </Title>

      <Text size="xl" mb="xl">
        We offer the best services to help you grow your business. Join us today
        to take your business to the next level.
      </Text>

      <Group>
        <Button
          variant="filled"
          color="blue"
          size="lg"
          onClick={handleLoginRedirect}
          style={{ marginRight: '10px' }}
        >
          Login
        </Button>
        <Button
          variant="outline"
          color="blue"
          size="lg"
          onClick={handleRegisterRedirect}
        >
          Register
        </Button>
      </Group>
    </Container>
  );
}

export default LandingPage;
