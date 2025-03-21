import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  );
};

export default LoadingSpinner; 