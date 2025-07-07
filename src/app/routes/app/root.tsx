//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router';

import { DashboardLayout } from '@/components/layouts';
import { useUser } from '@/lib/api/auth/auth';
import { setContext, setSelected } from '@/lib/store/slice/context-slice';

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const AppRoot = () => {
  const { data: userData } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData) {
      dispatch(
        setContext({
          user: userData._id,
          organization: userData.organization,
          unit: userData.unit,
          roles: userData.roles,
          activeRoute: window.location.pathname,
        }),
        setSelected({
          organization: userData.organization,
          unit: userData.unit,
        }),
      );
    }
  }, [dispatch, userData]);

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AppRoot;
