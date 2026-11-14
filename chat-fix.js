// CHAT FIX v6 - Tinder-style inbox
let _fixOtherId=null,_fixOtherProfile=null,_fixMeId=null,_fixProfiles={};
async function fixGetUid(){
  try{ var u=await window.supabase.auth.getUser(); if(u&&u.data&&u.data.user) return u.data.user.id; }catch(e){}
  try{ var mp=JSON.parse(localStorage.getItem('my_profile')||'{}'); if(mp.user_id) return mp.user_id; }catch(e){}
  return null;
}
function fixTime(t){ try{ return new Date(t).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); }catch(e){ return ''; } }
function fixEsc(s){ return (s||'').replace(/</g,'&lt;'); }
function fixImg(p){ return (p&&(p.img||p.photo||p.avatar||p.image_url||''))||''; }
function fixStyle(){
  if(document.getElementById('chat-fix-style')) return;
  var s=document.createElement('style'); s.id='chat-fix-style';
  s.textContent=''+
  '#chat-list-view{display:none}#chat-list-view h3{margin:4px 0 10px}.chat-row{display:flex;gap:12px;align-items:center;padding:10px;border-radius:14px;background:#1a1a1a;margin-bottom:8px;cursor:pointer}.chat-row img,.chat-row .av{width:52px;height:52px;border-radius:50%;object-fit:cover;flex-shrink:0}.chat-row .av{background:#ff5a8a;display:flex;align-items:center;justify-content:center;font-size:22px}.chat-row .meta{flex:1;min-width:0}.chat-row .top{display:flex;justify-content:space-between}.chat-row .nm{font-weight:700}.chat-row .tm{font-size:11px;color:#999}.chat-row .prev{font-size:13px;color:#aaa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chat-row .unread{background:#ff5a8a;color:#fff;font-size:11px;min-width:20px;height:20px;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:0 5px}'+
  '#chat-view{background:#111;border-radius:14px;padding:10px}#chat-title{display:flex;align-items:center;gap:10px;padding:6px 2px}#chat-title img{width:44px;height:44px;border-radius:50%;object-fit:cover;cursor:pointer}#chat-title .nm{font-weight:700;font-size:16px}#chat-title .sub{font-size:12px;color:#4ade80}#chat-title .spacer{flex:1}#chat-title .iconbtn{background:#222;border:0;color:#fff;width:36px;height:36px;border-radius:50%;font-size:16px;cursor:pointer}'+
  '#messages-list{padding:6px;display:flex;flex-direction:column;gap:8px;max-height:55vh;overflow-y:auto}.msg-row{display:flex;gap:8px;align-items:flex-end;max-width:88%}.msg-row.mine{margin-left:auto;flex-direction:row-reverse}.msg-row img{width:28px;height:28px;border-radius:50%;object-fit:cover}.msg-bubble{padding:10px 13px;border-radius:18px;font-size:15px;line-height:1.4;word-break:break-word}.msg-row.mine .msg-bubble{background:#ff5a8a;color:#fff;border-bottom-right-radius:6px}.msg-row:not(.mine) .msg-bubble{background:#262626;color:#fff;border-bottom-left-radius:6px}.msg-time{font-size:11px;color:#999;margin-top:3px;text-align:right}.msg-row:not(.mine) .msg-time{text-align:left}'+
  '#chat-input-bar{display:flex;gap:8px;align-items:center;background:#1e1e1e;border-radius:26px;padding:6px 6px 6px 10px;margin-top:10px}#chat-input-bar input{flex:1;background:transparent;border:0;outline:none;color:#fff;font-size:15px}#chat-input-bar button{background:#ff5a8a;border:0;color:#fff;width:38px;height:38px;border-radius:50%;font-size:16px;cursor:pointer}#chat-input-bar .tool{background:transparent;color:#aaa}'+
  '#fix-profile-modal{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;display:none;align-items:flex-end;justify-content:center}#fix-profile-modal .card{background:#1a1a1a;width:100%;max-width:420px;border-radius:20px 20px 0 0;overflow:hidden;padding-bottom:20px}#fix-profile-modal img{width:100%;height:320px;object-fit:cover}';
  document.head.appendChild(s);
}
function fixSetup(){
  fixStyle();
  var cv=document.getElementById('chat-view'); if(!cv) return;
  if(!document.getElementById('chat-list-view')){
    var lv=document.createElement('div'); lv.id='chat-list-view';
    lv.innerHTML='<h3>💬 Messages</h3><div id="chat-list"></div><p style="color:#888;font-size:13px">Tap a person to open chat. Tap their photo to see profile.</p>';
    cv.parentNode.insertBefore(lv,cv);
  }
  // Wrap input+button into a real input bar
  var inp=document.getElementById('msg-input'); var btn=inp?inp.nextElementSibling:null;
  if(inp && !document.getElementById('chat-input-bar')){
    var bar=document.createElement('div'); bar.id='chat-input-bar';
    var emoji=document.createElement('button'); emoji.className='tool'; emoji.type='button'; emoji.textContent='😀';
    emoji.onclick=function(){ inp.value+='😍'; inp.focus(); };
    var photo=document.createElement('button'); photo.className='tool'; photo.type='button'; photo.textContent='📷';
    photo.onclick=function(){ alert('Photo messages coming next — for now send text / emoji'); };
    inp.parentNode.insertBefore(bar,inp); bar.appendChild(emoji); bar.appendChild(photo); bar.appendChild(inp); if(btn) bar.appendChild(btn);
    btn.textContent='➤';
  }
  // Profile modal
  if(!document.getElementById('fix-profile-modal')){
    var m=document.createElement('div'); m.id='fix-profile-modal'; m.onclick=function(e){ if(e.target===m) m.style.display='none'; };
    m.innerHTML='<div class="card"><div id="fix-profile-body"></div><button onclick="document.getElementById(\'fix-profile-modal\').style.display=\'none\'" style="width:90%;margin:12px 5%;padding:12px;border-radius:12px;border:0;background:#333;color:#fff">Close</button></div>';
    document.body.appendChild(m);
  }
  // Intercept showTab for messages -> show list
  if(typeof showTab==='function' && !window._fixShowTabWrapped){
    window._fixShowTabWrapped=true; var orig=showTab;
    window.showTab=function(name){ orig(name); if(name==='messages'){ showChatList(); } };
  }
}
async function fixLoadProfiles(){
  var r=await window.supabase.from('profiles').select('*');
  _fixProfiles={}; (r.data||[]).forEach(function(p){ _fixProfiles[p.user_id]=p; });
}
async function showChatList(){
  fixSetup();
  var lv=document.getElementById('chat-list-view'); var cv=document.getElementById('chat-view');
  if(lv) lv.style.display='block'; if(cv) cv.style.display='none';
  var list=document.getElementById('chat-list'); if(!list) return;
  _fixMeId=await fixGetUid(); if(!_fixMeId){ list.innerHTML='<div style="padding:12px">Please login first</div>'; return; }
  await fixLoadProfiles();
  var d=await window.supabase.from('chat_messages').select('*').or('sender_id.eq.'+_fixMeId+',receiver_id.eq.'+_fixMeId).order('created_at',{ascending:false});
  var rows=d.data||[];
  if(!rows.length){ list.innerHTML='<div style="padding:20px;text-align:center;color:#888">No chats yet.<br>Go to Discover and tap Message on someone 💖</div>'; return; }
  var seen={}, convos=[];
  rows.forEach(function(m){
    var other=m.sender_id===_fixMeId?m.receiver_id:m.sender_id;
    if(!seen[other]){ seen[other]=true; convos.push({other:other,last:m}); }
  });
  list.innerHTML=convos.map(function(c){
    var p=_fixProfiles[c.other]||{name:'Unknown'};
    var nm=p.name||'Unknown'; var img=fixImg(p);
    var lastRead=parseInt(localStorage.getItem('read_'+c.other)||'0');
    var unread=rows.filter(function(m){ return m.sender_id===c.other && new Date(m.created_at).getTime()>lastRead; }).length;
    var av=img?'<img src="'+img+'" onclick="event.stopPropagation();fixShowProfileById(\''+c.other+'\')">':'<div class="av" onclick="event.stopPropagation();fixShowProfileById(\''+c.other+'\')">'+fixEsc(nm.charAt(0))+'</div>';
    return '<div class="chat-row" onclick="window.openChat(\''+fixEsc(nm)+'\')">'+av+'<div class="meta"><div class="top"><span class="nm">'+fixEsc(nm)+(p.age?', '+p.age:'')+'</span><span class="tm">'+fixTime(c.last.created_at)+'</span></div><div class="prev">'+(c.last.sender_id===_fixMeId?'You: ':'')+fixEsc(c.last.content)+'</div></div>'+(unread?'<div class="unread">'+unread+'</div>':'')+'</div>';
  }).join('');
}
function fixShowProfileById(uid){
  var p=_fixProfiles[uid]; if(!p) return; fixShowProfile(p);
}
function fixShowProfile(p){
  var m=document.getElementById('fix-profile-modal'); var b=document.getElementById('fix-profile-body');
  var img=fixImg(p);
  b.innerHTML=(img?'<img src="'+img+'">':'')+'<div style="padding:16px"><h2 style="margin:0">'+fixEsc(p.name)+(p.age?', '+p.age:'')+'</h2><p style="color:#aaa">'+fixEsc(p.location||p.country||'')+'</p><p>'+fixEsc(p.bio||p.about||'No bio yet')+'</p><button onclick="document.getElementById(\'fix-profile-modal\').style.display=\'none\';window.openChat(\''+fixEsc(p.name)+'\')" style="width:100%;padding:12px;border-radius:12px;border:0;background:#ff5a8a;color:#fff;font-weight:700">💬 Message</button></div>';
  m.style.display='flex';
}
window.fixShowProfileById=fixShowProfileById; window.fixShowProfile=fixShowProfile;
async function loadChat(){
  if(!window.currentChatWith) return; fixSetup();
  var lv=document.getElementById('chat-list-view'); if(lv) lv.style.display='none';
  var cv=document.getElementById('chat-view'); if(cv) cv.style.display='block';
  var list=document.getElementById('messages-list'); if(!list) return;
  _fixMeId=await fixGetUid(); if(!_fixMeId) return;
  await fixLoadProfiles();
  var pr=await window.supabase.from('profiles').select('*').eq('name', window.currentChatWith).maybeSingle();
  _fixOtherProfile=(pr&&pr.data)?pr.data:null; _fixOtherId=_fixOtherProfile?_fixOtherProfile.user_id:null;
  if(!_fixOtherId){ list.innerHTML='<div style="padding:12px">Cannot find '+window.currentChatWith+'</div>'; return; }
  localStorage.setItem('read_'+_fixOtherId, Date.now().toString());
  var tt=document.getElementById('chat-title');
  if(tt){
    var img=fixImg(_fixOtherProfile);
    tt.innerHTML='<button class="iconbtn" onclick="showChatList()">←</button>'+(img?'<img src="'+img+'" onclick="fixShowProfileById(\''+_fixOtherId+'\')">':'<div style="width:44px;height:44px;border-radius:50%;background:#ff5a8a;display:flex;align-items:center;justify-content:center" onclick="fixShowProfileById(\''+_fixOtherId+'\')">'+fixEsc(window.currentChatWith.charAt(0))+'</div>')+'<div><div class="nm">'+fixEsc(window.currentChatWith)+(_fixOtherProfile.age?', '+_fixOtherProfile.age:'')+'</div><div class="sub">● Online</div></div><div class="spacer"></div><button class="iconbtn" onclick="fixBlock()">🛡️</button>';
  }
  var d=await window.supabase.from('chat_messages').select('*').or('and(sender_id.eq.'+_fixMeId+',receiver_id.eq.'+_fixOtherId+'),and(sender_id.eq.'+_fixOtherId+',receiver_id.eq.'+_fixMeId+')').order('created_at',{ascending:true});
  var rows=d.data||[];
  list.innerHTML=rows.length?rows.map(function(m){
    var mine=m.sender_id===_fixMeId; var av=mine?'':fixImg(_fixOtherProfile);
    return '<div class="msg-row '+(mine?'mine':'')+'">'+(av?'<img src="'+av+'">':'')+'<div><div class="msg-bubble">'+fixEsc(m.content)+'</div><div class="msg-time">'+fixTime(m.created_at)+'</div></div></div>';
  }).join(''):'<div style="padding:20px;text-align:center;color:#888">No messages yet<br>Say hi to '+fixEsc(window.currentChatWith)+' 👋</div>';
  list.scrollTop=list.scrollHeight;
  try{ window.supabase.removeChannel(window._chatCh); window._chatCh=window.supabase.channel('chat-'+_fixMeId+'-'+_fixOtherId).on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_messages'},function(){ loadChat(); }).subscribe(); }catch(e){}
}
function fixBlock(){
  if(!confirm('Block '+window.currentChatWith+'? You will no longer see their messages.')) return;
  var b=JSON.parse(localStorage.getItem('blocked')||'[]'); if(_fixOtherId && b.indexOf(_fixOtherId)<0) b.push(_fixOtherId);
  localStorage.setItem('blocked',JSON.stringify(b)); alert('Blocked '+window.currentChatWith); showChatList();
}
window.fixBlock=fixBlock;
async function sendMsg(){
  var inp=document.getElementById('msg-input'); var text=inp.value.trim();
  if(!text) return; if(!window.currentChatWith) return;
  var meId=await fixGetUid(); if(!meId){ alert('Please login first'); return; }
  if(!_fixOtherId){ await loadChat(); if(!_fixOtherId) return; }
  var err=(await window.supabase.from('chat_messages').insert([{sender_id:meId, receiver_id:_fixOtherId, content:text}])).error;
  if(err){ alert('Send failed: '+err.message); return; }
  inp.value=''; loadChat();
}
window.loadChat=loadChat; window.sendMsg=sendMsg; window.showChatList=showChatList;
window._lastOpen=0; window._lastOpenName="";
window.openChat=async function(name){
  var now=Date.now(); if(window._lastOpenName===name && now-window._lastOpen<800) return;
  window._lastOpen=now; window._lastOpenName=name; window.currentChatWith=name;
  if(typeof showTab==="function") showTab("messages");
  await loadChat();
};
document.addEventListener("click",function(e){
  var b=e.target.closest("button"); if(!b) return;
  var t=b.textContent||""; if(t.indexOf("Messages")>=0) return; if(t.indexOf("Message")<0) return;
  var oc=b.getAttribute("onclick")||""; var m=oc.match(/openChat\(.(.+?).\)/); var nm=m?m[1]:null; if(!nm) return;
  e.stopPropagation(); window.openChat(nm);
});
document.addEventListener("DOMContentLoaded",fixSetup); fixSetup();
