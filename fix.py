import pathlib, re
p = pathlib.Path("notifications.js")
t = p.read_text()
pat = re.compile(r"async function checkOfflineBanner.*?window\.checkOfflineBanner=checkOfflineBanner;", re.DOTALL)
m = pat.search(t)
assert m, "not found"
new = "async function checkOfflineBanner(otherId, otherName, lastSeen){\n"
new += "  var el=document.getElementById('offline-notify-bar');\n"
new += "  if(!el){ el=document.createElement('div'); el.id='offline-notify-bar'; var cv=document.getElementById('chat-view'); if(cv) cv.parentNode.insertBefore(el,cv); }\n"
new += "  var isOnline = lastSeen && (Date.now()-new Date(lastSeen).getTime())<120000;\n"
new += "  if(isOnline){ el.innerHTML=''; return; }\n"
new += "  el.innerHTML='';\n"
new += "  var box=document.createElement('div');\n"
new += "  box.style.cssText='background:#222;border:1px solid #333;border-radius:12px;padding:10px;margin:8px;text-align:center';\n"
new += "  box.textContent=otherName+' is offline';\n"
new += "  var btn=document.createElement('button');\n"
new += "  btn.textContent='Notify me when online';\n"
new += "  btn.style.cssText='margin-top:8px;padding:10px 16px;border-radius:999px;border:0;background:#ff5a8a;color:#fff;font-weight:700';\n"
new += "  btn.onclick=function(){ window.handleNotifyClick(otherId, otherName); };\n"
new += "  box.appendChild(document.createElement('br')); box.appendChild(btn); el.appendChild(box);\n"
new += "}\n"
new += "window.checkOfflineBanner=checkOfflineBanner;\n"
new += "window.handleNotifyClick=function(otherId, otherName){\n"
new += "  try{ askNotifyWhenOnline(otherId, otherName); }catch(e){}\n"
new += "  var el=document.getElementById('offline-notify-bar'); if(!el) return;\n"
new += "  el.textContent='We will notify you when '+otherName+' is online';\n"
new += "  el.style.cssText='background:#222;border:1px solid #333;border-radius:12px;padding:10px;margin:8px;text-align:center';\n"
new += "  setTimeout(function(){ var b=document.getElementById('offline-notify-bar'); if(b) b.innerHTML=''; }, 2500);\n"
new += "};\n"
t2 = t[:m.start()] + new + t[m.end():]
p.write_text(t2)
print("OK fixed")
p2 = pathlib.Path("index.html")
h = p2.read_text()
mm = re.search(r"notifications\.js\?v=(\d+)", h)
v = int(mm.group(1))+1
h = h.replace(f"notifications.js?v={mm.group(1)}", f"notifications.js?v={v}")
p2.write_text(h)
print("bumped to", v)
