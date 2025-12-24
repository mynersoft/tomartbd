// hooks/useNotification.js
"use client";
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

// LocalStorage helpers
const getStoredNotifications = () => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('tomartbd_notifications');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading notifications from localStorage:', error);
    return [];
  }
};

const setStoredNotifications = (notifications) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('tomartbd_notifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications to localStorage:', error);
  }
};

// Notification icon mapper
const getNotificationIcon = (type) => {
  const icons = {
    // Order related
    order_placed: '📦',
    order_confirmed: '✅',
    order_processing: '🔄',
    order_shipped: '🚚',
    order_delivered: '🎁',
    order_cancelled: '❌',
    order_failed: '⚠️',
    
    // Price related
    price_drop: '📉',
    price_alert: '💰',
    
    // Cart related
    cart_reminder: '🛒',
    cart_abandoned: '⏰',
    
    // Promotional
    flash_sale: '⚡',
    promotion: '🎁',
    discount: '🏷️',
    limited_offer: '🔥',
    
    // Account related
    welcome: '👋',
    account_verified: '✓',
    security_alert: '🔒',
    password_changed: '🔑',
    
    // Product related
    back_in_stock: '📦',
    new_arrival: '🆕',
    product_alert: '📢',
    
    // System
    system_update: '🔄',
    maintenance: '🔧',
    announcement: '📢',
    
    // Default
    default: '🔔'
  };
  return icons[type] || icons.default;
};

// Priority levels
const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Notification types
const NOTIFICATION_TYPES = {
  ORDER: {
    PLACED: 'order_placed',
    CONFIRMED: 'order_confirmed',
    PROCESSING: 'order_processing',
    SHIPPED: 'order_shipped',
    DELIVERED: 'order_delivered',
    CANCELLED: 'order_cancelled'
  },
  PRICE: {
    DROP: 'price_drop',
    ALERT: 'price_alert'
  },
  CART: {
    REMINDER: 'cart_reminder',
    ABANDONED: 'cart_abandoned'
  },
  PROMOTION: {
    FLASH_SALE: 'flash_sale',
    DISCOUNT: 'discount',
    PROMOTION: 'promotion'
  },
  ACCOUNT: {
    WELCOME: 'welcome',
    SECURITY: 'security_alert',
    VERIFIED: 'account_verified'
  },
  PRODUCT: {
    BACK_IN_STOCK: 'back_in_stock',
    NEW_ARRIVAL: 'new_arrival'
  }
};

