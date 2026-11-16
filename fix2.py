import pathlib
# 1. sw.js - remove big image
p=pathlib.Path("sw.js"); t=p.read_text()
t=t.replace(", image: icon !== fallbackIcon ? icon : undefined", "")
p.write_text(t)
# 2. index.html - top bell opens full inbox
p=pathlib.Path("index.html"); t=p.read_text()
t=t.replace("onclick=\"showTab('messages')\"", "onclick=\"openNotifInbox()\"")
p.write_text(t)
# 3. notifications.js - reuse top bell, delete second bell
p=pathlib.Path("notifications.js"); t=p.read_text()
old="""async function renderNotifBell(){
  var uid=await notifGetUid(); if(!uid) return;
  var r=await window.supabase.from('notifications').select('id').eq('user_id',uid).eq('is_read',false);
  var n=(r.data||[]).length;
  var bell=document.getElementById('notif-bell');
  if(!bell){ bell=document.createElement('button'); bell.id='notif-bell'; bell.style.cssText='position:relative;font-size:22px;background:none;border:0;cursor:pointer'; bell.onclick=openNotifInbox; var header=document.querySelector('header')||document.body; header.appendChild(bell); }
  bell.innerHTML='🔔'+(n?'<span style="position:absolute;top:-4px;right:-4px;background:#ff5a8a;color:#fff;font-size:10px;min-width:18px;height:18px;border-radius:9px;display:flex;align-items:center;justify-content:center;padding:0 4px">'+n+'</span>':'');
}"""
new="""async function renderNotifBell(){
  var old=document.getElementById('notif-bell'); if(old) old.remove();
  var uid=await notifGetUid(); if(!uid) return;
  var r=await window.supabase.from('notifications').select('id').eq('user_id',uid).eq('is_read',false);
  var n=(r.data||[]).length;
  var el=document.getElementById('bell-badge'); if(!el) return;
  if(n>0){ el.style.display='block'; el.textContent=n>99?'99+':String(n); } else { el.style.display='none'; }
}"""
assert old in t, "renderNotifBell not found"
t=t.replace(old,new)
p.write_text(t)
print("patched OK")
