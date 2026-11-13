import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Madrid","Community of Madrid"),("Barcelona","Catalonia"),("Valencia","Valencian Community"),("Seville","Andalusia"),("Bilbao","Basque Country"),("A Coruna","Galicia"),("Oviedo","Asturias"),("Santander","Cantabria"),("Zaragoza","Aragon"),("Palma","Balearic Islands"),("Las Palmas","Canary Islands"),("Murcia","Region of Murcia"),("Pamplona","Navarre"),("Logrono","La Rioja"),("Merida","Extremadura"),("Valladolid","Castile and Leon"),("Toledo","Castile-La Mancha"),("Ceuta","Ceuta"),("Melilla","Melilla")]:
    data.append((city,state,"Spain"))
for city,state in [("Rome","Lazio"),("Milan","Lombardy"),("Naples","Campania"),("Turin","Piedmont"),("Florence","Tuscany"),("Venice","Veneto"),("Bologna","Emilia-Romagna"),("Genoa","Liguria"),("Bari","Apulia"),("Palermo","Sicily"),("Cagliari","Sardinia"),("Ancona","Marche"),("Perugia","Umbria"),("LAquila","Abruzzo"),("Campobasso","Molise"),("Potenza","Basilicata"),("Catanzaro","Calabria"),("Trento","Trentino-Alto Adige"),("Aosta","Aosta Valley"),("Trieste","Friuli-Venezia Giulia")]:
    data.append((city,state,"Italy"))
for city,state in [("London","London"),("Manchester","North West England"),("Birmingham","West Midlands"),("Leeds","Yorkshire"),("Newcastle","North East England"),("Bristol","South West England"),("Norwich","East of England"),("Southampton","South East England"),("Nottingham","East Midlands"),("Edinburgh","Scotland"),("Cardiff","Wales"),("Belfast","Northern Ireland")]:
    data.append((city,state,"United Kingdom"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-5-OK added {len(data)}")
