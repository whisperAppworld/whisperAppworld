import pathlib, re
# --- notifications.js: bar INSIDE chat-view + remember clicked ---
p = pathlib.Path("notifications.js")
t = p.read_text()
t = t.replace(
  "if(!el){ el=document.createElement('div'); el.id='offline-notify-bar'; var cv=document.getElementById('chat-view'); if(cv) cv.parentNode.insertBefore(el,cv); }",
  "if(!el){ el=document.createElement('div'); el.id='offline-notify-bar'; var cv=document.getElementById('chat-view'); if(cv) cv.insertBefore(el, cv.firstChild); }",
  1)
# guard: never show again after click
old = "  if(isOnline){ el.innerHTML=''; return; }"
if "notify_done_" not in t:
    new = "  if(isOnline){ el.innerHTML=''; return; }\n  try{ if(window._notifyDone && window._notifyDone[otherId]){ el.innerHTML=''; return; } }catch(e){}\n  try{ if(localStorage.getItem('notify_done_'+otherId)==='1'){ el.innerHTML=''; return; } }catch(e){}"
    t = t.replace(old, new, 1)
# banner text: add black dot AFTER offline
t = t.replace("box.textContent=otherName+' is offline';", "box.textContent=otherName+' is offline  \\u25cf';", 1)
# mark done in click handler
old2 = "  try{ askNotifyWhenOnline(otherId, otherName); }catch(e){}"
if "notify_done_" not in t.split("handleNotifyClick")[1] if "handleNotifyClick" in t else True:
    pass
if "_notifyDone" not in t:
    t = t.replace(old2, "  try{ window._notifyDone = window._notifyDone || {}; window._notifyDone[otherId]=1; localStorage.setItem('notify_done_'+otherId,'1'); }catch(e){}\n  try{ askNotifyWhenOnline(otherId, otherName); }catch(e){}", 1)
p.write_text(t)
print("notifications OK")

# --- chat-fix.js: header sub = Online / Offline with dot AFTER ---
p2 = pathlib.Path("chat-fix.js")
h = p2.read_text()
old_h = "(fixIsOnline(_fixOtherProfile.last_seen)?'<span style=\"color:#22c55e\">\\u25cf Online</span>':fixEsc(fixFmtLastSeen(_fixOtherProfile.last_seen)))"
# fallback: find the actual line pattern without unicode escapes
if old_h not in h:
    # search for the sub part generically
    m = re.search(r"\(fixIsOnline\(_fixOtherProfile\.last_seen\)\?.*?fixFmtLastSeen\(_fixOtherProfile\.last_seen\)\)\)", h)
    print("header pattern found:", bool(m))
    if m:
        h = h[:m.start()] + "(fixIsOnline(_fixOtherProfile.last_seen)?'<span style=\"color:#22c55e\">Online \\u25cf</span>':'<span style=\"color:#888\">Offline \\u25cf</span>')" + h[m.end():]
        print("header patched via regex")
else:
    h = h.replace(old_h, "(fixIsOnline(_fixOtherProfile.last_seen)?'<span style=\"color:#22c55e\">Online \\u25cf</span>':'<span style=\"color:#888\">Offline \\u25cf</span>')", 1)
    print("header patched direct")
p2.write_text(h)

# bump versions
for fname, key in [("index.html","notifications.js"), ("index.html","chat-fix.js")]:
    pp = pathlib.Path(fname)
    hh = pp.read_text()
    for k in ["notifications.js", "chat-fix.js"]:
        mm = re.search(k + r"\?v=(\d+)", hh)
        if mm:
            v = int(mm.group(1))+1
            hh = hh.replace(f"{k}?v={mm.group(1)}", f"{k}?v={v}")
            print(f"bumped {k} to {v}")
    pp.write_text(hh)
