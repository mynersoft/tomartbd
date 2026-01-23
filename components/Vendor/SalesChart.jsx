import React from 'react';
import { useSalesData } from '../../hooks/useVendorQuery';
import { TrendingUp, TrendingDown } from 'lucide-react';

const SalesChart = ({ period = 'monthly', chartType = 'line' }) => {
  const { data: salesData, isLoading } = useSalesData(period);

  if (isLoading) {
    return (
      <div className="h-64 animate-pulse">
        <div className="h-full bg-gray-200 rounded"></div>
      </div>
    );
  }

  const maxValue = Math.max(...(salesData?.dailyData?.map(d => d.revenue) || [0]));
  
  return (
    <div>
      <div className="h-64 flex items-end gap-1">
        {salesData?.dailyData?.map((day, index) => {
          const height = (day.revenue / maxValue) * 100;
          const isToday = day.date === new Date().toISOString().split('T')[0];
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className={`
                  w-full rounded-t transition-all duration-300
                  ${isToday 
                    ? 'bg-gradient-to-t from-blue-600 to-cyan-400' 
                    : 'bg-gradient-to-t from-blue-400 to-blue-300'
                  }
                  ${chartType === 'line' ? 'h-px' : 'min-h-[2px]'}
                  hover:opacity-80 cursor-pointer
                `}
                style={{ 
                  height: chartType === 'line' ? '2px' : `${height}%`,
                  background: chartType === 'line' 
                    ? `linear-gradient(to top, ${isToday ? '#2563eb' : '#60a5fa'} ${height}%, transparent ${height}%)`
                    : undefined
                }}
                title={`${day.date}: ৳${day.revenue.toLocaleString()}`}
              >
                {chartType === 'line' && (
                  <div 
                    className="absolute w-2 h-2 bg-blue-600 rounded-full -top-1"
                    style={{ left: '50%', transform: 'translateX(-50%)' }}
                  />
                )}
              </div>
              <span className="text-xs text-gray-500 mt-2">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            ৳{(salesData?.totalRevenue || 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {salesData?.totalOrders || 0}
          </p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Avg. Order Value</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            ৳{(salesData?.avgOrderValue || 0).toLocaleString()}
          </p>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">Growth</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            {salesData?.growthRate >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <p className={`text-xl font-bold ${
              salesData?.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {salesData?.growthRate >= 0 ? '+' : ''}{salesData?.growthRate || 0}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;