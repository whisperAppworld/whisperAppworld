import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
out = []
in_single = False
in_double = False
escaped = False
for ch in t:
    if escaped:
        out.append(ch)
        escaped = False
        continue
    if ch == "\\":
        # keep backslash, next char is escaped if inside string
        if in_single or in_double:
            escaped = True
        out.append(ch)
        continue
    if ch == "'" and not in_double:
        in_single = not in_single
        out.append(ch)
        continue
    if ch == '"' and not in_single:
        in_double = not in_double
        out.append(ch)
        continue
    if ch == "\n" and (in_single or in_double):
        out.append("\\n")
        continue
    out.append(ch)
p.write_text("".join(out))
print("STRING-FIX-OK")
