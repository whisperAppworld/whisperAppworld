import pathlib, re
p = pathlib.Path("index.html")
t = p.read_text()
# 1. Remove ALL existing profile boxes, keep 1 clean copy
boxes = re.findall(r'<div id="my-profile-box".*?<p id="pf-status".*?</p>\s*</div>', t, flags=re.S)
print("found boxes:", len(boxes))
t = re.sub(r'<div id="my-profile-box".*?<p id="pf-status".*?</p>\s*</div>', '', t, flags=re.S)
box = boxes[0] if boxes else '''<div id="my-profile-box" style="background:#222;padding:15px;border-radius:12px;margin:10px 0"><h3>Create My Profile</h3><input id="pf-name" placeholder="Your name" style="width:100%;padding:10px;margin:5px 0;border-radius:8px;border:none"><select id="pf-country" style="width:100%;padding:10px;margin:5px 0;border-radius:8px"><option>Equatorial Guinea</option><option>Nigeria</option><option>Cameroon</option><option>Ghana</option><option>Kenya</option><option>Spain</option><option>France</option><option>USA</option><option>UK</option></select><input type="file" id="pf-photo" accept="image/*" style="margin:5px 0;color:white"><br><img id="pf-preview" style="width:80px;height:80px;border-radius:50%;object-fit:cover;display:none"><br><button id="pf-save-btn" type="button" style="background:#ff5a8a;color:white;border:none;padding:12px;width:100%;border-radius:10px;font-weight:bold;margin-top:8px">Save & Show Me On Map</button><p id="pf-status" style="color:#0f0"></p></div>'''
# 2. Insert it INSIDE profile tab - right after <... id="profile" ...>
m = re.search(r'<[^>]*id="profile"[^>]*>', t)
if m:
    t = t[:m.end()] + box + t[m.end():]
else:
    t = t.replace('</body>', box+'</body>')
# 3. Force: box only visible when Profile tab is visible
js = """
<style>#my-profile-box{display:none} #profile:not([style*="display: none"]) #my-profile-box{display:block}</style>
<script>
function fixProfileBoxVisibility(){
  var box=document.getElementById('my-profile-box');
  var prof=document.getElementById('profile');
  if(!box||!prof) return;
  var isHidden = (prof.style.display==='none' || getComputedStyle(prof).display==='none');
  box.style.display = isHidden ? 'none' : 'block';
}
setInterval(fixProfileBoxVisibility, 300);
document.addEventListener('click', function(){ setTimeout(fixProfileBoxVisibility, 100); });
</script>
"""
if 'fixProfileBoxVisibility' not in t:
    t = t.replace('</body>', js+'</body>')
p.write_text(t)
print("VISIBILITY FIX DONE")
