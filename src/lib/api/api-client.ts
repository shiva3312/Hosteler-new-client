//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import Axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { useNotifications } from '@/components/ui/core/notifications';
import { env } from '@/config/env';
import logger from '@/config/log';
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
  (response) => response.data,
  (error: AxiosError<any>) => {
    const status = error.response?.status;
    const data = error.response?.data;

    // 🔍 Extract error message safely
    const message =
      data?.message ||
      data?.error ||
      error.message ||
      'Something went wrong. Please try again.';

    // 🔔 Notify user
    if (!data.silentError) {
      useNotifications.getState().addNotification({
        type: 'error',
        title: getTitleByStatus(status),
        message,
      });
    }
    // 🔒 Unauthorized (force redirect)
    if (status === 401) {
      const searchParams = new URLSearchParams();
      const redirectTo =
        searchParams.get('redirectTo') || window.location.pathname;
      window.location.href = paths.auth.login.getHref(redirectTo);
    }

    // 🚫 Too Many Requests
    if (status === 429) {
      console.warn('⏳ Too many requests - please slow down.');

      // Optionally retry (e.g. with exponential backoff)
      // return retryRequest(error); <-- optional if implemented
    }

    // 🧱 Generic handling for server errors
    if (status === 500) {
      logger.error('Server error:', data);
    }

    return Promise.reject(error);
  },
);

// ✅ Optional: Customize error title based on HTTP status
function getTitleByStatus(status?: number): string {
  switch (status) {
    case 400:
      return 'Bad Request';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    case 404:
      return 'Not Found';
    case 429:
      return 'Too Many Requests';
    case 500:
      return 'Server Error';
    default:
      return 'Error';
  }
}
