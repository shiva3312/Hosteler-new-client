//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import Axios, { InternalAxiosRequestConfig } from 'axios';

import { useNotifications } from '@/components/ui/core/notifications';
import { env } from '@/config/env';
import { paths } from '@/config/paths';
import { LocalStorage } from '@/utils/local-storage.class';

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
  if (config.headers) {
    config.headers.Accept = 'application/json';
  }

  // Set the Authorization header if the token exists
  const token = LocalStorage.get(LocalStorage.KEY.AUTHORIZATION);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.withCredentials = true;
  return config;
}

export const api = Axios.create({
  baseURL: env.API_URL,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message;
    useNotifications.getState().addNotification({
      type: 'error',
      title: 'Error',
      message,
    });

    if (error.response?.status === 401) {
      const searchParams = new URLSearchParams();
      const redirectTo =
        searchParams.get('redirectTo') || window.location.pathname;
      window.location.href = paths.auth.login.getHref(redirectTo);
    }

    return Promise.reject(error);
  },
);
