// offlineStorage.js - Utility for handling offline storage using IndexedDB

// Open IndexedDB database
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('bookstoreOfflineDB', 1);
    
    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject('Error opening IndexedDB');
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
    
    // Create object stores when database is first created or version is upgraded
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object store for pending orders
      if (!db.objectStoreNames.contains('pendingOrders')) {
        db.createObjectStore('pendingOrders', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

// Save order to IndexedDB when offline
export const saveOrderOffline = async (orderData) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(['pendingOrders'], 'readwrite');
    const store = transaction.objectStore('pendingOrders');
    
    // Add timestamp to track when the order was created
    const orderWithTimestamp = {
      ...orderData,
      createdAt: new Date().toISOString(),
    };
    
    const request = store.add(orderWithTimestamp);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve({ success: true, offlineId: request.result });
      };
      
      request.onerror = (event) => {
        console.error('Error saving order offline:', event.target.error);
        reject(new Error('Failed to save order offline'));
      };
    });
  } catch (error) {
    console.error('Error in saveOrderOffline:', error);
    throw error;
  }
};

// Get all pending orders from IndexedDB
export const getPendingOrders = async () => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(['pendingOrders'], 'readonly');
    const store = transaction.objectStore('pendingOrders');
    
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        console.error('Error getting pending orders:', event.target.error);
        reject(new Error('Failed to get pending orders'));
      };
    });
  } catch (error) {
    console.error('Error in getPendingOrders:', error);
    throw error;
  }
};

// Remove a pending order from IndexedDB after it's successfully processed
export const removePendingOrder = async (id) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(['pendingOrders'], 'readwrite');
    const store = transaction.objectStore('pendingOrders');
    
    const request = store.delete(id);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve({ success: true });
      };
      
      request.onerror = (event) => {
        console.error('Error removing pending order:', event.target.error);
        reject(new Error('Failed to remove pending order'));
      };
    });
  } catch (error) {
    console.error('Error in removePendingOrder:', error);
    throw error;
  }
};

// Check if the browser is online
export const isOnline = () => {
  return navigator.onLine;
};

// Add event listeners for online/offline status
export const setupNetworkListeners = (onlineCallback, offlineCallback) => {
  window.addEventListener('online', onlineCallback);
  window.addEventListener('offline', offlineCallback);
  
  return () => {
    window.removeEventListener('online', onlineCallback);
    window.removeEventListener('offline', offlineCallback);
  };
};