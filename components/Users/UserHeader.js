// components/Users/UserHeader.js
'use client';

import React from 'react';
import { Mail, Phone, MapPin, Calendar, Edit, Check, X } from 'lucide-react';

const UserHeader = ({ user, theme, editMode, editedUser, onEditChange }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTierColor = (tier) => {
    switch (tier.toLowerCase()) {
      case 'premium':
        return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'gold':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
      case 'silver':
        return 'bg-gradient-to-r from-gray-400 to-gray-500';
      default:
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
    }
  };

  const handleInputChange = (field, value) => {
    onEditChange({
      ...editedUser,
      personalInfo: {
        ...editedUser.personalInfo,
        [field]: value,
      },
    });
  };

  return (
    <div
      className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-6 mb-8`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Avatar and Status */}
        <div>
          <div className="flex flex-col items-center lg:items-start">
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                {user.name}
              </div>

              {/* Status Indicator */}
              <div className="absolute -bottom-2 -right-2">
                <div
                  className={`w-8 h-8 rounded-full ${getTierColor(user.personalInfo.tier)} flex items-center justify-center`}
                >
                  <span className="text-xs font-bold text-white">
                    {user.personalInfo.tier.charAt(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.personalInfo.status)}`}
              >
                {user.personalInfo.status.charAt(0).toUpperCase() +
                  user.personalInfo.status.slice(1)}
              </span>
            </div>

            {/* Tier Badge */}
            <div
              className={`px-4 py-2 rounded-lg ${getTierColor(user.personalInfo.tier)} text-white font-medium`}
            >
              {user.personalInfo.tier} Member
            </div>
          </div>
        </div>

        {/* Middle - Personal Info */}
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between mb-6">
            <div>
              {editMode ? (
                <input
                  type="text"
                  value={editedUser.personalInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`text-2xl font-bold ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} border-b-2 border-primary-500 outline-none w-full`}
                />
              ) : (
                <h2
                  className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  {user.personalInfo.name}
                </h2>
              )}
              <p
                className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}
              >
                User ID: {user.id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3
                className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3`}
              >
                Contact Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail
                    className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
                  />
                  {editMode ? (
                    <input
                      type="email"
                      value={editedUser.personalInfo.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                      className={`flex-1 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} border-b border-gray-300 dark:border-gray-600 outline-none`}
                    />
                  ) : (
                    <span
                      className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                    >
                      {user.personalInfo.email}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Phone
                    className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
                  />
                  {editMode ? (
                    <input
                      type="tel"
                      value={editedUser.personalInfo.phone}
                      onChange={(e) =>
                        handleInputChange('phone', e.target.value)
                      }
                      className={`flex-1 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} border-b border-gray-300 dark:border-gray-600 outline-none`}
                    />
                  ) : (
                    <span
                      className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                    >
                      {user.personalInfo.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h3
                className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3`}
              >
                Account Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar
                    className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
                  />
                  <div>
                    <p
                      className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      Joined
                    </p>
                    <p
                      className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                    >
                      {formatDate(user.personalInfo.joinDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar
                    className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
                  />
                  <div>
                    <p
                      className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                    >
                      Last Active
                    </p>
                    <p
                      className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                    >
                      {formatDate(user.personalInfo.lastActive)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="mt-6">
            <h3
              className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3`}
            >
              Address
            </h3>
            <div className="flex items-start gap-3">
              <MapPin
                className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-1`}
              />
              <div>
                <p
                  className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  {user.address.street}
                </p>
                <p
                  className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  {user.address.city}, {user.address.state}{' '}
                  {user.address.zipCode}
                </p>
                <p
                  className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {user.address.country}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
