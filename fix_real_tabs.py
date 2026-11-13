import pathlib, re
p = pathlib.Path("index.html")
t = p.read_text()
# 1. Fix Profile button
t = t.replace('id="btn-profile" class="active" onclick="showTab(\'discover\')"', 'id="btn-profile" onclick="showTab(\'profile\')"')
# 2. Extract box and remove it from floating position
m = re.search(r'<div id="my-profile-box".*?<p id="pf-status".*?</p>\s*</div>', t, flags=re.S)
box = m.group(0) if m else ''
if m: t = t.replace(box, '')
# 3. Put box INSIDE tab-profile, right after <section id="tab-profile"
t = t.replace('<section id="tab-profile" class="active">', '<section id="tab-profile">'+box, 1)
if '<section id="tab-profile">' not in t:
    # fallback if class differs
    t = re.sub(r'(<section id="tab-profile"[^>]*>)', r'\1'+box, t, count=1)
# 4. Default tab = Discover, not Profile
t = t.replace('<section id="tab-profile" class="active">', '<section id="tab-profile">')
t = t.replace('<section id="tab-discover">', '<section id="tab-discover" class="active">')
t = t.replace('id="btn-discover" onclick', 'id="btn-discover" class="active" onclick')
# 5. Remove broken old fixes that fight showTab
t = re.sub(r'<!-- FORCE DISCOVER DEFAULT -->.*?</script>', '', t, flags=re.S)
t = re.sub(r'<style>#my-profile-box.*?display:block !important</style>', '', t, flags=re.S)
t = re.sub(r'<script>\s*// Track real current tab.*?</script>', '', t, flags=re.S)
t = re.sub(r'<style>#my-profile-box.*?display:block</style>', '', t, flags=re.S)
t = re.sub(r'<script>\s*function fixProfileBoxVisibility.*?</script>', '', t, flags=re.S)
p.write_text(t)
print("REAL TABS FIX DONE, box in profile?", 'tab-profile' in t and 'my-profile-box' in t)
