import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Minsk","Minsk"),("Gomel","Gomel"),("Mogilev","Mogilev"),("Vitebsk","Vitebsk"),("Grodno","Grodno"),("Brest","Brest")]:
    data.append((city,state,"Belarus"))
for city,state in [("Chisinau","Chisinau"),("Tiraspol","Transnistria"),("Balti","Balti"),("Bender","Bender"),("Comrat","Gagauzia")]:
    data.append((city,state,"Moldova"))
for city,state in [("Tirana","Tirana"),("Durres","Durres"),("Vlore","Vlore"),("Shkoder","Shkoder"),("Elbasan","Elbasan"),("Korce","Korce")]:
    data.append((city,state,"Albania"))
for city,state in [("Sarajevo","Sarajevo"),("Banja Luka","Republika Srpska"),("Mostar","Herzegovina-Neretva"),("Tuzla","Tuzla"),("Zenica","Zenica-Doboj"),("Bihac","Una-Sana")]:
    data.append((city,state,"Bosnia and Herzegovina"))
for city,state in [("Skopje","Skopje"),("Bitola","Pelagonia"),("Kumanovo","Northeastern"),("Tetovo","Polog"),("Ohrid","Southwestern")]:
    data.append((city,state,"North Macedonia"))
for city,state in [("Podgorica","Podgorica"),("Niksic","Niksic"),("Bar","Bar"),("Budva","Budva"),("Kotor","Kotor")]:
    data.append((city,state,"Montenegro"))
for city,state in [("Belgrade","Belgrade"),("Novi Sad","Vojvodina"),("Nis","Nisava"),("Kragujevac","Sumadija"),("Subotica","Vojvodina"),("Zrenjanin","Vojvodina"),("Pancevo","Vojvodina"),("Cacak","Moravica")]:
    data.append((city,state,"Serbia"))
for city,state in [("Pristina","Pristina"),("Prizren","Prizren"),("Peja","Peja"),("Mitrovica","Mitrovica"),("Gjakova","Gjakova")]:
    data.append((city,state,"Kosovo"))
for city,state in [("Sofia","Sofia"),("Plovdiv","Plovdiv"),("Varna","Varna"),("Burgas","Burgas"),("Ruse","Ruse"),("Stara Zagora","Stara Zagora"),("Pleven","Pleven"),("Sliven","Sliven")]:
    data.append((city,state,"Bulgaria"))
for city,state in [("Bucharest","Bucharest"),("Cluj-Napoca","Cluj"),("Timisoara","Timis"),("Iasi","Iasi"),("Constanta","Constanta"),("Craiova","Dolj"),("Brasov","Brasov"),("Galati","Galati"),("Ploiesti","Prahova"),("Oradea","Bihor")]:
    data.append((city,state,"Romania"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-25-OK added {len(data)}")
