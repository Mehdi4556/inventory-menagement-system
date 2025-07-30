import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const ProductCard = ({ product, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${product._id}`);
        toast.success('Product deleted successfully');
        onDelete(product._id);
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800 truncate">{product.name}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          product.inStock 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
        </span>
      </div>
      
      <div className="mb-4">
        <div className="text-2xl font-bold text-blue-600 mb-2">
          ${product.price}
        </div>
        <div className="text-gray-600">
          Category: {product.categoryId?.name || 'No Category'}
        </div>
      </div>
      
      <div className="flex gap-2">
        <Link 
          to={`/products/${product._id}/edit`} 
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-center transition-colors"
        >
          Edit
        </Link>
        <button 
          onClick={handleDelete}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;