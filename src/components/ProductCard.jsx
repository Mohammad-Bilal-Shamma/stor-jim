import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

// CSS for mobile responsiveness
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { _id, title, price, image, category, author, quantity, description } =
    product;
  const isAvailable = quantity > 0;

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -10,
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }}
    >
      <Link to={`/product/${_id}`} className="block relative w-full pt-[100%]">
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder.jpg';
            }}
          />
        </motion.div>
      </Link>
      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/product/${_id}`} className="block">
          <motion.h3
            className="font-tajawal font-semibold text-xl mb-2 line-clamp-2 hover:text-primary transition-colors product-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h3>
        </Link>
        <motion.p
          className="text-gray-600 mb-2 text-sm product-category"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {category.name}
          {author && ` - ${author.name}`}
        </motion.p>
        {description && (
          <motion.p
            className="text-gray-500 text-sm mb-2 line-clamp-2 flex-grow product-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {description}
          </motion.p>
        )}
        <motion.div
          className="flex justify-between items-center mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-primary font-bold text-lg product-price">{price} $</span>
          <span
            className={`text-sm product-availability ${
              isAvailable ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isAvailable ? `الكمية المتوفرة: ${quantity}` : 'غير متوفر'}
          </span>
        </motion.div>
        <div className="mt-auto">
          {isAvailable ? (
            <motion.button
              onClick={() =>
                addToCart({
                  id: _id,
                  image,
                  title,
                  author: author?.name || category.name,
                  price,
                })
              }
              className="bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-lg hover:opacity-90 w-full flex items-center justify-center gap-2 product-button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <i className="fas fa-shopping-cart"></i>
              <span>أضف إلى السلة</span>
            </motion.button>
          ) : (
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full"
            >
              <Link
                to={`/inquiry?title=${encodeURIComponent(
                  title
                )}&author=${encodeURIComponent(author?.name || category.name)}`}
                className="bg-gradient-to-r from-gray-500 to-gray-700 text-white py-2 px-4 rounded-lg hover:opacity-90 w-full flex items-center justify-center gap-2 product-button"
              >
                <i className="fas fa-question-circle"></i>
                <span>استعلام عن المنتج</span>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
