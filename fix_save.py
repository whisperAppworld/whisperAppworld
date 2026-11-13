import pathlib, re
p = pathlib.Path("index.html")
t = p.read_text()
# Remove broken form if inside tag
t = re.sub(r'id="profile".*?my-profile-box.*?</div>\s*</div>', 'id="profile">', t, flags=re.S)
# Remove old broken my-profile-box block anywhere
t = re.sub(r'<div id="my-profile-box".*?<p id="pf-status".*?</p>\s*</div>', '', t, flags=re.S)
form_html = '''<div id="my-profile-box" style="background:#222;padding:15px;border-radius:12px;margin:10px 0"><h3>Create My Profile</h3><input id="pf-name" placeholder="Your name" style="width:100%;padding:10px;margin:5px 0;border-radius:8px;border:none"><select id="pf-country" style="width:100%;padding:10px;margin:5px 0;border-radius:8px"><option>Equatorial Guinea</option><option>Nigeria</option><option>Cameroon</option><option>Ghana</option><option>Kenya</option><option>Spain</option><option>France</option><option>USA</option><option>UK</option><option>Brazil</option><option>Morocco</option><option>Senegal</option><option>South Africa</option><option>Germany</option><option>Italy</option><option>Mexico</option><option>Canada</option><option>Egypt</option><option>India</option><option>Colombia</option></select><input type="file" id="pf-photo" accept="image/*" style="margin:5px 0;color:white"><br><img id="pf-preview" style="width:80px;height:80px;border-radius:50%;object-fit:cover;display:none"><br><button id="pf-save-btn" type="button" style="background:#ff5a8a;color:white;border:none;padding:12px;width:100%;border-radius:10px;font-weight:bold;margin-top:8px">Save & Show Me On Map</button><p id="pf-status" style="color:#0f0"></p></div>'''
# Insert after opening tag of profile div: find <... id="profile" ...>
m = re.search(r'<[^>]*id="profile"[^>]*>', t)
if m:
    t = t[:m.end()] + form_html + t[m.end():]
else:
    t = t.replace('</body>', form_html+'</body>')
# Ensure JS at end before </body> - clean old duplicate
js = """
<script>
window._myPhoto='';
document.addEventListener('change', function(e){ if(e.target && e.target.id=='pf-photo'){ var f=e.target.files[0]; if(!f) return; var r=new FileReader(); r.onload=function(ev){ window._myPhoto=ev.target.result; var im=document.getElementById('pf-preview'); if(im){im.src=window._myPhoto; im.style.display='block';} }; r.readAsDataURL(f); }});
function saveMyProfile(){
  var n=document.getElementById('pf-name'); var c=document.getElementById('pf-country');
  if(!n || !n.value.trim()){ alert('Please enter your name'); return; }
  var prof={name:n.value.trim(), country:c?c.value:'Equatorial Guinea', photo:window._myPhoto||'', time:Date.now()};
  try{ localStorage.setItem('my_profile', JSON.stringify(prof)); var all=[]; try{all=JSON.parse(localStorage.getItem('all_profiles')||'[]');}catch(e){} all=all.filter(function(x){return x.name!==prof.name}); all.unshift(prof); localStorage.setItem('all_profiles', JSON.stringify(all)); }catch(e){ alert('Storage error: '+e); return; }
  var st=document.getElementById('pf-status'); if(st) st.textContent='Saved! Go to Discover - you are now on the map!';
  alert(prof.name+' from '+prof.country+' is now on the map!');
  if(typeof initMap==='function'){ try{initMap();}catch(e){} }
}
document.addEventListener('click', function(e){ if(e.target && e.target.id=='pf-save-btn'){ saveMyProfile(); }});
window.saveMyProfile=saveMyProfile;
</script>
"""
if 'pf-save-btn' not in t or 'window.saveMyProfile' not in t:
    # remove old saveMyProfile script if exists to avoid duplicate
    t = t.replace('</body>', js+'</body>')
p.write_text(t)
print("SAVE FIX DONE", 'my-profile-box' in t, 'saveMyProfile' in t)
