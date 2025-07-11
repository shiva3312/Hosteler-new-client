//Copyright (c) Shivam Chaurasia - All rights reserved. Confidential and proprietary.
import { nanoid } from 'nanoid';
import { create } from 'zustand';

export type Notification = {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message?: string;
};

type NotificationsStore = {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, 'id'>,
    autoRemove?: boolean,
  ) => void;
  dismissNotification: (id: string) => void;
};

export const useNotifications = create<NotificationsStore>((set) => ({
  notifications: [],
  addNotification: (notification, autoRemove = true) => {
    const id = nanoid();
    set((state) => ({
      notifications: [...state.notifications, { id, ...notification }],
    }));

    // remove notification after 5 seconds
    if (autoRemove && notification.type !== 'error') {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, 5000);
    }
  },
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id,
      ),
    })),
}));
