"use client"

import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  iconOnly = false,
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  href,
  target,
  rel,
  ariaLabel,
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-md';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500 bg-transparent',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500 bg-transparent',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500',
  };
  
  // Size classes
  const sizeClasses = {
    sm: iconOnly ? 'p-1.5' : 'px-3 py-1.5 text-sm',
    md: iconOnly ? 'p-2.5' : 'px-4 py-2.5',
    lg: iconOnly ? 'p-3.5' : 'px-6 py-3.5 text-lg',
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Combined classes
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`;
  
  // Render content
  const renderContent = () => {
    if (loading) {
      return (
        <>
          <FaSpinner className="animate-spin" />
          {children && <span className="ml-2">{children}</span>}
        </>
      );
    }
    
    return (
      <>
        {leftIcon && <span className={children ? 'mr-2' : ''}>{leftIcon}</span>}
        {children && !iconOnly && children}
        {rightIcon && <span className={children ? 'ml-2' : ''}>{rightIcon}</span>}
      </>
    );
  };
  
  // If href is provided and not disabled, render as anchor
  if (href && !disabled) {
    return (
      <a
        href={href}
        className={combinedClasses}
        target={target}
        rel={rel}
        aria-label={ariaLabel || (iconOnly ? children?.toString() : undefined)}
      >
        {renderContent()}
      </a>
    );
  }
  
  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel || (iconOnly ? children?.toString() : undefined)}
      aria-busy={loading}
    >
      {renderContent()}
    </button>
  );
};

export default Button;