//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { notifications } from '@mantine/notifications';

import { env } from '@/config/env';
import { Environment } from '@/data/feature';

export type NotificationPayload = {
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message?: string;
};

const typeToColor = {
  info: 'blue',
  warning: 'yellow',
  success: 'green',
  error: 'red',
};

/**
 * Displays a notification. Can be used anywhere.
 * @param notification - The notification content.
 * @param autoRemove - Whether the notification should be dismissed automatically. Defaults to true.
 * @returns The ID of the created notification.
 */
export const showNotification = (
  notification: NotificationPayload,
  autoRemove = true,
): string => {
  const shouldAutoClose =
    autoRemove &&
    !(notification.type === 'error' && env.ENVIRONMENT === Environment.DEV);

  return notifications.show({
    position: 'top-right',
    id: notification.title,
    // Use title as ID to avoid duplicates
    withCloseButton: true,
    title: notification.title,
    message: notification.message,
    color: typeToColor[notification.type],
    autoClose: shouldAutoClose ? 3000 : false,
  });
};

/**
 * A hook to manage application-wide notifications using Mantine.
 *
 * NOTE: You must have the `<Notifications />` component from `@mantine/notifications`
 * rendered in your component tree for notifications to appear.
 */
export const useNotifications = () => {
  /**
   * Dismisses a notification by its ID.
   * @param id - The ID of the notification to dismiss.
   */
  const dismissNotification = (id: string) => {
    notifications.hide(id);
  };

  return { addNotification: showNotification, dismissNotification };
};
