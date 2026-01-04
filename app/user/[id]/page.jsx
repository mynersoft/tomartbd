// app/users/[id]/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Shield,
  CreditCard,
  Package,
  Star,
  Edit,
  Trash2,
  MoreVertical,
  Download,
  Printer,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Globe,
  ShoppingBag,
  Heart,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  BarChart3,
  Award,
  Flag,
  Settings,
  Send,
  Tag,
  Wallet,
  Gift,
  Truck,
  RefreshCw,
  Filter,
  Search,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import UserHeader from '@/components/Users/UserHeader';
import UserStats from '@/components/Users/UserStats';
import UserActivity from '@/components/Users/UserActivity';
import UserOrders from '@/components/Users/UserOrders';
import UserPreferences from '@/components/Users/UserPreferences';
import UserActions from '@/components/Users/UserActions';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useUsers } from '../../../hooks/useUsers';

const UserDetailPage = () => {
  useUsers();

  const params = useParams();
  const router = useRouter();
  const userId = params.id;

  const { users } = useSelector((state) => state.user);

  const userData = users.filter((item) => item._id === userId);

  const [loading, setLoading] = useState(true);
  // const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState(null);

  console.log(user);
  // Mock user data - replace with API call
  const mockUser = {
    id: userId,
    personalInfo: {
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      phone: '+1 (555) 123-4567',
      avatar: null,
      joinDate: '2024-01-15',
      lastActive: '2024-12-15T10:30:00Z',
      status: 'active',
      tier: 'premium',
    },
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
    },
    stats: {
      totalOrders: 45,
      totalSpent: 8924.56,
      avgOrderValue: 198.32,
      ordersThisMonth: 8,
      lifetimeValue: 12456.89,
      refunds: 2,
      cancelledOrders: 1,
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      language: 'English',
      currency: 'USD',
      timezone: 'EST',
    },
    activity: {
      recentLogins: [
        {
          date: '2024-12-15T10:30:00Z',
          device: 'iPhone 13',
          location: 'New York, NY',
        },
        {
          date: '2024-12-14T15:45:00Z',
          device: 'MacBook Pro',
          location: 'New York, NY',
        },
        {
          date: '2024-12-13T09:20:00Z',
          device: 'iPad Pro',
          location: 'Brooklyn, NY',
        },
      ],
      recentSearches: ['wireless headphones', 'smart watch', 'gaming chair'],
      wishlistItems: 12,
      cartItems: 3,
    },
    loyalty: {
      points: 2450,
      tier: 'Gold',
      nextTier: 'Platinum',
      progress: 65,
      rewards: ['Free Shipping', 'Early Access', 'Birthday Gift'],
    },
  };

  useEffect(() => {
    // Simulate API call
    // const fetchUser = async () => {
    setLoading(true);
    try {
      // const response = await fetch(`/api/users/${userId}`);
      // const data = await response.json();

      // Simulate delay
      setTimeout(() => {
        setUser(mockUser);
        // setEditedUser(mockUser);
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('Failed to load user data');
      setLoading(false);
    }
    // };

    // fetchUser();
  }, []);


  const handleSave = async () => {
    try {
      // API call to update user
      // await fetch(`/api/users/${userId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editedUser),
      // });

      setUser(editedUser);
      setEditMode(false);
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // API call to delete user
        // await fetch(`/api/users/${userId}`, { method: 'DELETE' });

        toast.success('User deleted successfully');
        router.push('/users');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(user, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `user-${userId}-data.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast.success('User data exported');
  };

  const handleSendEmail = () => {
    toast.success('Email dialog opened');
    // Open email compose dialog
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'activity', label: 'Activity', icon: BarChart3 },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'loyalty', label: 'Loyalty', icon: Award },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton Header */}
          <div className="mb-8">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-64 animate-pulse"></div>
          </div>

          {/* Skeleton Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-full"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            User Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The user you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.push('/users')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-40 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/users')}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
              >
                <ArrowLeft
                  className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                />
              </button>

              <div>
                <h1
                  className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  {user.name}
                </h1>
                <p
                  className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  User ID: {userId} • {user.personalInfo.tier} Member
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className={`flex items-center gap-2 px-4 py-2 border ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} rounded-lg transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
              >
                <Download className="w-4 h-4" />
                Export
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Printer className="w-4 h-4" />
                Print
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* User Header */}
          <UserHeader
            user={user}
            theme={theme}
            editMode={editMode}
            editedUser={editedUser}
            onEditChange={setEditedUser}
          />

          {/* Tabs */}
          <div className="mb-8">
            <div
              className={`flex overflow-x-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-1`}
            >
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors flex-shrink-0 ${
                      activeTab === tab.id
                        ? `${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-primary-50 text-primary-600'}`
                        : `${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Cards */}
              <UserStats user={user} theme={theme} />

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Recent Orders */}
                  <UserOrders user={user} theme={theme} />

                  {/* Activity Timeline */}
                  <UserActivity user={user} theme={theme} />
                </div>
              )}

              {activeTab === 'orders' && (
                <div
                  className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3
                        className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                      >
                        Order History
                      </h3>
                      <p
                        className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        {user.stats.totalOrders} total orders
                      </p>
                    </div>
                    <button
                      className={`text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors`}
                    >
                      View All Orders →
                    </button>
                  </div>
                  {/* Order list component would go here */}
                </div>
              )}

              {activeTab === 'activity' && (
                <div
                  className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                >
                  <h3
                    className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                  >
                    User Activity Log
                  </h3>
                  {/* Activity log component would go here */}
                </div>
              )}

              {activeTab === 'preferences' && (
                <UserPreferences
                  user={user}
                  theme={theme}
                  editMode={editMode}
                  editedUser={editedUser}
                  onEditChange={setEditedUser}
                />
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <UserActions
                user={user}
                theme={theme}
                onSendEmail={handleSendEmail}
                onEdit={() => setEditMode(!editMode)}
                onDelete={handleDelete}
                onSave={handleSave}
                editMode={editMode}
              />

              {/* Loyalty Program */}
              <div
                className={`rounded-xl ${theme === 'dark' ? 'bg-gradient-to-br from-yellow-900/30 to-yellow-800/30' : 'bg-gradient-to-br from-yellow-50 to-amber-50'} p-6 shadow-sm border ${theme === 'dark' ? 'border-yellow-800/50' : 'border-yellow-200'}`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3
                      className={`text-lg font-semibold ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-900'}`}
                    >
                      Loyalty Program
                    </h3>
                    <p
                      className={`text-sm ${theme === 'dark' ? 'text-yellow-400/70' : 'text-yellow-700'}`}
                    >
                      {user.loyalty.tier} Member
                    </p>
                  </div>
                  <Award
                    className={`w-6 h-6 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span
                        className={`text-sm ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-900'}`}
                      >
                        Progress to {user.loyalty.nextTier}
                      </span>
                      <span
                        className={`text-sm font-bold ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-900'}`}
                      >
                        {user.loyalty.progress}%
                      </span>
                    </div>
                    <div
                      className={`h-2 w-full ${theme === 'dark' ? 'bg-yellow-900/50' : 'bg-yellow-200'} rounded-full overflow-hidden`}
                    >
                      <div
                        className={`h-full ${theme === 'dark' ? 'bg-yellow-500' : 'bg-yellow-500'} rounded-full`}
                        style={{ width: `${user.loyalty.progress}%` }}
                      >
                        <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-yellow-900/30' : 'bg-white/50'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-sm ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-900'}`}
                      >
                        Reward Points
                      </span>
                      <span
                        className={`text-xl font-bold ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-900'}`}
                      >
                        {user.loyalty.points.toLocaleString()}
                      </span>
                    </div>
                    <p
                      className={`text-xs ${theme === 'dark' ? 'text-yellow-400/70' : 'text-yellow-700'}`}
                    >
                      Redeem points for discounts and rewards
                    </p>
                  </div>

                  <div>
                    <h4
                      className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-900'}`}
                    >
                      Active Rewards
                    </h4>
                    <div className="space-y-2">
                      {user.loyalty.rewards.map((reward, index) => (
                        <div
                          key={index}
                          className={`flex items-center gap-2 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-700'}`}
                        >
                          <Gift className="w-4 h-4" />
                          <span className="text-sm">{reward}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Interactions */}
              <div
                className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <h3
                  className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  Recent Interactions
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'} flex items-center justify-center`}
                    >
                      <MessageSquare
                        className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                      >
                        Support Ticket #789
                      </p>
                      <p
                        className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        Yesterday, 2:30 PM
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      Open
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'} flex items-center justify-center`}
                    >
                      <Star
                        className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                      >
                        5-Star Review
                      </p>
                      <p
                        className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        Dec 12, 2024
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'} flex items-center justify-center`}
                    >
                      <ShoppingBag
                        className={`w-5 h-5 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                      >
                        Order Placed
                      </p>
                      <p
                        className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        Dec 10, 2024
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'}`}
                    >
                      Delivered
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div
                className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <h3
                  className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  Customer Notes
                </h3>

                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        VIP Customer
                      </span>
                      <span
                        className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}
                      >
                        Dec 1, 2024
                      </span>
                    </div>
                    <p
                      className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      High-value customer. Prefers premium products and fast
                      shipping.
                    </p>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                      >
                        Technical Support
                      </span>
                      <span
                        className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}
                      >
                        Nov 28, 2024
                      </span>
                    </div>
                    <p
                      className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      Assisted with product setup. Follow up in 2 weeks.
                    </p>
                  </div>
                </div>

                <button
                  className={`w-full mt-4 px-4 py-2 border ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} rounded-lg transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDetailPage;
