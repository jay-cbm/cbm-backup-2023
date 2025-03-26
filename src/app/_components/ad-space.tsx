'use client';

import React, { useEffect, useState } from 'react';

interface AdSpaceProps {
  position?: 'horizontal' | 'vertical' | 'square';
  className?: string;
}

export default function AdSpace({ 
  position = 'horizontal',
  className = '',
}: AdSpaceProps) {
  const [adId, setAdId] = useState<string>('');
  
  // Generate a unique ID for each ad instance
  useEffect(() => {
    setAdId(`ad-${Math.random().toString(36).substring(2, 10)}`);
  }, []);

  // Determine the appropriate size based on position
  const getAdContainerClasses = () => {
    switch (position) {
      case 'vertical':
        return 'h-[600px] w-[160px] mx-auto';
      case 'square':
        return 'h-[300px] w-[300px] mx-auto';
      case 'horizontal':
      default:
        return 'h-[90px] w-full mx-auto'; // Removed max-width to make it full width
    }
  };

  return (
    <div className={`ad-container my-8 ${className}`}>
      <div 
        id={adId}
        className={`bg-gray-100 border border-gray-300 flex items-center justify-center ${getAdContainerClasses()}`}
        data-ad-position={position}
      >
        {/* Placeholder for actual ad - would be replaced by real ad scripts */}
        <div className="text-gray-400 text-sm">
          <span className="block">Ad Space</span>
          <span className="text-xs block mt-1">Your cryptocurrency ad could be here</span>
        </div>
      </div>
    </div>
  );
}
