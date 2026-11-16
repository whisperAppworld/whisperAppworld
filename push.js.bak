const VAPID_PUBLIC_KEY = 'BLoymFpiiLWh1Eji-g3yMRNFT-7NaCMWVmqWDX-wCZcGOIFgasAXfmJ7ItHSWrQyhwa7flcJFTW4cF5yXkDQJyM';


function getPushUid(){
  try{ var mp=JSON.parse(localStorage.getItem('my_profile')||'{}'); if(mp.user_id) return mp.user_id; if(mp.id) return mp.id; }catch(e){}
  if(window._myUid) return window._myUid;
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

window.isPushEnabled = () => localStorage.getItem('whisper_push_enabled') === '1' && Notification.permission === 'granted';
window.isInAppEnabled = () => localStorage.getItem('whisper_inapp_enabled') !== '0';
window.setInAppEnabled = (on) => { localStorage.setItem('whisper_inapp_enabled', on ? '1' : '0'); };

async function setupPush() {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
    const reg = await navigator.serviceWorker.register('sw.js');
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') { localStorage.setItem('whisper_push_enabled', '0'); return false; }
    let sub = await reg.pushManager.getSubscription();
  if (sub) { try { await sub.unsubscribe(); } catch(e){} sub = null; }
    if (!sub) {
      sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) });
    }
    localStorage.setItem('whisper_push_enabled', '1');
    // DB save must never break Push - save in background
    try {
      var _uid = getPushUid();
                                        if (!_uid) { try { const { data: { user } } = await window.supabase.auth.getUser(); if (user) _uid = user.id; } catch(e){} }
                                        if (_uid) {
                                            const _res = await window.supabase.from('push_subscriptions').upsert({ user_id: _uid, subscription: sub.toJSON(), updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
                                            console.log('Push DB save', _res.error || 'OK', _uid);
                                            if (_res.error) { localStorage.setItem('whisper_push_db_error', String(_res.error.message||_res.error)); localStorage.setItem('pending_push_sub', JSON.stringify(sub.toJSON()));
                                        } else { localStorage.setItem('whisper_push_db_error','no-uid');
                                            localStorage.setItem('pending_push_sub', JSON.stringify(sub.toJSON()));
                                        }
    } catch (dbErr) { console.log('Push DB save failed, trying REST fallback', dbErr); try{ var _uid2=getPushUid(); if(_uid2){ var _r=await fetch('https://jztfakvawduanyovbbkt.supabase.co/rest/v1/push_subscriptions', {method:'POST', headers:{'apikey':'sb_publishable_Xgea70sY3vlxZQD0PTWFYQ_ySQN2K4C','Authorization':'Bearer sb_publishable_Xgea70sY3vlxZQD0PTWFYQ_ySQN2K4C','Content-Type':'application/json','Prefer':'resolution=merge-duplicates'}, body: JSON.stringify({user_id:_uid2, subscription: sub.toJSON(), updated_at: new Date().toISOString()})}); console.log('REST fallback', _r.status); if(_r.ok){ localStorage.removeItem('pending_push_sub'); return true; } else localStorage.setItem('whisper_push_db_error','REST '+_r.status+' '+(await _r.text()).slice(0,200)); } }catch(e2){ localStorage.setItem('whisper_push_db_error', String(e2.message||e2)); } console.log('Push DB save failed (Push still ON)', dbErr); localStorage.setItem('pending_push_sub', JSON.stringify(sub.toJSON())); }
    return true;
  } catch (e) { console.log('Push setup failed', e); localStorage.setItem('whisper_push_error', String(e.message || e)); localStorage.setItem('whisper_push_enabled', '0'); return false; }
}

async function disablePush() {
  localStorage.setItem('whisper_push_enabled', '0');
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = await reg?.pushManager.getSubscription();
    if (sub) await sub.unsubscribe();
  } catch (e) {}
}
window.setupPush = setupPush;
window.handlePushToggle = async (el) => {
  console.log('Push toggle clicked', el.checked);
  if (el.checked) {
    const ok = await window.setupPush();
    if (!ok) el.checked = false;
  } else {
    await window.disablePush();
  }
  syncNotifToggles();
};
window.disablePush = disablePush;

async function flushPendingPush() {
                                const pending = localStorage.getItem('pending_push_sub');
                                if (!pending) return;
                                var _uid = getPushUid();
                                if (!_uid) { try { const { data: { user } } = await window.supabase.auth.getUser(); if (user) _uid = user.id; } catch(e){} }
                                if (!_uid) return;
                                const _res = await window.supabase.from('push_subscriptions').upsert({ user_id: _uid, subscription: JSON.parse(pending), updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
                                console.log('Flush push', _res.error || 'OK');
                                if (!_res.error) localStorage.removeItem('pending_push_sub');
                            }
window.supabase.auth.onAuthStateChange(() => { flushPendingPush(); });

// --- Wire Settings toggles ---
function syncNotifToggles() {
  const pushEl = document.getElementById('t-push');
  const inappEl = document.getElementById('t-inapp');
  const statusEl = document.getElementById('notif-status');
  if (!pushEl || !inappEl) return;
  pushEl.checked = window.isPushEnabled();
  inappEl.checked = window.isInAppEnabled();
  if (statusEl) {
    if (Notification.permission === 'denied') statusEl.textContent = 'Push is blocked in browser settings. Allow notifications for this site to turn it on.';
    else if (localStorage.getItem('pending_push_sub')) statusEl.textContent = 'Push ON but NOT SAVED to DB. DB Err: ' + (localStorage.getItem('whisper_push_db_error')||'unknown') + ' | uid:' + (getPushUid()||'none');
    else if (pushEl.checked) statusEl.textContent = 'Push is ON.';
    else if (localStorage.getItem('pending_push_sub')) statusEl.textContent = 'Push ON but NOT SAVED to DB. DB Err: ' + (localStorage.getItem('whisper_push_db_error')||'unknown') + ' | uid:' + (getPushUid()||'none');
    else statusEl.textContent = 'Push is OFF. Err: ' + (localStorage.getItem('whisper_push_error')||'none') + ' | perm:' + Notification.permission;
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const pushEl = document.getElementById('t-push');
  const inappEl = document.getElementById('t-inapp');
  // push toggle handled by onchange=handlePushToggle in HTML - no duplicate listener here
  if (inappEl) inappEl.addEventListener('change', () => {
    window.setInAppEnabled(inappEl.checked);
    syncNotifToggles();
  });
  // Refresh when user opens Settings
  const settingsBtn = document.getElementById('psub-settings-btn');
  if (settingsBtn) settingsBtn.addEventListener('click', () => setTimeout(syncNotifToggles, 100));
  syncNotifToggles();
});
