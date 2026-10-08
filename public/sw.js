// ============================================================
// KoraLive PWA & Web Push Notification Service Worker
// ============================================================
const CACHE_NAME = 'koralive-pwa-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

// Install: Cache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Purge obsolete caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Offline fallback caching strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/');
          }
        })
      );
    })
  );
});

// ============================================================
// 🔔 Web Push Notifications Handling
// ============================================================
// Allows instant goal, match start, and live score push notifications
// even when the application tab is closed or in background.
self.addEventListener('push', (event) => {
  let payload = {
    title: '⚽ كورة لايف - تنبيه مباشر',
    body: 'تم تسجيل هدف جديد في إحدى المباريات المباشرة!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'koralive-goal-alert',
    url: '/',
    vibrate: [200, 100, 200, 100, 400],
    data: { url: '/' }
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      payload = { ...payload, ...parsed };
    } catch (e) {
      payload.body = event.data.text() || payload.body;
    }
  }

  const notificationOptions = {
    body: payload.body,
    icon: payload.icon || '/icon-192.png',
    badge: payload.badge || '/icon-192.png',
    image: payload.image || undefined,
    tag: payload.tag || 'koralive-live-update',
    renotify: true,
    requireInteraction: true,
    vibrate: payload.vibrate || [200, 100, 200, 100, 300],
    data: {
      url: payload.url || '/',
      matchId: payload.matchId,
      timestamp: Date.now()
    },
    actions: [
      { action: 'open_match', title: '⚽ شاهد الهدف والنتيجة' },
      { action: 'dismiss', title: 'إغلاق ✕' }
    ],
    dir: 'rtl',
    lang: 'ar'
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, notificationOptions)
  );
});

// Notification Click Handler: Opens/focuses the app window when notification is tapped
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If any existing client window is open, focus it
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            matchId: event.notification.data?.matchId
          });
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// Background Message listener from active pages
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, options } = event.data;
    self.registration.showNotification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200, 100, 400],
      dir: 'rtl',
      lang: 'ar',
      ...options
    });
  }
});
