import React, { useState, useEffect } from 'react';
import { setupAutoSync } from '../services/syncService';

const SyncNotification = () => {
  const [syncNotification, setSyncNotification] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Setup auto sync with notification callback
    const cleanupSync = setupAutoSync((result) => {
      if (result.success && result.details && result.details.length > 0) {
        const successCount = result.details.filter(
          (r) => r.status === 'fulfilled' && r.value.success
        ).length;
        
        if (successCount > 0) {
          // Show notification that orders were synced
          setSyncNotification({
            message: `تم مزامنة ${successCount} طلب/طلبات بنجاح`,
            type: 'success',
          });
          setVisible(true);
          
          // Hide notification after 5 seconds
          setTimeout(() => {
            setVisible(false);
          }, 5000);
        }
      }
    });

    return () => {
      cleanupSync();
    };
  }, []);

  // If no notification or not visible, don't render anything
  if (!syncNotification || !visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md">
      <div 
        className={`p-4 rounded-lg shadow-lg flex items-center justify-between ${
          syncNotification.type === 'success' 
            ? 'bg-green-100 border-l-4 border-green-500 text-green-700' 
            : 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700'
        }`}
      >
        <div className="flex items-center">
          <i className={`mr-2 ${
            syncNotification.type === 'success' 
              ? 'fas fa-check-circle' 
              : 'fas fa-exclamation-triangle'
          }`}></i>
          <p>{syncNotification.message}</p>
        </div>
        <button 
          onClick={() => setVisible(false)}
          className="ml-4 text-gray-500 hover:text-gray-700"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default SyncNotification;