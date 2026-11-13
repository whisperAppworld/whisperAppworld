import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
# 1. Add more profiles for Map - Nigeria + Africa + World
old_profiles = """  { name: "Sofia, 23", location: "Douala, Cameroon", bio: "Anonymous for now. Ask me anything.", promptQ: "A secret I never tell is...", promptA: "I overthink every text I send.", img: "https://i.pravatar.cc/400?img=45" }
];"""
new_profiles = """  { name: "Sofia, 23", location: "Douala, Cameroon", bio: "Anonymous for now. Ask me anything.", promptQ: "A secret I never tell is...", promptA: "I overthink every text I send.", img: "https://i.pravatar.cc/400?img=45" },
  { name: "Chiamaka, 23", location: "Port Harcourt, Nigeria", bio: "Lover of afrobeats and long talks.", promptQ: "A perfect day for me is...", promptA: "Beach, music, and good company.", img: "https://i.pravatar.cc/400?img=32" },
  { name: "Kwame, 26", location: "Accra, Ghana", bio: "Calm, funny, loves football and food.", promptQ: "I get excited about...", promptA: "Good jollof and deep conversations.", img: "https://i.pravatar.cc/400?img=13" },
  { name: "Zawadi, 24", location: "Nairobi, Kenya", bio: "Sunset lover, coffee addict.", promptQ: "My love language is...", promptA: "Quality time and honest talks.", img: "https://i.pravatar.cc/400?img=44" },
  { name: "Thabo, 27", location: "Johannesburg, South Africa", bio: "Music, gym, and late night chats.", promptQ: "A perfect day for me is...", promptA: "Braai with friends and good music.", img: "https://i.pravatar.cc/400?img=53" },
  { name: "Layla, 22", location: "Cairo, Egypt", bio: "Poetry, art, and quiet nights.", promptQ: "A secret I never tell is...", promptA: "I write poems about strangers.", img: "https://i.pravatar.cc/400?img=49" },
  { name: "Emma, 24", location: "London, UK", bio: "Tea, books, and long walks.", promptQ: "My love language is...", promptA: "Deep talks and remembering details.", img: "https://i.pravatar.cc/400?img=31" },
  { name: "Chris, 25", location: "New York, USA", bio: "City boy, loves music and movies.", promptQ: "I get excited about...", promptA: "New places and real people.", img: "https://i.pravatar.cc/400?img=15" }
];"""
assert old_profiles in t, "PROFILES-NOT-FOUND"
t = t.replace(old_profiles, new_profiles)
# 2. Append Map logic
map_js = """
// ---- MAP TAB ----
let mapFilter = 'all';
let mapCity = 'Malabo';
function getMapPeople(){
  let list = profiles.slice();
  if(mapFilter === 'online') list = list.filter((_,i)=> i % 2 === 0);
  if(mapFilter === 'near') list = list.filter(p => p.location.includes('Malabo') || p.location.includes('Nigeria') || p.location.includes('Cameroon') || p.location.includes('Ghana'));
  if(mapCity && mapCity.toLowerCase() !== 'malabo'){
    const q = mapCity.toLowerCase();
    const byCity = list.filter(p => p.location.toLowerCase().includes(q));
    if(byCity.length) list = byCity;
  }
  return list;
}
function renderMap(){
  const listEl = document.getElementById('map-list');
  const pinsEl = document.getElementById('map-pins');
  const countEl = document.getElementById('map-count');
  const emptyEl = document.getElementById('map-empty');
  const labelEl = document.getElementById('map-center-label');
  if(!listEl) return;
  const people = getMapPeople();
  if(labelEl) labelEl.textContent = mapCity;
  if(countEl) countEl.textContent = people.length + ' people';
  if(emptyEl) emptyEl.style.display = people.length ? 'none' : 'block';
  if(pinsEl){
    pinsEl.innerHTML = '';
    const spots = [[18,22],[68,30],[30,65],[75,65],[45,35],[60,45],[22,48],[80,50]];
    people.forEach((person,i)=>{
      const s = spots[i % spots.length];
      const d = document.createElement('div');
      d.textContent = '📍';
      d.title = person.name + ' - ' + person.location;
      d.style.cssText = 'position:absolute;left:'+s[0]+'%;top:'+s[1]+'%;font-size:26px;cursor:pointer;';
      d.onclick = ()=>{ const idx = profiles.indexOf(person); if(idx>=0){ currentIndex = idx; showProfile(idx); document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active")); document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active")); document.getElementById("discover").classList.add("active"); document.querySelector('[data-screen="discover"]').classList.add("active"); } };
      pinsEl.appendChild(d);
    });
  }
  listEl.innerHTML = '';
  people.forEach((person)=>{
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:10px;align-items:center;background:white;padding:10px;border-radius:15px;';
    row.innerHTML = '<img src="'+person.img+'" style="width:50px;height:50px;border-radius:50%;object-fit:cover;"><div style="flex:1;"><strong>'+person.name+'</strong><br><span style="color:#888;font-size:13px;">'+person.location+'</span><br><span style="font-size:13px;">'+person.bio+'</span></div><button style="background:#6C63FF;color:white;border:none;padding:8px 14px;border-radius:20px;font-weight:bold;">View</button>';
    row.querySelector('button').onclick = ()=>{ const idx = profiles.indexOf(person); if(idx>=0){ currentIndex = idx; showProfile(idx); document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active")); document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active")); document.getElementById("discover").classList.add("active"); document.querySelector('[data-screen="discover"]').classList.add("active"); } };
    listEl.appendChild(row);
  });
}
document.addEventListener('click', function(e){
  if(e.target && e.target.classList && e.target.classList.contains('map-filter')){
    mapFilter = e.target.getAttribute('data-filter');
    document.querySelectorAll('.map-filter').forEach(b=>{ b.style.background='#eee'; b.style.color='black'; });
    e.target.style.background='#6C63FF'; e.target.style.color='white';
    renderMap();
  }
  if(e.target && e.target.id === 'map-search-btn'){
    const v = document.getElementById('map-search').value.trim();
    if(v){ mapCity = v; renderMap(); }
  }
});
const _origNav = document.querySelectorAll('.nav-btn');
_origNav.forEach(btn=>{
  btn.addEventListener('click', ()=>{ if(btn.getAttribute('data-screen')==='location'){ setTimeout(renderMap, 50); } });
});
setTimeout(renderMap, 500);
"""
p.write_text(t + map_js)
print("MAP-JS-OK")
