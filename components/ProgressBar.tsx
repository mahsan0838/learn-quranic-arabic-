import React from 'react';

interface ProgressBarProps {
  percentage: number;
  colorClass?: string;
  heightClass?: string;
  showLabel?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  percentage, 
  colorClass = 'bg-islamic-primary', 
  heightClass = 'h-3',
  showLabel = false
}) => {
  // Ensure percentage stays between 0 and 100
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{Math.round(clampedPercentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 dark:bg-slate-700 rounded-full ${heightClass}`}>
        <div
          className={`${colorClass} ${heightClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;