export const useNotification = (userId = null) => {
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationSound] = useState(typeof Audio !== 'undefined' ? new Audio('/notification.mp3') : null);

  // Fetch notifications
  const { 
    data: notifications = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      if (!userId) {
        // Guest user - get from localStorage
        return getStoredNotifications();
      }
      
      try {
        const response = await axios.get(`/api/notifications?userId=${userId}`);
        return response.data.notifications || [];
      } catch (err) {
        console.error('Error fetching notifications:', err);
        // Fallback to localStorage if API fails
        return getStoredNotifications();
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  // Mark single notification as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId) => {
      if (!userId) {
        // Update localStorage for guests
        const current = getStoredNotifications();
        const updated = current.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true, readAt: new Date().toISOString() }
            : notification
        );
        setStoredNotifications(updated);
        return;
      }
      
      try {
        await axios.patch(`/api/notifications/${notificationId}/read`);
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', userId]);
    },
    onError: (error) => {
      toast.error('Failed to mark notification as read');
      console.error('Mutation error:', error);
    }
  });

  // Mark all notifications as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        // Update localStorage for guests
        const current = getStoredNotifications();
        const updated = current.map(notification => ({
          ...notification, 
          read: true, 
          readAt: new Date().toISOString()
        }));
        setStoredNotifications(updated);
        return;
      }
      
      try {
        await axios.post('/api/notifications/mark-all-read', { userId });
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', userId]);
      toast.success('All notifications marked as read');
    },
    onError: (error) => {
      toast.error('Failed to mark all notifications as read');
      console.error('Mutation error:', error);
    }
  });

  // Delete single notification
  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId) => {
      if (!userId) {
        // Delete from localStorage for guests
        const current = getStoredNotifications();
        const updated = current.filter(notification => notification.id !== notificationId);
        setStoredNotifications(updated);
        return;
      }
      
      try {
        await axios.delete(`/api/notifications/${notificationId}`);
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', userId]);
    },
    onError: (error) => {
      toast.error('Failed to delete notification');
      console.error('Mutation error:', error);
    }
  });

  // Clear all notifications
  const clearAllNotificationsMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        setStoredNotifications([]);
        return;
      }
      
      try {
        await axios.delete(`/api/notifications?userId=${userId}`);
      } catch (error) {
        console.error('Error clearing notifications:', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', userId]);
      toast.success('All notifications cleared');
    },
    onError: (error) => {
      toast.error('Failed to clear notifications');
      console.error('Mutation error:', error);
    }
  });

  // Create notification
  const createNotification = useCallback(async (notificationData) => {
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: notificationData.type || NOTIFICATION_TYPES.SYSTEM.DEFAULT,
      title: notificationData.title,
      message: notificationData.message,
      data: notificationData.data || {},
      priority: notificationData.priority || PRIORITY.MEDIUM,
      read: false,
      createdAt: new Date().toISOString(),
      expiresAt: notificationData.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days default
      category: notificationData.category || 'general',
      icon: getNotificationIcon(notificationData.type),
      action: notificationData.action || null,
    };

    // Update local state immediately
    queryClient.setQueryData(['notifications', userId], (old = []) => {
      const updated = [notification, ...old];
      // Keep only last 100 notifications
      return updated.slice(0, 100);
    });

    // Store in localStorage for guests or cache
    if (!userId) {
      const current = getStoredNotifications();
      const updated = [notification, ...current];
      setStoredNotifications(updated.slice(0, 100));
    } else {
      // Send to backend for logged-in users
      try {
        await axios.post('/api/notifications', notification);
      } catch (error) {
        console.error('Error saving notification to backend:', error);
      }
    }

    // Play sound if enabled
    if (soundEnabled && notificationSound && notification.priority !== PRIORITY.LOW) {
      try {
        notificationSound.currentTime = 0;
        await notificationSound.play();
      } catch (error) {
        console.error('Error playing notification sound:', error);
      }
    }

    // Show toast notification
    if (notification.priority === PRIORITY.HIGH || notification.priority === PRIORITY.URGENT) {
      showNotificationToast(notification);
    }

    return notification;
  }, [userId, queryClient, soundEnabled, notificationSound]);

  // Predefined notification templates
  const notificationTemplates = {
    // Order notifications
    orderPlaced: (order) => createNotification({
      type: NOTIFICATION_TYPES.ORDER.PLACED,
      title: '🎉 Order Placed Successfully!',
      message: `Your order #${order.id} has been placed. Total: ৳${order.total}`,
      data: { orderId: order.id, orderTotal: order.total },
      priority: PRIORITY.HIGH,
      category: 'order',
      action: { label: 'View Order', url: `/orders/${order.id}` }
    }),

    orderShipped: (order) => createNotification({
      type: NOTIFICATION_TYPES.ORDER.SHIPPED,
      title: '🚚 Order Shipped!',
      message: `Your order #${order.id} is on the way. Track your delivery.`,
      data: { 
        orderId: order.id, 
        trackingNumber: order.trackingNumber,
        estimatedDelivery: order.estimatedDelivery 
      },
      priority: PRIORITY.HIGH,
      category: 'order',
      action: { label: 'Track Order', url: `/track/${order.trackingNumber}` }
    }),

    orderDelivered: (order) => createNotification({
      type: NOTIFICATION_TYPES.ORDER.DELIVERED,
      title: '🎁 Order Delivered!',
      message: `Your order #${order.id} has been delivered. Please confirm receipt.`,
      data: { orderId: order.id, deliveredAt: order.deliveredAt },
      priority: PRIORITY.HIGH,
      category: 'order',
      action: { label: 'Confirm Receipt', url: `/orders/${order.id}/confirm` }
    }),

    // Price notifications
    priceDrop: (product) => createNotification({
      type: NOTIFICATION_TYPES.PRICE.DROP,
      title: '📉 Price Drop Alert!',
      message: `Price decreased on ${product.name}. Now: ৳${product.price}`,
      data: { 
        productId: product.id, 
        productName: product.name,
        oldPrice: product.oldPrice,
        newPrice: product.price,
        discount: product.discount 
      },
      priority: PRIORITY.MEDIUM,
      category: 'price',
      action: { label: 'View Product', url: `/products/${product.id}` }
    }),

    // Cart notifications
    cartReminder: (cart) => createNotification({
      type: NOTIFICATION_TYPES.CART.REMINDER,
      title: '🛒 Items Waiting in Cart',
      message: `You have ${cart.itemsCount} items worth ৳${cart.total} in your cart.`,
      data: { 
        itemsCount: cart.itemsCount,
        cartTotal: cart.total,
        cartItems: cart.items 
      },
      priority: PRIORITY.LOW,
      category: 'cart',
      action: { label: 'View Cart', url: '/cart' }
    }),

    // Promotional notifications
    flashSale: (sale) => createNotification({
      type: NOTIFICATION_TYPES.PROMOTION.FLASH_SALE,
      title: '⚡ Flash Sale Live!',
      message: `${sale.discount}% off on ${sale.category}. Ends in ${sale.timeLeft}`,
      data: { 
        saleId: sale.id,
        discount: sale.discount,
        category: sale.category,
        endTime: sale.endTime 
      },
      priority: PRIORITY.HIGH,
      category: 'promotion',
      action: { label: 'Shop Now', url: `/flash-sale/${sale.id}` }
    }),

    welcome: (user) => createNotification({
      type: NOTIFICATION_TYPES.ACCOUNT.WELCOME,
      title: '👋 Welcome to TomartBD!',
      message: `Hello ${user.name}! Get 15% off on your first order with code WELCOME15.`,
      data: { 
        userId: user.id,
        userName: user.name,
        discountCode: 'WELCOME15' 
      },
      priority: PRIORITY.HIGH,
      category: 'account',
      action: { label: 'Shop Now', url: '/products' }
    }),

    backInStock: (product) => createNotification({
      type: NOTIFICATION_TYPES.PRODUCT.BACK_IN_STOCK,
      title: '📦 Back in Stock!',
      message: `${product.name} is back in stock. Hurry while supplies last!`,
      data: { 
        productId: product.id,
        productName: product.name,
        stockQuantity: product.stock 
      },
      priority: PRIORITY.MEDIUM,
      category: 'product',
      action: { label: 'Buy Now', url: `/products/${product.id}` }
    }),

    // Security notifications
    newLogin: (device) => createNotification({
      type: NOTIFICATION_TYPES.ACCOUNT.SECURITY,
      title: '🔒 New Login Detected',
      message: `New login from ${device.browser} on ${device.os}. ${device.location}`,
      data: { 
        device: device.browser,
        os: device.os,
        location: device.location,
        time: device.time 
      },
      priority: PRIORITY.URGENT,
      category: 'security',
      action: { label: 'Review Activity', url: '/security' }
    }),
  };

  // Helper functions
  const getUnreadNotifications = useCallback(() => {
    return notifications.filter(notification => !notification.read);
  }, [notifications]);

  const getNotificationsByType = useCallback((type) => {
    return notifications.filter(notification => notification.type === type);
  }, [notifications]);

  const getNotificationsByCategory = useCallback((category) => {
    return notifications.filter(notification => notification.category === category);
  }, [notifications]);

  const getNotificationsByPriority = useCallback((priority) => {
    return notifications.filter(notification => notification.priority === priority);
  }, [notifications]);

  const hasUnreadNotifications = useCallback(() => {
    return unreadCount > 0;
  }, [unreadCount]);

  const formatNotificationTime = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    
    return date.toLocaleDateString('en-BD', {
      day: 'numeric',
      month: 'short',
      year: numeric
    });
  }, []);

  // Update unread count
  useEffect(() => {
    const unread = getUnreadNotifications().length;
    setUnreadCount(unread);
    
    // Update browser tab title
    if (unread > 0) {
      document.title = `(${unread}) TomartBD`;
    } else {
      document.title = 'TomartBD';
    }
    
    // Request permission for browser notifications
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [notifications, getUnreadNotifications]);

  // Cleanup expired notifications
  useEffect(() => {
    const cleanupExpired = () => {
      const now = new Date();
      const validNotifications = notifications.filter(notification => {
        if (!notification.expiresAt) return true;
        return new Date(notification.expiresAt) > now;
      });
      
      if (validNotifications.length < notifications.length) {
        if (!userId) {
          setStoredNotifications(validNotifications);
        }
        queryClient.setQueryData(['notifications', userId], validNotifications);
      }
    };

    cleanupExpired();
  }, [notifications, userId, queryClient]);

  return {
    // State
    notifications,
    unreadCount,
    isLoading,
    error,
    
    // Actions
    createNotification,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
    clearAllNotifications: clearAllNotificationsMutation.mutate,
    refetchNotifications: refetch,
    
    // Template notifications
    templates: notificationTemplates,
    
    // Helper functions
    getUnreadNotifications,
    getNotificationsByType,
    getNotificationsByCategory,
    getNotificationsByPriority,
    hasUnreadNotifications,
    formatNotificationTime,
    
    // Settings
    soundEnabled,
    setSoundEnabled,
    
    // Constants
    PRIORITY,
    NOTIFICATION_TYPES,
  };
};

// Helper function to show notification toast
const showNotificationToast = (notification) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <span className="text-xl">{notification.icon}</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                {notification.title}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {notification.message}
              </p>
              {notification.action && (
                <button
                  onClick={() => {
                    window.location.href = notification.action.url;
                    toast.dismiss(t.id);
                  }}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {notification.action.label} →
                </button>
              )}
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      duration: 5000,
      position: 'top-right',
    }
  );
};

// Export the hook as default
export default useNotification;