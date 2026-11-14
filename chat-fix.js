// CHAT FIX - overrides app.js loadChat/sendMsg to use conversations + real user_id
let _fixConv=null;
async function fixGetUid(){
  try{ var u=await window.supabase.auth.getUser(); if(u&&u.data&&u.data.user) return u.data.user.id; }catch(e){}
  try{ var mp=JSON.parse(localStorage.getItem('my_profile')||'{}'); if(mp.user_id) return mp.user_id; }catch(e){}
  return null;
}
async function fixGetOrCreateConv(meId, otherName){
  var sb=window.supabase;
  var pr=await sb.from('profiles').select('user_id').eq('name', otherName).maybeSingle();
  var otherId=(pr&&pr.data&&pr.data.user_id)?pr.data.user_id:null;
  if(!otherId){ console.log('No user_id for', otherName); return {conv:null, otherId:null}; }
  var q=await sb.from('conversations').select('*').or('and(user1_id.eq.'+meId+',user2_id.eq.'+otherId+'),and(user1_id.eq.'+otherId+',user2_id.eq.'+meId+')').maybeSingle();
  if(q&&q.data) return {conv:q.data, otherId:otherId};
  var myName=(typeof getMyName==='function'?getMyName():'Me');
  var ins=await sb.from('conversations').insert({user1_id:meId, user2_id:otherId, user1_name:myName, user2_name:otherName}).select().single();
  if(ins.error){ console.log(ins.error); return {conv:null, otherId:otherId}; }
  return {conv:ins.data, otherId:otherId};
}
async function loadChat(){
  if(!currentChatWith) return;
  if(typeof fillSendAs==='function') fillSendAs();
  var meId=await fixGetUid();
  var meName=(typeof getMyName==='function'?getMyName():'Me');
  var list=document.getElementById('messages-list'); if(!list) return;
  if(!meId){ list.innerHTML='<div style="padding:12px">Please login first to chat</div>'; return; }
  var r=await fixGetOrCreateConv(meId, currentChatWith);
  _fixConv=r.conv; if(!_fixConv){ list.innerHTML='<div style="padding:12px">Cannot find '+currentChatWith+' yet - they need to save profile once after login</div>'; return; }
  var d=await window.supabase.from('chat_messages').select('*').eq('conversation_id',_fixConv.id).order('created_at',{ascending:true});
  var rows=d.data||[];
  list.innerHTML=rows.map(function(m){
    var mine=m.sender_id===meId;
    var txt=m.text||m.content||'';
    return '<div style="text-align:'+(mine?'right':'left')+';margin:6px 0"><span style="background:'+(mine?'#ff5a8a':'#333')+';color:white;padding:8px 12px;border-radius:14px;display:inline-block;max-width:80%">'+txt.replace(/</g,'&lt;')+'</span></div>';
  }).join('');
  list.scrollTop=list.scrollHeight;
  // realtime
  try{
    window.supabase.removeChannel(window._chatCh);
    window._chatCh=window.supabase.channel('chat-'+_fixConv.id).on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_messages',filter:'conversation_id=eq.'+_fixConv.id},function(){ loadChat(); }).subscribe();
  }catch(e){}
}
async function sendMsg(){
  var inp=document.getElementById('msg-input'); var text=inp.value.trim();
  if(!text) return; if(!currentChatWith) return;
  var meId=await fixGetUid(); if(!meId){ alert('Please login first'); return; }
  if(!_fixConv){ await loadChat(); if(!_fixConv) return; }
  var err=(await window.supabase.from('chat_messages').insert([{conversation_id:_fixConv.id, sender_id:meId, receiver_id:currentChatWith, content:text, text:text}])).error;
  if(err){ alert('Send failed: '+err.message); return; }
  await window.supabase.from('conversations').update({last_message:text, last_message_at:new Date().toISOString()}).eq('id',_fixConv.id);
  inp.value=''; loadChat();
}
window.loadChat=loadChat; window.sendMsg=sendMsg;

window.openChat=async function(name){window.currentChatWith=name;if(typeof showTab==="function")showTab("messages");await loadChat();};
document.addEventListener("click",function(e){var b=e.target.closest("button");if(b==null)return;var t=b.textContent||"";if(t.indexOf("Messages")>=0)return;if(t.indexOf("Message")<0)return;var oc=b.getAttribute("onclick")||"";var m=oc.match(/openChat\(.(.+?).\)/);var nm=m?m[1]:null;if(nm==null)return;e.stopPropagation();window.openChat(nm);});
