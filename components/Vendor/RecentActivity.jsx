'use client';
import React from 'react';
import {
  CheckCircle,
  ShoppingBag,
  Package,
  DollarSign,
  UserPlus,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const RecentActivity = ({ limit = 10 }) => {
  const { data: activities, isLoading } = useRecentActivities();

  const getActivityIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="h-4 w-4" />;
      case 'product':
        return <Package className="h-4 w-4" />;
      case 'sale':
        return <DollarSign className="h-4 w-4" />;
      case 'customer':
        return <UserPlus className="h-4 w-4" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-600';
      case 'product':
        return 'bg-green-100 text-green-600';
      case 'sale':
        return 'bg-purple-100 text-purple-600';
      case 'customer':
        return 'bg-orange-100 text-orange-600';
      case 'alert':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities?.slice(0, limit).map((activity, index) => (
        <div key={index} className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900">{activity.message}</p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {formatDate(activity.timestamp)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
