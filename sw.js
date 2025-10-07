// SERVICE WORKER - MIT Notifications Handler
// Handles background notifications and click actions

const CACHE_NAME = '4mgi-v3'; // Updated cache version
const urlsToCache = [
  '/'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch handler - Network First with Cache Fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Try network first
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone();
        
        // Update cache with new response
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });
        
        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Offline fallback for HTML pages
            if (event.request.destination === 'document') {
              return caches.match('/home.html');
            }
          });
      })
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  const notification = event.notification;
  const action = event.action;
  const data = notification.data || {};

  notification.close();

  // Handle different actions
  let url = '/home.html';

  switch(action) {
    case 'view':
      url = '/home.html';
      break;
    case 'plan':
      url = '/home.html#plan-mits';
      break;
    case 'complete':
      url = '/home.html#complete-mit';
      break;
    case 'review':
      url = '/home.html#review';
      break;
    case 'dismiss':
      // Just close, no action
      return;
    default:
      // Default click (no action button) - open home
      url = '/home.html';
  }

  // Focus or open window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (let client of clientList) {
          if (client.url.includes('home.html') && 'focus' in client) {
            return client.focus().then(() => {
              // Send message to client with action
              client.postMessage({
                type: 'notification-click',
                action: action,
                data: data
              });
            });
          }
        }
        
        // If not open, open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Notification Close Handler
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
  
  // Track analytics or cleanup if needed
  const tag = event.notification.tag;
  const data = event.notification.data || {};
  
  // Could send analytics here
  // trackEvent('notification-closed', { tag, type: data.type });
});

// Push notification handler (for future web push implementation)
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  if (!event.data) {
    return;
  }

  try {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New notification from 4MGI',
      icon: data.icon || '/icon-192.png',
      badge: '/badge-72.png',
      vibrate: [200, 100, 200],
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: data.requireInteraction !== false,
      tag: data.tag || 'push-notification'
    };

    event.waitUntil(
      self.registration.showNotification(data.title || '4MGI Strategy AI', options)
    );
  } catch (error) {
    console.error('Error handling push notification:', error);
  }
});

// Background sync (for future offline MIT updates)
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);
  
  if (event.tag === 'sync-mits') {
    event.waitUntil(
      // Sync MIT data when back online
      syncMITData()
    );
  }
});

async function syncMITData() {
  try {
    // Get pending MIT updates from IndexedDB or localStorage
    const pendingUpdates = await getPendingUpdates();
    
    if (pendingUpdates.length > 0) {
      // Send to server or update local storage
      console.log('Syncing MIT updates:', pendingUpdates.length);
      
      // For now, just log (would send to API in production)
      pendingUpdates.forEach(update => {
        console.log('Synced:', update);
      });
      
      // Clear pending updates
      await clearPendingUpdates();
    }
  } catch (error) {
    console.error('Error syncing MIT data:', error);
  }
}

async function getPendingUpdates() {
  // Would fetch from IndexedDB in production
  return [];
}

async function clearPendingUpdates() {
  // Would clear IndexedDB in production
  return true;
}

// Periodic Background Sync (Chrome 80+)
self.addEventListener('periodicsync', (event) => {
  console.log('Periodic sync:', event.tag);
  
  if (event.tag === 'daily-mit-check') {
    event.waitUntil(
      checkDailyMITs()
    );
  }
});

async function checkDailyMITs() {
  try {
    // Check if user has completed today's MITs
    const mits = await getTodayMITs();
    const completed = mits.filter(m => m.status === 'completed').length;
    
    if (completed === mits.length && mits.length > 0) {
      // All MITs complete - send celebration notification
      await self.registration.showNotification(
        '🎉 All MITs Complete!',
        {
          body: `Amazing! You completed all ${mits.length} MITs today!`,
          icon: '/icon-192.png',
          badge: '/badge-72.png',
          tag: 'daily-complete',
          requireInteraction: false
        }
      );
    }
  } catch (error) {
    console.error('Error checking daily MITs:', error);
  }
}

async function getTodayMITs() {
  // Would fetch from API or IndexedDB in production
  return [];
}

console.log('Service Worker loaded');
