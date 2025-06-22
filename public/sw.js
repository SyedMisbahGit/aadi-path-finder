// Al-Naseeh V3 Service Worker
// Version: 3.0.0
// Purpose: PWA functionality, offline caching, AI service optimization

const CACHE_NAME = 'al-naseeh-v3-cache-v1';
const AI_CACHE_NAME = 'al-naseeh-v3-ai-cache-v1';
const STATIC_CACHE_NAME = 'al-naseeh-v3-static-cache-v1';

// Cache strategies
const CACHE_STRATEGIES = {
  STATIC: 'static',
  DYNAMIC: 'dynamic',
  AI_RESPONSE: 'ai-response',
  NETWORK_FIRST: 'network-first',
  CACHE_FIRST: 'cache-first'
};

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/screenshots/mobile-home.png',
  '/screenshots/mobile-counselor.png',
  '/screenshots/mobile-documents.png',
  '/screenshots/mobile-safety.png'
];

// AI service endpoints to cache
const AI_ENDPOINTS = [
  '/api/ai/counselor',
  '/api/ai/predictions',
  '/api/ai/safety-analysis',
  '/api/ai/document-analysis',
  '/api/ai/voice-processing',
  '/api/ai/translation'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Cache AI service responses
      caches.open(AI_CACHE_NAME).then((cache) => {
        console.log('[SW] Caching AI service responses');
        return cache.addAll(AI_ENDPOINTS.map(endpoint => new Request(endpoint, { method: 'GET' })));
      })
    ]).then(() => {
      console.log('[SW] Service worker installed successfully');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== AI_CACHE_NAME && 
              cacheName !== STATIC_CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[SW] Service worker activated successfully');
      return self.clients.claim();
    })
  );
});

// Fetch event - handle different caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE_NAME));
  } else if (isAIEndpoint(request)) {
    event.respondWith(aiResponseStrategy(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(dynamicCaching(request));
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New update from Al-Naseeh',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/icon-96x96.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-96x96.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Al-Naseeh V3', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(syncOfflineData());
  }
});

// Cache strategies
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for cache first:', error);
    return new Response('Offline content not available', { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline content not available', { status: 503 });
  }
}

async function dynamicCaching(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for dynamic caching:', error);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline content not available', { status: 503 });
  }
}

async function aiResponseStrategy(request) {
  const cache = await caches.open(AI_CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache AI responses for 1 hour
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
      
      // Set cache expiration
      setTimeout(() => {
        cache.delete(request);
      }, 60 * 60 * 1000); // 1 hour
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] AI service failed, trying cache:', error);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('AI service temporarily unavailable', { status: 503 });
  }
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return STATIC_ASSETS.includes(url.pathname) || 
         url.pathname.startsWith('/icons/') ||
         url.pathname.startsWith('/screenshots/') ||
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.png') ||
         url.pathname.endsWith('.jpg') ||
         url.pathname.endsWith('.jpeg') ||
         url.pathname.endsWith('.gif') ||
         url.pathname.endsWith('.svg');
}

function isAIEndpoint(request) {
  const url = new URL(request.url);
  return AI_ENDPOINTS.some(endpoint => url.pathname.startsWith(endpoint));
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/');
}

// Background sync function
async function syncOfflineData() {
  console.log('[SW] Syncing offline data...');
  
  // Get all clients
  const clients = await self.clients.matchAll();
  
  // Send sync message to all clients
  clients.forEach(client => {
    client.postMessage({
      type: 'SYNC_OFFLINE_DATA',
      timestamp: Date.now()
    });
  });
}

// Message handling
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_AI_RESPONSE') {
    cacheAIResponse(event.data.request, event.data.response);
  }
});

// Cache AI response manually
async function cacheAIResponse(request, response) {
  const cache = await caches.open(AI_CACHE_NAME);
  await cache.put(request, new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' }
  }));
}

// Periodic cache cleanup
setInterval(async () => {
  const cache = await caches.open(AI_CACHE_NAME);
  const requests = await cache.keys();
  
  requests.forEach(async (request) => {
    const response = await cache.match(request);
    const date = response.headers.get('date');
    
    if (date && Date.now() - new Date(date).getTime() > 60 * 60 * 1000) {
      await cache.delete(request);
    }
  });
}, 30 * 60 * 1000); // Run every 30 minutes

console.log('[SW] Al-Naseeh V3 Service Worker loaded successfully'); 