import pathlib
p = pathlib.Path('index.html')
t = p.read_text()
old = "await window.supabase.from('profiles').update({email_verified:!!emailVerified, photo_verified:!!photoVerified}).eq('user_id', user.id);"
new = "if(photoVerified){ await window.supabase.from('profiles').update({email_verified:!!emailVerified, photo_verified:true}).eq('user_id', user.id); }"
assert old in t, 'pattern not found'
p.write_text(t.replace(old, new))
print('patched ok')
