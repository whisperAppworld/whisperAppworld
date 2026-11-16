self.addEventListener('push', function(event) {
  let data = {};
  try { data = event.data.json(); } catch(e) { data = { body: event.data ? event.data.text() : 'New message' }; }
  const title = data.title || 'WhisperApp';
  const fallbackIcon = 'images/icon-192.png';
  event.waitUntil((async function(){
    let _ic = data.icon || data.sender_photo || (data.data && (data.data.sender_photo||data.data.icon)) || ''; let icon = (_ic && String(_ic).indexOf('data:')===0) ? fallbackIcon : (_ic || fallbackIcon);
    try{
      var sid = data.sender_id || (data.data && data.data.sender_id);
      if(sid){
        var res = await fetch('https://jztfakvawduanyovbbkt.supabase.co/rest/v1/profiles?user_id=eq.'+encodeURIComponent(sid)+'&select=photo,photos,image_url', { headers: { 'apikey': 'sb_publishable_Xgea70sY3vlxZQD0PTWFYQ_ySQN2K4C', 'Authorization': 'Bearer sb_publishable_Xgea70sY3vlxZQD0PTWFYQ_ySQN2K4C' } });
        var rows = await res.json();
        var photo = rows && rows[0] && (rows[0].photo || rows[0].image_url || (rows[0].photos && rows[0].photos[0]));
        if(photo && icon===fallbackIcon) icon = photo;
      }
    }catch(e){}
    const options = { body: data.body || 'You have a new message', icon: icon, badge: fallbackIcon, data: { url: (data.url || (data.data && data.data.url) || './index.html') } };
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
