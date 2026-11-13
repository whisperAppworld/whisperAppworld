import pathlib, re
p = pathlib.Path("index.html")
t = p.read_text()
# 1. Add Profile Form in Profile section - before </div> of profile or before script
form_html = '''
<div id="my-profile-box" style="background:#222;padding:15px;border-radius:12px;margin:10px 0">
<h3>👤 Create My Profile</h3>
<p style="font-size:13px;color:#aaa">This will put YOU on the map!</p>
<input id="pf-name" placeholder="Your name" style="width:100%;padding:10px;margin:5px 0;border-radius:8px;border:none">
<select id="pf-country" style="width:100%;padding:10px;margin:5px 0;border-radius:8px">
<option value="Equatorial Guinea">Equatorial Guinea</option><option value="Nigeria">Nigeria</option><option value="Cameroon">Cameroon</option><option value="Ghana">Ghana</option><option value="Kenya">Kenya</option><option value="Spain">Spain</option><option value="France">France</option><option value="USA">USA</option><option value="UK">UK</option><option value="Brazil">Brazil</option><option value="Morocco">Morocco</option><option value="Senegal">Senegal</option><option value="South Africa">South Africa</option><option value="Germany">Germany</option><option value="Italy">Italy</option><option value="Mexico">Mexico</option><option value="Canada">Canada</option><option value="Egypt">Egypt</option><option value="India">India</option><option value="Colombia">Colombia</option>
</select>
<input type="file" id="pf-photo" accept="image/*" style="margin:5px 0;color:white">
<br><img id="pf-preview" style="width:80px;height:80px;border-radius:50%;object-fit:cover;display:none">
<br><button onclick="saveMyProfile()" style="background:#ff5a8a;color:white;border:none;padding:12px;width:100%;border-radius:10px;font-weight:bold;margin-top:8px">✅ Save & Show Me On Map</button>
<p id="pf-status" style="font-size:13px;color:#0f0"></p>
</div>
'''
if 'my-profile-box' not in t:
    # Try to insert at start of Profile tab, else before </body>
    if 'id="profile"' in t:
        t = t.replace('id="profile"', 'id="profile">'+form_html, 1)
    else:
        t = t.replace('</body>', form_html+'</body>')
# 2. Add JS functions for real profile
js = """
// REAL PROFILE -> MAP
const COUNTRY_POS = {'Equatorial Guinea':[3.75,8.78],'Nigeria':[9.08,7.48],'Cameroon':[3.87,11.52],'Ghana':[7.94,-1.02],'Kenya':[-0.02,37.9],'Spain':[40.46,-3.74],'France':[46.22,2.21],'USA':[37.09,-95.71],'UK':[55.37,-3.43],'Brazil':[-14.23,-51.92],'Morocco':[31.79,-7.09],'Senegal':[14.49,-14.45],'South Africa':[-30.55,22.93],'Germany':[51.16,10.45],'Italy':[41.87,12.56],'Mexico':[23.63,-102.55],'Canada':[56.13,-106.34],'Egypt':[26.82,30.80],'India':[20.59,78.96],'Colombia':[4.57,-74.29]};
let _myPhoto='';
document.addEventListener('change', function(e){ if(e.target && e.target.id=='pf-photo'){ let f=e.target.files[0]; if(!f) return; let r=new FileReader(); r.onload=function(ev){ _myPhoto=ev.target.result; let im=document.getElementById('pf-preview'); im.src=_myPhoto; im.style.display='block'; }; r.readAsDataURL(f); }});
function saveMyProfile(){
  let name=document.getElementById('pf-name').value.trim();
  let country=document.getElementById('pf-country').value;
  if(!name){ alert('Please enter your name'); return; }
  let prof={name:name, country:country, photo:_myPhoto||'', time:Date.now()};
  localStorage.setItem('my_profile', JSON.stringify(prof));
  let all=[]; try{ all=JSON.parse(localStorage.getItem('all_profiles')||'[]'); }catch(e){}
  all = all.filter(x=>x.name!==name); all.unshift(prof); localStorage.setItem('all_profiles', JSON.stringify(all));
  document.getElementById('pf-status').textContent='✅ Saved! Go to Discover - you are now on the map!';
  alert('✅ '+name+' from '+country+' is now on the map!');
  if(typeof renderCircles==='function') renderCircles();
  if(typeof initMap==='function') initMap();
}
function getRealProfiles(){ try{ return JSON.parse(localStorage.getItem('all_profiles')||'[]'); }catch(e){ return []; } }
"""
if 'saveMyProfile' not in t:
    t = t.replace('function showTab', js+'function showTab')
# 3. Make renderCircles + initMap include real profiles first
# Patch renderCircles to prepend real profiles - simple: after renderCircles definition, wrap initMap to add real markers
if 'getRealProfiles' in t and 'REAL MARKERS' not in t:
    t = t.replace('renderCircles();', '/*REAL MARKERS*/ let _origInitMap = typeof initMap==="function" ? initMap : null; function initMapWithReal(){ if(_origInitMap) _origInitMap(); let real=getRealProfiles(); if(window._map && window.L && real.length){ real.forEach(pr=>{ let pos=COUNTRY_POS[pr.country]||[3.75,8.78]; let html = pr.photo ? `<img src="${pr.photo}" style="width:30px;height:30px;border-radius:50%">` : "👤"; L.marker(pos).addTo(window._map).bindPopup(`<b>${pr.name}</b><br>${pr.country}<br>${pr.photo?`<img src="${pr.photo}" style="width:80px;border-radius:10px">`:``}`); }); } } initMap = initMapWithReal; renderCircles();')
p.write_text(t)
print("PROFILE DONE")
