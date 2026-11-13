import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
# literal backslash + n -> real newline
t = t.replace("\\n", "\n")
p.write_text(t)
print("NEWLINE-FIX-OK")
