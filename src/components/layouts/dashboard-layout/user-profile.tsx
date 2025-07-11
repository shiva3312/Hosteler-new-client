//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Container, Group, Menu, Text, UnstyledButton } from '@mantine/core';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import RoleBadge from '@/components/ui/core/badge/role-badge';
import { UserProfileImage } from '@/components/ui/core/file-hanling/user-image';
import { paths } from '@/config/paths';
import { ImageSize } from '@/interfaces/enums';
import { useLogout } from '@/lib/api/auth/auth';
import { AuthorizationService } from '@/lib/api/auth/authorization';
import { useMe } from '@/lib/api/user/get-me';

function UserProfile() {
  const navigate = useNavigate();
  const logout = useLogout({
    onSuccess: () => navigate(paths.auth.login.getHref()),
  });

  // const me = useSelector((state: RootState) => state.context.user);
  const { data: me } = useMe();

  const user = {
    name: me?.data?.profile
      ? `${me?.data?.profile.firstName ?? ''}`.trim()
      : `${me?.data?.username ?? ''}`,
    image: 'https://via.placeholder.com/150',
    highestRole: AuthorizationService.getHightest(me?.data?.roles ?? []),
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
              <Text fw={800} size="md" lh={1} mr={3}>
                {user.name}
              </Text>
              <UserProfileImage
                url={me?.data?.imageUrl ?? ''}
                type={ImageSize.Icon}
                outline
              />
              {/* <IconChevronDown size={12} stroke={1.5} /> */}
            </Group>
          </UnstyledButton>
        </Menu.Target>
        <Menu.Dropdown>
          {/* <Menu.Item leftSection={<IconHeart size={16} stroke={1.5} />}>
            Liked posts
          </Menu.Item>
          <Menu.Item leftSection={<IconStar size={16} stroke={1.5} />}>
            Saved posts
          </Menu.Item>
          <Menu.Item leftSection={<IconMessage size={16} stroke={1.5} />}>
            Your comments
          </Menu.Item> */}
          <Menu.Divider />
          <Menu.Label>Profile</Menu.Label>
          <Menu.Item
            leftSection={<IconUser size={16} stroke={1.5} />}
            onClick={() => navigate(paths.app.dashboard.getHref())}
          >
            <RoleBadge
              pl={'-12'}
              variant="transparent"
              role={user.highestRole}
            />
          </Menu.Item>
          {/* <Menu.Item
            leftSection={
              <Avatar src={user.image} alt={user.name} radius="xl" size={16} />
            }
            onClick={() => navigate(paths.app.dashboard.getHref())}
          >
            <RoleBadge variant="transparent" role={user.highestRole} />
          </Menu.Item> */}

          {/* <Menu.Label>Settings</Menu.Label> */}
          <Menu.Item
            leftSection={<IconSettings size={16} stroke={1.5} />}
            onClick={() => navigate(paths.app.settings.getHref())}
          >
            Account settings
          </Menu.Item>

          <Menu.Divider />

          <Menu.Item
            color="red"
            leftSection={<IconLogout size={16} stroke={1.5} />}
            onClick={() => logout.mutate({})}
          >
            Logout
          </Menu.Item>

          {/* <Menu.Divider /> */}

          {/* <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item leftSection={<IconPlayerPause size={16} stroke={1.5} />}>
            Pause subscription
          </Menu.Item>
          <Menu.Item
            color="red"
            leftSection={<IconTrash size={16} stroke={1.5} />}
          >
            Delete account
          </Menu.Item> */}
        </Menu.Dropdown>
      </Menu>
    </Container>
  );
}

export default UserProfile;
