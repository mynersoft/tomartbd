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

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Channels Header */}
          <div className="border-b border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Notification Channels</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Select how you want to receive notifications
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 mt-6">
                {channels.map(channel => (
                  <div key={channel.key} className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${channel.color}`}>
                      {channel.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{channel.name}</p>
                      <p className="text-sm text-gray-600">
                        {channel.key === 'push' && 'In-app notifications'}
                        {channel.key === 'email' && 'Email notifications'}
                        {channel.key === 'sms' && 'Text messages'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="divide-y divide-gray-200">
            {notificationCategories.map((category, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{category.desc}</p>
                      
                      <div className="flex gap-6 mt-4">
                        {channels.map(channel => {
                          const settingKey = category.settings.find(key => 
                            key.includes(channel.key)
                          );
                          if (!settingKey) return null;
                          
                          return (
                            <div key={channel.key} className="flex items-center gap-2">
                              <div className={`p-1.5 rounded ${channel.color}`}>
                                {channel.icon}
                              </div>
                              <span className="text-sm text-gray-700">{channel.name}</span>
                              <Switch
                                checked={settings[settingKey]}
                                onChange={() => handleToggle(settingKey)}
                                className={`${
                                  settings[settingKey] ? 'bg-blue-600' : 'bg-gray-200'
                                } relative inline-flex h-6 w-11 items-center rounded-full transition`}
                              >
                                <span
                                  className={`${
                                    settings[settingKey] ? 'translate-x-6' : 'translate-x-1'
                                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                />
                              </Switch>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end gap-4">
              <button className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
                Reset to Default
              </button>
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiet Hours
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5">
                <option>10:00 PM - 8:00 AM (Default)</option>
                <option>11:00 PM - 7:00 AM</option>
                <option>No quiet hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Notifications per Day
              </label>
              <select className="w-full border border-gray-300 rounded-lg px-4 py-2.5">
                <option>5 notifications</option>
                <option>10 notifications</option>
                <option>15 notifications</option>
                <option>No limit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sample Notifications */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview Notifications</h3>
          <div className="space-y-4">
            {[
              { type: 'order', title: 'Order Confirmed', desc: 'Your order has been confirmed' },
              { type: 'price', title: 'Price Drop Alert', desc: 'Price decreased on your watched item' },
              { type: 'promo', title: 'Flash Sale Live', desc: 'Hurry! Limited time offer' },
            ].map((notif, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    notif.type === 'order' ? 'bg-blue-100 text-blue-600' :
                    notif.type === 'price' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {notif.type === 'order' ? '📦' : notif.type === 'price' ? '📉' : '⚡'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{notif.title}</p>
                    <p className="text-sm text-gray-600">{notif.desc}</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Send Test
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;