import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
add = '  { name: "Kemunto, 24", location: "Kisii, Kisii, Kenya", bio: "From Kisii, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img=33" },\n'
t = t.replace(old, add + old)
p.write_text(t)
print("KISII-OK")
