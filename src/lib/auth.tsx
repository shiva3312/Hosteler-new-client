//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import Cookies from 'js-cookie';
import { configureAuth } from 'react-query-auth';
import { Navigate, useLocation } from 'react-router';
import { z } from 'zod';

import { paths } from '@/config/paths';
import { UserLoginRequestZodSchema } from '@/interfaces/auth.interface';
import {
  UserRequestZodSchema,
  UserResponse,
} from '@/interfaces/user.interface';
import { AuthResponse } from '@/types/api';

import { api } from './api-client';

// api call definitions for auth (types, schemas, requests):
// these are not part of features as this is a module shared across features

const getUser = async (): Promise<UserResponse> => {
  const response = await api.get('/user/me');
  return response.data;
};

const logout = (): Promise<void> => {
  return api.post('/logout');
};

export const loginInputSchema = UserLoginRequestZodSchema;

export type LoginInput = z.infer<typeof loginInputSchema>;
const loginWithEmailAndPassword = (data: LoginInput): Promise<AuthResponse> => {
  return api.post('/login', data);
};

export type RegisterInput = z.infer<typeof UserRequestZodSchema>;

const registerWithEmailAndPassword = (
  data: RegisterInput,
): Promise<AuthResponse> => {
  return api.post('/signup', data);
};

const authConfig = {
  userFn: getUser,
  loginFn: async (data: LoginInput) => {
    const response = await loginWithEmailAndPassword(data);
    return response.data;
  },
  registerFn: async (data: RegisterInput) => {
    const response = await registerWithEmailAndPassword(data);
    return response.data;
  },
  logoutFn: logout,
};

export const { useUser, useLogin, useLogout, useRegister, AuthLoader } =
  configureAuth(authConfig);

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser();
  const location = useLocation();
  const authToken = Cookies.get('Authorization');

  if (!authToken && !user.data) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return children;
};
