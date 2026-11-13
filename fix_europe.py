import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = [("Tirana","Tirana","Albania"),("Andorra la Vella","Andorra la Vella","Andorra"),("Vienna","Vienna","Austria"),("Minsk","Minsk","Belarus"),("Brussels","Brussels","Belgium"),("Sarajevo","Sarajevo","Bosnia and Herzegovina"),("Sofia","Sofia","Bulgaria"),("Zagreb","Zagreb","Croatia"),("Nicosia","Nicosia","Cyprus"),("Prague","Prague","Czechia"),("Copenhagen","Capital Region","Denmark"),("Tallinn","Harju","Estonia"),("Helsinki","Uusimaa","Finland"),("Paris","Ile-de-France","France"),("Berlin","Berlin","Germany"),("Athens","Attica","Greece"),("Budapest","Budapest","Hungary"),("Reykjavik","Capital Region","Iceland"),("Dublin","Leinster","Ireland"),("Rome","Lazio","Italy"),("Pristina","Pristina","Kosovo"),("Riga","Riga","Latvia"),("Vaduz","Vaduz","Liechtenstein"),("Vilnius","Vilnius","Lithuania"),("Luxembourg City","Luxembourg","Luxembourg"),("Valletta","South Eastern","Malta"),("Chisinau","Chisinau","Moldova"),("Monaco","Monaco","Monaco"),("Podgorica","Podgorica","Montenegro"),("Amsterdam","North Holland","Netherlands"),("Skopje","Skopje","North Macedonia"),("Oslo","Oslo","Norway"),("Warsaw","Mazovia","Poland"),("Lisbon","Lisbon","Portugal"),("Bucharest","Bucharest","Romania"),("Moscow","Moscow","Russia"),("San Marino","San Marino","San Marino"),("Belgrade","Belgrade","Serbia"),("Bratislava","Bratislava","Slovakia"),("Ljubljana","Ljubljana","Slovenia"),("Madrid","Madrid","Spain"),("Stockholm","Stockholm","Sweden"),("Bern","Bern","Switzerland"),("Kyiv","Kyiv","Ukraine"),("Vatican City","Vatican City","Vatican City")]
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, "\\n".join(lines) + "\\n" + old)
p.write_text(t)
print(f"EUROPE-OK added {len(data)}")
