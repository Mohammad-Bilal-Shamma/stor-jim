import React, { useState, useEffect } from 'react';
import { isOnline } from '../services/offlineStorage';

const NetworkStatus = () => {
  const [online, setOnline] = useState(isOnline());

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Only show when offline
  if (online) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white py-2 px-4 text-center z-50">
      <div className="flex items-center justify-center gap-2">
        <i className="fas fa-wifi"></i>
        <span>أنت حاليًا غير متصل بالإنترنت. بعض الميزات قد لا تعمل بشكل صحيح.</span>
      </div>
    </div>
  );
};

export default NetworkStatus;