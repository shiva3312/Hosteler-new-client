//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Box, Flex } from '@mantine/core';

import { SwitchesCard } from '@/components/ui/configuration/user-configuration';
import { UserCardImage } from '@/components/ui/user/user-profile-card';
import { Action, Authorization } from '@/lib/api/auth/authorization-wrapper';

import SummaryDashboard from './summary-dashboard';

function Dashboard() {
  return (
    <Flex
      justify={'center'}
      direction={'column'}
      gap="xl"
      p="xl"
      align={'center'}
    >
      <Authorization action={Action.user_profile}>
        <Box w={{ base: '100%', sm: '80%' }}>
          <UserCardImage />
        </Box>
      </Authorization>
      <Authorization action={Action.user_config_in_dashboard}>
        <Box w={{ base: '100%', sm: '80%' }}>
          <SwitchesCard />
        </Box>
      </Authorization>
      <Authorization action={Action.summary_dashboard}>
        <Box w={{ base: '100%', sm: '80%' }}>
          <SummaryDashboard />
        </Box>
      </Authorization>
    </Flex>
  );
}

export default Dashboard;
