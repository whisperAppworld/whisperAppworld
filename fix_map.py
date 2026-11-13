import pathlib
p = pathlib.Path("index.html")
t = p.read_text()
# Add Leaflet map CSS in head
if "leaflet" not in t.lower():
    t = t.replace("</style>", "#map{height:280px;border-radius:12px;margin:10px 0}\n.counter{background:#ff5a8a;padding:10px;border-radius:10px;text-align:center;font-weight:bold}\n</style><link rel='stylesheet' href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'>")
    t = t.replace("</body>", "<script src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'></script></body>")
# Add Map + Counter inside Discover section
if 'id="map"' not in t:
    t = t.replace(
        '<div class="circles" id="circles"></div>',
        '''<div class="counter" id="daily-counter">❤️ 30 Likes left today</div>
<div id="map"></div>
<p style="font-size:13px;color:#aaa">Tap a circle to Like. Each Like uses 1 of your 30 daily. Resets tomorrow.</p>
<div class="circles" id="circles"></div>'''
    )
# Replace old circles JS with map + daily limit logic
old = """// 30 circling profiles
const names=["Amina","Carlos","Maria","John","Fatima","David","Sofia","James","Luna","Peter","Nina","Alex","Marta","Kevin","Ada","Luis","Zoe","Emma","Noah","Mia","Liam","Ava","Ethan","Chloe","Lucas","Elena","Omar","Sara","Diego","Grace"];
let c=document.getElementById('circles');
if(c){ c.innerHTML=names.map((n,i)=>`<div class="circle" onclick="alert('Viewing '+n)"><div>👤<br><span>${n}</span></div></div>`).join(''); }"""
new = """// MAP + 30 DAILY LIMIT
const names=["Amina","Carlos","Maria","John","Fatima","David","Sofia","James","Luna","Peter","Nina","Alex","Marta","Kevin","Ada","Luis","Zoe","Emma","Noah","Mia","Liam","Ava","Ethan","Chloe","Lucas","Elena","Omar","Sara","Diego","Grace"];
const countries=["Equatorial Guinea","Nigeria","Cameroon","Spain","Ghana","France","USA","Kenya","Brazil","Germany","Morocco","Italy","Senegal","UK","Mexico","Portugal","Egypt","Canada","Colombia","Turkey","South Africa","India","Poland","Netherlands","Chile","Argentina","Japan","Australia","Peru","Belgium"];
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
function likePerson(name){
  let liked=getLiked();
  if(liked.includes(name)){ alert(name+' already liked today'); return; }
  if(liked.length>=30){ alert('Daily limit reached! 30/30'); return; }
  liked.push(name); localStorage.setItem(todayKey(), JSON.stringify(liked));
  renderCircles(); initMap();
  alert('❤️ You liked '+name+'! '+(30-liked.length)+' left today');
}
function initMap(){
  let m=document.getElementById('map'); if(!m||!window.L) return;
  if(window._map){ window._map.remove(); }
  let map=L.map('map').setView([3.75, 8.78], 2); window._map=map;
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19}).addTo(map);
  let liked=getLiked();
  names.forEach((n,i)=>{
    let lat=3.75 + (Math.sin(i*2.3)*25);
    let lng=8.78 + (Math.cos(i*1.7)*45);
    let color=liked.includes(n)?'red':'pink';
    L.circleMarker([lat,lng],{radius:8,color:color,fillColor:color,fillOpacity:0.9}).addTo(map).bindPopup('<b>'+n+'</b><br>'+countries[i]+'<br><button onclick="likePerson(\\''+n+'\\')">❤️ Like</button>');
  });
}
renderCircles();
setTimeout(initMap, 500);
"""
if old in t:
    t = t.replace(old, new)
else:
    t = t.replace("function showTab(name){", new + "function showTab(name){")
# Refresh map when Discover opened
t = t.replace("document.getElementById('btn-'+name).classList.add('active');", "document.getElementById('btn-'+name).classList.add('active'); if(name=='discover'){ setTimeout(initMap,300); }")
p.write_text(t)
print("DONE - Map + 30 daily limit added")
