
function showProfileSub(n){
  ['login','my','settings'].forEach(function(k){
    var el = document.getElementById('profile-sub-'+k);
    if(el) el.style.display = (k===n ? 'block' : 'none');
    var b = document.getElementById('psub-'+k+'-btn');
    if(b) b.style.background = (k===n ? '#ff5a8a' : '#333');
  });
}


// MAP + 30 DAILY LIMIT
const names=["Amina","Carlos","Maria","John","Fatima","David","Sofia","James","Luna","Peter","Nina","Alex","Marta","Kevin","Ada","Luis","Zoe","Emma","Noah","Mia","Liam","Ava","Ethan","Chloe","Lucas","Elena","Omar","Sara","Diego","Grace","Yemi","Aisha","Kwame","Ingrid","Mateo","Yuki","Anika","Ravi","Lena","Tunde","Nia","Hugo","Priya","Felix","Zara","Andre","Maya","Kenji","Lila","Oscar","Tara","Ibrahim","Camila","Dmitri","Hana","Leo","Freya","Samuel","Isla","Marco","Nora","Victor","Ruby","Ahmed","Clara","Jonas","Mei","Tomas","Anya","Ken"];
const countries=["Equatorial Guinea","Nigeria","Cameroon","Spain","Ghana","France","USA","Kenya","Brazil","Germany","Morocco","Italy","Senegal","UK","Mexico","Portugal","Egypt","Canada","Colombia","Turkey","South Africa","India","Poland","Netherlands","Chile","Argentina","Japan","Australia","Peru","Belgium","Nigeria","Kenya","Ghana","Sweden","Mexico","Japan","India","Brazil","Germany","Nigeria","Ethiopia","France","Spain","India","Germany","Morocco","Brazil","USA","Japan","South Africa","Spain","Ethiopia","Nigeria","Brazil","Russia","Korea","Italy","Finland","Nigeria","UK","China","Mexico","Ghana","Brazil","Egypt","Spain","Norway","China","Poland","Greece"];
// Auto-fill profile country dropdown from same countries list
(function(){ var pc=document.getElementById('pf-country'); if(!pc) return; pc.innerHTML=''; [...new Set(countries)].sort().forEach(function(c){ var o=document.createElement('option'); o.value=c; o.textContent=c; pc.appendChild(o); }); })();

function todayKey(){ return 'likes_'+new Date().toISOString().slice(0,10); }
function getLiked(){ try{ return JSON.parse(localStorage.getItem(todayKey())||'[]'); }catch(e){ return []; } }
function renderCircles(){
  let liked=getLiked();
  let left=30-liked.length;
  let ctr=document.getElementById('daily-counter');
  if(ctr) ctr.textContent = left<=0 ? '😴 No Likes left today - come back tomorrow!' : '❤️ '+left+' Likes left today';
  let c=document.getElementById('circles');
  if(!c) return;
  c.innerHTML=names.map((n,i)=>{
    let isLiked=liked.includes(n);
    let style=isLiked ? 'border-color:#555;opacity:0.4' : '';
    return `<div class="circle" style="${style}" onclick="likePerson('${n}')"><div>${isLiked?'❤️':'👤'}<br><span>${n}</span><br><span style="font-size:8px">${countries[i]}</span></div></div>`;
  }).join('');
}

