const BASE = window.SUPABASE_URL;
const KEY = window.SUPABASE_KEY;
const headers = { "apikey": KEY, "Authorization": "Bearer " + KEY, "Content-Type": "application/json", "Prefer": "return=representation" };

async function loadWhispers(){
  const res = await fetch(BASE + "/rest/v1/whispers?select=*&order=created_at.desc", { headers });
  const data = await res.json();
  const list = document.getElementById("list");
  if(!Array.isArray(data)){ list.innerHTML = "<p>Table not found yet. Create table whispers in Supabase.</p>"; return; }
  list.innerHTML = data.map(w => `<div class="card"><b>${w.name || "Anon"}</b><p>${w.text || ""}</p></div>`).join("");
}

async function loadProfiles(){
  const el = document.getElementById("profiles");
  if(!el) return;
  let data = [];
  try{
    const res = await fetch(BASE + "/rest/v1/profiles?select=*&order=created_at.desc", { headers });
    const j = await res.json();
    if(Array.isArray(j)) data = j;
  }catch(e){}
  // Merge your locally-saved profile (with all 5 photos) on top
  try{
    const local = JSON.parse(localStorage.getItem('all_profiles')||'[]');
    const names = new Set(data.map(x=>x.name));
    const extra = local.filter(x=>!names.has(x.name)).map(x=>({name:x.name, location:x.country, img:x.photo|| (x.photos&&x.photos[0])||'', photos:x.photos||[], bio:x.bio||'', age:x.age||'', gender:x.gender||'', looking_for:x.looking_for||'', interests:x.interests||'', language:x.language||''}));
    data = [...extra, ...data];
  }catch(e){}
  if(!data.length){ el.innerHTML = "<p>No profiles yet. Be the first!</p>"; return; }
  el.innerHTML = data.map((p,pi) => {
    const gallery = (Array.isArray(p.photos) && p.photos.length ? p.photos : (p.img ? [p.img] : [])).filter(Boolean).slice(0,5);
    const main = gallery[0] || '';
    const thumbs = gallery.map((src,idx)=>`<img src="${src}" onclick="event.stopPropagation();window.open('${src}','_blank')" style="width:56px;height:56px;object-fit:cover;border-radius:10px;cursor:pointer;${idx===0?'border:2px solid #ff5a8a':''}">`).join("");
    return `<div class="card" onclick="if(this.querySelector('img')) window.open('${main}','_blank')" style="cursor:pointer"><div style="margin-bottom:8px">${main?`<img src="${main}" style="width:100%;height:240px;object-fit:cover;border-radius:14px;display:block">`:`<div style="height:240px;border-radius:14px;background:#222;display:flex;align-items:center;justify-content:center;font-size:40px">👤</div>`}</div><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">${thumbs}</div><b>${p.name || "Anon"}${p.age ? ", " + p.age : ""}</b><p>📍 ${p.location || ""}</p><p>${p.bio || ""}</p><p><b>Interested in:</b> ${p.interests || "Not set"}</p><p><b>Speaks:</b> ${p.language || "Not set"}</p><p>${p.gender || ""} | Looking for: ${p.looking_for || ""}</p><p style="font-size:12px;opacity:.7">Tap photo to open full size</p></div>`;
  }).join("");
}


async function sendWhisper(){
  const name = document.getElementById("name").value || "Anon";
  const text = document.getElementById("text").value;
  if(!text) return alert("Write something first");
  const res = await fetch(BASE + "/rest/v1/whispers", { method: "POST", headers, body: JSON.stringify({ name, text }) });
  if(!res.ok){ alert("Error: " + await res.text()); return; }
  document.getElementById("text").value = "";
  loadWhispers();
}

async function saveProfile(){
  const name = document.getElementById("p-name").value;
  const age = parseInt(document.getElementById("p-age").value);
  const location = document.getElementById("p-location").value;
  const gender = document.getElementById("p-gender").value;
  const looking_for = document.getElementById("p-looking").value;
  const bio = document.getElementById("p-bio").value;
  const interests = document.getElementById("p-interests").value;
  const language = document.getElementById("p-language").value;
  const urlPhotos = [];
  for(let i=0;i<5;i++){ const el=document.getElementById("p-img-"+i); if(el && el.value.trim()) urlPhotos.push(el.value.trim()); }
  const uploaded = (window._myPhotos||[]).filter(Boolean);
  const allPhotos = uploaded.length ? uploaded : urlPhotos;
  const img = allPhotos[0] || (document.getElementById("p-img") ? document.getElementById("p-img").value : "");
  const photos = allPhotos;
  if(!name) return alert("Add your name first");
  if(!location) return alert("Add Country first - e.g. Equatorial Guinea - Malabo");
  const res = await fetch(BASE + "/rest/v1/profiles", { method: "POST", headers, body: JSON.stringify({ id: crypto.randomUUID(), name, age, location, gender, looking_for, bio, interests, language, img, photos }) });
  if(!res.ok){ alert("Error: " + await res.text()); return; }
  alert("Profile saved!");
  loadProfiles();
}
loadWhispers();
loadProfiles();
