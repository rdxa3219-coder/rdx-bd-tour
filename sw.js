// sw.js - ব্যাকগ্রাউন্ড সার্ভিস ওয়ার্কার

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// পুশ নোটিফিকেশন হ্যান্ডলার
self.addEventListener('push', (event) => {
  let data = { title: 'BD Tour', body: 'নতুন নোটিফিকেশন এসেছে!' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: 'https://cdn-icons-png.flaticon.com/512/3408/3408590.png',
    badge: 'https://cdn-icons-png.flaticon.com/512/3408/3408590.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// নোটিফিকেশনে চাপ দিলে সাইট ওপেন হওয়া
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || '/');
      }
    })
  );
});
