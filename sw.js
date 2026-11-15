self.addEventListener('push', function(event) {
  let data = {};
  try { data = event.data.json(); } catch(e) { data = { body: event.data ? event.data.text() : 'New message' }; }
  const title = data.title || 'WhisperApp';
  const options = {
    body: data.body || 'You have a new message',
    icon: 'images/icon-192.png',
    badge: 'images/icon-192.png',
    data: { url: data.url || './index.html' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
