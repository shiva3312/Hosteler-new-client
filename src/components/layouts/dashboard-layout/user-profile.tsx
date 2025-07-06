//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import {
  Avatar,
  Container,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {
  IconChevronDown,
  IconHeart,
  IconLogout,
  IconMessage,
  IconPlayerPause,
  IconSettings,
  IconStar,
  IconSwitchHorizontal,
  IconTrash,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { paths } from '@/config/paths';
import { useLogout } from '@/lib/auth';

function UserProfile() {
  const navigate = useNavigate();
  const logout = useLogout({
    onSuccess: () => navigate(paths.auth.login.getHref()),
  });
  const user = {
    name: 'Shivam Chaurasia',
    image:
      'https://images.unsplash.com/photo-1601922023934-7c3e5b8f0c2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MXwyMDg5NzN8MHwxfGFsbHwxfHx8fHx8fHwxNjE1ODQxMjE0&ixlib=rb-1.2.1&q=80&w=400',
  };

  return (
    <Container size="md" m={0} p={0} style={{ position: 'relative' }}>
      <Menu
        width={260}
        position="bottom-end"
        transitionProps={{ transition: 'pop-top-right' }}
        // onClose={() => setUserMenuOpened(false)}
        // onOpen={() => setUserMenuOpened(true)}
        withinPortal
      >
        <Menu.Target>
          <UnstyledButton>
            <Group gap={7}>
              <Avatar src={user.image} alt={user.name} radius="xl" size={20} />
              <Text fw={500} size="sm" lh={1} mr={3}>
                {user.name}
              </Text>
              <IconChevronDown size={12} stroke={1.5} />
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconHeart size={16} stroke={1.5} />}>
            Liked posts
          </Menu.Item>
          <Menu.Item leftSection={<IconStar size={16} stroke={1.5} />}>
            Saved posts
          </Menu.Item>
          <Menu.Item leftSection={<IconMessage size={16} stroke={1.5} />}>
            Your comments
          </Menu.Item>

          <Menu.Label>Settings</Menu.Label>
          <Menu.Item leftSection={<IconSettings size={16} stroke={1.5} />}>
            Account settings
          </Menu.Item>
          <Menu.Item
            leftSection={<IconSwitchHorizontal size={16} stroke={1.5} />}
          >
            Change account
          </Menu.Item>
          <Menu.Item
            leftSection={<IconLogout size={16} stroke={1.5} />}
            onClick={() => logout.mutate({})}
          >
            Logout
          </Menu.Item>

          <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item leftSection={<IconPlayerPause size={16} stroke={1.5} />}>
            Pause subscription
          </Menu.Item>
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={16} stroke={1.5} />}
          >
            Delete account
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Container>
  );
}

export default UserProfile;
