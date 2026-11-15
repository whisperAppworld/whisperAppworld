// CHAT FIX v7 - fast, no race, verified, emoji picker, scroll profile
let _fixOtherId=null,_fixOtherProfile=null,_fixMeId=null,_fixProfiles={},_fixProfPromise=null,_fixProfTime=0,_fixLoadToken=0,_fixOpening=false,_fixEmojiOpen=false;
async function fixGetUid(){
  try{ var u=await window.supabase.auth.getUser(); if(u&&u.data&&u.data.user) return u.data.user.id; }catch(e){}
  try{ var mp=JSON.parse(localStorage.getItem('my_profile')||'{}'); if(mp.user_id) return mp.user_id; }catch(e){}
  return null;
}
function fixTime(t){ try{ return new Date(t).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); }catch(e){ return ''; } }
function fixEsc(s){ return (s||'').replace(/</g,'&lt;'); }
function fixImg(p){ return (p&&(p.img||p.photo||p.avatar||p.image_url||''))||''; }
function fixIsVerified(p){ if(!p) return false; if(p.photo_verified||p.email_verified) return true; try{ var all=JSON.parse(localStorage.getItem('all_profiles')||'[]'); var f=all.find(function(x){return x&&x.name===p.name;}); if(f&&(f.photo_verified||f.email_verified)) return true; }catch(e){} return false; }
function fixBadge(p){ return fixIsVerified(p)?' <span style="color:#38bdf8;font-size:14px" title="Verified"><svg width="16" height="16" viewBox="0 0 24 24" style="vertical-align:-3px;margin-left:4px;display:inline-block"><circle cx="12" cy="12" r="10.5" fill="#0095F6"/><path d="M17.2 7.8L10.6 14.4L7 10.8" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span>':''; }
function fixStyle(){
  if(document.getElementById('chat-fix-style')) return;
  var s=document.createElement('style'); s.id='chat-fix-style';
  s.textContent=''+
  '#chat-list-view{display:none}.chat-row{display:flex;gap:12px;align-items:center;padding:10px;border-radius:14px;background:#1a1a1a;margin-bottom:8px;cursor:pointer}.chat-row img,.chat-row .av{width:52px;height:52px;border-radius:50%;object-fit:cover;flex-shrink:0}.chat-row .av{background:#ff5a8a;display:flex;align-items:center;justify-content:center;font-size:22px}.chat-row .meta{flex:1;min-width:0}.chat-row .top{display:flex;justify-content:space-between}.chat-row .nm{font-weight:700}.chat-row .tm{font-size:11px;color:#999}.chat-row .prev{font-size:13px;color:#aaa;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.chat-row .unread{background:#ff5a8a;color:#fff;font-size:11px;min-width:20px;height:20px;border-radius:10px;display:flex;align-items:center;justify-content:center;padding:0 5px}'+
  '#tab-messages{width:auto;max-width:none;box-sizing:border-box;padding:0;margin:-16px -16px 0}#chat-view{border-radius:0 !important;min-height:calc(100dvh - 130px)}#messages-list{padding:10px 12px}#messages-list>div{max-width:100%}#chat-view{background:#111;border-radius:14px;padding:10px;width:100%;max-width:100%;box-sizing:border-box;margin:0}#messages-list{width:100%;box-sizing:border-box}#chat-input-bar{width:100%;box-sizing:border-box}#chat-title{display:flex;align-items:center;gap:10px;padding:12px 12px;width:100%;box-sizing:border-box;overflow:hidden;min-height:60px;flex-shrink:0;margin:0 0 4px 0;background:transparent}#chat-title .namewrap{flex:1;min-width:0;overflow:hidden}#chat-title img{width:40px;height:40px;border-radius:50%;object-fit:cover;cursor:pointer;flex-shrink:0;flex:none}#chat-title .nm{font-weight:700;font-size:16px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#chat-title .sub{font-size:12px;color:#4ade80}#chat-title .spacer{flex:1}#chat-title .iconbtn{background:transparent;border:0;color:#fff;width:32px;height:32px;min-width:32px;border-radius:50%;font-size:18px;font-weight:700;cursor:pointer;flex-shrink:0;flex:none;display:flex;align-items:center;justify-content:center;padding:0}'+
  '#messages-list{padding:6px;display:flex;flex-direction:column;gap:8px;max-height:55vh;overflow-y:auto}.msg-row{display:flex;gap:8px;align-items:flex-end;max-width:88%}.msg-row.mine{margin-left:auto;flex-direction:row-reverse}.msg-row img{width:28px;height:28px;border-radius:50%;object-fit:cover}.msg-bubble{padding:10px 13px;border-radius:18px;font-size:15px;line-height:1.4;word-break:break-word}.msg-row.mine .msg-bubble{background:#ff5a8a;color:#fff;border-bottom-right-radius:6px}.msg-row:not(.mine) .msg-bubble{background:#262626;color:#fff;border-bottom-left-radius:6px}.msg-time{font-size:11px;color:#999;margin-top:3px;text-align:right}.msg-row:not(.mine) .msg-time{text-align:left}'+
  '#chat-input-bar{display:flex;gap:8px;align-items:center;background:#1e1e1e;border-radius:26px;padding:6px 6px 6px 10px;margin-top:10px;position:relative}#chat-input-bar input{flex:1;background:transparent;border:0;outline:none;color:#fff;font-size:15px}#chat-input-bar button{background:#ff5a8a;border:0;color:#fff;width:38px;height:38px;border-radius:50%;font-size:16px;cursor:pointer}#chat-input-bar .tool{background:transparent;color:#aaa}'+
  '#fix-emoji-picker{display:none;position:absolute;bottom:48px;left:0;background:#222;border-radius:14px;padding:10px;grid-template-columns:repeat(6,1fr);gap:6px;z-index:99}#fix-emoji-picker span{font-size:22px;cursor:pointer;text-align:center}'+
  '#fix-profile-modal{position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:9999;display:none;align-items:flex-end;justify-content:center}#fix-profile-modal .card{background:#1a1a1a;width:100%;max-width:420px;max-height:88vh;overflow-y:auto;border-radius:20px 20px 0 0;padding-bottom:20px}#fix-profile-modal img.main{width:100%;height:320px;object-fit:cover}';
  document.head.appendChild(s);
}
function fixSetup(){
  fixStyle();
  var cv=document.getElementById('chat-view'); if(!cv) return;
  if(!document.getElementById('chat-list-view')){
    var lv=document.createElement('div'); lv.id='chat-list-view';
    lv.innerHTML='<div id="chat-list"></div><p style="color:#888;font-size:13px">Tap a person to open chat. Tap their photo to see profile.</p>';
    cv.parentNode.insertBefore(lv,cv);
  }
  var inp=document.getElementById('msg-input'); var btn=inp?inp.nextElementSibling:null;
  if(inp && !document.getElementById('chat-input-bar')){
    var bar=document.createElement('div'); bar.id='chat-input-bar';
    var picker=document.createElement('div'); picker.id='fix-emoji-picker';
    '😍😘❤️🔥😂😊😉😎🥰😋🤗👋🙏💖✨🎉🌹💋😍'.split('').forEach(function(){});
    var emojis=['😍','😘','❤️','🔥','😂','😊','😉','😎','🥰','😋','🤗','👋','🙏','💖','✨','🎉','🌹','💋','😢','😡','👍','👀','💯','🥂','🎂','⚽','🎵','✈️','🏖️','🍷'];
    emojis.forEach(function(e){ var sp=document.createElement('span'); sp.textContent=e; sp.onclick=function(){ inp.value+=e; inp.focus(); }; picker.appendChild(sp); });
    var emoji=document.createElement('button'); emoji.className='tool'; emoji.type='button'; emoji.textContent='😀';
    emoji.onclick=function(ev){ ev.stopPropagation(); _fixEmojiOpen=!_fixEmojiOpen; picker.style.display=_fixEmojiOpen?'grid':'none'; };
    var photo=document.createElement('button'); photo.className='tool'; photo.type='button'; photo.textContent='📷';
    photo.onclick=function(){ alert('Photo messages coming next — for now send text / emoji'); };
    inp.parentNode.insertBefore(bar,inp); bar.appendChild(emoji); bar.appendChild(photo); bar.appendChild(inp); if(btn) bar.appendChild(btn); bar.appendChild(picker);
    btn.textContent='➤';
    document.addEventListener('click',function(){ if(_fixEmojiOpen){ _fixEmojiOpen=false; picker.style.display='none'; } });
  }
  if(!document.getElementById('fix-profile-modal')){
    var m=document.createElement('div'); m.id='fix-profile-modal'; m.onclick=function(e){ if(e.target===m) m.style.display='none'; };
    m.innerHTML='<div class="card"><div id="fix-profile-body"></div><button onclick="document.getElementById(\'fix-profile-modal\').style.display=\'none\'" style="width:90%;margin:12px 5%;padding:12px;border-radius:12px;border:0;background:#333;color:#fff">Close</button></div>';
    document.body.appendChild(m);
  }
  if(typeof showTab==='function' && !window._fixShowTabWrapped){
    window._fixShowTabWrapped=true; var orig=showTab;
    window.showTab=function(name){ orig(name); if(name==='messages' && !_fixOpening){ showChatList(); } };
  }
  // Restore verified in Discover / People after they render
  if(!window._fixVerifiedWrapped){
    window._fixVerifiedWrapped=true;
    ['renderSwipe','renderPeople'].forEach(function(fn){
      if(typeof window[fn]==='function'){ var o=window[fn]; window[fn]=function(){ var r=o.apply(this,arguments); setTimeout(fixAddVerifiedBadges,80); return r; }; }
    });
  }
}
async function fixLoadProfiles(force){
  if(!force && Date.now()-_fixProfTime<60000 && Object.keys(_fixProfiles).length) return _fixProfiles;
  if(_fixProfPromise) return _fixProfPromise;
  _fixProfPromise=(async function(){
    var r=await window.supabase.from('profiles').select('*');
    _fixProfiles={}; (r.data||[]).forEach(function(p){ _fixProfiles[p.user_id]=p; });
    _fixProfTime=Date.now(); _fixProfPromise=null; return _fixProfiles;
  })();
  return _fixProfPromise;
}
function fixAddVerifiedBadges(){
  try{
    fixLoadProfiles().then(function(){
      document.querySelectorAll('#swipe-card, #discover-list, #tab-people, #tab-discover').forEach(function(root){
        root.querySelectorAll('b, strong, h3, .name').forEach(function(el){
          if(el.dataset.fixV) return; var txt=el.textContent||''; if(!txt) return;
          var prof=Object.values(_fixProfiles).find(function(p){ return p.name && txt.indexOf(p.name)>=0; });
          /* duplicate badge injector DISABLED - badge already in index.html, was causing double + flash */
        });
      });
    });
  }catch(e){}
}
async function showChatList(){
  fixSetup();
  var lv=document.getElementById('chat-list-view'); var cv=document.getElementById('chat-view');
  if(lv) lv.style.display='block'; if(cv) cv.style.display='none';
  var list=document.getElementById('chat-list'); if(!list) return;
  var myToken=++_fixLoadToken;
  _fixMeId=await fixGetUid(); if(myToken!==_fixLoadToken) return;
  if(!_fixMeId){ list.innerHTML='<div style="padding:12px">Please login first</div>'; return; }
  list.innerHTML='<div style="padding:20px;text-align:center;color:#888">⏳ Loading chats...</div>';
  await fixLoadProfiles();
  var d=await window.supabase.from('chat_messages').select('*').or('sender_id.eq.'+_fixMeId+',receiver_id.eq.'+_fixMeId).order('created_at',{ascending:false});
  if(myToken!==_fixLoadToken) return;
  var rows=d.data||[];
  if(!rows.length){ list.innerHTML='<div style="padding:20px;text-align:center;color:#888">No chats yet.<br>Go to Discover and tap Message on someone 💖</div>'; return; }
  var seen={}, convos=[];
  rows.forEach(function(m){ var other=m.sender_id===_fixMeId?m.receiver_id:m.sender_id; if(!seen[other]){ seen[other]=true; convos.push({other:other,last:m}); } });
  list.innerHTML=convos.map(function(c){
    var p=_fixProfiles[c.other]||{name:'Unknown'}; var nm=p.name||'Unknown'; var img=fixImg(p);
    var lastRead=parseInt(localStorage.getItem('read_'+c.other)||'0');
    var unread=rows.filter(function(m){ return m.sender_id===c.other && new Date(m.created_at).getTime()>lastRead; }).length;
    var av=img?'<img src="'+img+'" onclick="event.stopPropagation();fixShowProfileById(\''+c.other+'\')">':'<div class="av" onclick="event.stopPropagation();fixShowProfileById(\''+c.other+'\')">'+fixEsc(nm.charAt(0))+'</div>';
    return '<div class="chat-row" onclick="window.openChat(\''+fixEsc(nm)+'\')">'+av+'<div class="meta"><div class="top"><span class="nm">'+fixEsc(nm)+(p.age?', '+p.age:'')+fixBadge(p)+'</span><span class="tm">'+fixTime(c.last.created_at)+'</span></div><div class="prev">'+(c.last.sender_id===_fixMeId?'You: ':'')+fixEsc(c.last.content)+'</div></div>'+(unread?'<div class="unread">'+unread+'</div>':'')+'</div>';
  }).join('');
}
async function fixShowProfileById(uid){ var p=_fixProfiles[uid]||(_fixOtherId===uid?_fixOtherProfile:null); if(!p){ try{ var r=await window.supabase.from('profiles').select('*').eq('user_id',uid).maybeSingle(); if(r&&r.data){ p=r.data; _fixProfiles[uid]=p; } }catch(e){} } if(!p){ alert('Profile not found yet, try again'); return; } fixShowProfile(p); }
function fixShowProfile(p){
  var m=document.getElementById('fix-profile-modal'); var b=document.getElementById('fix-profile-body');
  try{ fixSetup(); }catch(e){}
  var img=fixImg(p); var photos=[]; try{ var _ph=p.photos; if(!_ph) photos=img?[img]:[]; else if(typeof _ph==='string'){ try{ var _j=JSON.parse(_ph); photos=Array.isArray(_j)?_j.filter(Boolean):[_ph]; }catch(e){ photos=[_ph]; } } else if(Array.isArray(_ph)) photos=_ph.filter(Boolean); else photos=img?[img]:[]; }catch(e){ photos=img?[img]:[]; }
  var ver=fixIsVerified(p)?'<div style="color:#38bdf8;font-weight:700;margin:6px 0"><svg width="16" height="16" viewBox="0 0 24 24" style="vertical-align:-3px;margin-left:4px;display:inline-block"><circle cx="12" cy="12" r="10.5" fill="#0095F6"/><path d="M17.2 7.8L10.6 14.4L7 10.8" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg> Verified Profile</div>':'<div style="color:#999;font-size:13px;margin:6px 0">Not verified yet</div>';
  var gallery=(photos&&photos.length?photos:[img]).filter(Boolean).map(function(u){ return '<img class="main" src="'+u+'" onerror="this.style.display=\'none\'">'; }).join('')||'<div style="height:220px;display:flex;align-items:center;justify-content:center;font-size:60px;background:#222">👤</div>';
  b.innerHTML=gallery+'<div style="padding:16px"><h2 style="margin:0">'+fixEsc(p.name)+(p.age?', '+p.age:'')+fixBadge(p)+'</h2>'+ver+'<p style="color:#aaa">📍 '+fixEsc(p.location||p.country||'')+' • '+fixEsc(p.gender||'')+'</p><p>'+fixEsc(p.bio||p.about||'No bio yet')+'</p><p style="color:#aaa;font-size:13px">Interests: '+fixEsc(p.interests||'-')+'<br>Language: '+fixEsc(p.language||'-')+'<br>Looking for: '+fixEsc(p.looking||p.relationship||'-')+'</p><p style="color:#888;font-size:12px">Scroll up to see all photos ↑</p><button onclick="document.getElementById(\'fix-profile-modal\').style.display=\'none\';window.openChat(\''+fixEsc(p.name)+'\')" style="width:100%;padding:12px;border-radius:12px;border:0;background:#ff5a8a;color:#fff;font-weight:700">💬 Message</button></div>';
  if(!m||!b){ alert('Profile modal missing'); return; }
  m.style.display='flex';
}
window.fixShowProfileById=fixShowProfileById; window.fixShowProfile=fixShowProfile;
function fixFmtLastSeen(ts){ if(!ts) return 'Last seen recently'; var d=new Date(ts); var diff=Date.now()-d.getTime(); if(diff<120000) return 'Online'; var sameDay=new Date().toDateString()===d.toDateString(); var hh=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'); if(sameDay) return 'Last seen today '+hh; var y=new Date(Date.now()-86400000); if(y.toDateString()===d.toDateString()) return 'Last seen yesterday '+hh; return 'Last seen '+d.toLocaleDateString()+' '+hh; }
function fixIsOnline(ts){ if(!ts) return false; return (Date.now()-new Date(ts).getTime())<120000; }
async function fixHeartbeat(){ try{ var uid=await fixGetUid(); if(!uid) return; await window.supabase.from('profiles').update({last_seen:new Date().toISOString()}).eq('user_id',uid); }catch(e){} }
if(!window._fixHb){ window._fixHb=setInterval(fixHeartbeat,30000); fixHeartbeat(); }
async function fixMarkRead(){ try{ if(!_fixMeId||!_fixOtherId) return; await window.supabase.from('chat_messages').update({read_at:new Date().toISOString()}).eq('receiver_id',_fixMeId).eq('sender_id',_fixOtherId).is('read_at',null); }catch(e){} }
async function loadChat(){
  if(!window.currentChatWith) return; fixSetup();
  var myToken=++_fixLoadToken;
  var lv=document.getElementById('chat-list-view'); if(lv) lv.style.display='none';
  var cv=document.getElementById('chat-view'); if(cv) cv.style.display='block';
  var list=document.getElementById('messages-list'); if(!list) return;
  list.innerHTML='<div style="padding:20px;text-align:center;color:#888">⏳ Loading chat...</div>';
  _fixMeId=await fixGetUid(); if(myToken!==_fixLoadToken) return;
  await fixLoadProfiles();
  var pr=await window.supabase.from('profiles').select('*').eq('name', window.currentChatWith).maybeSingle();
  if(myToken!==_fixLoadToken) return;
  _fixOtherProfile=(pr&&pr.data)?pr.data:null; _fixOtherId=_fixOtherProfile?_fixOtherProfile.user_id:null;
  if(!_fixOtherId){ list.innerHTML='<div style="padding:12px">Cannot find '+window.currentChatWith+'</div>'; return; }
  localStorage.setItem('read_'+_fixOtherId, Date.now().toString()); fixMarkRead();
  var tt=document.getElementById('chat-title');
  if(tt){
    var img=fixImg(_fixOtherProfile);
    tt.innerHTML='<button class="iconbtn" onclick="showChatList()">←</button>'+(img?'<img src="'+img+'" onclick="fixShowProfileById(\''+_fixOtherId+'\')">':'<div style="width:40px;height:40px;min-width:40px;border-radius:50%;background:#ff5a8a;flex-shrink:0;display:flex;align-items:center;justify-content:center" onclick="fixShowProfileById(\''+_fixOtherId+'\')">'+fixEsc(window.currentChatWith.charAt(0))+'</div>')+'<div class="namewrap"><div class="nm">'+fixEsc(window.currentChatWith)+(_fixOtherProfile.age?', '+_fixOtherProfile.age:'')+fixBadge(_fixOtherProfile)+'</div><div class="sub" id="fix-presence">'+(fixIsOnline(_fixOtherProfile.last_seen)?'<span style="color:#22c55e">● Online</span>':fixEsc(fixFmtLastSeen(_fixOtherProfile.last_seen)))+'</div></div><button class="iconbtn" onclick="fixBlock()">🛡️</button>';
  }
  var d=await window.supabase.from('chat_messages').select('*').or('and(sender_id.eq.'+_fixMeId+',receiver_id.eq.'+_fixOtherId+'),and(sender_id.eq.'+_fixOtherId+',receiver_id.eq.'+_fixMeId+')').order('created_at',{ascending:true});
  if(myToken!==_fixLoadToken) return;
  var rows=d.data||[];
  list.innerHTML=rows.length?rows.map(function(m){
    var mine=m.sender_id===_fixMeId; var av=mine?'':fixImg(_fixOtherProfile);
    var tick=mine?(m.read_at?'<span style="color:#38bdf8"> ✓✓ Seen</span>':'<span style="color:#aaa"> ✓ Delivered</span>'):''; return '<div class="msg-row '+(mine?'mine':'')+'">'+(av?'<img src="'+av+'">':'')+'<div><div class="msg-bubble">'+fixEsc(m.content)+'</div><div class="msg-time">'+fixTime(m.created_at)+tick+'</div></div></div>';
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
  _fixOtherId=null; _fixOtherProfile=null; _fixChatLoaded=false;
  try{ var _ml=document.getElementById('messages-list'); if(_ml) _ml.innerHTML='<div style="padding:20px;text-align:center;color:#888">⏳ Loading chat...</div>'; var _tt=document.getElementById('chat-title'); if(_tt) _tt.innerHTML='<button class="iconbtn" onclick="showChatList()">←</button><div class="namewrap"><div class="nm">Loading...</div><div class="sub">...</div></div>'; var _lv=document.getElementById('chat-list-view'); if(_lv) _lv.style.display='none'; var _cv=document.getElementById('chat-view'); if(_cv) _cv.style.display='block'; }catch(e){}
  _fixOpening=true;
  if(typeof showTab==="function") showTab("messages");
  _fixOpening=false;
  await loadChat();
};
document.addEventListener("click",function(e){
  var b=e.target.closest("button"); if(!b) return;
  var t=b.textContent||""; if(t.indexOf("Messages")>=0) return; if(t.indexOf("Message")<0) return;
  var oc=b.getAttribute("onclick")||""; var m=oc.match(/openChat\(.(.+?).\)/); var nm=m?m[1]:null; if(!nm) return;
  e.stopPropagation(); window.openChat(nm);
});
document.addEventListener("DOMContentLoaded",fixSetup); fixSetup();
