(function(){
var style=document.createElement('style');
style.textContent='#lp-menu{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#222;border:1px solid #444;border-radius:14px;padding:8px;z-index:9999;display:flex;gap:8px;box-shadow:0 10px 30px rgba(0,0,0,.5)}#lp-menu button{padding:10px 16px;border-radius:10px;border:0;font-size:15px;cursor:pointer;background:#333;color:#fff}#lp-menu button.del{background:#ff3b5c}#lp-menu button.edit{background:#ff5a8a}';
document.head.appendChild(style);
var timer=null, row=null, fired=false;
function clearTimer(){ if(timer){clearTimeout(timer); timer=null;} }
function hideMenu(){ var m=document.getElementById('lp-menu'); if(m) m.remove(); }
function getIndex(r){ var rows=document.querySelectorAll('#messages-list .msg-row'); for(var i=0;i<rows.length;i++){ if(rows[i]===r) return i; } return -1; }
async function getMsgByRow(r){
  var idx=getIndex(r);
  if(idx<0) return null;
  var d=await window.supabase.from('chat_messages').select('*').or('and(sender_id.eq.'+_fixMeId+',receiver_id.eq.'+_fixOtherId+'),and(sender_id.eq.'+_fixOtherId+',receiver_id.eq.'+_fixMeId+')').order('created_at',{ascending:true});
  var rows=(d&&d.data)||[];
  return rows[idx]||null;
}
async function showMenu(r){
  hideMenu();
  var msg=await getMsgByRow(r);
  if(!msg) return;
  var isImg=(msg.content||'').indexOf('IMG:')===0;
  var menu=document.createElement('div');
  menu.id='lp-menu';
  var editBtn=document.createElement('button');
  editBtn.className='edit'; editBtn.textContent='Edit';
  editBtn.onclick=function(){ hideMenu(); if(isImg){ alert('Cannot edit photos'); return; } var nv=prompt('Edit message', msg.content||''); if(nv===null) return; nv=nv.trim(); if(!nv) return; window.supabase.from('chat_messages').update({content:nv}).eq('id',msg.id).then(function(res){ if(res.error) alert('Edit failed: '+res.error.message); else if(window.loadChat) window.loadChat(true); }); };
  var delBtn=document.createElement('button');
  delBtn.className='del'; delBtn.textContent='Delete';
  delBtn.onclick=function(){ hideMenu(); if(!confirm('Delete this message?')) return; window.supabase.from('chat_messages').delete().eq('id',msg.id).then(function(res){ if(res.error) alert('Delete failed: '+res.error.message); else if(window.loadChat) window.loadChat(true); }); };
  var cancelBtn=document.createElement('button');
  cancelBtn.textContent='Cancel';
  cancelBtn.onclick=hideMenu;
  if(!isImg) menu.appendChild(editBtn);
  menu.appendChild(delBtn);
  menu.appendChild(cancelBtn);
  document.body.appendChild(menu);
}
document.addEventListener('pointerdown',function(e){
  var r=e.target.closest?e.target.closest('#messages-list .msg-row.mine'):null;
  if(!r) return;
  row=r; fired=false; clearTimer();
  timer=setTimeout(function(){ fired=true; if(navigator.vibrate) try{navigator.vibrate(30);}catch(err){} showMenu(row); },500);
});
document.addEventListener('pointerup',function(){ clearTimer(); });
document.addEventListener('pointermove',function(){ clearTimer(); });
document.addEventListener('pointercancel',function(){ clearTimer(); });
document.addEventListener('click',function(e){ if(!e.target.closest || !e.target.closest('#lp-menu')) hideMenu(); });
})();
