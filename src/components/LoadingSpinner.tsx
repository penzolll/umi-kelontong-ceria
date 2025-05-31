
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const LoadingSpinner = ({ size = 'md', message }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className={`animate-spin rounded-full border-b-2 border-emerald-500 ${sizeClasses[size]}`}></div>
      {message && (
        <p className="text-sm text-gray-600">{message}</p>
      )}
    </div>
  );
};
