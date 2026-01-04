// components/Users/UserActions.js
'use client';

import React from 'react';
import {
  Send,
  Edit,
  Trash2,
  Check,
  X,
  Mail,
  Bell,
  Tag,
  Wallet,
  Gift,
} from 'lucide-react';

const UserActions = ({
  user,
  theme,
  onSendEmail,
  onEdit,
  onDelete,
  onSave,
  editMode,
}) => {
  const quickActions = [
    {
      label: 'Send Email',
      icon: Send,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      action: onSendEmail,
    },
    {
      label: 'Send Notification',
      icon: Bell,
      color:
        'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      action: () => console.log('Send notification'),
    },
    {
      label: 'Add Tag',
      icon: Tag,
      color:
        'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
      action: () => console.log('Add tag'),
    },
    {
      label: 'Add Credit',
      icon: Wallet,
      color:
        'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
      action: () => console.log('Add credit'),
    },
    {
      label: 'Send Gift',
      icon: Gift,
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
      action: () => console.log('Send gift'),
    },
  ];

  return (
    <div
      className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3
          className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
        >
          Quick Actions
        </h3>
        <div className="flex items-center gap-2">
          {editMode ? (
            <>
              <button
                onClick={onSave}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                title="Save Changes"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={onEdit}
                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              title="Edit User"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className={`flex flex-col items-center justify-center p-4 rounded-lg ${action.color} hover:opacity-90 transition-opacity`}
            >
              <Icon className="w-5 h-5 mb-2" />
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Edit/Delete Actions */}
      <div className="space-y-3">
        {editMode ? (
          <div className="space-y-2">
            <button
              onClick={onSave}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
            <button
              onClick={onEdit}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <X className="w-4 h-4" />
              Cancel Editing
            </button>
          </div>
        ) : (
          <button
            onClick={onEdit}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            <Edit className="w-4 h-4" />
            Edit User Profile
          </button>
        )}

        <button
          onClick={onDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <Trash2 className="w-4 h-4" />
          Delete User Account
        </button>
      </div>

      {/* Status Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4
          className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
        >
          Account Status
        </h4>

        <div className="space-y-2">
          <button
            className={`w-full text-left px-4 py-3 rounded-lg ${
              user.personalInfo.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => console.log('Set active')}
          >
            <div className="flex items-center justify-between">
              <span>Set as Active</span>
              {user.personalInfo.status === 'active' && (
                <Check className="w-4 h-4" />
              )}
            </div>
          </button>

          <button
            className={`w-full text-left px-4 py-3 rounded-lg ${
              user.personalInfo.status === 'inactive'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => console.log('Set inactive')}
          >
            <div className="flex items-center justify-between">
              <span>Set as Inactive</span>
              {user.personalInfo.status === 'inactive' && (
                <Check className="w-4 h-4" />
              )}
            </div>
          </button>

          <button
            className={`w-full text-left px-4 py-3 rounded-lg ${
              user.personalInfo.status === 'suspended'
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => console.log('Suspend')}
          >
            <div className="flex items-center justify-between">
              <span>Suspend Account</span>
              {user.personalInfo.status === 'suspended' && (
                <Check className="w-4 h-4" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Tier Upgrade */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4
          className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
        >
          Tier Management
        </h4>

        <div className="space-y-2">
          {['Standard', 'Silver', 'Gold', 'Platinum', 'Premium'].map((tier) => (
            <button
              key={tier}
              className={`w-full text-left px-4 py-3 rounded-lg ${
                user.personalInfo.tier === tier
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => console.log(`Upgrade to ${tier}`)}
            >
              <div className="flex items-center justify-between">
                <span>{tier}</span>
                {user.personalInfo.tier === tier && (
                  <Check className="w-4 h-4" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserActions;
