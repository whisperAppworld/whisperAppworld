async function notifGetUid(){ try{ const {data:{user}} = await window.supabase.auth.getUser(); if(user) return user.id; }catch(e){} try{ var mp=JSON.parse(localStorage.getItem('my_profile')||'{}'); return mp.user_id||mp.id||null; }catch(e){} return null; }
async function notifGetMyProfile(){ try{ var mp=JSON.parse(localStorage.getItem('my_profile')||'{}'); if(mp.name) return mp; }catch(e){} var uid=await notifGetUid(); if(!uid) return {}; var r=await window.supabase.from('profiles').select('*').eq('user_id',uid).maybeSingle(); return r.data||{}; }
async function notifyUser(userId, type, title, body, extra={}){
  if(!userId) return;
  var me = await notifGetMyProfile();
  var _senderId = me.user_id||me.id||null;
  try{ var _r = await window.supabase.from('notifications').insert([{ user_id:userId, type, title, body, sender_id: _senderId, sender_name: extra.sender_name||me.name||'', sender_photo: extra.sender_photo||me.img||me.photo||me.image_url||'', data: extra.data||{} }]); if(_r && _r.error) console.log('NOTIF INSERT FAILED:', _r.error.message); else console.log('NOTIF INSERT OK for', userId); }catch(e){ console.log('notif save',e); }
  var _pushData = Object.assign({}, extra.data||{}, {sender_id:_senderId});
  if(window.sendPushToUser) window.sendPushToUser(userId, title, body, _pushData);
  // DO NOT showInAppBanner here - this runs in SENDER browser, would show sender their own message.
}
window.notifyUser = notifyUser;
// Push ONLY - for online alerts. No notifications table row, so no bell entry.
// This is what wakes the user when app is closed.
async function notifyPushOnly(userId, title, body, extra={}){
  if(!userId) return;
  var me = await notifGetMyProfile();
  var pushData = Object.assign({}, extra.data||{}, {sender_id: me.user_id||me.id||null});
  if(window.sendPushToUser) window.sendPushToUser(userId, title, body, pushData);
}
window.notifyPushOnly = notifyPushOnly;
function showInAppBanner(title, body){
  var b=document.getElementById('whisper-inapp-banner');
  if(!b){ b=document.createElement('div'); b.id='whisper-inapp-banner'; b.style.cssText='position:fixed;top:10px;left:10px;right:10px;z-index:10001;background:#1a1a1a;border:1px solid #ff5a8a;border-radius:14px;padding:12px;box-shadow:0 10px 30px rgba(0,0,0,.5)'; b.onclick=()=>{ b.style.display='none'; openNotifInbox(); }; document.body.appendChild(b); }
  b.innerHTML='<b>'+title+'</b><div style="color:#ccc;font-size:13px">'+body+'</div>';
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
  var list=(r.data||[]);
  var m=document.getElementById('notif-inbox');
  if(!m){ m=document.createElement('div'); m.id='notif-inbox'; m.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:10002;display:flex;align-items:flex-end;justify-content:center'; m.onclick=e=>{ if(e.target===m) m.style.display='none'; }; document.body.appendChild(m); }
  m.innerHTML='<div style="background:#1a1a1a;width:100%;max-width:420px;max-height:88vh;overflow-y:auto;border-radius:20px 20px 0 0;padding:16px"><h3 style="margin:0">🔔 Notifications</h3><button onclick="notifMarkAllRead()" style="margin:10px 0;padding:8px 14px;border-radius:10px;border:0;background:#333;color:#fff">Mark all read</button><div>'+(list.length?list.map(n=>'<div onclick="notifOpen(\''+n.id+'\',\''+(n.data?.chat_with||'')+'\')" style="padding:12px;border-bottom:1px solid #333;cursor:pointer;background:'+(n.is_read?'transparent':'#222')+'"><b>'+n.title+'</b><div style="color:#ccc;font-size:13px">'+n.body+'</div><div style="color:#888;font-size:11px">'+new Date(n.created_at).toLocaleString()+'</div></div>').join(''):'<p style="color:#888">No notifications yet</p>')+'</div><button onclick="document.getElementById(\'notif-inbox\').style.display=\'none\'" style="width:100%;padding:12px;border-radius:12px;border:0;background:#333;color:#fff;margin-top:10px">Close</button></div>';
  m.style.display='flex';
}
async function notifOpen(id, chatWith){
  await window.supabase.from('notifications').update({is_read:true}).eq('id',id);
  document.getElementById('notif-inbox').style.display='none';
  renderNotifBell();
  if(chatWith && window.openChat){ var p=await window.supabase.from('profiles').select('*').eq('user_id',chatWith).maybeSingle(); if(p.data) window.openChat(p.data.name); }
}
async function notifMarkAllRead(){ var uid=await notifGetUid(); await window.supabase.from('notifications').update({is_read:true}).eq('user_id',uid).eq('is_read',false); openNotifInbox(); renderNotifBell(); }
window.openNotifInbox=openNotifInbox; window.notifMarkAllRead=notifMarkAllRead; window.notifOpen=notifOpen; window.renderNotifBell=renderNotifBell;
async function heartbeat(){
  var uid=await notifGetUid(); if(!uid) return;
  try{ await window.supabase.from('profiles').update({last_seen:new Date().toISOString()}).eq('user_id',uid); }catch(e){}
  try{
    var alerts=await window.supabase.from('online_alerts').select('*').eq('watcher_id',uid);
    for(var a of (alerts.data||[])){
      var t=await window.supabase.from('profiles').select('name,last_seen').eq('user_id',a.target_id).maybeSingle();
      if(t.data && t.data.last_seen && (Date.now()-new Date(t.data.last_seen).getTime())<120000){
        await notifyPushOnly(uid, (t.data.name||'Someone')+' is online now 🟢', 'Tap to chat now', {sender_name:t.data.name, data:{chat_with:a.target_id}});
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
  var el=document.getElementById('offline-notify-bar'); if(!el){ el=document.createElement('div'); el.id='offline-notify-bar'; var cv=document.getElementById('chat-view'); if(cv) cv.parentNode.insertBefore(el,cv); }
  var isOnline = lastSeen && (Date.now()-new Date(lastSeen).getTime())<120000;
  if(isOnline){ el.innerHTML=''; return; }
  el.innerHTML='<div style="background:#222;border:1px solid #333;border-radius:12px;padding:10px;margin:8px;text-align:center">⚫ '+otherName+' is offline<br><button onclick="askNotifyWhenOnline(\''+otherId+'\',\''+otherName+'\')" style="margin-top:8px;padding:10px 16px;border-radius:999px;border:0;background:#ff5a8a;color:#fff;font-weight:700">🔔 Notify me when she comes online</button></div>';
}
window.checkOfflineBanner=checkOfflineBanner;
