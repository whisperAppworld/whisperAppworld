import pathlib, re
p = pathlib.Path("script.js")
t = p.read_text()
# split the giant line back into one profile per line
# profiles end with " }," - put a newline after each
t2 = re.sub(r'\},', '},\n', t)
# clean up double blank lines
t2 = re.sub(r'\n\s*\n+', '\n', t2)
p.write_text(t2)
print("NEWLINE-FIX-OK")
