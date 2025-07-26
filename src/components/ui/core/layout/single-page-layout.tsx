//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Box } from '@mantine/core';
import { ReactNode } from 'react';

import { Footer } from './footer';
import { Header } from './header';

interface PageLayoutProps {
  children: ReactNode;
}

export function SinglePageLayout({ children }: PageLayoutProps) {
  return (
    <Box
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />
      <Box style={{ flex: 1 }}>{children}</Box>
      <Footer />
    </Box>
  );
}
