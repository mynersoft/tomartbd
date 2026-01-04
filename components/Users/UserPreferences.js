// components/Users/UserPreferences.js
'use client';

import React from 'react';
import {
  Bell,
  Mail,
  Globe,
  CreditCard,
  Moon,
  Lock,
  Check,
  X,
} from 'lucide-react';

const UserPreferences = ({
  user,
  theme,
  editMode,
  editedUser,
  onEditChange,
}) => {
  const preferences = [
    {
      key: 'emailNotifications',
      label: 'Email Notifications',
      description: 'Receive order updates via email',
      icon: Mail,
      type: 'toggle',
    },
    {
      key: 'smsNotifications',
      label: 'SMS Notifications',
      description: 'Receive shipping alerts via SMS',
      icon: Bell,
      type: 'toggle',
    },
    {
      key: 'marketingEmails',
      label: 'Marketing Emails',
      description: 'Receive promotional offers',
      icon: Mail,
      type: 'toggle',
    },
    {
      key: 'language',
      label: 'Preferred Language',
      description: 'Interface and communication language',
      icon: Globe,
      type: 'select',
      options: ['English', 'Spanish', 'French', 'German', 'Chinese'],
    },
    {
      key: 'currency',
      label: 'Preferred Currency',
      description: 'Display prices in this currency',
      icon: CreditCard,
      type: 'select',
      options: ['USD', 'EUR', 'GBP', 'JPY', 'CAD'],
    },
    {
      key: 'timezone',
      label: 'Timezone',
      description: 'Local timezone for notifications',
      icon: Moon,
      type: 'select',
      options: ['EST', 'PST', 'CST', 'GMT', 'CET'],
    },
  ];

  const handlePreferenceChange = (key, value) => {
    onEditChange({
      ...editedUser,
      preferences: {
        ...editedUser.preferences,
        [key]: value,
      },
    });
  };

  return (
    <div
      className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            User Preferences
          </h3>
          <p
            className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Customize user settings and notifications
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {preferences.map((pref, index) => {
          const Icon = pref.icon;
          const value = editMode
            ? editedUser.preferences[pref.key]
            : user.preferences[pref.key];

          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}
                >
                  <Icon
                    className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                  />
                </div>

                <div>
                  <p
                    className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                  >
                    {pref.label}
                  </p>
                  <p
                    className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}
                  >
                    {pref.description}
                  </p>
                </div>
              </div>

              {pref.type === 'toggle' ? (
                <button
                  onClick={() => {
                    if (editMode) {
                      handlePreferenceChange(pref.key, !value);
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    value ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  } transition-colors ${!editMode ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  disabled={!editMode}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              ) : (
                <div className="min-w-32">
                  {editMode ? (
                    <select
                      value={value}
                      onChange={(e) =>
                        handlePreferenceChange(pref.key, e.target.value)
                      }
                      className={`w-full px-3 py-2 rounded-lg border ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    >
                      {pref.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`px-3 py-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
                    >
                      {value}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Security Settings */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4
          className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          Security Settings
        </h4>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}
              >
                <Lock
                  className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                />
              </div>

              <div>
                <p
                  className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  Two-Factor Authentication
                </p>
                <p
                  className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}
                >
                  Add an extra layer of security
                </p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.personalInfo.tier === 'premium'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
              }`}
            >
              {user.personalInfo.tier === 'premium' ? 'Enabled' : 'Disabled'}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}
              >
                <Globe
                  className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                />
              </div>

              <div>
                <p
                  className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  Login Activity
                </p>
                <p
                  className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}
                >
                  View recent login history
                </p>
              </div>
            </div>

            <button
              className={`text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors`}
            >
              View Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;
