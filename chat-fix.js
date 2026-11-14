// CHAT FIX v4 - uses chat_messages(sender_id, receiver_id, content)
let _fixOtherId = null;
async function fixGetUid(){
  try{ var u=await window.supabase.auth.getUser(); if(u&&u.data&&u.data.user) return u.data.user.id; }catch(e){}
  try{ var mp=JSON.parse(localStorage.getItem('my_profile')||'{}'); if(mp.user_id) return mp.user_id; }catch(e){}
  return null;
}
async function fixGetOtherId(otherName){
  var sb=window.supabase;
  var pr=await sb.from('profiles').select('user_id').eq('name', otherName).maybeSingle();
  if(pr&&pr.data&&pr.data.user_id) return pr.data.user_id;
  return null;
}
async function loadChat(){
  if(!window.currentChatWith) return;
  var list=document.getElementById('messages-list'); if(!list) return;
  var meId=await fixGetUid();
  if(!meId){ list.innerHTML='<div style="padding:12px">Please login first to chat</div>'; return; }
  _fixOtherId=await fixGetOtherId(window.currentChatWith);
  if(!_fixOtherId){ list.innerHTML='<div style="padding:12px">Cannot find '+window.currentChatWith+' yet - they need to save profile once after login</div>'; return; }
  var d=await window.supabase.from('chat_messages').select('*').or('and(sender_id.eq.'+meId+',receiver_id.eq.'+_fixOtherId+'),and(sender_id.eq.'+_fixOtherId+',receiver_id.eq.'+meId+')').order('created_at',{ascending:true});
  var rows=d.data||[];
  list.innerHTML=rows.map(function(m){
    var mine=m.sender_id===meId;
    var txt=m.content||'';
    return '<div style="text-align:'+(mine?'right':'left')+';margin:6px 0"><span style="background:'+(mine?'#ff5a8a':'#333')+';color:white;padding:8px 12px;border-radius:14px;display:inline-block;max-width:80%">'+txt.replace(/</g,'&lt;')+'</span></div>';
  }).join('') || '<div style="padding:12px;color:#888">No messages yet - say hi!</div>';
  list.scrollTop=list.scrollHeight;
  try{
    window.supabase.removeChannel(window._chatCh);
    window._chatCh=window.supabase.channel('chat-'+meId+'-'+_fixOtherId).on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_messages'},function(){ loadChat(); }).subscribe();
  }catch(e){}
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
  var tt=document.getElementById("chat-title"); if(tt) tt.textContent="Chat with "+name;
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
