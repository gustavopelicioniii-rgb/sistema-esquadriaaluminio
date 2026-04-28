import { createContext } from 'react';

export type NotificationType = 'estoque' | 'pagamento' | 'producao' | 'crm';

export interface AppNotification {
  id: string;
  type: NotificationType;
  msg: string;
  detail?: string;
  time: string;
  read: boolean;
  severity: 'info' | 'warning' | 'critical';
}

export interface NotificationsContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  badgeCounts: Record<NotificationType, number>;
}

const noop = () => {};

export const fallbackNotificationsContext: NotificationsContextValue = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  markAsRead: noop,
  markAllAsRead: noop,
  badgeCounts: {
    estoque: 0,
    pagamento: 0,
    producao: 0,
    crm: 0,
  },
};

export const NotificationsContext = createContext<NotificationsContextValue | null>(null);