let swipeIdx=0;
function getAges(){return names.map(function(n,i){return 19+((i*7)%14);});}
function getFiltered(){
  let f=document.getElementById('country-filter');
  let v=f?f.value:'ALL';
  return names.map(function(n,i){return i;}).filter(function(i){return v==='ALL'||countries[i]===v;});
}
function renderSwipe(){
  let cf=document.getElementById('country-filter');
  if(cf && cf.options.length<=1){
    let uniq=[...new Set(countries)].sort();
    uniq.forEach(function(c){let o=document.createElement('option');o.value=c;o.textContent=c;cf.appendChild(o);});
  }
  let el=document.getElementById('swipe-card'); if(!el) return;
  let liked=getLiked();
  let list=getFiltered();
  while(swipeIdx<list.length && liked.includes(names[list[swipeIdx]])) swipeIdx++;
  if(swipeIdx>=list.length){ el.innerHTML='<div class="card" style="text-align:center;padding:30px"><h3>🎉 No more people in this country</h3><p>Try All Countries or come back tomorrow.</p></div>'; return; }
  let idx=list[swipeIdx], n=names[idx], c=countries[idx], age=getAges()[idx];
  let photo='https://i.pravatar.cc/600?img='+((idx%70)+1);
  el.innerHTML = `<div class="swipe-card"><div class="photo" onclick="likePerson('${n}')" style="position:relative;cursor:pointer"><div style="font-size:110px">${n.charAt(0)}</div><img src="${photo}" onerror="this.remove()" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" /></div><div class="info"><h3>${n} - ${age}</h3><p>${c}</p><p>Looking to meet new people</p></div><div class="swipe-actions"><button class="btn-pass" onclick="passPerson()">Pass</button><button class="btn-like" onclick="likePerson('${n}')">Like</button></div></div>`;
}
function passPerson(){swipeIdx++;renderSwipe();}
function openMap(){document.getElementById('map-modal').classList.add('open');setTimeout(function(){initMap();if(window._map)window._map.invalidateSize();},100);}
function closeMap(){document.getElementById('map-modal').classList.remove('open');}
function likePerson(name){
  let liked=getLiked();
  if(liked.includes(name)){ alert(name+' already liked today'); return; }
  if(liked.length>=30){ alert('Daily limit reached! 30/30'); return; }
  liked.push(name); localStorage.setItem(todayKey(), JSON.stringify(liked));;let _idx=names.indexOf(name);if(_idx>=0&&_idx%3===0){let ml=document.getElementById('matches-list');if(ml){if(ml.innerHTML.includes('No matches yet'))ml.innerHTML='';ml.innerHTML+='<div class=card><b>💖 '+name+' • '+getAges()[_idx]+'</b><br>📍 '+countries[_idx]+'<br><button onclick="showTab(\'messages\')">💬 Chat Now</button></div>';}alert('💖 MATCH! '+name+' liked you back!');}swipeIdx++;renderSwipe();
  renderCircles(); initMap();
  alert('❤️ You liked '+name+'! '+(30-liked.length)+' left today');
}
function initMap(){
  let m=document.getElementById('map'); if(!m||!window.L) return;
  if(window._map){ window._map.remove(); }
  m.style.height='70vh'; m.style.minHeight='520px';
  let map=L.map('map').setView([3.75, 8.78], 3); window._map=map;
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{maxZoom:19,attribution:'© OpenStreetMap © CARTO'}).addTo(map);
  let liked=getLiked();
  names.forEach((n,i)=>{
    let lat=3.75 + (Math.sin(i*2.3)*25);
    let lng=8.78 + (Math.cos(i*1.7)*45);
    let color=liked.includes(n)?'red':'pink';
    L.circleMarker([lat,lng],{radius:8,color:color,fillColor:color,fillOpacity:0.9}).addTo(map).bindPopup('<b>'+n+'</b><br>'+countries[i]+'<br><button onclick="likePerson(\''+n+'\')">❤️ Like</button>');
  });
}
renderCircles();
setTimeout(()=>{initMap(); if(window._map) window._map.invalidateSize();}, 800);


let currentChatWith = null;
function openChat(name){
  currentChatWith = name;
  document.getElementById('chat-title').textContent = 'Chat with ' + name;
  document.getElementById('chat-view').style.display = 'block';
  loadChat();
}
async function loadChat(){
  if(!currentChatWith) return;
  let me = localStorage.getItem('whisper_user') || 'Me';
  // For now receiver is by name stored in localStorage map - we use chat_messages with text names via content prefix
  // Real version: we load all messages and filter in JS (no fake messages)
  let { data, error } = await window.supabase.from('chat_messages').select('*').order('created_at', {ascending:true}).limit(100);
  if(error){ console.log(error); return; }
  let list = document.getElementById('messages-list');
  if(!list) return;
  list.innerHTML = (data||[]).map(function(m){
    let mine = m.sender_id === (window._my_id || '');
    return '<div style="text-align:'+(mine?'right':'left')+';margin:6px 0"><span style="background:'+(mine?'#ff5a8a':'#333')+';padding:8px 12px;border-radius:14px;display:inline-block;max-width:80%">'+m.content+'</span></div>';
  }).join('');
  list.scrollTop = list.scrollHeight;
}
async function sendMsg(){
  let inp = document.getElementById('msg-input');
  let text = inp.value.trim();
  if(!text) return;
  if(!window._my_id){
    // create a stable local id for this device until real auth is wired
    window._my_id = localStorage.getItem('whisper_my_id') || ('user_' + Date.now());
    localStorage.setItem('whisper_my_id', window._my_id);
  }
  // receiver_id: for now use currentChatWith name hash - real auth will replace this next step
  let receiver = currentChatWith || 'General';
  let { error } = await window.supabase.from('chat_messages').insert([{ sender_id: window._my_id, receiver_id: receiver, content: text }]);
  if(error){ alert('Send failed: ' + error.message); return; }
  inp.value = '';
  loadChat();
}

