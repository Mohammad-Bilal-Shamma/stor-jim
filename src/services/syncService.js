// syncService.js - Service for synchronizing offline data when online

import { getPendingOrders, removePendingOrder, isOnline } from './offlineStorage';

// Base URL for API requests
const BASE_URL = 'https://lib-dashboard-lovat.vercel.app/api/clint';

// Process all pending orders when online
export const syncPendingOrders = async () => {
  // If not online, don't attempt to sync
  if (!isOnline()) {
    return { success: false, message: 'No internet connection' };
  }

  try {
    // Get all pending orders from IndexedDB
    const pendingOrders = await getPendingOrders();
    
    if (pendingOrders.length === 0) {
      return { success: true, message: 'No pending orders to sync' };
    }
    
    console.log(`Found ${pendingOrders.length} pending orders to sync`);
    
    // Process each pending order
    const results = await Promise.allSettled(
      pendingOrders.map(async (order) => {
        try {
          // Send the order to the server
          const response = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
          });
          
          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
          }
          
          const data = await response.json();
          
          if (!data.success) {
            throw new Error(data.message || 'Server error');
          }
          
          // If successful, remove the order from IndexedDB
          await removePendingOrder(order.id);
          
          return { 
            success: true, 
            orderId: order.id, 
            serverResponse: data.data 
          };
        } catch (error) {
          console.error(`Failed to sync order ${order.id}:`, error);
          return { 
            success: false, 
            orderId: order.id, 
            error: error.message 
          };
        }
      })
    );
    
    // Count successful and failed syncs
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;
    
    return {
      success: true,
      message: `Synced ${successful} orders, ${failed} failed`,
      details: results,
    };
  } catch (error) {
    console.error('Error syncing pending orders:', error);
    return {
      success: false,
      message: 'Error syncing pending orders',
      error: error.message,
    };
  }
};

// Setup automatic sync when coming online
export const setupAutoSync = (onSyncComplete) => {
  const handleOnline = async () => {
    console.log('Internet connection restored, syncing pending orders...');
    const result = await syncPendingOrders();
    
    if (onSyncComplete && typeof onSyncComplete === 'function') {
      onSyncComplete(result);
    }
  };
  
  window.addEventListener('online', handleOnline);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
  };
};

// Manually trigger sync
export const triggerSync = async () => {
  if (!isOnline()) {
    return { success: false, message: 'No internet connection' };
  }
  
  return await syncPendingOrders();
};