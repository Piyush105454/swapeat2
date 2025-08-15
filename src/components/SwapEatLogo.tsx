import React from 'react';

interface SwapEatLogoProps {
  size?: number;
  className?: string;
}

export const SwapEatLogo: React.FC<SwapEatLogoProps> = ({ size = 64, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer yellow circle */}
        <circle cx="100" cy="100" r="95" fill="#FFD700" stroke="#000" strokeWidth="2"/>
        
        {/* Inner circle with segments */}
        <g>
          {/* Purple segment (top) */}
          <path
            d="M 100 20 A 80 80 0 0 1 180 100 L 100 100 Z"
            fill="#8B5CF6"
          />
          
          {/* Red/Pink segment (bottom right) */}
          <path
            d="M 100 100 L 180 100 A 80 80 0 0 1 56.57 156.57 Z"
            fill="#F87171"
          />
          
          {/* Yellow segment (bottom left) */}
          <path
            d="M 100 100 L 56.57 156.57 A 80 80 0 0 1 100 20 Z"
            fill="#FFD700"
          />
        </g>
        
        {/* Center point */}
        <circle cx="100" cy="100" r="3" fill="#000"/>
      </svg>
    </div>
  );
};

export const SwapEatLogoWithText: React.FC<SwapEatLogoProps & { showText?: boolean }> = ({ 
  size = 64, 
  className = "",
  showText = true 
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <SwapEatLogo size={size} />
      {showText && (
        <h1 className="text-2xl font-bold text-uigray-80 mt-3 [font-family:'Poppins',Helvetica]">
          SwapEat
        </h1>
      )}
    </div>
  );
};