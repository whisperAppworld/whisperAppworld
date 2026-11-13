import pathlib, re
p = pathlib.Path("script.js")
# backup
pathlib.Path("script.js.bak-phase2").write_text(p.read_text())
t = p.read_text()
lines = t.splitlines()
seen = set()
out = []
removed = 0
for line in lines:
    m = re.search(r'location: "([^"]+)"', line)
    if m and 'name:' in line:
        loc = m.group(1)
        # keep first of each location, drop exact duplicates
        if loc in seen:
            removed += 1
            continue
        seen.add(loc)
    out.append(line)
p.write_text("\n".join(out) + "\n")
print(f"PHASE3-DEDUP-OK removed {removed} dupes, unique locations: {len(seen)}")
