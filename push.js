const VAPID_PUBLIC_KEY = 'BITwRuSeGTwCitRmZ5ALbVtVCZ1XpjqBGcoJ7Z5nWzKYwUGyty8n6gcmV_4-XYWCNRNJZIwVAJPBSDZkHaql7No';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

async function setupPush() {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    const reg = await navigator.serviceWorker.register('sw.js');
    alert('SW OK'); console.log('SW registered', reg);
    alert('Asking permission...'); const perm = await Notification.requestPermission(); alert('Permission: ' + perm);
    if (perm !== 'granted') return;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }
    console.log('Push subscription:', JSON.stringify(sub));
    // Save to Supabase - will work after you create push_subscriptions table
    const { data: { user } } = await window.supabase.auth.getUser();
    if (user) {
      await window.supabase.from('push_subscriptions').upsert({
        user_id: user.id,
        subscription: sub.toJSON(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
      console.log('Push subscription saved for', user.id);
    } else {
      localStorage.setItem('pending_push_sub', JSON.stringify(sub.toJSON()));
    }
  } catch (e) { alert('Push failed: ' + e.message); console.log('Push setup failed', e); }
}

// Run after login / on load
window.addEventListener('load', () => {
  setTimeout(setupPush, 2000);
});
window.setupPush = setupPush;

// Flush pending subscription after login
async function flushPendingPush() {
  const pending = localStorage.getItem('pending_push_sub');
  if (!pending) return;
  const { data: { user } } = await window.supabase.auth.getUser();
  if (!user) return;
  await window.supabase.from('push_subscriptions').upsert({
    user_id: user.id,
    subscription: JSON.parse(pending),
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' });
  localStorage.removeItem('pending_push_sub');
  console.log('Pending push subscription flushed');
}
window.supabase.auth.onAuthStateChange(() => { flushPendingPush(); });

// Show Enable button if permission not granted yet
(function addEnableBtn(){
  if (Notification.permission === 'granted') return;
  const btn = document.createElement('button');
  btn.textContent = '🔔 Enable Notifications';
  btn.style.cssText = 'position:fixed;bottom:90px;right:12px;z-index:9999;padding:12px 14px;border-radius:999px;border:none;background:#ff2d55;color:#fff;font-weight:bold;box-shadow:0 4px 14px rgba(0,0,0,.4)';
  btn.onclick = async () => { await setupPush(); btn.remove(); };
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(btn));
  if (document.body) document.body.appendChild(btn);
})();
