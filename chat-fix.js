// CHAT FIX v5 - dating-app style chat header + bubbles
let _fixOtherId=null, _fixOtherProfile=null;
async function fixGetUid(){
  try{ var u=await window.supabase.auth.getUser(); if(u&&u.data&&u.data.user) return u.data.user.id; }catch(e){}
  try{ var mp=JSON.parse(localStorage.getItem('my_profile')||'{}'); if(mp.user_id) return mp.user_id; }catch(e){}
  return null;
}
function fixTime(t){ try{ var d=new Date(t); return d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); }catch(e){ return ''; } }
function fixStyle(){
  if(document.getElementById('chat-fix-style')) return;
  var s=document.createElement('style'); s.id='chat-fix-style';
  s.textContent='#chat-view{background:#111}#chat-title{display:flex;align-items:center;gap:10px;padding:10px;background:#1a1a1a;border-radius:12px;margin-bottom:10px}#chat-title img{width:44px;height:44px;border-radius:50%;object-fit:cover}#chat-title .nm{font-weight:700;font-size:16px}#chat-title .sub{font-size:12px;color:#4ade80}#messages-list{padding:6px;display:flex;flex-direction:column;gap:8px}.msg-row{display:flex;gap:8px;align-items:flex-end;max-width:88%}.msg-row.mine{margin-left:auto;flex-direction:row-reverse}.msg-row img{width:28px;height:28px;border-radius:50%;object-fit:cover}.msg-bubble{padding:10px 13px;border-radius:18px;font-size:15px;line-height:1.4;max-width:100%;word-break:break-word}.msg-row.mine .msg-bubble{background:#ff5a8a;color:#fff;border-bottom-right-radius:6px}.msg-row:not(.mine) .msg-bubble{background:#262626;color:#fff;border-bottom-left-radius:6px}.msg-time{font-size:11px;color:#999;margin-top:3px;text-align:right}.msg-row:not(.mine) .msg-time{text-align:left}';
  document.head.appendChild(s);
}
async function loadChat(){
  if(!window.currentChatWith) return;
  fixStyle();
  var list=document.getElementById('messages-list'); if(!list) return;
  var meId=await fixGetUid();
  if(!meId){ list.innerHTML='<div style="padding:12px">Please login first to chat</div>'; return; }
  var pr=await window.supabase.from('profiles').select('*').eq('name', window.currentChatWith).maybeSingle();
  _fixOtherProfile=(pr&&pr.data)?pr.data:null;
  _fixOtherId=_fixOtherProfile?_fixOtherProfile.user_id:null;
  if(!_fixOtherId){ list.innerHTML='<div style="padding:12px">Cannot find '+window.currentChatWith+' yet</div>'; return; }
  var tt=document.getElementById('chat-title');
  if(tt){
    var img=_fixOtherProfile.img||_fixOtherProfile.photo||_fixOtherProfile.avatar||'';
    var age=_fixOtherProfile.age?(', '+_fixOtherProfile.age):'';
    tt.innerHTML=(img?'<img src="'+img+'">':'<div style="width:44px;height:44px;border-radius:50%;background:#ff5a8a;display:flex;align-items:center;justify-content:center;font-size:20px">'+window.currentChatWith.charAt(0)+'</div>')+'<div><div class="nm">'+window.currentChatWith+age+'</div><div class="sub">● Online</div></div>';
  }
  var d=await window.supabase.from('chat_messages').select('*').or('and(sender_id.eq.'+meId+',receiver_id.eq.'+_fixOtherId+'),and(sender_id.eq.'+_fixOtherId+',receiver_id.eq.'+meId+')').order('created_at',{ascending:true});
  var rows=d.data||[];
  if(!rows.length){ list.innerHTML='<div style="padding:20px;text-align:center;color:#888">No messages yet<br>Say hi to '+window.currentChatWith+' 👋</div>'; }
  else{
    list.innerHTML=rows.map(function(m){
      var mine=m.sender_id===meId;
      var txt=(m.content||'').replace(/</g,'&lt;');
      var av=mine?'':(_fixOtherProfile.img||_fixOtherProfile.photo||'');
      return '<div class="msg-row '+(mine?'mine':'')+'">'+(av?'<img src="'+av+'">':'')+'<div><div class="msg-bubble">'+txt+'</div><div class="msg-time">'+fixTime(m.created_at)+'</div></div></div>';
    }).join('');
  }
  list.scrollTop=list.scrollHeight;
  try{ window.supabase.removeChannel(window._chatCh); window._chatCh=window.supabase.channel('chat-'+meId+'-'+_fixOtherId).on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_messages'},function(){ loadChat(); }).subscribe(); }catch(e){}
}
async function sendMsg(){
  var inp=document.getElementById('msg-input'); var text=inp.value.trim();
  if(!text) return; if(!window.currentChatWith) return;
  var meId=await fixGetUid(); if(!meId){ alert('Please login first'); return; }
  if(!_fixOtherId){ await loadChat(); if(!_fixOtherId) return; }
  var err=(await window.supabase.from('chat_messages').insert([{sender_id:meId, receiver_id:_fixOtherId, content:text}])).error;
  if(err){ alert('Send failed: '+err.message); return; }
  inp.value=''; loadChat();
}
window.loadChat=loadChat; window.sendMsg=sendMsg;
window._lastOpen=0; window._lastOpenName="";
window.openChat=async function(name){
  var now=Date.now();
  if(window._lastOpenName===name && now-window._lastOpen<800) return;
  window._lastOpen=now; window._lastOpenName=name;
  window.currentChatWith=name;
  if(typeof showTab==="function") showTab("messages");
  var cv=document.getElementById("chat-view"); if(cv) cv.style.display="block";
  await loadChat();
};
document.addEventListener("click",function(e){
  var b=e.target.closest("button"); if(!b) return;
  var t=b.textContent||""; if(t.indexOf("Messages")>=0) return; if(t.indexOf("Message")<0) return;
  var oc=b.getAttribute("onclick")||""; var m=oc.match(/openChat\(.(.+?).\)/); var nm=m?m[1]:null; if(!nm) return;
  e.stopPropagation(); window.openChat(nm);
});
