//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router';

import { DashboardLayout } from '@/components/layouts';
import { useAuth } from '@/lib/api/auth/auth';
import {
  // ContextState,
  // initialContextState,
  setContext,
} from '@/lib/store/slice/context-slice';
// import { isEmpty } from '@/utils/cn';
// import { LocalStorage } from '@/utils/local-storage.class';
// const storedContext = LocalStorage.get<ContextState>(LocalStorage.KEY.CONTEXT);
export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const AppRoot = () => {
  const { data: userData } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    // if (storedContext && !_.isEqual(initialContextState, storedContext)) {
    //   logger.info('Restoring context from local storage:', storedContext);
    //   dispatch(setContext({ data: storedContext ?? {} }));
    // } else if (userData) {
    dispatch(
      setContext({
        data: {
          user: userData,
          activeRoute: window.location.pathname ?? null,
          selectedOrganization: userData?.organization ?? null,
          selectedUnit: userData?.unit ?? null,
        },
        updateLocalStorage: true,
      }),
    );
    // }
  }, [dispatch, userData]);

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default AppRoot;
