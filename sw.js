self.addEventListener('push', function(event) {
  let data = {};
  try { data = event.data.json(); } catch(e) { data = { body: event.data ? event.data.text() : 'New message' }; }
  const title = data.title || 'WhisperApp';
  const fallbackIcon = 'images/icon-192.png';
  event.waitUntil((async function(){
    let icon = fallbackIcon;
    const options = { body: data.body || 'You have a new message', icon: icon, badge: fallbackIcon, data: { url: data.url || './index.html' } };
    await self.registration.showNotification(title, options);
  })());
});
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || './index.html';
  event.waitUntil(clients.matchAll({type:'window', includeUncontrolled:true}).then(function(list){
    for(var i=0;i<list.length;i++){ if('focus' in list[i]) return list[i].focus().then(function(c){ if(c.navigate) { try{ c.navigate(url); }catch(e){} } return c; }); }
    if(clients.openWindow) return clients.openWindow(url);
  }));
});
