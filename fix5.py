import pathlib, re
p = pathlib.Path("notifications.js")
t = p.read_text()
# Replace whole handleNotifyClick with instant-hide version
pat = re.compile(r"window\.handleNotifyClick=function.*?^};", re.DOTALL | re.MULTILINE)
m = pat.search(t)
assert m, "handler not found"
new = "window.handleNotifyClick=function(otherId, otherName){\n"
new += "  try{ window._notifyDone = window._notifyDone || {}; window._notifyDone[otherId]=1; localStorage.setItem('notify_done_'+otherId,'1'); }catch(e){}\n"
new += "  try{ askNotifyWhenOnline(otherId, otherName); }catch(e){}\n"
new += "  var el=document.getElementById('offline-notify-bar'); if(!el) return;\n"
new += "  el.innerHTML=''; el.style.display='none';\n"
new += "};"
t = t[:m.start()] + new + t[m.end():]
p.write_text(t)
print("OK instant hide")
p2 = pathlib.Path("index.html")
h = p2.read_text()
mm = re.search(r"notifications\.js\?v=(\d+)", h)
v = int(mm.group(1))+1
h = h.replace(f"notifications.js?v={mm.group(1)}", f"notifications.js?v={v}")
p2.write_text(h)
print("bumped to", v)
