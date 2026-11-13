import pathlib
p = pathlib.Path("script.js")
lines = p.read_text().splitlines()
drop = [
    'Santiago, Santiago Metropolitan, Chile',
    'Santo Domingo, Santo Domingo, Dominican Republic',
    'San Juan, San Juan, Caribbean',
]
out = [l for l in lines if not any(d in l for d in drop)]
p.write_text("\n".join(out) + "\n")
print(f"removed {len(lines)-len(out)} dupes/bad entries")
