import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Lome","Maritime"),("Sokode","Centrale"),("Kara","Kara"),("Kpalime","Plateaux"),("Atakpame","Plateaux")]:
    data.append((city,state,"Togo"))
for city,state in [("Cotonou","Littoral"),("Porto-Novo","Oueme"),("Parakou","Borgou"),("Abomey-Calavi","Atlantique"),("Djougou","Donga"),("Bohicon","Zou"),("Natitingou","Atakora"),("Ouidah","Atlantique"),("Lokossa","Mono"),("Kandi","Alibori")]:
    data.append((city,state,"Benin"))
for city,state in [("Conakry","Conakry"),("Nzerekore","Nzerekore"),("Kankan","Kankan"),("Kindia","Kindia"),("Labe","Labe"),("Mamou","Mamou"),("Boke","Boke"),("Faranah","Faranah")]:
    data.append((city,state,"Guinea"))
for city,state in [("Freetown","Western Area"),("Bo","Southern"),("Kenema","Eastern"),("Makeni","Northern"),("Koidu","Eastern")]:
    data.append((city,state,"Sierra Leone"))
for city,state in [("Monrovia","Montserrado"),("Gbarnga","Bong"),("Buchanan","Grand Bassa"),("Ganta","Nimba"),("Kakata","Margibi"),("Zwedru","Grand Gedeh"),("Harper","Maryland"),("Voinjama","Lofa")]:
    data.append((city,state,"Liberia"))
for city,state in [("Nouakchott","Nouakchott"),("Nouadhibou","Dakhlet Nouadhibou"),("Rosso","Trarza"),("Kaedi","Gorgol"),("Zouerat","Tiris Zemmour"),("Kiffa","Assaba"),("Atar","Adrar"),("Selibaby","Guidimaka")]:
    data.append((city,state,"Mauritania"))
for city,state in [("Banjul","Banjul"),("Serekunda","Kanifing"),("Brikama","West Coast"),("Farafenni","North Bank"),("Basse Santa Su","Upper River")]:
    data.append((city,state,"Gambia"))
for city,state in [("Bissau","Bissau"),("Bafata","Bafata"),("Gabú","Gabu"),("Bissorã","Oio"),("Cacheu","Cacheu")]:
    data.append((city,state,"Guinea-Bissau"))
for city,state in [("Praia","Santiago"),("Mindelo","Sao Vicente"),("Santa Maria","Sal"),("Assomada","Santiago")]:
    data.append((city,state,"Cape Verde"))
for city,state in [("Sao Tome","Agua Grande"),("Santo Antonio","Principe")]:
    data.append((city,state,"Sao Tome and Principe"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-20-OK added {len(data)}")
