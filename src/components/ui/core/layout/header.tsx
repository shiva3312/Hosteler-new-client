//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Container, Flex, Group, Image, Text } from '@mantine/core';
import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router';

import { paths } from '@/config/paths';

import classes from './header.module.css';

const links: { link: string; label: ReactNode }[] = [
  { link: paths.auth.login.getHref(), label: 'Login' },
  { link: paths.home.getHref(), label: 'Home' },
];

export function Header() {
  // const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(window.location.pathname);
  const navigate = useNavigate();

  const items = links.map((link) => (
    <a
      key={link.link}
      href={link.link}
      className={classes.link}
      data-active={active === link.link || undefined}
      onClick={(event) => {
        event.preventDefault();
        setActive(link.link);
        navigate(link.link);
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Flex align={'center'} flex={'row'} gap={'xs'} wrap={'nowrap'}>
          <Image
            src="/logo_no-background.png"
            alt="Logo"
            radius="md"
            style={{ width: '48px', height: '48px', objectFit: 'cover' }}
          />
          <Text fw={700} size="xl" c="blue">
            Hostelease
          </Text>
        </Flex>
        <Group
          gap={5}
          // visibleFrom="xs"
        >
          {items}
        </Group>

        {/* <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" /> */}
      </Container>
    </header>
  );
}
