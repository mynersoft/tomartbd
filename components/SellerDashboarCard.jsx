
import React from 'react';

const SellerDashboarCard = () => {
  const buttons = [
    { label: 'Add Products', icon: '➕' },
    { label: 'Products', icon: '📦' },
    { label: 'Orders', icon: '📋' },
    { label: 'Return Order', icon: '↩️' },
    { label: 'Manage Reviews', icon: '⭐' },
    { label: 'My Income', icon: '💰' },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Basic Function</h1>
        
        
        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          {buttons.map((button, index) => (
            <button
              key={index}
              className=" p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border hover:border-blue-300"
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <span className="text-2xl">{button.icon}</span>
                <span className="text-sm font-medium text-gray-800">{button.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboarCard;