async function notifGetUid(){ try{ const {data:{user}} = await window.supabase.auth.getUser(); if(user) return user.id; }catch(e){} try{ var mp=JSON.parse(localStorage.getItem('my_profile')||'{}'); return mp.user_id||mp.id||null; }catch(e){} return null; }
async function notifGetMyProfile(){ try{ var mp=JSON.parse(localStorage.getItem('my_profile')||'{}'); if(mp.name) return mp; }catch(e){} var uid=await notifGetUid(); if(!uid) return {}; var r=await window.supabase.from('profiles').select('*').eq('user_id',uid).maybeSingle(); return r.data||{}; }
function notifFlagFor(c){ if(!c) return ''; var m={'Equatorial Guinea':'GQ','Spain':'ES','Nigeria':'NG','Cameroon':'CM','Gabon':'GA','France':'FR','Germany':'DE','Italy':'IT','Portugal':'PT','United Kingdom':'GB','USA':'US','Canada':'CA','Brazil':'BR','Mexico':'MX','Morocco':'MA','Ghana':'GH','Kenya':'KE','South Africa':'ZA','India':'IN','Philippines':'PH','China':'CN','Japan':'JP','Russia':'RU','Poland':'PL','Netherlands':'NL','Belgium':'BE','Switzerland':'CH','Austria':'AT','Sweden':'SE','Norway':'NO','Denmark':'DK','Finland':'FI','Ireland':'IE','Greece':'GR','Turkey':'TR','Egypt':'EG','Algeria':'DZ','Angola':'AO','Senegal':'SN','Congo':'CG','Chad':'TD','Mali':'ML','Ethiopia':'ET','Tanzania':'TZ','Uganda':'UG','Zambia':'ZM','Australia':'AU','Argentina':'AR','Chile':'CL','Colombia':'CO','Peru':'PE','Venezuela':'VE','Cuba':'CU'}; var code=m[c]||m[String(c).trim()]||''; if(!code && String(c).length==2) code=String(c).toUpperCase(); if(!code) return ''; return String.fromCodePoint.apply(null, Array.from(code).map(function(ch){return 127397+ch.charCodeAt(0);})); }
async function notifyUser(userId, type, title, body, extra={}){
  if(!userId) return;
  var me = await notifGetMyProfile();
  var _meFlag = notifFlagFor(me.country||me.location||'');
  if(_meFlag && title && !title.startsWith(_meFlag)) title = _meFlag + ' ' + title;
  var _senderId = me.user_id||me.id||null;
  try{ var _r = await window.supabase.from('notifications').insert([{ user_id:userId, type, title, body, sender_id: _senderId, sender_name: extra.sender_name||me.name||'', sender_photo: (function(){var r=extra.sender_photo||me.photo||me.image_url||me.img||(me.photos&&me.photos[0])||''; return (r && r.indexOf('data:')===0)?'':r;})(), data: extra.data||{} }]); if(_r && _r.error) console.log('NOTIF INSERT FAILED:', _r.error.message); else console.log('NOTIF INSERT OK for', userId); }catch(e){ console.log('notif save',e); }
  var _rawPhoto = extra.sender_photo||me.photo||me.image_url||me.img||(me.photos&&me.photos[0])||''; var _photo = (_rawPhoto && _rawPhoto.indexOf('data:')===0) ? '' : _rawPhoto; var _pushData = Object.assign({}, extra.data||{}, {sender_id:_senderId, sender_photo:_photo, sender_name: extra.sender_name||me.name||''});
  if(window.sendPushToUser) window.sendPushToUser(userId, title, body, _pushData);
  // DO NOT showInAppBanner here - this runs in SENDER browser, would show sender their own message.
}
window.notifyUser = notifyUser;
// Push ONLY - for online alerts. No notifications table row, so no bell entry.
// This is what wakes the user when app is closed.
async function notifyPushOnly(userId, title, body, extra={}){
  if(!userId) return;
  var me = await notifGetMyProfile();
  var _raw2 = extra.sender_photo||me.photo||me.image_url||me.img||(me.photos&&me.photos[0])||''; var _photo2 = (_raw2 && _raw2.indexOf('data:')===0) ? '' : _raw2; var pushData = Object.assign({}, extra.data||{}, {sender_id: me.user_id||me.id||null, sender_photo:_photo2, sender_name: extra.sender_name||me.name||''});
  if(window.sendPushToUser) window.sendPushToUser(userId, title, body, pushData);
}
window.notifyPushOnly = notifyPushOnly;
function showInAppBanner(title, body, photo){
  var _ph = photo || '';
  try{ if(window.whisperPlayAlert) window.whisperPlayAlert(); }catch(e){}
  var b=document.getElementById('whisper-inapp-banner');
  if(!b){ b=document.createElement('div'); b.id='whisper-inapp-banner'; b.style.cssText='position:fixed;top:10px;left:10px;right:10px;z-index:10001;background:#1a1a1a;border:1px solid #ff5a8a;border-radius:14px;padding:12px;box-shadow:0 10px 30px rgba(0,0,0,.5)'; b.onclick=()=>{ b.style.display='none'; openNotifInbox(); }; document.body.appendChild(b); }
  b.innerHTML=(_ph?'<img src="'+_ph+'" onerror="this.remove()" style="width:44px;height:44px;border-radius:50%;object-fit:cover;float:left;margin-right:10px">':'<div style="width:44px;height:44px;border-radius:50%;background:#ff5a8a;color:#fff;display:flex;align-items:center;justify-content:center;float:left;margin-right:10px;font-size:20px">'+(title||'W').charAt(0)+'</div>')+'<b>'+title+'</b><div style="color:#ccc;font-size:13px">'+body+'</div><div style="clear:both"></div>';
  b.style.display='block';
  setTimeout(()=>{ b.style.display='none'; }, 4000);
}
async function renderNotifBell(){
  // do NOT remove bell - top-bell is the bell
  var uid=await notifGetUid(); if(!uid) return;
  var r=await window.supabase.from('notifications').select('id').eq('user_id',uid).eq('is_read',false);
  if(r.error) console.log('BELL QUERY FAILED:', r.error.message);
  var n=(r.data||[]).length;
  var el=document.getElementById('bell-badge'); if(!el) return;
  if(n>0){ el.style.display='block'; el.textContent=n>99?'99+':String(n); } else { el.style.display='none'; }
}
async function openNotifInbox(){
  var uid=await notifGetUid(); if(!uid) return alert('Login first');
  var r=await window.supabase.from('notifications').select('*').eq('user_id',uid).order('created_at',{ascending:false}).limit(50);
  if(r.error) alert('Notifications failed: '+r.error.message); var list=(r.data||[]);
  var m=document.getElementById('notif-inbox');
  if(!m){ m=document.createElement('div'); m.id='notif-inbox'; m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:10002;display:flex;align-items:flex-end;justify-content:center'; m.onclick=e=>{ if(e.target===m) m.style.display='none'; }; document.body.appendChild(m); }
  m.innerHTML='<div style="background:#1a1a1a;width:100%;max-width:420px;max-height:88vh;overflow-y:auto;border-radius:20px 20px 0 0;padding:16px"><h3 style="margin:0">🔔 '+((localStorage.getItem('whisper_lang')||'English')==='French'?'Notifications':(localStorage.getItem('whisper_lang')||'English')==='Spanish'?'Notificaciones':'Notifications')+'</h3><button onclick="notifMarkAllRead()" style="margin:10px 0;padding:8px 14px;border-radius:10px;border:0;background:#333;color:#fff">'+((localStorage.getItem('whisper_lang')||'English')==='French'?'Tout marquer comme lu':(localStorage.getItem('whisper_lang')||'English')==='Spanish'?'Marcar todo como leído':'Mark all read')+'</button><div>'+(list.length?list.map(n=>'<div onclick="notifOpen(\''+n.id+'\',\''+(n.data?.chat_with||'')+'\')" style="padding:12px;border-bottom:1px solid #333;cursor:pointer;background:'+(n.is_read?'transparent':'#222')+'"><b>'+n.title+'</b><div style="color:#ccc;font-size:13px">'+n.body+'</div><div style="color:#888;font-size:11px">'+new Date(n.created_at).toLocaleString()+'</div></div>').join(''):'<p style="color:#888">'+((localStorage.getItem('whisper_lang')||'English')==='French'?'Aucune notification pour le moment':(localStorage.getItem('whisper_lang')||'English')==='Spanish'?'Sin notificaciones aún':'No notifications yet')+'</p>')+'</div><button onclick="document.getElementById(\'notif-inbox\').style.display=\'none\'" style="width:100%;padding:12px;border-radius:12px;border:0;background:#333;color:#fff;margin-top:10px">Close</button></div>';
  m.style.display='flex';
}
async function notifOpen(id, chatWith){
  await window.supabase.from('notifications').update({is_read:true}).eq('id',id);
  document.getElementById('notif-inbox').style.display='none';
  renderNotifBell();
  if(chatWith && window.openChat){ var p=await window.supabase.from('profiles').select('*').eq('user_id',chatWith).maybeSingle(); if(p.data) window.openChat(p.data.name); }
}
async function notifMarkAllRead(){ var uid=await notifGetUid(); var r=await window.supabase.from('notifications').update({is_read:true}).eq('user_id',uid).eq('is_read',false); if(r&&r.error){ alert('Mark read failed: '+r.error.message); return; } openNotifInbox(); renderNotifBell(); }
window.openNotifInbox=openNotifInbox; window.notifMarkAllRead=notifMarkAllRead; window.notifOpen=notifOpen; window.renderNotifBell=renderNotifBell;
async function heartbeat(){
  var uid=await notifGetUid(); if(!uid) return;
  try{ await window.supabase.from('profiles').update({last_seen:new Date().toISOString()}).eq('user_id',uid); }catch(e){}
  try{
    // I just came online -> tell everyone waiting for ME (this runs even if watcher closed the app)
    var mine=await window.supabase.from('online_alerts').select('*').eq('target_id',uid);
    for(var m of (mine.data||[])){
      var w=await window.supabase.from('profiles').select('name,country').eq('user_id',uid).maybeSingle();
      await notifyUser(m.watcher_id,'online',(notifFlagFor(w.data&&w.data.country||'')+' '+(w.data&&w.data.name||'Someone')).trim()+' is online now 🟢',''+((localStorage.getItem('whisper_lang')||'English')==='French'?'Appuie pour discuter':(localStorage.getItem('whisper_lang')||'English')==='Spanish'?'Toca para chatear':'Tap to chat now')+'',{sender_name:(w.data&&w.data.name)||'',data:{chat_with:uid}});
      await window.supabase.from('online_alerts').delete().eq('id',m.id);
    }
  }catch(e){ console.log('online-notify-as-target',e); }
  try{
    var alerts=await window.supabase.from('online_alerts').select('*').eq('watcher_id',uid);
    for(var a of (alerts.data||[])){
      var t=await window.supabase.from('profiles').select('name,country,last_seen').eq('user_id',a.target_id).maybeSingle();
      if(t.data && t.data.last_seen && (Date.now()-new Date(t.data.last_seen).getTime())<120000){
        await notifyUser(uid,'online',(notifFlagFor(t.data&&t.data.country||'')+' '+(t.data.name||'Someone')).trim()+' is online now 🟢',''+((localStorage.getItem('whisper_lang')||'English')==='French'?'Appuie pour discuter':(localStorage.getItem('whisper_lang')||'English')==='Spanish'?'Toca para chatear':'Tap to chat now')+'',{sender_name:t.data.name,data:{chat_with:a.target_id}});
        await window.supabase.from('online_alerts').delete().eq('id',a.id);
      }
    }
  }catch(e){}
}
setInterval(heartbeat, 30000);
setInterval(renderNotifBell, 15000);
document.addEventListener('DOMContentLoaded', ()=>{ setTimeout(()=>{ heartbeat(); renderNotifBell(); }, 1000); });
async function askNotifyWhenOnline(targetId, targetName){
  var uid=await notifGetUid(); if(!uid) return;
  var ok=confirm('Notify you when '+targetName+' comes online?');
  if(!ok) return;
  await window.supabase.from('online_alerts').upsert({watcher_id:uid, target_id:targetId},{onConflict:'watcher_id,target_id'});
  alert('✅ We will notify you when '+targetName+' is online');
}
window.askNotifyWhenOnline=askNotifyWhenOnline;
async function checkOfflineBanner(otherId, otherName, lastSeen){
  var el=document.getElementById('offline-notify-bar');
  if(!el){ el=document.createElement('div'); el.id='offline-notify-bar'; var cv=document.getElementById('chat-view'); if(cv) cv.insertBefore(el, cv.firstChild); }
  var isOnline = lastSeen && (Date.now()-new Date(lastSeen).getTime())<120000;
  if(isOnline){ el.innerHTML=''; return; }
  try{ if(window._notifyDone && window._notifyDone[otherId]){ el.innerHTML=''; return; } }catch(e){}
  try{ if(localStorage.getItem('notify_done_'+otherId)==='1'){ el.innerHTML=''; return; } }catch(e){}
  el.innerHTML=''; el.style.display='';
  var box=document.createElement('div');
  box.style.cssText='background:#222;border:1px solid #333;border-radius:12px;padding:10px;margin:8px;text-align:center';
  box.textContent=otherName+((localStorage.getItem('whisper_lang')||'English')==='French'?' est hors ligne  ●':(localStorage.getItem('whisper_lang')||'English')==='Spanish'?' esta sin conexion  ●':' is offline  ●');
  var btn=document.createElement('button');
  btn.textContent=((localStorage.getItem('whisper_lang')||'English')==='French'?'Préviens-moi quand en ligne':(localStorage.getItem('whisper_lang')||'English')==='Spanish'?'Avísame cuando esté en línea':'Notify me when online');
  btn.style.cssText='margin-top:8px;padding:10px 16px;border-radius:999px;border:0;background:#ff5a8a;color:#fff;font-weight:700';
  btn.onclick=function(){ window.handleNotifyClick(otherId, otherName); };
  box.appendChild(document.createElement('br')); box.appendChild(btn); el.appendChild(box);
}
window.checkOfflineBanner=checkOfflineBanner;
window.handleNotifyClick=function(otherId, otherName){
  try{ window._notifyDone = window._notifyDone || {}; window._notifyDone[otherId]=1; localStorage.setItem('notify_done_'+otherId,'1'); }catch(e){}
  try{ askNotifyWhenOnline(otherId, otherName); }catch(e){}
  var el=document.getElementById('offline-notify-bar'); if(!el) return;
  el.innerHTML=''; el.style.display='none';
};


// Realtime notifications: banner + sound when app is open
(function(){
  var started=false;
  async function start(){
    if(started) return; started=true;
    try{
      var uid=await notifGetUid(); if(!uid) { started=false; return; }
      window.supabase.channel('whisper-notif-realtime-'+uid)
        .on('postgres_changes',{event:'INSERT',schema:'public',table:'notifications',filter:'user_id=eq.'+uid},function(payload){
          var n=payload.new||{};
          if(window.whisperSettings && window.whisperSettings.inapp===false) return;
          showInAppBanner(n.title||'Whisper', n.body||'');
          if(window.renderNotifBell) window.renderNotifBell();
        }).subscribe();
    }catch(e){}
  }
  document.addEventListener('DOMContentLoaded',function(){ setTimeout(start,1500); });
  setTimeout(start,3000);
})();
