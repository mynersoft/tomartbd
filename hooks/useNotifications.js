"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

/* =========================
   LocalStorage helpers
========================= */
const STORAGE_KEY = "tomartbd_notifications";

const getStoredNotifications = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const setStoredNotifications = (notifications) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
};

/* =========================
   Icons
========================= */
const getNotificationIcon = (type) => {
  const icons = {
    order_placed: "📦",
    order_confirmed: "✅",
    order_processing: "🔄",
    order_shipped: "🚚",
    order_delivered: "🎁",
    order_cancelled: "❌",
    price_drop: "📉",
    cart_reminder: "🛒",
    promotion: "🎁",
    welcome: "👋",
    security_alert: "🔒",
    back_in_stock: "📦",
    default: "🔔",
  };
  return icons[type] || icons.default;
};

/* =========================
   Constants
========================= */
export const PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
};

export const NOTIFICATION_TYPES = {
  ORDER_PLACED: "order_placed",
  ORDER_SHIPPED: "order_shipped",
  ORDER_DELIVERED: "order_delivered",
  PRICE_DROP: "price_drop",
  CART_REMINDER: "cart_reminder",
  PROMOTION: "promotion",
  WELCOME: "welcome",
  SECURITY: "security_alert",
  BACK_IN_STOCK: "back_in_stock",
};

/* =========================
   useNotification Hook
========================= */
export const useNotification = (userId = null) => {
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  /* =========================
     Fetch notifications
  ========================= */
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notification", userId],
    queryFn: async () => {
      if (!userId) {
        return getStoredNotifications();
      }
      const res = await axios.get("/api/notification");
      return res.data.notifications || [];
    },
    staleTime: 10_000,
    refetchInterval: 30_000,
  });

  /* =========================
     Mark as read
  ========================= */
  const markAsRead = useMutation({
    mutationFn: async (id) => {
      if (!userId) {
        const updated = getStoredNotifications().map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
        setStoredNotifications(updated);
        return;
      }
      await axios.patch(`/api/notification/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notification", userId]);
    },
  });

  /* =========================
     Mark all as read
  ========================= */
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!userId) {
        const updated = getStoredNotifications().map((n) => ({
          ...n,
          read: true,
        }));
        setStoredNotifications(updated);
        return;
      }
      await axios.post("/api/notification/mark-all-read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notification", userId]);
      toast.success("All notifications marked as read");
    },
  });

  /* =========================
     Delete single
  ========================= */
  const deleteNotification = useMutation({
    mutationFn: async (id) => {
      if (!userId) {
        const updated = getStoredNotifications().filter((n) => n.id !== id);
        setStoredNotifications(updated);
        return;
      }
      await axios.delete(`/api/notification/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notification", userId]);
    },
  });

  /* =========================
     Clear all
  ========================= */
  const clearAll = useMutation({
    mutationFn: async () => {
      if (!userId) {
        setStoredNotifications([]);
        return;
      }
      await axios.delete("/api/notification");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["notification", userId]);
      toast.success("All notifications cleared");
    },
  });

  /* =========================
     Create notification
  ========================= */
  const createNotification = useCallback(
    async (data) => {
      const notification = {
        id: `notif_${Date.now()}`,
        userId,
        type: data.type,
        title: data.title,
        message: data.message,
        priority: data.priority || PRIORITY.MEDIUM,
        read: false,
        createdAt: new Date().toISOString(),
        icon: getNotificationIcon(data.type),
        action: data.action || null,
      };

      queryClient.setQueryData(["notification", userId], (old = []) => [
        notification,
        ...old,
      ]);

      if (!userId) {
        setStoredNotifications([notification, ...getStoredNotifications()]);
      } else {
        await axios.post("/api/notification", notification);
      }

      return notification;
    },
    [userId, queryClient]
  );

  /* =========================
     Helpers
  ========================= */
  const getUnreadNotifications = useCallback(
    () => notifications.filter((n) => !n.read),
    [notifications]
  );

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /* =========================
     Unread count
  ========================= */
  useEffect(() => {
    setUnreadCount(getUnreadNotifications().length);
  }, [notifications, getUnreadNotifications]);

  /* =========================
     Return API
  ========================= */
  return {
    notifications,
    unreadCount,
    isLoading,
    error,

    createNotification,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate,
    deleteNotification: deleteNotification.mutate,
    clearAll: clearAll.mutate,
    refetchNotifications: refetch,

    getUnreadNotifications,
    formatTime,

    PRIORITY,
    NOTIFICATION_TYPES,
  };
};

export default useNotification;