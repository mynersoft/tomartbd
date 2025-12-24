// app/notifications/page.js
"use client";
import { useState } from 'react';
import { Bell, Mail, Phone, Shield, ShoppingBag, Package, Tag } from 'lucide-react';
import { Switch } from '@headlessui/react';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    // Push Notifications
    pushOrders: true,
    pushShipping: true,
    pushPromotions: false,
    pushPriceDrop: true,
    pushCartReminder: true,
    
    // Email Notifications
    emailOrders: true,
    emailShipping: true,
    emailPromotions: true,
    emailNewsletter: true,
    emailSecurity: true,
    
    // SMS Notifications
    smsOrders: false,
    smsShipping: true,
    smsPromotions: false,
  });

  const notificationCategories = [
    {
      title: 'Order Updates',
      icon: <ShoppingBag className="w-5 h-5" />,
      desc: 'Order confirmation, processing, and delivery updates',
      settings: ['pushOrders', 'emailOrders', 'smsOrders']
    },
    {
      title: 'Shipping Updates',
      icon: <Package className="w-5 h-5" />,
      desc: 'Shipping status and tracking information',
      settings: ['pushShipping', 'emailShipping', 'smsShipping']
    },
    {
      title: 'Promotions & Offers',
      icon: <Tag className="w-5 h-5" />,
      desc: 'Discounts, flash sales, and special offers',
      settings: ['pushPromotions', 'emailPromotions', 'smsPromotions']
    },
    {
      title: 'Price Alerts',
      icon: '📉',
      desc: 'Price drop alerts on watched products',
      settings: ['pushPriceDrop']
    },
    {
      title: 'Cart Reminders',
      icon: '🛒',
      desc: 'Reminders about items in your cart',
      settings: ['pushCartReminder']
    },
    {
      title: 'Security Alerts',
      icon: <Shield className="w-5 h-5" />,
      desc: 'Login alerts and security notifications',
      settings: ['emailSecurity']
    },
  ];

  const channels = [
    { key: 'push', icon: <Bell className="w-5 h-5" />, name: 'Push', color: 'text-purple-600 bg-purple-50' },
    { key: 'email', icon: <Mail className="w-5 h-5" />, name: 'Email', color: 'text-blue-600 bg-blue-50' },
    { key: 'sms', icon: <Phone className="w-5 h-5" />, name: 'SMS', color: 'text-green-600 bg-green-50' },
  ];

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notification Settings</h1>
          <p className="text-gray-600 mt-2">
            Choose what notifications you want to receive and how
          </p>
        </div>

        <div