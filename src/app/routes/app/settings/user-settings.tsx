//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import {
  Container,
  TextInput,
  PasswordInput,
  Switch,
  Button,
  Grid,
  Paper,
  Title,
  Group,
} from '@mantine/core';
import React, { useState } from 'react';
import './user-settings.css';

function UserSettings() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  const handleSubmit = () => {
    // Handle settings update logic
    console.log('Settings updated:', {
      email,
      password,
      isNotificationsEnabled,
    });
  };

  return (
    <Container>
      <Title order={1} mb="xl">
        User Settings
      </Title>

      {/* User Settings Form */}
      <Grid gutter="md">
        {/* Email Field */}
        <Grid.Col span={12}>
          <Paper p="lg" shadow="sm" radius="md">
            <TextInput
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Paper>
        </Grid.Col>

        {/* Password Field */}
        <Grid.Col span={12}>
          <Paper p="lg" shadow="sm" radius="md">
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Paper>
        </Grid.Col>

        {/* Notifications Settings */}
        <Grid.Col span={12}>
          <Paper p="lg" shadow="sm" radius="md">
            <Group>
              <Title order={3}>Notifications</Title>
              <Switch
                checked={isNotificationsEnabled}
                onChange={(e) => setIsNotificationsEnabled(e.target.checked)}
                label="Enable notifications"
              />
            </Group>
          </Paper>
        </Grid.Col>

        {/* Submit Button */}
        <Grid.Col span={12}>
          <Button onClick={handleSubmit} fullWidth>
            Save Settings
          </Button>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default UserSettings;
