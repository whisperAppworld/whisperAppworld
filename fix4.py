import pathlib, re
p = pathlib.Path("notifications.js")
t = p.read_text()
old = "  try{ askNotifyWhenOnline(otherId, otherName); }catch(e){}"
assert old in t
new = "  try{ window._notifyDone = window._notifyDone || {}; window._notifyDone[otherId]=1; localStorage.setItem('notify_done_'+otherId,'1'); }catch(e){}\n  try{ askNotifyWhenOnline(otherId, otherName); }catch(e){}"
t = t.replace(old, new, 1)
p.write_text(t)
print("handler now sets notify_done")
p2 = pathlib.Path("index.html")
h = p2.read_text()
mm = re.search(r"notifications\.js\?v=(\d+)", h)
v = int(mm.group(1))+1
h = h.replace(f"notifications.js?v={mm.group(1)}", f"notifications.js?v={v}")
p2.write_text(h)
print("bumped notifications to", v)
