//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { AppShell, Box, Burger, Flex } from '@mantine/core';
import {
  IconHome2,
  IconGauge,
  IconDeviceDesktopAnalytics,
  IconSettings,
  IconUser,
  IconSettingsCog,
} from '@tabler/icons-react';
import { useState } from 'react';

import { paths } from '@/config/paths';
import { useDisclosure } from '@/hooks/use-disclosure.js';

import SidebarLinks, { Link } from './sidebar-links'; // Import the sidebar links component
import UserProfile from './user-profile';
import './layout.css';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isOpen: opened, toggle } = useDisclosure();
  const [active, setActive] = useState('Home');

  const mainLinks: Link[] = [
    {
      link: paths.app.dashboard.getHref(),
      icon: IconGauge,
      label: 'Dashboard',
    },
    {
      link: paths.app.home.getHref(),
      icon: IconHome2,
      label: 'Home',
    },
    {
      link: paths.app.analytics.getHref(),
      icon: IconDeviceDesktopAnalytics,
      label: 'Analytics',
    },
    {
      link: paths.app.settings.getHref(),
      icon: IconSettings,
      label: 'Settings',
    },
    {
      link: paths.app.systemSettings.user.getHref(),
      icon: IconSettingsCog,
      label: 'System Settings',
      subLinks: [
        {
          link: paths.app.systemSettings.user.getHref(),
          icon: IconUser,
          label: 'User',
        },
        {
          link: paths.app.systemSettings.group.getHref(),
          icon: IconUser,
          label: 'Group',
        },
        {
          link: paths.app.systemSettings.feature.getHref(),
          icon: IconUser,
          label: 'Feature',
        },
        {
          link: paths.app.systemSettings.system.getHref(),
          icon: IconUser,
          label: 'System',
        },
      ],
    },
  ].filter(Boolean) as Link[];

  const hasSublink = mainLinks?.find((link) => link.label === active)?.subLinks;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: hasSublink ? 250 : 60,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header zIndex={0}>
        <Flex
          justify={'space-between'}
          align={'center'}
          style={{
            height: '100%',
            width: '100%',
            paddingInline: 'var(--mantine-spacing-md)',
          }}
        >
          <Box>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <span className="logo">Logo</span>
          </Box>
          <UserProfile />
        </Flex>
      </AppShell.Header>
      <AppShell.Navbar>
        <SidebarLinks
          mainLinks={mainLinks}
          active={active}
          setActive={setActive}
        />
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
