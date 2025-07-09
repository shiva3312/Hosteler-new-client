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
import { LocalStorage } from '@/utils/local-storage.class';

import { api } from '../api-client';

// api call definitions for auth (types, schemas, requests):
// these are not part of features as this is a module shared across features

const getUser = async (): Promise<UserResponse> => {
  const response = await api.get('/user/me');
  return response.data;
};

const logout = (): Promise<void> => {
  return api.post('/logout').then(() => {
    clearToken();
  });
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

    // Set the token in cookies and local storage
    if (response.token) {
      setToken(response?.token?.token, response.token.expiresIn);
    }

    return response.data;
  },
  registerFn: async (data: RegisterInput) => {
    const response = await registerWithEmailAndPassword(data);

    // Set the token in cookies and local storage
    if (response.token) {
      setToken(response?.token?.token, response.token.expiresIn);
    }

    return response.data;
  },
  logoutFn: logout,
};

export const {
  useUser: useAuth,
  useLogin,
  useLogout,
  useRegister,
  AuthLoader,
} = configureAuth(authConfig);

export const getToken = (): string | undefined => {
  // Get the token from cookies
  const authToken = Cookies.get('Authorization');
  // If the token is not found in cookies, try to get it from local storage
  const token = LocalStorage.get<string>(LocalStorage.KEY.AUTHORIZATION);

  if (token) {
    return token;
  }
  return authToken;
};

export const setToken = (token: string, timeout: number): void => {
  if (token === undefined || token === null) {
    throw new Error('Token cannot be null or undefined');
  }
  // Cookies.set('Authorization', token, {
  //   expires: new Date(Date.now() + timeout * 1000), // Sets the cookie to expire after the specified timeout
  //   secure: true, // Use secure cookies in production
  //   sameSite: 'Strict', // Prevents CSRF attacks
  // });

  // NOTE: Cookies will automatically be sent with requests if the API is on the same domain.
  // If the API is on a different domain, you may need to set the `withCredentials` option in your API client.
  // This is already handled in the api client configuration.
  // IMPORTANT: Due to cookies read issue in development - we can just set the token in local storage.

  // Set the token in local storage for easy access
  LocalStorage.set(LocalStorage.KEY.AUTHORIZATION, token, timeout);
};

export const clearToken = () => {
  // Clear the token from cookies
  Cookies.remove('Authorization');
  // Clear the token from local storage
  LocalStorage.remove(LocalStorage.KEY.AUTHORIZATION);
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const authToken = getToken();

  if (!authToken) {
    return (
      <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
    );
  }

  return children;
};
