const CACHE_NAME = "mealpal-v2"
const STATIC_CACHE = "mealpal-static-v2"
const DYNAMIC_CACHE = "mealpal-dynamic-v2"

const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/manifest.json",
  "/icons/icon-192x192.jpg",
  "/icons/icon-512x512.jpg",
  "https://unpkg.com/lucide@latest/dist/umd/lucide.js",
]

// Install event - cache static resources
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...")
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("Caching static resources")
      return cache.addAll(urlsToCache)
    }).then(() => {
      console.log("Static resources cached successfully")
      return self.skipWaiting()
    })
  )
})

// Activate event - clean up old caches and take control
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log("Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      console.log("Service Worker activated")
      return self.clients.claim()
    })
  )
})

// Fetch event - serve from cache with network fallback
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Handle different types of requests
  if (url.origin === location.origin) {
    // Same origin requests
    event.respondWith(handleSameOriginRequest(request))
  } else {
    // Cross-origin requests (like Lucide icons)
    event.respondWith(handleCrossOriginRequest(request))
  }
})

async function handleSameOriginRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Try network
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log("Network request failed:", error)
    
    // Return offline page for navigation requests
    if (request.destination === "document") {
      const cachedResponse = await caches.match("/index.html")
      if (cachedResponse) {
        return cachedResponse
      }
    }
    
    // Return a basic offline response
    return new Response("Offline - Conteúdo não disponível", {
      status: 503,
      statusText: "Service Unavailable"
    })
  }
}

async function handleCrossOriginRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Try network
    const networkResponse = await fetch(request)
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log("Cross-origin request failed:", error)
    // Return a basic offline response for external resources
    return new Response("", { status: 503 })
  }
}

// Background sync for offline data
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("Background sync triggered")
    event.waitUntil(doBackgroundSync())
  }
})

async function doBackgroundSync() {
  // This would sync any pending data when back online
  console.log("Performing background sync...")
}

// Push notifications (for future use)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: "/icons/icon-192x192.jpg",
      badge: "/icons/icon-192x192.jpg",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    }
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  
  event.waitUntil(
    clients.openWindow("/")
  )
})
