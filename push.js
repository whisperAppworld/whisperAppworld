const VAPID_PUBLIC_KEY = 'BLoymFpiiLWh1Eji-g3yMRNFT-7NaCMWVmqWDX-wCZcGOIFgasAXfmJ7ItHSWrQyhwa7flcJFTW4cF5yXkDQJyM';

function getPushUid(){
  try{ var mp=JSON.parse(localStorage.getItem('my_profile')||'{}'); if(mp.user_id) return mp.user_id; if(mp.id) return mp.id; }catch(e){}
  if(window._myUid) return window._myUid;
  return null;
}
async function getCurrentUid(){
  var u = getPushUid();
  if(u) return u;
  try{ const { data:{user} } = await window.supabase.auth.getUser(); if(user) return user.id; }catch(e){}
  return null;
}
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

window.isInAppEnabled = () => localStorage.getItem('whisper_inapp_enabled') !== '0';
window.setInAppEnabled = (on) => { localStorage.setItem('whisper_inapp_enabled', on ? '1' : '0'); };

// DB is source of truth: does this user have a subscription saved?
async function isPushEnabledInDB(){
  try{
    var uid = await getCurrentUid();
    if(!uid) return false;
    if(Notification.permission !== 'granted') return false;
    var reg = await navigator.serviceWorker.getRegistration();
    if(!reg) return false;
    var sub = await reg.pushManager.getSubscription();
    if(!sub) return false;
    const { data, error } = await window.supabase.from('push_subscriptions').select('user_id').eq('user_id', uid).maybeSingle();
    if(error){ console.log('DB check err', error); return false; }
    return !!data;
  }catch(e){ console.log('isPushEnabledInDB', e); return false; }
}
window.isPushEnabledInDB = isPushEnabledInDB;

async function setupPush() {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
    const reg = await navigator.serviceWorker.register('sw.js?v=3');
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') return false;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) });
    }
    var _uid = await getCurrentUid();
    if (!_uid) { console.log('Push: no uid, cannot save'); return false; }
    const _res = await window.supabase.from('push_subscriptions').upsert({ user_id: _uid, subscription: sub.toJSON(), updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    console.log('Push DB save', _res.error || 'OK', _uid);
    if (_res.error) return false;
    await syncNotifToggles();
    return true;
  } catch (e) { console.log('Push setup failed', e); return false; }
}

async function disablePush() {
  try {
    var _uid = await getCurrentUid();
    if (_uid) await window.supabase.from('push_subscriptions').delete().eq('user_id', _uid);
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = await reg?.pushManager.getSubscription();
    if (sub) await sub.unsubscribe();
  } catch (e) { console.log('disablePush', e); }
  await syncNotifToggles();
}
window.setupPush = setupPush;
window.disablePush = disablePush;

window.handlePushToggle = async (el) => {
  console.log('Push toggle clicked', el.checked);
  if (el.checked) {
    const ok = await window.setupPush();
    if (!ok) el.checked = false;
  } else {
    await window.disablePush();
  }
  await syncNotifToggles();
};

// Auto-restore: on login, if browser already has subscription + permission, re-save it for THIS user. No toggle tap needed.
async function autoRestorePush() {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    if (Notification.permission !== 'granted') return;
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    var _uid = await getCurrentUid();
    if (!_uid) return;
    const _res = await window.supabase.from('push_subscriptions').upsert({ user_id: _uid, subscription: sub.toJSON(), updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    console.log('Auto-restore push for', _uid, _res.error || 'OK');
    await syncNotifToggles();
  } catch(e) { console.log('autoRestorePush', e); }
}
window.autoRestorePush = autoRestorePush;

async function syncNotifToggles() {
  const pushEl = document.getElementById('t-push');
  const inappEl = document.getElementById('t-inapp');
  const statusEl = document.getElementById('notif-status');
  if (!pushEl || !inappEl) return;
  inappEl.checked = window.isInAppEnabled();
  // Check DB + real subscription, not localStorage
  const on = await isPushEnabledInDB();
  pushEl.checked = on;
  if (statusEl) {
    if (Notification.permission === 'denied') statusEl.textContent = 'Push is blocked in browser settings. Allow notifications for this site to turn it on.';
    else if (on) statusEl.textContent = 'Push is ON.';
    else statusEl.textContent = 'Push is OFF. Tap to turn on. Perm: ' + Notification.permission;
  }
}
window.syncNotifToggles = syncNotifToggles;

document.addEventListener('DOMContentLoaded', () => {
  const inappEl = document.getElementById('t-inapp');
  if (inappEl) inappEl.addEventListener('change', () => {
    window.setInAppEnabled(inappEl.checked);
    syncNotifToggles();
  });
  const settingsBtn = document.getElementById('psub-settings-btn');
  if (settingsBtn) settingsBtn.addEventListener('click', () => setTimeout(syncNotifToggles, 100));
  setTimeout(syncNotifToggles, 500);
  setTimeout(autoRestorePush, 1500);
});
try { window.supabase.auth.onAuthStateChange((ev) => { if (ev === 'SIGNED_IN') setTimeout(autoRestorePush, 1500); }); } catch(e){}

async function sendPushToUser(userId, title, body, data={}) {
  if (!userId) return;
  try {
    await fetch('https://jztfakvawduanyovbbkt.supabase.co/functions/v1/send-push', {
      method: 'POST',
      headers: { 'apikey': 'sb_publishable_Xgea70sY3vlxZQD0PTWFYQ_ySQN2K4C', 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, sender_id: data.sender_id || null, sender_photo: data.sender_photo||data.photo||null, sender_name: data.sender_name||null, icon: data.sender_photo||data.photo||null, image: data.sender_photo||data.photo||null, title: title || 'Whisper 🔔', body: body || 'You have a new message', url: data.url || '/', data })
    });
  } catch(e) { console.log('sendPush failed', e); }
}
window.sendPushToUser = sendPushToUser;

async function updateBellBadge(){
  // Single source of truth: notifications table (renderNotifBell).
  // Do NOT count chat_messages here - that made bell != inbox.
  if(window.renderNotifBell) return window.renderNotifBell();
}
window.updateBellBadge = updateBellBadge;
setInterval(updateBellBadge, 10000);
document.addEventListener('DOMContentLoaded', ()=> setTimeout(updateBellBadge, 1000));
