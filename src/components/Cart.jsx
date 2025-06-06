import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/api';
import { setupAutoSync } from '../services/syncService';
import { isOnline } from '../services/offlineStorage';

const Cart = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [offlineOrderSuccess, setOfflineOrderSuccess] = useState(false);
  const [networkStatus, setNetworkStatus] = useState(isOnline());
  
  // Setup network status monitoring
  useEffect(() => {
    const handleOnline = () => setNetworkStatus(true);
    const handleOffline = () => setNetworkStatus(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Setup auto sync for offline orders
    const cleanupSync = setupAutoSync((result) => {
      if (result.success && result.details.some(r => r.status === 'fulfilled' && r.value.success)) {
        // Show notification that orders were synced
        console.log('Orders synced successfully:', result);
      }
    });
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      cleanupSync();
    };
  }, []);

  // Function to redirect to WhatsApp with order details
  const redirectToWhatsApp = (orderDetails) => {
    const phoneNumber = '212723329765'; // WhatsApp number without the '+' symbol
    
    // Create message with order details
    let message = 'طلب جديد:\n';
    message += `المجموع: ${orderDetails.total} $\n`;
    message += 'المنتجات:\n';
    
    orderDetails.items.forEach(item => {
      const cartItem = cartItems.find(i => i.id === item.product);
      if (cartItem) {
        message += `- ${cartItem.title} (${item.quantity}) - ${cartItem.price * item.quantity} $\n`;
      }
    });
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank');
  };

  const handleOrderSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    setOfflineOrderSuccess(false);

    try {
      const orderData = {
        user_name: 'عميل', // You might want to collect this from a form
        total: getCartTotal(),
        items: cartItems.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
      };

      // If online, redirect to WhatsApp after creating order
      if (networkStatus) {
        const order = await createOrder(orderData);
        console.log('Order created:', order);
        
        // Clear cart after successful order
        cartItems.forEach((item) => removeFromCart(item.id));
        
        // Redirect to WhatsApp with order details
        redirectToWhatsApp(orderData);
        
        // Close the cart
        onClose();
        return;
      }
      
      // If offline, save order locally
      const order = await createOrder(orderData);
      console.log('Order created:', order);

      // Handle offline order
      if (order.isOffline) {
        setOfflineOrderSuccess(true);
        // Clear cart after successful offline order save
        cartItems.forEach((item) => removeFromCart(item.id));
        // Don't close the cart to show the offline message
        return;
      }

      // Clear cart after successful online order
      cartItems.forEach((item) => removeFromCart(item.id));
      onClose();
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء إنشاء الطلب');
      console.error('Error creating order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      <div className="fixed left-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">عربة التسوق</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {cartItems.length === 0 ? (
            <p className="text-center text-gray-500 my-8">عربة التسوق فارغة</p>
          ) : (
            <>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-gray-200 py-4"
                  >
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium text-lg">{item.title}</h3>
                        <p className="text-gray-600">{item.price} $</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors ml-4"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>المجموع:</span>
                  <span>{getCartTotal()} $</span>
                </div>
                
                {!networkStatus && (
                  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-4 rounded">
                    <div className="flex items-center">
                      <i className="fas fa-exclamation-triangle mr-2"></i>
                      <p>أنت حاليًا غير متصل بالإنترنت. سيتم حفظ طلبك محليًا وإرساله عند استعادة الاتصال.</p>
                    </div>
                  </div>
                )}
                
                {offlineOrderSuccess && (
                  <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded">
                    <div className="flex items-center">
                      <i className="fas fa-check-circle mr-2"></i>
                      <p>تم حفظ طلبك محليًا وسيتم إرساله تلقائيًا عند استعادة الاتصال بالإنترنت.</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
                    <div className="flex items-center">
                      <i className="fas fa-times-circle mr-2"></i>
                      <p>{error}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleOrderSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>جاري إنشاء الطلب...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-shopping-cart"></i>
                      <span>{networkStatus ? 'إتمام الطلب' : 'حفظ الطلب محليًا'}</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
