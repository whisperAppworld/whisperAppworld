const VAPID_PUBLIC_KEY = 'BB0X3OuIloyBI9zBzwpjGgGmWCiVu4-5e5XQx_nNjHSg3tqGdNMvfbrux_80FWVyJneoSxHASib-Jr7090J4HgU';

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
    if (!sub) {
      sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) });
    }
    localStorage.setItem('whisper_push_enabled', '1');
    // DB save must never break Push - save in background
    try {
      const { data: { user } } = await window.supabase.auth.getUser();
      if (user) {
        await window.supabase.from('push_subscriptions').upsert({ user_id: user.id, subscription: sub.toJSON(), updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
      } else {
        localStorage.setItem('pending_push_sub', JSON.stringify(sub.toJSON()));
      }
    } catch (dbErr) { console.log('Push DB save failed (Push still ON)', dbErr); localStorage.setItem('pending_push_sub', JSON.stringify(sub.toJSON())); }
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
window.disablePush = disablePush;

async function flushPendingPush() {
  const pending = localStorage.getItem('pending_push_sub');
  if (!pending) return;
  const { data: { user } } = await window.supabase.auth.getUser();
  if (!user) return;
  await window.supabase.from('push_subscriptions').upsert({ user_id: user.id, subscription: JSON.parse(pending), updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
  localStorage.removeItem('pending_push_sub');
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
    else if (pushEl.checked) statusEl.textContent = 'Push is ON.';
    else statusEl.textContent = 'Push is OFF. Err: ' + (localStorage.getItem('whisper_push_error')||'none') + ' | perm:' + Notification.permission;
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const pushEl = document.getElementById('t-push');
  const inappEl = document.getElementById('t-inapp');
  if (pushEl) pushEl.addEventListener('change', async () => {
    if (pushEl.checked) {
      const ok = await window.setupPush();
      if (!ok) pushEl.checked = false;
    } else {
      await window.disablePush();
    }
    syncNotifToggles();
  });
  if (inappEl) inappEl.addEventListener('change', () => {
    window.setInAppEnabled(inappEl.checked);
    syncNotifToggles();
  });
  // Refresh when user opens Settings
  const settingsBtn = document.getElementById('psub-settings-btn');
  if (settingsBtn) settingsBtn.addEventListener('click', () => setTimeout(syncNotifToggles, 100));
  syncNotifToggles();
});