async function signupUser(){
  let email=document.getElementById('auth-email').value;
  let pass=document.getElementById('auth-pass').value;
  let {data,error}=await supabase.auth.signUp({email:email,password:pass});
  document.getElementById('auth-status').textContent=error?error.message:'Check your email to confirm, then Login!';
}
async function loginUser(){
  let email=document.getElementById('auth-email').value;
  let pass=document.getElementById('auth-pass').value;
  let {data,error}=await supabase.auth.signInWithPassword({email:email,password:pass});
  document.getElementById('auth-status').textContent=error?error.message:'Logged in as '+email;
  if(!error) document.getElementById('login-box').style.display='none';
}
renderCircles(); renderSwipe();






window._myPhoto=''; window._myPhotos=['','','','',''];
function renderPfPhotos(){
  var wrap=document.getElementById('pf-photos'); var prev=document.getElementById('pf-previews'); if(!wrap) return;
  wrap.innerHTML=''; prev.innerHTML='';
  for(var i=0;i<5;i++){
    (function(i){
      var b=document.createElement('button'); b.type='button'; b.textContent=(window._myPhotos[i]?'Change Photo '+(i+1):'Add Photo '+(i+1)); b.style.cssText='padding:8px 10px;border-radius:8px;border:1px dashed #ff5a8a;background:#333;color:white;cursor:pointer';
      b.onclick=function(){ window._pfPhotoIndex=i; document.getElementById('pf-photo').click(); };
      wrap.appendChild(b);
      if(window._myPhotos[i]){
        var im=document.createElement('img'); im.src=window._myPhotos[i]; im.style.cssText='width:70px;height:70px;border-radius:10px;object-fit:cover;cursor:pointer'; im.title='Tap to remove';
        im.onclick=function(){ window._myPhotos[i]=''; window._myPhoto=window._myPhotos[0]||''; renderPfPhotos(); };
        prev.appendChild(im);
      }
    })(i);
  }
}
document.addEventListener('change', function(e){ if(e.target && e.target.id=='pf-photo'){ var f=e.target.files[0]; if(!f) return; var idx=window._pfPhotoIndex||0; var r=new FileReader(); r.onload=function(ev){ window._myPhotos[idx]=ev.target.result; window._myPhoto=window._myPhotos[0]||''; renderPfPhotos(); }; r.readAsDataURL(f); }});
document.addEventListener('DOMContentLoaded', renderPfPhotos); setTimeout(renderPfPhotos,500);
function saveMyProfile(){
  var n=document.getElementById('p-name')||document.getElementById('pf-name');
  var pf=document.getElementById('pf-name'); if(pf&&n&&n.value.trim()) pf.value=n.value.trim();
  var ageEl=document.getElementById('p-age'); var age=ageEl?ageEl.value.trim():'';
  var genEl=document.getElementById('p-gender'); var gender=genEl?genEl.value:'';
  var c=document.getElementById('pf-country');
  if(!n || !n.value.trim()){ alert('Please enter your name'); return; }
  var urlPhotos=[]; for(var i=0;i<5;i++){ var u=document.getElementById('p-img-'+i); if(u&&u.value.trim()) urlPhotos[i]=u.value.trim(); }
  var finalPhotos=[]; for(var i=0;i<5;i++){ finalPhotos[i]=window._myPhotos[i]||urlPhotos[i]||''; }
  window._myPhotos=finalPhotos; window._myPhoto=finalPhotos[0]||'';
  var prof={name:n.value.trim(), age:age, gender:gender, country:c?c.value:'Equatorial Guinea', photo:window._myPhoto||'', photos:finalPhotos, time:Date.now()};
  try{ localStorage.setItem('my_profile', JSON.stringify(prof)); var all=[]; try{all=JSON.parse(localStorage.getItem('all_profiles')||'[]');}catch(e){} all=all.filter(function(x){return x.name!==prof.name}); all.unshift(prof); localStorage.setItem('all_profiles', JSON.stringify(all)); }catch(e){ alert('Storage error: '+e); return; }
  var st=document.getElementById('pf-status'); if(st) st.textContent='Saved! Go to Discover - you are now on the map!';
  alert(prof.name+' from '+prof.country+' is now on the map!');
  if(typeof initMap==='function'){ try{initMap();}catch(e){} }
}
document.addEventListener('click', function(e){ if(e.target && e.target.id=='pf-save-btn'){ saveMyProfile(); }});
window.saveMyProfile=saveMyProfile; try{ var s=JSON.parse(localStorage.getItem('my_profile')||'{}'); if(s.name){ var pn=document.getElementById('p-name'); if(pn) pn.value=s.name; var pa=document.getElementById('p-age'); if(pa&&s.age) pa.value=s.age; } }catch(e){} if(typeof syncProfileHeader==='function') syncProfileHeader();


