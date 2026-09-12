import React from 'react';

const LoadingSpinner = ({ label = 'Loading...', size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-2',
    lg: 'w-10 h-10 border-3',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-6 text-[#6B6966] font-sans">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-[#E7E5E4] border-t-[#B08D57] rounded-full animate-spin`}
        role="status"
        aria-label={label}
      />
      {label && <p className="text-xs font-medium text-[#6B6966]">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;

