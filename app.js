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
  const res = await fetch(BASE + "/rest/v1/profiles?select=*&order=created_at.desc", { headers });
  const data = await res.json();
  if(!Array.isArray(data)){ el.innerHTML = "<p>Create table profiles in Supabase first.</p>"; return; }
  if(!data.length){ el.innerHTML = "<p>No profiles yet. Be the first!</p>"; return; }
  el.innerHTML = data.map(p => { const gallery = (Array.isArray(p.photos) && p.photos.length ? p.photos : (p.img ? [p.img] : [])).filter(Boolean).slice(0,5); const galleryHtml = gallery.map((src,idx)=>`<img src="${src}" style="width:70px;height:70px;object-fit:cover;border-radius:10px;${idx===0?'border:2px solid #ff5a8a':''}">`).join(""); return `<div class="card"><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">${galleryHtml}</div><b>${p.name || "Anon"}${p.age ? ", " + p.age : ""}</b><p>📍 ${p.location || ""}</p><p>${p.bio || ""}</p><p><b>Interested in:</b> ${p.interests || "Not set"}</p><p><b>Speaks:</b> ${p.language || "Not set"}</p><p>${p.gender || ""} | Looking for: ${p.looking_for || ""}</p></div>`; }).join("");
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
