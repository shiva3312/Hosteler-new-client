//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.

import { Box, Title, Tooltip, UnstyledButton } from '@mantine/core';
import { Icon, IconProps } from '@tabler/icons-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebar-links.css';

export interface Link {
  link: string;
  icon: React.ForwardRefExoticComponent<IconProps & React.RefAttributes<Icon>>;
  label: string;
  subLinks?: Link[];
}

export interface NavbarLinkProps {
  mainLinks: Link[];
  active: string;
  setActive: (label: string) => void;
}

export function SidebarLinks({
  mainLinks,
  setActive,
  active,
}: NavbarLinkProps) {
  const [activeLink, setActiveLink] = useState('');
  const navigate = useNavigate();

  // ✅ Changed: use navigate instead of NavLink
  const MainLinks = mainLinks.map((link) => (
    <Tooltip
      label={link.label}
      position="right"
      withArrow
      transitionProps={{ duration: 0 }}
      key={link.label}
    >
      <UnstyledButton
        className="mainLink"
        onClick={() => {
          setActive(link.label);
          navigate(link.link); // ✅ programmatic navigation
        }}
        data-active={link.label === active || undefined}
      >
        <link.icon size={22} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  ));

  // ✅ Changed: use navigate for sub-links as well
  const subLinks =
    mainLinks.find((link) => link.label === active)?.subLinks || [];

  const SubLinkComponents = subLinks.map((link) => (
    <UnstyledButton
      className="link"
      key={link.link}
      data-active={activeLink === link.label || undefined}
      onClick={() => {
        setActiveLink(link.label);
        navigate(link.link);
      }}
    >
      {link.label}
    </UnstyledButton>
  ));

  return (
    <Box className="nav-link-container">
      <nav className="navbar">
        <div className="wrapper">
          <div className="aside">{MainLinks}</div>
          {SubLinkComponents.length > 0 && (
            <div className="main">
              <Title order={4} fz={'h4'} fw={600} className="title">
                {active}
              </Title>
              {SubLinkComponents}
            </div>
          )}
        </div>
      </nav>
    </Box>
  );
}

export default SidebarLinks;
