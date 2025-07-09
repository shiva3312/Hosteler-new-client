//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Anchor, AppShell, Box, Burger, Flex } from '@mantine/core';
import {
  IconUsers,
  IconGauge,
  IconSettings,
  IconUser,
  IconSettingsCog,
  IconToolsKitchen3,
  IconBed,
  IconSitemap,
} from '@tabler/icons-react';
import { useState } from 'react';

import { paths } from '@/config/paths';
import { useDisclosure } from '@/hooks/use-disclosure.js';

import RoleBasedSelector from './rolebase-selector';
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
      link: paths.app.organization.getHref(),
      icon: IconSitemap,
      label: 'Organization',
    },
    {
      link: paths.app.unit.getHref(),
      icon: IconBed,
      label: 'Hostel',
    },
    {
      link: paths.app.member.getHref(),
      icon: IconUsers,
      label: 'Member',
    },
    {
      link: paths.app.mess.getHref(),
      icon: IconToolsKitchen3,
      label: 'Mess',
      subLinks: [
        {
          link: paths.app.mess.getHref(),
          icon: IconToolsKitchen3,
          label: 'Mess',
        },
        {
          link: paths.app.mess.mealItem.getHref(),
          icon: IconToolsKitchen3,
          label: 'Meal Item',
        },
        {
          link: paths.app.mess.menu.getHref(),
          icon: IconToolsKitchen3,
          label: 'Menu',
        },
        {
          link: paths.app.mess.menuCycle.getHref(),
          icon: IconToolsKitchen3,
          label: 'Menu Cycle',
        },
        {
          link: paths.app.mess.mealChart.getHref(),
          icon: IconToolsKitchen3,
          label: 'Meal Chart',
        },
        {
          link: paths.app.mess.mealPreference.getHref(),
          icon: IconToolsKitchen3,
          label: 'Meal Preference',
        },
      ],
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
      <AppShell.Header zIndex={4}>
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
            <Anchor
              href={paths.home.getHref()}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = paths.app.dashboard.getHref();
              }}
            >
              <span className="logo">HostelEase</span>
            </Anchor>
          </Box>
          <Flex gap={'xl'} align={'center'}>
            <RoleBasedSelector />
            <UserProfile />
          </Flex>
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
