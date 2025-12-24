// hooks/useNotifications.js
"use client";
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useNotifications = (userId) => {
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', userId],
    queryFn: async () => {
      if (!userId) {
        // For guests, get from localStorage
        const local = JSON.parse(localStorage.getItem('tomartbd_notifications') || '[]');
        return local.slice(0, 50); // Limit for guests
      }
      const res = await axios.get(`/api/notifications?userId=${userId}`);
      return res.data.notifications;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Mark as read
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId) => {
      if (!userId) {
        // Update localStorage for guests
        const local = JSON.parse(localStorage.getItem('tomartbd_notifications') || '[]');
        const updated = local.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        );
        localStorage.setItem('tomartbd_notifications', JSON.stringify(updated));
        return;
      }
      await axios.patch(`/api/notifications/${notificationId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', userId]);
    },
  });

  // Mark all as read
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        localStorage.removeItem('tomartbd_notifications');
        return;
      }
      await axios.post('/api/notifications/mark-all-read', { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications', userId]);
      toast.success('All notifications marked as read');
    },
  });

  // Add notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      userId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      data: notification.data || {},
      read: false,
      createdAt: new Date().toISOString(),
      priority: notification.priority || 'medium',
    };

    // Add to query cache immediately for instant update
    queryClient.setQueryData(['notifications', userId], (old = []) => {
      return [newNotification, ...old.slice(0, 49)]; // Keep only 50 latest
    });

    // For guests, save to localStorage
    if (!userId) {
      const local = JSON.parse(localStorage.getItem('tomartbd_notifications') || '[]');
      localStorage.setItem('tomartbd_notifications', 
        JSON.stringify([newNotification, ...local.slice(0, 49)])
      );
    } else {
      // For logged-in users, send to backend
      axios.post('/api/notifications', newNotification).catch(console.error);
    }

    // Show toast based on priority
    if (notification.priority === 'high') {
      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'}
          max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                {getNotificationIcon(newNotification.type)}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {newNotification.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {newNotification.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      ));
    }
  };

  // Update unread count
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
    
    // Update browser tab title
    if (unread > 0) {
      document.title = `(${unread}) TomartBD`;
    } else {
      document.title = 'TomartBD';
    }
  }, [notifications]);

  // Sample notification triggers
  const triggerSampleNotifications = {
    priceDrop: (product) => addNotification({
      type: 'price_drop',
      title: 'Price Drop Alert! 🎉',
      message: `Price decreased on ${product.name}. New price: ৳${product.price}`,
      data: { productId: product.id },
      priority: 'medium',
    }),

    orderShipped: (order) => addNotification({
      type: 'order_shipped',
      title: 'Order Shipped! 📦',
      message: `Your order #${order.id} has been shipped. Track it now.`,
      data: { orderId: order.id, trackingNumber: order.trackingNumber },
      priority: 'high',
    }),

    cartReminder: (cart) => addNotification({
      type: 'cart_reminder',
      title: 'Items Waiting! 🛒',
      message: `You have ${cart.items.length} items in your cart. Complete your purchase.`,
      data: { cartItems: cart.items },
      priority: 'low',
    }),

    flashSale: () => addNotification({
      type: 'flash_sale',
      title: 'Flash Sale Live! ⚡',
      message: 'Hurry! Flash sale ends in 2 hours. Up to 70% off.',
      priority: 'high',
    }),

    welcome: (user) => addNotification({
      type: 'welcome',
      title: 'Welcome to TomartBD! 👋',
      message: `Welcome ${user.name}! Get 15% off on your first order.`,
      priority: 'high',
    }),
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    addNotification,
    triggerSampleNotifications,
  };
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 'price_drop': return '📉';
    case 'order_shipped': return '🚚';
    case 'order_delivered': return '🎁';
    case 'cart_reminder': return '🛒';
    case 'flash_sale': return '⚡';
    case 'welcome': return '👋';
    case 'security': return '🔒';
    case 'promotion': return '🎁';
    default: return '🔔';
  }
};