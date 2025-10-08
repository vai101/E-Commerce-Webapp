import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-4 animate-fadeIn">
      <div className="flex flex-col h-full">
        {/* Image Placeholder */}
        <div className="h-48 rounded-md mb-4 bg-shimmer bg-[length:400%_100%] animate-shimmer"></div>
        <div className="flex-grow space-y-3">
          {/* Category Placeholder */}
          <div className="w-1/4 h-3 rounded bg-shimmer bg-[length:400%_100%] animate-shimmer"></div>
          {/* Title Placeholder */}
          <div className="w-3/4 h-5 rounded bg-shimmer bg-[length:400%_100%] animate-shimmer"></div>
          {/* Price Placeholder */}
          <div className="w-1/2 h-4 rounded bg-shimmer bg-[length:400%_100%] animate-shimmer"></div>
        </div>
        {/* Button Placeholder */}
        <div className="w-full h-10 rounded-md mt-4 bg-shimmer bg-[length:400%_100%] animate-shimmer"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;