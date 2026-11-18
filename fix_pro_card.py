import pathlib
p = pathlib.Path("index.html")
t = p.read_text()

# 1. Professional CSS - replace old swipe-card CSS
old_css = ".swipe-card{background:#222;border-radius:20px;overflow:hidden;margin:12px 0;box-shadow:0 10px 30px rgba(0,0,0,.4)}"
new_css = ".swipe-card{background:#1a1a1a;border-radius:22px;overflow:hidden;margin:12px 0;box-shadow:0 12px 35px rgba(0,0,0,.55);border:1px solid #2a2a2a}"
t = t.replace(old_css, new_css)

# 2. Bigger photo + better buttons
t = t.replace(".swipe-card .photo{height:360px;", ".swipe-card .photo{height:440px;")
t = t.replace(".swipe-actions button{flex:1;padding:16px;font-size:18px;border-radius:50px}", ".swipe-actions button{flex:1;padding:16px;font-size:18px;border-radius:50px;font-weight:800}.swipe-actions{align-items:center}")
t = t.replace(".btn-like{background:#ff5a8a !important}", ".btn-like{background:linear-gradient(135deg,#ff5a8a,#ff8a5c) !important;box-shadow:0 6px 20px rgba(255,90,138,.5);transform:scale(1.08)}")

p.write_text(t)
print("PRO CARD DONE")
