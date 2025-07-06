//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Outlet } from 'react-router';

import { DashboardLayout } from '@/components/layouts';

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const AppRoot = () => {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AppRoot;
