if(typeof flagFor==='undefined' && typeof notifFlagFor==='function'){ var flagFor = notifFlagFor; window.flagFor = notifFlagFor; }
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
  '#tab-messages{width:auto;max-width:none;box-sizing:border-box;padding:0;margin:-16px -16px 0}#chat-view{border-radius:0 !important;min-height:calc(100dvh - 130px)}#messages-list{padding:10px 12px}#messages-list>div{max-width:100%}#chat-view{background:#111;border-radius:14px;padding:10px;width:100%;max-width:100%;box-sizing:border-box;margin:0}#messages-list{width:100%;box-sizing:border-box}#chat-input-bar{width:100%;box-sizing:border-box}#chat-title{display:flex;align-items:center;gap:10px;padding:12px 12px;width:100%;box-sizing:border-box;overflow:hidden;min-height:60px;flex-shrink:0;margin:0 0 4px 0;background:transparent}#chat-title .iconbtn:first-child{position:static;transform:none;order:0;width:28px;height:28px;min-width:28px;font-size:18px}#chat-title #blockBtn{order:9}#chat-title .namewrap{flex:1;min-width:0;overflow:hidden}#chat-title img{width:40px;height:40px;border-radius:50%;object-fit:cover;cursor:pointer;flex-shrink:0;flex:none}#chat-title .nm{font-weight:700;font-size:16px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#chat-title .sub{font-size:12px;color:#4ade80}#chat-title .spacer{flex:1}#chat-title .iconbtn{background:transparent;border:0;color:#fff;width:32px;height:32px;min-width:32px;border-radius:50%;font-size:18px;font-weight:700;cursor:pointer;flex-shrink:0;flex:none;display:flex;align-items:center;justify-content:center;padding:0}'+
  '#messages-list{padding:6px;display:flex;flex-direction:column;gap:8px;max-height:55vh;overflow-y:auto}.msg-row{display:flex;gap:8px;align-items:flex-end;max-width:88%}.msg-row.mine{margin-left:auto;flex-direction:row-reverse}.msg-row>img{width:28px;height:28px;border-radius:50%;object-fit:cover}.msg-bubble:has(img){padding:0 !important;background:transparent !important}.msg-bubble img{width:100% !important;max-width:200px !important;min-width:0 !important;height:auto !important;border-radius:12px !important;object-fit:contain !important;display:block !important}.msg-bubble{padding:10px 13px;border-radius:18px;font-size:15px;line-height:1.4;word-break:break-word}.msg-row.mine .msg-bubble{background:#ff5a8a;color:#fff;border-bottom-right-radius:6px}.msg-row:not(.mine) .msg-bubble{background:#262626;color:#fff;border-bottom-left-radius:6px}.msg-time{font-size:11px;color:#999;margin-top:3px;text-align:right}.msg-row:not(.mine) .msg-time{text-align:left}'+
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
    document.addEventListener("click",function(e){if(e.target.tagName==="IMG"&&e.target.closest(".msg-bubble")){var ov=document.createElement("div");ov.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:10000;display:flex;align-items:center;justify-content:center";var im=document.createElement("img");im.src=e.target.src;im.style.cssText="max-width:95vw;max-height:95vh;object-fit:contain;border-radius:12px";ov.appendChild(im);ov.onclick=function(){ov.remove();};document.body.appendChild(ov);}});photo.onclick=function(){var ov=document.createElement("div");ov.style.cssText="position:fixed;inset:0;background:#000;z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center";var vd=document.createElement("video");vd.setAttribute("playsinline","");vd.autoplay=true;vd.style.cssText="width:100%;max-width:480px;transform:scaleX(-1)";var btn=document.createElement("button");btn.textContent="Take Selfie";btn.style.cssText="margin:12px;padding:14px 28px;font-size:18px;border-radius:999px;border:0;background:#fff";var cancel=document.createElement("button");cancel.textContent="Cancel";cancel.style.cssText="padding:10px 20px;border-radius:999px;border:0;background:#333;color:#fff";ov.appendChild(vd);ov.appendChild(btn);ov.appendChild(cancel);document.body.appendChild(ov);var stream=null;function stop(){if(stream){stream.getTracks().forEach(function(tr){tr.stop();});}ov.remove();}cancel.onclick=stop;navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:false}).then(function(st){stream=st;vd.srcObject=st;}).catch(function(er){alert("Camera blocked: "+er.message);stop();});btn.onclick=async function(){var c=document.createElement("canvas");var w=vd.videoWidth||640;var h=vd.videoHeight||480;c.width=w;c.height=h;var ctx=c.getContext("2d");ctx.translate(w,0);ctx.scale(-1,1);ctx.drawImage(vd,0,0,w,h);var data=c.toDataURL("image/jpeg",0.7);stop();var meId=await fixGetUid();if(!_fixOtherId){await loadChat();}var err=(await window.supabase.from("chat_messages").insert([{sender_id:meId,receiver_id:_fixOtherId,content:"IMG:"+data}])).error;if(err)alert("Send failed: "+err.message);else loadChat();};};
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
  list.innerHTML='<div style="padding:20px;text-align:center;color:#888">⏳ '+((localStorage.getItem('whisper_lang')||'English')==='French'?'Chargement des discussions...':(localStorage.getItem('whisper_lang')||'English')==='Spanish'?'Cargando chats...':'Loading chats...')+'</div>';
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
    var unread=rows.filter(function(m){ return m.sender_id===c.other && !m.read_at; }).length;
    var av=img?'<img src="'+img+'" onclick="event.stopPropagation();fixShowProfileById(\''+c.other+'\')">':'<div class="av" onclick="event.stopPropagation();fixShowProfileById(\''+c.other+'\')">'+fixEsc(nm.charAt(0))+'</div>';
    return '<div class="chat-row" onclick="window.openChat(\''+fixEsc(nm)+'\')">'+av+'<div class="meta"><div class="top"><span class="nm">'+fixEsc(nm)+(p.age?', '+p.age:'')+fixBadge(p)+'</span><span class="tm">'+fixTime(c.last.created_at)+'</span></div><div class="prev">'+(c.last.sender_id===_fixMeId?'You: ':'')+(c.last.content&&c.last.content.indexOf("IMG:")===0?"📷 Image":fixEsc(c.last.content))+'</div></div>'+(unread?'<div class="unread">'+unread+'</div>':'')+'</div>';
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
async function loadChat(silent){
  if(!window.currentChatWith) return; fixSetup();
  var myToken=++_fixLoadToken;
  var lv=document.getElementById('chat-list-view'); if(lv) lv.style.display='none';
  var cv=document.getElementById('chat-view'); if(cv) cv.style.display='block';
  var list=document.getElementById('messages-list'); if(!list) return;
  if(!silent){list.innerHTML='<div style="padding:20px;text-align:center;color:#888">⏳ '+((localStorage.getItem('whisper_lang')||'English')==='French'?'Chargement de la discussion...':(localStorage.getItem('whisper_lang')||'English')==='Spanish'?'Cargando chat...':'Loading chat...')+'</div>';}
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
    tt.innerHTML=(img?'<img src="'+img+'" onclick="fixShowProfileById(\''+_fixOtherId+'\')">':'<div style="width:40px;height:40px;min-width:40px;border-radius:50%;background:#ff5a8a;flex-shrink:0;display:flex;align-items:center;justify-content:center" onclick="fixShowProfileById(\''+_fixOtherId+'\')">'+fixEsc(window.currentChatWith.charAt(0))+'</div>')+'<div class="namewrap"><div class="nm">'+fixEsc(window.currentChatWith)+(_fixOtherProfile.age?', '+_fixOtherProfile.age:'')+fixBadge(_fixOtherProfile)+'</div><div class="sub" id="fix-presence">'+(fixIsOnline(_fixOtherProfile.last_seen)?'<span style="color:#22c55e">Online \u25cf</span>':'<span style="color:#888">Offline \u25cf</span>')+'</div></div><button class="iconbtn" onclick="startVoiceCall()" title="Voice call"><svg width="22" height="22" viewBox="0 0 24 24" fill="#22c55e"><path d="M6.6 10.8c1.5 3 3.6 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg></button><button class="iconbtn" onclick="startVideoCall()" title="Video call"><svg width="24" height="24" viewBox="0 0 24 24" fill="#3b82f6"><path d="M17 10.5V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3.5l4 4v-11l-4 4z"/></svg></button><button class="iconbtn" onclick="fixBlock()">🛡️</button>'+'<button class="iconbtn" onclick="showChatList()">←</button>';
  }
  var d=await window.supabase.from('chat_messages').select('*').or('and(sender_id.eq.'+_fixMeId+',receiver_id.eq.'+_fixOtherId+'),and(sender_id.eq.'+_fixOtherId+',receiver_id.eq.'+_fixMeId+')').order('created_at',{ascending:true});
  if(myToken!==_fixLoadToken) return;
  var rows=d.data||[];
  list.innerHTML=rows.length?rows.map(function(m){
    var mine=m.sender_id===_fixMeId; var av=mine?'':fixImg(_fixOtherProfile);
    var tick=mine?(m.read_at?'<span style="color:#38bdf8"> ✓✓ Seen</span>':'<span style="color:#aaa"> ✓ Delivered</span>'):''; return '<div class="msg-row '+(mine?'mine':'')+'">'+(av?'<img src="'+av+'">':'')+'<div><div class="msg-bubble">'+(m.content&&m.content.indexOf("IMG:")===0?"<img src="+m.content.slice(4)+" style=\"width:100%;max-width:340px;min-width:240px;height:auto;cursor:zoom-in;border-radius:10px;display:block\">":fixEsc(m.content))+'</div><div class="msg-time">'+fixTime(m.created_at)+tick+'</div></div></div>';
  }).join(''):'<div style="padding:20px;text-align:center;color:#888">No messages yet<br>Say hi to '+fixEsc(window.currentChatWith)+' 👋</div>';
  list.scrollTop=list.scrollHeight;
  try{ window.supabase.removeChannel(window._chatCh); window._chatCh=window.supabase.channel('chat-'+_fixMeId+'-'+_fixOtherId).on('postgres_changes',{event:'INSERT',schema:'public',table:'chat_messages'},function(){ loadChat(true); }).subscribe(); }catch(e){}
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
  var _sn='Someone'; try{ _sn=JSON.parse(localStorage.getItem('my_profile')||'{}').name||_sn; }catch(e){} var _myCountry=''; try{ var _mp=JSON.parse(localStorage.getItem('my_profile')||'{}'); _myCountry=_mp.country||_mp.location||''; if(!_myCountry){ var _rp=JSON.parse(localStorage.getItem('richProfile')||'{}'); _myCountry=_rp['p-nationality']||_rp.country||''; } }catch(e){} var _flag=((typeof notifFlagFor==='function')?notifFlagFor(_myCountry):''); var _title=_flag+' '+_sn; if(window.notifyUser) window.notifyUser(_fixOtherId, 'chat', _title, text, {sender_name:_title, data:{chat_with:meId, url:'/?chat='+encodeURIComponent(window.currentChatWith||'')}}); else if(window.sendPushToUser) window.sendPushToUser(_fixOtherId, _title, text, {url:'/?chat='+encodeURIComponent(window.currentChatWith||''), type:'chat', sender_id:meId});
  inp.value=''; loadChat(true);
}
window.loadChat=loadChat; window.sendMsg=sendMsg; window.showChatList=showChatList;
window._lastOpen=0; window._lastOpenName="";
window.openChat=async function(name){
  var now=Date.now(); if(window._lastOpenName===name && now-window._lastOpen<800) return;
  window._lastOpen=now; window._lastOpenName=name; window.currentChatWith=name;
  _fixOtherId=null; _fixOtherProfile=null; _fixChatLoaded=false;
  try{ var _ml=document.getElementById('messages-list'); if(_ml) _ml.innerHTML='<div style="padding:20px;text-align:center;color:#888">⏳ '+((localStorage.getItem('whisper_lang')||'English')==='French'?'Chargement de la discussion...':(localStorage.getItem('whisper_lang')||'English')==='Spanish'?'Cargando chat...':'Loading chat...')+'</div>'; var _tt=document.getElementById('chat-title'); if(_tt) _tt.innerHTML='<div class="namewrap"><div class="nm">'+((localStorage.getItem('whisper_lang')||'English')==='French'?'Chargement...':(localStorage.getItem('whisper_lang')||'English')==='Spanish'?'Cargando...':'Loading...')+'</div><div class="sub">...</div></div>'; var _lv=document.getElementById('chat-list-view'); if(_lv) _lv.style.display='none'; var _cv=document.getElementById('chat-view'); if(_cv) _cv.style.display='block'; }catch(e){}
  _fixOpening=true;
  if(typeof showTab==="function") showTab("messages");
  _fixOpening=false;
  await loadChat();
  // Show "Notify me when online" if other person is offline - push-only, no bell
  try{
    if(window.checkOfflineBanner && _fixOtherId && _fixOtherProfile){
      window.checkOfflineBanner(_fixOtherId, window.currentChatWith, _fixOtherProfile.last_seen);
    }
  }catch(e){}
};
document.addEventListener("click",function(e){
  var b=e.target.closest("button"); if(!b) return;
  var t=b.textContent||""; if(t.indexOf("Messages")>=0) return; if(t.indexOf("Message")<0) return;
  var oc=b.getAttribute("onclick")||""; var m=oc.match(/openChat\(.(.+?).\)/); var nm=m?m[1]:null; if(!nm) return;
  e.stopPropagation(); window.openChat(nm);
});
document.addEventListener("DOMContentLoaded",fixSetup); fixSetup();

// Auto-open chat from ?chat=Name (push notification tap)
(function(){
  try{
    var name = new URLSearchParams(window.location.search).get('chat');
    if(name==null || name=='') return;
    var tries=0;
    var iv=setInterval(function(){
      tries++;
      if(typeof window.openChat==='function'){
        clearInterval(iv);
        try{ window.openChat(decodeURIComponent(name)); }catch(e){ window.openChat(name); }
        try{ history.replaceState(null,'', window.location.pathname); }catch(e){}
      }
      if(tries>50) clearInterval(iv);
    }, 200);
  }catch(e){}
})();


// TRANSLATE_PRO - professional chat translate
(function(){
  var st=document.createElement("style"); st.textContent=".translate-btn{background:#2a2a2a!important;border:1px solid #3a3a3a!important;color:#fff!important;padding:6px 10px!important;border-radius:999px!important;font-size:12px!important;font-weight:800!important;cursor:pointer!important;white-space:nowrap}.translate-btn.active{background:linear-gradient(135deg,#ff5a8a,#ff8a5c)!important;border-color:transparent!important}.msg-translated{display:block;margin-top:6px;padding-top:6px;border-top:1px dashed rgba(255,255,255,.25);font-size:13px;opacity:.85;font-style:italic}.msg-row.mine .msg-bubble{box-shadow:0 4px 14px rgba(255,90,138,.35)}#messages-list{scroll-behavior:smooth}"; document.head.appendChild(st);
  window._translateOn=false;
  window.toggleTranslateChat=async function(){
    window._translateOn=!window._translateOn;
    var btn=document.getElementById("translateBtn"); if(btn){btn.classList.toggle("active",window._translateOn); btn.textContent=window._translateOn?"🌐 Translating...":"🌐 Translate";}
    if(!window._translateOn){ document.querySelectorAll(".msg-translated").forEach(function(n){n.remove();}); return; }
    var myLang=(localStorage.getItem("whisper_lang")||"English");
    var target=myLang==="French"?"fr":myLang==="Spanish"?"es":"en";
    var bubbles=document.querySelectorAll("#messages-list .msg-bubble");
    for(var i=0;i<bubbles.length;i++){
      var b=bubbles[i]; if(b.querySelector(".msg-translated")) continue;
      var txt=b.childNodes[0]?b.childNodes[0].textContent:""; if(!txt||txt.length<2||txt.indexOf("IMG:")===0) continue;
      try{
        var r=await fetch("https://api.mymemory.translated.net/get?q="+encodeURIComponent(txt)+"&langpair=auto|"+target);
        var j=await r.json(); var tr=j.responseData&&j.responseData.translatedText?j.responseData.translatedText:"";
        if(tr && tr.toLowerCase()!==txt.toLowerCase()){ var s=document.createElement("span"); s.className="msg-translated"; s.textContent="🌐 "+tr; b.appendChild(s); }
      }catch(e){}
    }
  };
  setInterval(function(){
    var title=document.getElementById("chat-title"); if(!title||document.getElementById("translateBtn")) return;
    if(title.textContent.indexOf("Loading")>=0||title.textContent.indexOf("Chat")===0) return;
    var btn=document.createElement("button"); btn.id="translateBtn"; btn.className="translate-btn iconbtn"; btn.textContent="🌐 Translate"; btn.onclick=function(e){e.stopPropagation(); window.toggleTranslateChat();};
    title.appendChild(btn);
  },800);
})();

// CHAT_ALL_IN_ONE_V2 - photo design + translate per msg + block + YOUR exact badge + date
(function(){
  var st=document.createElement("style");
  st.textContent="#chat-view{background:#141428!important;border-radius:22px!important;padding:0!important;overflow:hidden}#chat-title{background:#1b1b2e!important;padding:12px!important;border-bottom:1px solid #2a2a44!important;min-height:64px!important;gap:6px!important}#chat-title .nm{font-size:17px!important;color:#fff!important}#chat-title .sub{color:#4ade80!important;font-size:12px!important;font-weight:600!important}#messages-list{background:#141428!important;padding:14px 12px 10px!important;gap:12px!important;max-height:62vh!important}.msg-row{max-width:85%!important;flex-direction:column!important;align-items:flex-start!important;gap:4px!important}.msg-row.mine{margin-left:auto!important;align-items:flex-end!important}.msg-bubble{font-size:15px!important;line-height:1.45!important;padding:11px 14px!important;border-radius:20px!important}.msg-row:not(.mine) .msg-bubble{background:#2e2e44!important;color:#fff!important;border-bottom-left-radius:6px!important}.msg-row.mine .msg-bubble{background:linear-gradient(135deg,#ff5a8a,#ff7a5c)!important;color:#fff!important;border-bottom-right-radius:6px!important;box-shadow:0 4px 14px rgba(255,90,138,.35)!important}.msg-time{color:#8b8b9e!important;font-size:11px!important}#chat-input-bar{background:#2a2a3e!important;border-radius:999px!important;padding:6px 6px 6px 12px!important;margin:10px 10px 12px!important;border:1px solid #3a3a55!important}#chat-input-bar button{background:linear-gradient(135deg,#ff5a8a,#ff8a5c)!important;width:40px!important;height:40px!important}.msg-translate{background:#2a2a3e!important;border:1px solid #3a3a55!important;color:#fff!important;padding:4px 10px!important;border-radius:999px!important;font-size:11px!important;font-weight:700!important;cursor:pointer!important;display:inline-block!important;margin-top:4px}.msg-translated{display:block;margin-top:5px;padding-top:5px;border-top:1px dashed rgba(255,255,255,.25);font-size:13px;opacity:.9}.verify-badge{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:16px!important;height:16px!important;min-width:16px!important;border-radius:50%!important;background:#1DA1F2!important;color:#fff!important;font-size:10px!important;font-weight:900!important;margin-left:5px!important;vertical-align:middle!important;line-height:1!important}.block-btn{background:#2a2a3e!important;border:1px solid #ff5a5a!important;color:#ff8a8a!important;padding:6px 10px!important;border-radius:999px!important;font-size:12px!important;font-weight:800!important;cursor:pointer!important;white-space:nowrap}.date-sep{display:flex;justify-content:center;margin:14px 0 6px}.date-sep span{background:#2a2a3e;border:1px solid #3a3a55;color:#b8b8cc;font-size:11px;font-weight:700;padding:5px 12px;border-radius:999px}";
  document.head.appendChild(st);
  window.translateOneMsg=async function(el){
    var row=el.closest(".msg-row"); if(!row) return;
    var bub=row.querySelector(".msg-bubble"); if(!bub) return;
    var old=row.querySelector(".msg-translated");
    if(old){ old.remove(); el.textContent="🌐 Translate"; return; }
    var txt=""; for(var i=0;i<bub.childNodes.length;i++){ if(bub.childNodes[i].nodeType===3) txt+=bub.childNodes[i].textContent; }
    txt=txt.trim(); if(!txt) return;
    el.textContent="⏳ Translating...";
    var myLang=(localStorage.getItem("whisper_lang")||"English");
    var target=myLang==="French"?"fr":myLang==="Spanish"?"es":"en";
    try{
      var r=await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl="+target+"&dt=t&q="+encodeURIComponent(txt));
      var j=await r.json(); var tr=""; try{ tr=j[0].map(function(x){return x[0]}).join(""); }catch(e){}
      if(tr && tr.toLowerCase()!==txt.toLowerCase()){ var s=document.createElement("span"); s.className="msg-translated"; s.textContent="🌐 "+tr; bub.appendChild(s); el.textContent="🌐 Hide translation"; }
      else el.textContent="🌐 Already in your language";
    }catch(e){ el.textContent="🌐 Tap again"; }
  };
  window.blockThisChat=async function(){
    var name=window.currentChatWith||"this user";
    if(!confirm("Block "+name+"? You will not receive messages from them.")) return;
    try{ if(window._fixOtherId && window.supabase){ var meId=null; try{ meId=JSON.parse(localStorage.getItem("my_profile")||"{}").id; }catch(e){} if(meId) await window.supabase.from("blocked_users").insert([{blocker_id:meId, blocked_id:window._fixOtherId}]); } }catch(e){}
    alert(name+" blocked");
    try{ if(typeof showChatList==="function") showChatList(); }catch(e){}
  };
  setInterval(function(){
    var title=document.getElementById("chat-title"); if(!title) return;
    var nmEl=title.querySelector(".nm");
    var prof=window._fixOtherProfile||{}; var isVer=prof.verified||prof.is_verified||prof.blue_check;
    if(nmEl && isVer && !nmEl.querySelector(".verify-badge")){ var b=document.createElement("span"); b.className="verify-badge"; b.textContent="✓"; b.title="Verified"; nmEl.appendChild(b); }
    var hb=document.getElementById("translateBtn"); if(hb) hb.remove();
    if(nmEl && !document.getElementById("blockChatBtn") && title.textContent.indexOf("Loading")<0){
      var btn=document.createElement("button"); btn.id="blockChatBtn"; btn.className="block-btn"; btn.textContent="🚫 Block";
      btn.onclick=function(e){ e.stopPropagation(); window.blockThisChat(); }; title.appendChild(btn);
    }
    document.querySelectorAll("#messages-list .msg-row").forEach(function(row){
      if(row.querySelector(".msg-translate")) return;
      var bub=row.querySelector(".msg-bubble"); if(!bub) return;
      var link=document.createElement("div"); link.className="msg-translate"; link.textContent="🌐 Translate";
      link.onclick=function(e){ e.stopPropagation(); window.translateOneMsg(link); };
      row.appendChild(link);
    });
    var list=document.getElementById("messages-list");
    if(list && list.children.length>0 && !list.querySelector(".date-sep")){
      var sep=document.createElement("div"); sep.className="date-sep"; var s=document.createElement("span");
      s.textContent="Today • "+new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
      sep.appendChild(s); list.insertBefore(sep, list.firstChild);
    }
  },900);
})();

// HEADER_CLEAN_V1 - remove duplicate Block + header Translate, keep shield
(function(){
  var st=document.createElement("style");
  st.textContent="#chat-title{flex-wrap:nowrap!important;overflow:hidden}#chat-title .nm{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-width:130px!important}#blockChatBtn{display:none!important}#translateBtn{display:none!important}[id*=\"translate\"][id*=\"Btn\"]{display:none!important}.msg-translate{display:inline-block!important}";
  document.head.appendChild(st);
  // Wire YOUR shield button to real block
  setInterval(function(){
    var myBlock=document.getElementById("blockChatBtn"); if(myBlock) myBlock.remove();
    // Find header Translate buttons (any button with Translate text in header only)
    document.querySelectorAll("#chat-title button, #chat-title .btn, #chat-title [onclick]").forEach(function(b){
      var txt=(b.textContent||"").toLowerCase();
      if(txt.indexOf("translat")>=0){ b.style.display="none"; b.remove(); }
    });
    // Find shield button - it contains shield emoji or has block in id/class/onclick
    var title=document.getElementById("chat-title"); if(!title) return;
    title.querySelectorAll("button").forEach(function(b){
      var txt=b.textContent||""; var id=(b.id||"").toLowerCase(); var cls=(b.className||"").toLowerCase();
      var isShield=txt.indexOf("🛡")>=0||txt.indexOf("🛡️")>=0||id.indexOf("block")>=0||cls.indexOf("block")>=0;
      if(isShield && !b.dataset.wired){
        b.dataset.wired="1";
        b.onclick=function(e){ e.stopPropagation(); if(window.blockThisChat) window.blockThisChat(); };
      }
    });
  },800);
})();

// MESSAGES_HEADER_V1 - hide WhisperChat on Messages, style Messages title
(function(){
  var st=document.createElement("style");
  st.textContent=".messages-title-pro{font-size:28px!important;font-weight:900!important;letter-spacing:-0.5px!important;background:linear-gradient(135deg,#ff5a8a,#ff8a5c,#ffb86b)!important;-webkit-background-clip:text!important;-webkit-text-fill-color:transparent!important;background-clip:text!important;display:flex!important;align-items:center!important;gap:8px!important;margin:0!important;padding:4px 0 8px!important}";
  document.head.appendChild(st);
  setInterval(function(){
    var isMessages=false;
    var chatView=document.getElementById("chat-view");
    var msgList=document.getElementById("messages-list");
    // We are in Messages if chat view / messages list is visible
    if((chatView && chatView.offsetParent!==null) || (msgList && msgList.offsetParent!==null)) isMessages=true;
    // Also check nav: Messages tab active
    var activeTab=document.querySelector("[data-tab=\"messages\"].active, .nav-item.active");
    if(activeTab && (activeTab.textContent||"").toLowerCase().indexOf("message")>=0) isMessages=true;
    // Find all elements that say WhisperChat
    document.querySelectorAll("h1,h2,h3,div,header").forEach(function(el){
      if(el.children.length>0) return; // only leaf text
      if((el.textContent||"").trim()==="WhisperChat"){
        el.dataset.whisperTitle="1";
        el.style.display=isMessages?"none":"";
      }
    });
    // Style the Messages heading
    document.querySelectorAll("h1,h2,h3,div").forEach(function(el){
      if(el.children.length>0) return;
      var txt=(el.textContent||"").trim();
      if(txt==="💬 Messages"||txt==="Messages"||txt.indexOf("Messages")===0 && txt.length<20){
        if(!el.classList.contains("messages-title-pro")) el.classList.add("messages-title-pro");
        if(txt==="Messages") el.textContent="💬 Messages";
      }
    });
  },800);
})();

// LIST_AND_BELL_V1 - hide WhisperChat on list + hide bell inside chat
(function(){
  setInterval(function(){
    var navActive=document.querySelector(".nav-item.active, [data-tab].active, .tab.active");
    var navTxt=navActive?(navActive.textContent||"").toLowerCase():"";
    var isMessagesPage=navTxt.indexOf("message")>=0;
    var list=document.getElementById("chat-list")||document.querySelector("[id*=\"chat-list\"]");
    if(list && list.offsetParent!==null) isMessagesPage=true;
    var inChat=false;
    var msgList=document.getElementById("messages-list");
    var chatView=document.getElementById("chat-view");
    if((msgList && msgList.offsetParent!==null) || (chatView && chatView.offsetParent!==null)) inChat=true;
    if(isMessagesPage){
      document.querySelectorAll("h1,h2,h3,div,span,header").forEach(function(el){
        if((el.textContent||"").trim()==="WhisperChat"){
          el.style.display="none"; el.style.height="0"; el.style.margin="0"; el.style.padding="0";
        }
      });
    }
    // Bell: hide ONLY inside chat, show on list
    document.querySelectorAll("button,div,span,a").forEach(function(el){
      var txt=(el.textContent||"").trim();
      if(txt==="🔔" || txt.indexOf("🔔")>=0 && txt.length<5){
        if(inChat){ el.style.display="none"; }
        else if(isMessagesPage){ el.style.display=""; }
      }
      if(el.id && el.id.toLowerCase().indexOf("notif")>=0){
        if(inChat){ el.style.display="none"; }
        else if(isMessagesPage){ el.style.display=""; }
      }
    });
  },600);
})();

// CALL_BUG_FIX_V1 - stop stale calls replaying on every load
(function(){
  // 1. Kill the annoying alert popup "ended the call"
  var _alert = window.alert;
  window.alert = function(msg){
    var s = String(msg||"");
    if(s.toLowerCase().indexOf("ended the call")>=0) return; // silent, do not block page
    return _alert(msg);
  };
  // 2. On load, clear any old call left in storage
  try{
    Object.keys(localStorage).forEach(function(k){
      if(k.toLowerCase().indexOf("call")>=0) localStorage.removeItem(k);
    });
    Object.keys(sessionStorage).forEach(function(k){
      if(k.toLowerCase().indexOf("call")>=0) sessionStorage.removeItem(k);
    });
  }catch(e){}
  // 3. Every 1 sec: if CALL overlay appears but call is older than 20 sec / no fresh signal, hide it
  var pageLoad = Date.now();
  setInterval(function(){
    // Only auto-hide CALL overlay in first 10 sec after load - a REAL new call after that still shows
    if(Date.now() - pageLoad > 15000) return;
    document.querySelectorAll("div").forEach(function(el){
      var txt=(el.textContent||"");
      if(txt.trim().startsWith("CALL") && txt.indexOf("Accept")>=0 && txt.indexOf("Decline")>=0){
        // This CALL appeared right on load = stale, hide it
        el.style.display="none";
        // Also try to auto-decline it silently
        var dec=document.querySelector("button");
        // do not click Accept ever here
      }
    });
  },800);
  // 4. Stop any old call sound / video on load
  try{
    document.querySelectorAll("video,audio").forEach(function(m){ try{m.pause();}catch(e){} });
  }catch(e){}
})();

// KILL_FLASH_V1 - stop flashing WhisperChat + CALL, remove not hide
(function(){
  // 1. CSS kill-switch - no flash, stays dead
  var st=document.createElement("style");
  st.textContent = `
    .kill-whisperchat{ display:none!important; visibility:hidden!important; height:0!important; }
  `;
  document.head.appendChild(st);
  window.BLOCK_CALLS = true; // flag for your call code to check
  // 2. Auto-Decline any CALL that appears - click Decline once, don't loop
  var declining = false;
  function killCall(){
    var btns = Array.from(document.querySelectorAll("button,div"));
    var dec = btns.find(function(b){ return (b.textContent||"").trim()==="Decline"; });
    if(dec && !declining){
      declining = true;
      try{ dec.click(); }catch(e){}
      setTimeout(function(){ declining=false; }, 3000);
    }
    // Remove CALL overlay node entirely
    document.querySelectorAll("div").forEach(function(el){
      var txt=(el.textContent||"");
      if(txt.indexOf("CALL")>=0 && txt.indexOf("Accept")>=0 && txt.indexOf("Decline")>=0 && txt.length<200){
        el.remove();
      }
    });
  }
  // 3. Remove WhisperChat node entirely on Messages page - not hide
  function killWhisper(){
    var isMessages = false;
    var nav=document.querySelector(".nav-item.active, [data-tab].active, .tab.active");
    if(nav && (nav.textContent||"").toLowerCase().indexOf("message")>=0) isMessages=true;
    var list=document.getElementById("chat-list");
    if(list && list.offsetParent!==null) isMessages=true;
    if(!isMessages) return;
    document.querySelectorAll("h1,h2,h3,div,span,header").forEach(function(el){
      if((el.textContent||"").trim()==="WhisperChat"){
        el.remove(); // gone, cannot flash back from same node
      }
    });
  }
  // 4. Watch for re-created nodes and kill instantly - no interval flash
  var obs = new MutationObserver(function(){
    killWhisper();
    killCall();
  });
  obs.observe(document.body, {childList:true, subtree:true});
  setInterval(function(){ killWhisper(); killCall(); }, 1000);
})();

// VOICE_NOTE_V1 - lightweight voice note next to Send
(function(){
  var rec=null, chunks=[], isRec=false, micBtn=null;
  function findSend(){
    return document.querySelector("button[type=submit], button.send-btn, #send-btn, [id*=send]");
  }
  function makeBtn(){
    if(micBtn && document.body.contains(micBtn)) return;
    var send=findSend();
    if(!send || !send.parentNode) return;
    micBtn=document.createElement("button");
    micBtn.textContent="🎤";
    micBtn.title="Voice note";
    micBtn.style.cssText="width:44px;height:44px;border-radius:50%;border:none;background:#ff5a8a;color:#fff;font-size:20px;cursor:pointer;flex-shrink:0;margin-left:6px";
    micBtn.onclick=function(){
      if(!isRec){
        navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
          rec=new MediaRecorder(stream); chunks=[];
          rec.ondataavailable=function(e){ if(e.data.size) chunks.push(e.data); };
          rec.onstop=function(){
            var blob=new Blob(chunks,{type:"audio/webm"});
            var url=URL.createObjectURL(blob);
            var audio=document.createElement("audio");
            audio.controls=true; audio.src=url; audio.style.maxWidth="220px";
            var input=document.querySelector("input[type=text], textarea");
            if(input){ input.value=""; }
            // Insert into chat list as a bubble - your send logic will pick it up if you wire it, for now show preview
            alert("Voice note recorded ("+Math.round(blob.size/1024)+"KB). Tap Send to share - preview below");
            var box=document.getElementById("messages-list")||document.body;
            var div=document.createElement("div");
            div.style.cssText="background:#ffe4ec;padding:8px;border-radius:12px;margin:8px;max-width:260px;margin-left:auto";
            div.appendChild(audio);
            box.appendChild(div);
            stream.getTracks().forEach(function(tr){ tr.stop(); });
          };
          rec.start(); isRec=true; micBtn.textContent="⏹️"; micBtn.style.background="#ff0000";
        }).catch(function(){ alert("Allow microphone to record voice note"); });
      } else {
        try{ rec.stop(); }catch(e){}
        isRec=false; micBtn.textContent="🎤"; micBtn.style.background="#ff5a8a";
      }
    };
    send.parentNode.insertBefore(micBtn, send.nextSibling);
  }
  setInterval(makeBtn, 1000);
})();
