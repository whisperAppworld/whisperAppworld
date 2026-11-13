import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Accra","Greater Accra"),("Kumasi","Ashanti"),("Tamale","Northern"),("Sekondi-Takoradi","Western"),("Cape Coast","Central"),("Ho","Volta"),("Koforidua","Eastern"),("Sunyani","Bono"),("Bolgatanga","Upper East"),("Wa","Upper West"),("Techiman","Bono East"),("Dambai","Oti"),("Goaso","Ahafo"),("Nalerigu","North East"),("Damongo","Savannah"),("Sefwi Wiawso","Western North")]:
    data.append((city,state,"Ghana"))
for city,state in [("Abidjan","Abidjan"),("Bouake","Vallee du Bandama"),("Daloa","Haut-Sassandra"),("Yamoussoukro","Yamoussoukro"),("San-Pedro","Bas-Sassandra"),("Korhogo","Poro"),("Man","Tonkpi"),("Gagnoa","Goh"),("Divo","Loh-Djiboua"),("Abengourou","Indenie-Djuablin"),("Odienne","Kabadougou"),("Bondoukou","Gontougo")]:
    data.append((city,state,"Ivory Coast"))
for city,state in [("Dakar","Dakar"),("Thies","Thies"),("Kaolack","Kaolack"),("Ziguinchor","Ziguinchor"),("Saint-Louis","Saint-Louis"),("Touba","Diourbel"),("Tambacounda","Tambacounda"),("Kolda","Kolda"),("Fatick","Fatick"),("Louga","Louga"),("Matam","Matam"),("Kedougou","Kedougou")]:
    data.append((city,state,"Senegal"))
for city,state in [("Bamako","Bamako"),("Sikasso","Sikasso"),("Segou","Segou"),("Kayes","Kayes"),("Mopti","Mopti"),("Gao","Gao"),("Koulikoro","Koulikoro"),("Timbuktu","Tombouctou")]:
    data.append((city,state,"Mali"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-18-OK added {len(data)}")
