//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { Navigate, Outlet } from 'react-router-dom';

import FullPageSpinner from '@/components/ui/core/spinner/fullpage-spinner';
import { useMe } from '@/lib/api/user/get-me'; // Replace with your user hook

import { AuthorizationService } from './authorization';

interface RoleProtectedRouteProps {
  redirectPath?: string; // Path to redirect if access is denied
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  redirectPath = '/unauthorized', // Default redirect path
}) => {
  const { data: me, isLoading, isSuccess, isError } = useMe(); // Add loading and error states

  // Wait for the data to load
  if (isLoading) {
    return <FullPageSpinner />;
  }

  // Handle error state (optional)
  if (isError) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check if the user has any of the allowed roles
  const hasAccess = AuthorizationService.hasLinkAccess(
    window.location.pathname,
    me?.data?.roles || [],
    isSuccess,
  );

  if (!hasAccess) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default RoleProtectedRoute;
