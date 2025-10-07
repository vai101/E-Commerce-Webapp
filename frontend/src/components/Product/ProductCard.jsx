import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  // A simple function to add to cart. You can expand this later.
  const addToCartHandler = () => {
    // This should eventually use the same logic as your ProductScreen
    // For now, it can just be a placeholder or navigate to the product page
    console.log(`Adding ${product.name} to cart`);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
      <Link to={`/product/${product._id}`}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover" 
        />
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-sm text-gray-400 mb-1">{product.category || 'Category'}</p>
        <h3 className="text-lg font-semibold text-white mb-2 flex-grow">
          <Link to={`/product/${product._id}`} className="hover:text-blue-400 transition-colors">
            {product.name}
          </Link>
        </h3>
        
        <p className="text-2xl font-bold text-blue-400 mb-4">
          ₹{product.price.toFixed(2)}
        </p>

        <button 
          onClick={addToCartHandler} 
          className="w-full mt-auto py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-800"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;