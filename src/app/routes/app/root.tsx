//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router';

import { DashboardLayout } from '@/components/layouts';
import { useUser } from '@/lib/api/auth/auth';
import {
  ContextState,
  setContext,
  setSelected,
} from '@/lib/store/slice/context-slice';
import { LocalStorage } from '@/utils/local-storage.class';
const storedContext = LocalStorage.get<ContextState>(LocalStorage.KEY.CONTEXT);
export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const AppRoot = () => {
  const { data: userData } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    if (storedContext) {
      console.log('Restoring context from local storage:', storedContext);
      dispatch(setContext({ data: storedContext }));
      dispatch(setSelected({ data: storedContext.selected }));
    } else if (userData) {
      dispatch(
        setContext({
          data: {
            user: userData._id,
            organization: userData.organization,
            unit: userData.unit,
            roles: userData.roles,
            activeRoute: window.location.pathname,
          },
          updateLocalStorage: true,
        }),
      );
      dispatch(
        setSelected({
          data: {
            organization: userData.organization,
            unit: userData.unit,
          },
          updateLocalStorage: true,
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
