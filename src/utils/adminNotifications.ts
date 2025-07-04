// Admin Notifications Utilities
// Toast notifications and alert system for admin interface

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number; // in milliseconds, 0 for persistent
  actions?: NotificationAction[];
  timestamp: Date;
  isRead?: boolean;
  isDismissed?: boolean;
}

export interface NotificationAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface NotificationOptions {
  type?: NotificationType;
  title?: string;
  duration?: number;
  actions?: NotificationAction[];
  persistent?: boolean;
}

export class AdminNotificationManager {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private nextId = 1;

  // Add notification
  add(message: string, options: NotificationOptions = {}): string {
    const notification: Notification = {
      id: `notification-${this.nextId++}`,
      type: options.type || 'info',
      title: options.title,
      message,
      duration: options.persistent ? 0 : (options.duration || this.getDefaultDuration(options.type || 'info')),
      actions: options.actions,
      timestamp: new Date(),
      isRead: false,
      isDismissed: false
    };

    console.log('[AdminNotificationManager] Adding notification:', notification.type, message);

    this.notifications.unshift(notification);
    this.notifyListeners();

    // Auto-dismiss if duration is set
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.dismiss(notification.id);
      }, notification.duration);
    }

    return notification.id;
  }

  // Dismiss notification
  dismiss(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isDismissed = true;
      this.notifications = this.notifications.filter(n => n.id !== id);
      this.notifyListeners();
    }
  }

  // Mark as read
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      this.notifyListeners();
    }
  }

  // Mark all as read
  markAllAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
    this.notifyListeners();
  }

  // Clear all notifications
  clear(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  // Get all notifications
  getAll(): Notification[] {
    return [...this.notifications];
  }

  // Get unread count
  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // Subscribe to changes
  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify listeners
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  // Get default duration based on type
  private getDefaultDuration(type: NotificationType): number {
    switch (type) {
      case 'success':
        return 4000;
      case 'info':
        return 5000;
      case 'warning':
        return 6000;
      case 'error':
        return 8000;
      default:
        return 5000;
    }
  }

  // Convenience methods
  success(message: string, options: Omit<NotificationOptions, 'type'> = {}): string {
    return this.add(message, { ...options, type: 'success' });
  }

  error(message: string, options: Omit<NotificationOptions, 'type'> = {}): string {
    return this.add(message, { ...options, type: 'error' });
  }

  warning(message: string, options: Omit<NotificationOptions, 'type'> = {}): string {
    return this.add(message, { ...options, type: 'warning' });
  }

  info(message: string, options: Omit<NotificationOptions, 'type'> = {}): string {
    return this.add(message, { ...options, type: 'info' });
  }
}

// Global notification manager instance
export const adminNotifications = new AdminNotificationManager();

// React hook for notifications
import React from 'react';

export function useAdminNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    // Initialize with current notifications
    setNotifications(adminNotifications.getAll());

    // Subscribe to changes
    const unsubscribe = adminNotifications.subscribe(setNotifications);

    return unsubscribe;
  }, []);

  const add = React.useCallback((message: string, options?: NotificationOptions) => {
    return adminNotifications.add(message, options);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    adminNotifications.dismiss(id);
  }, []);

  const markAsRead = React.useCallback((id: string) => {
    adminNotifications.markAsRead(id);
  }, []);

  const markAllAsRead = React.useCallback(() => {
    adminNotifications.markAllAsRead();
  }, []);

  const clear = React.useCallback(() => {
    adminNotifications.clear();
  }, []);

  // Convenience methods
  const success = React.useCallback((message: string, options?: Omit<NotificationOptions, 'type'>) => {
    return adminNotifications.success(message, options);
  }, []);

  const error = React.useCallback((message: string, options?: Omit<NotificationOptions, 'type'>) => {
    return adminNotifications.error(message, options);
  }, []);

  const warning = React.useCallback((message: string, options?: Omit<NotificationOptions, 'type'>) => {
    return adminNotifications.warning(message, options);
  }, []);

  const info = React.useCallback((message: string, options?: Omit<NotificationOptions, 'type'>) => {
    return adminNotifications.info(message, options);
  }, []);

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.isRead).length,
    add,
    dismiss,
    markAsRead,
    markAllAsRead,
    clear,
    success,
    error,
    warning,
    info
  };
}

// Predefined notification messages
export const adminMessages = {
  // Success messages
  saved: 'Changes saved successfully',
  created: 'Item created successfully',
  updated: 'Item updated successfully',
  deleted: 'Item deleted successfully',
  uploaded: 'File uploaded successfully',
  exported: 'Data exported successfully',
  imported: 'Data imported successfully',

  // Error messages
  saveError: 'Failed to save changes',
  loadError: 'Failed to load data',
  deleteError: 'Failed to delete item',
  uploadError: 'Failed to upload file',
  networkError: 'Network error. Please check your connection.',
  serverError: 'Server error. Please try again later.',
  validationError: 'Please check the form for errors',

  // Warning messages
  unsavedChanges: 'You have unsaved changes',
  deleteConfirm: 'Are you sure you want to delete this item?',
  bulkDeleteConfirm: 'Are you sure you want to delete selected items?',
  
  // Info messages
  loading: 'Loading...',
  processing: 'Processing...',
  saving: 'Saving...',
  uploading: 'Uploading...'
};

// Notification helpers for common admin actions
export const notifySuccess = {
  saved: () => adminNotifications.success(adminMessages.saved),
  created: (itemType?: string) => adminNotifications.success(
    itemType ? `${itemType} created successfully` : adminMessages.created
  ),
  updated: (itemType?: string) => adminNotifications.success(
    itemType ? `${itemType} updated successfully` : adminMessages.updated
  ),
  deleted: (itemType?: string) => adminNotifications.success(
    itemType ? `${itemType} deleted successfully` : adminMessages.deleted
  ),
  uploaded: () => adminNotifications.success(adminMessages.uploaded),
  exported: () => adminNotifications.success(adminMessages.exported),
  imported: () => adminNotifications.success(adminMessages.imported)
};

export const notifyError = {
  save: () => adminNotifications.error(adminMessages.saveError),
  load: () => adminNotifications.error(adminMessages.loadError),
  delete: () => adminNotifications.error(adminMessages.deleteError),
  upload: () => adminNotifications.error(adminMessages.uploadError),
  network: () => adminNotifications.error(adminMessages.networkError),
  server: () => adminNotifications.error(adminMessages.serverError),
  validation: () => adminNotifications.error(adminMessages.validationError)
};

export const notifyWarning = {
  unsavedChanges: () => adminNotifications.warning(adminMessages.unsavedChanges),
  deleteConfirm: (callback: () => void) => adminNotifications.warning(
    adminMessages.deleteConfirm,
    {
      actions: [
        { label: 'Delete', action: callback, style: 'danger' },
        { label: 'Cancel', action: () => {}, style: 'secondary' }
      ],
      persistent: true
    }
  )
};

export const notifyInfo = {
  loading: () => adminNotifications.info(adminMessages.loading),
  processing: () => adminNotifications.info(adminMessages.processing),
  saving: () => adminNotifications.info(adminMessages.saving),
  uploading: () => adminNotifications.info(adminMessages.uploading)
};