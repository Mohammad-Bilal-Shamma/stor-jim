import React, { createContext, useContext, useState, useEffect } from 'react';

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
        <div className="fixed top-5 right-5 bg-primary text-white p-4 rounded-lg shadow-lg z-50 flex items-center justify-between min-w-[300px]">
          <div className="flex items-center">
            <p>{notification.message}</p>
          </div>
          <button
            onClick={hideNotification}
            className="ml-4 text-white hover:text-gray-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </CartContext.Provider>
  );
};
