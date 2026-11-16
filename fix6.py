import pathlib, re
p = pathlib.Path("notifications.js")
t = p.read_text()
old = "  el.innerHTML='';\n  var box=document.createElement('div');"
assert old in t
new = "  el.innerHTML=''; el.style.display='';\n  var box=document.createElement('div');"
t = t.replace(old, new, 1)
p.write_text(t)
print("OK display reset")
p2 = pathlib.Path("index.html")
h = p2.read_text()
mm = re.search(r"notifications\.js\?v=(\d+)", h)
v = int(mm.group(1))+1
h = h.replace(f"notifications.js?v={mm.group(1)}", f"notifications.js?v={v}")
p2.write_text(h)
print("bumped to", v)
