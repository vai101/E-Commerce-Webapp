// src/components/Product/ProductCardSkeleton.jsx
import React from 'react';

const ProductCardSkeleton = () => {
  return (
    <div className="border border-gray-700 bg-gray-800 rounded-lg p-4">
      <div className="animate-pulse flex flex-col h-full">
        {/* Image Placeholder */}
        <div className="bg-gray-700 h-48 rounded-md mb-4"></div>
        <div className="flex-grow space-y-3">
          {/* Category Placeholder */}
          <div className="w-1/4 h-4 bg-gray-700 rounded"></div>
          {/* Title Placeholder */}
          <div className="w-3/4 h-6 bg-gray-700 rounded"></div>
          {/* Price Placeholder */}
          <div className="w-1/2 h-5 bg-gray-700 rounded"></div>
        </div>
        {/* Button Placeholder */}
        <div className="w-full h-10 bg-gray-700 rounded-md mt-4"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;