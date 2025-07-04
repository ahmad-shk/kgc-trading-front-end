import React from "react";

interface DottedLoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'blue' | 'gray'| 'white';
  overlay?: boolean;
}

const sizeMap = {
 xs: 'w-1 h-1',
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

const colorMap = {
  blue: 'bg-blue-500',
  gray: 'bg-gray-500',
  white: 'bg-white',
};

const DottedLoader: React.FC<DottedLoaderProps> = ({
  size = 'md',
  color = 'blue',
  overlay = false,
}) => {
  const dotSize = sizeMap[size];
  const dotColor = colorMap[color];

  const dots = (
    <div className="flex space-x-2">
      <div className={`rounded-full ${dotSize} ${dotColor} animate-bounce [animation-delay:-0.3s]`}></div>
      <div className={`rounded-full ${dotSize} ${dotColor} animate-bounce [animation-delay:-0.15s]`}></div>
      <div className={`rounded-full ${dotSize} ${dotColor} animate-bounce`}></div>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
        {dots}
      </div>
    );
  }

  return <div className="flex justify-center items-center">{dots}</div>;
};

export default DottedLoader;
