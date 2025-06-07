import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    item: null,
  });

  const addToCart = (item) => {
    try {
      if (!item || !item.id) {
        throw new Error('بيانات المنتج غير صحيحة');
      }

      setCartItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.id === item.id);
        if (existingItem) {
          setNotification({
            show: true,
            message: `تمت زيادة كمية ${item.title} في السلة`,
            item: item,
          });
          return prevItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        setNotification({
          show: true,
          message: `تمت إضافة ${item.title} إلى السلة`,
          item: item,
        });
        return [...prevItems, { ...item, quantity: 1 }];
      });
    } catch (error) {
      console.error('خطأ في إضافة المنتج إلى السلة:', error);
      setNotification({
        show: true,
        message: 'حدث خطأ أثناء إضافة المنتج إلى السلة',
        item: null,
      });
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Hide notification after 3 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const hideNotification = () => {
    setNotification({ ...notification, show: false });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        notification,
        hideNotification,
      }}
    >
      {children}
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-5 right-5 bg-primary text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between min-w-[300px]"
        >
          <div className="flex items-center gap-2">
            {notification.item?.image && (
              <img
                src={notification.item.image}
                alt={notification.item.title}
                className="w-10 h-10 object-cover rounded"
              />
            )}
            <p className="text-sm">{notification.message}</p>
          </div>
          <button
            onClick={hideNotification}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </motion.div>
      )}
    </CartContext.Provider>
  );
};