window._myPhotos = window._myPhotos || ["","","","",""];
function updateAvatar(){
  var av = document.getElementById("p-avatar-preview"); if(!av) return;
  var first = (window._myPhotos||[]).find(function(x){return x});
  if(first){
    av.innerHTML = '<img src="'+first+'" style="width:100%;height:100%;object-fit:cover;display:block">';
  } else {
    av.innerHTML = '😊';
  }
}
function initPhotoBlocks(){
  const wrap = document.getElementById("p-blocks"); if(!wrap) return;
  wrap.innerHTML = "";
  for(let i=0;i<5;i++){
    const d = document.createElement("div");
    d.style.cssText = "width:100px;height:120px;border:2px dashed #ff5a8a;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;position:relative;background:#222;cursor:pointer";
    d.innerHTML = `<img id="p-prev-${i}" style="width:100%;height:100%;object-fit:cover;display:none"><span id="p-label-${i}" style="font-size:28px">+</span><span style="font-size:11px;color:#fff;text-align:center;padding:2px">Photo ${i+1}${i===0?' - Main':''}</span><input type="file" id="p-file-${i}" accept="image/*" style="position:absolute;inset:0;opacity:0;cursor:pointer">`;
    wrap.appendChild(d);
    const file = d.querySelector("input");
    file.addEventListener("change", e => {
      const f = e.target.files[0]; if(!f) return;
      const r = new FileReader();
      r.onload = ev => {
        window._myPhotos[i] = ev.target.result;
        updateAvatar();
        const img = document.getElementById("p-prev-"+i);
        img.src = ev.target.result; img.style.display = "block";
        document.getElementById("p-label-"+i).style.display = "none";
      };
      r.readAsDataURL(f);
    });
  }
}
document.addEventListener("DOMContentLoaded", function(){ initPhotoBlocks(); updateAvatar(); var av=document.getElementById("p-avatar-preview"); if(av){ av.style.cursor="pointer"; av.onclick=function(){
  var first=(window._myPhotos||[]).find(function(x){return x});
  var ov=document.getElementById("avatar-big"); if(!ov){ ov=document.createElement("div"); ov.id="avatar-big"; ov.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:9999;flex-direction:column"; ov.onclick=function(){ ov.style.display="none"; }; document.body.appendChild(ov); }
  ov.innerHTML=(first?'<img src="'+first+'" style="width:98vw;max-width:480px;height:98vw;max-height:480px;object-fit:cover;border-radius:24px;border:10px solid #ff5a8a;box-shadow:0 0 0 6px white, 0 0 60px #ff5a8a">':'<div style="font-size:200px">😊</div>')+'<p style="color:white;margin-top:16px;font-weight:bold">Tap anywhere to close ✕</p>';
  ov.style.display="flex";
  return;
  var bold = av.dataset.bold==="1"; var bold = av.dataset.bold==="1"; av.dataset.bold = bold?"0":"1"; av.style.transition = "all 0.25s ease"; av.style.border = bold ? "3px solid white" : "8px solid #ff5a8a"; av.style.boxShadow = bold ? "none" : "0 0 0 4px white, 0 0 0 10px #ff5a8a, 0 12px 32px rgba(255,90,138,0.7)"; av.style.transform = bold ? "scale(1)" : "scale(1.22)"; av.style.outline = bold ? "none" : "3px solid #ff8a5c"; }; } });
initPhotoBlocks(); updateAvatar();


function syncProfileHeader(){
  var nameEl=document.getElementById('p-name'); var ageEl=document.getElementById('p-age');
  var name=(nameEl&&nameEl.value.trim())||'';
  var age=(ageEl&&ageEl.value.trim())||'';
  if(!name){ try{ var s=JSON.parse(localStorage.getItem('my_profile')||'{}'); name=s.name||''; age=s.age||age; }catch(e){} }
  if(!name){ var pf=document.getElementById('pf-name'); if(pf&&pf.value.trim()) name=pf.value.trim(); }
  var hn=document.getElementById('p-header-name'); if(hn) hn.textContent=name||'Your Name';
  var ha=document.getElementById('p-header-age'); if(ha) ha.textContent=(age?age+' years old':'Age • --');
  var pv=document.getElementById('p-preview-name'); if(pv) pv.textContent=(name||'Your Name')+' • '+(age||'Age');
}
document.addEventListener('input',function(e){ if(e.target&&(e.target.id=='p-name'||e.target.id=='p-age'||e.target.id=='pf-name')) syncProfileHeader(); });
document.addEventListener('DOMContentLoaded',syncProfileHeader);
setTimeout(syncProfileHeader,500); setTimeout(syncProfileHeader,1500); setInterval(syncProfileHeader,1000);
