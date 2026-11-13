import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
# remove the duplicate Madrid with longer state name, keep the short one
old = '  { name: "Ada, 22", location: "Madrid, Community of Madrid, Spain"'
# find and remove that whole line
lines = t.splitlines()
out = [l for l in lines if 'Madrid, Community of Madrid, Spain' not in l]
p.write_text("\n".join(out) + "\n")
print(f"removed {len(lines)-len(out)} Madrid dupe")
