// database.js - IndexedDB management module

let db;
const DB_NAME = 'TradingPlatform';
const DB_VERSION = 1;

// Initialize IndexedDB
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = function() {
      console.error('Failed to open database');
      reject('Failed to open database');
    };

    request.onsuccess = function(event) {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = function(event) {
      db = event.target.result;

      // Create trades store
      if (!db.objectStoreNames.contains('trades')) {
        const tradeStore = db.createObjectStore('trades', { keyPath: 'id', autoIncrement: true });
        tradeStore.createIndex('timestamp', 'timestamp', { unique: false });
        tradeStore.createIndex('category', 'category', { unique: false });
      }

      // Create wallet store
      if (!db.objectStoreNames.contains('wallet')) {
        db.createObjectStore('wallet', { keyPath: 'id' });
      }

      // Create transactions store
      if (!db.objectStoreNames.contains('transactions')) {
        const txStore = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
        txStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// Database operations
const dbOperations = {
  // Add record to store
  add: (storeName, data) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Update record in store
  put: (storeName, data) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Delete record from store
  delete: (storeName, id) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  },

  // Get all records from store
  getAll: (storeName) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  // Get specific record by ID
  get: (storeName, id) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
};