import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Nassau","New Providence"),("Bridgetown","Saint Michael"),("San Juan","San Juan"),("St Johns","Saint John"),("Castries","Castries"),("Kingstown","Saint George"),("Roseau","Saint George"),("Basseterre","Saint George Basseterre"),("St Georges","Saint George"),("Hamilton","Pembroke")]:
    data.append((city,state,"Caribbean"))
for city,state in [("Cairo","Cairo"),("Alexandria","Alexandria"),("Giza","Giza"),("Port Said","Port Said"),("Suez","Suez"),("Luxor","Luxor"),("Aswan","Aswan"),("Mansoura","Dakahlia"),("Tanta","Gharbia"),("Assiut","Assiut"),("Ismailia","Ismailia"),("Faiyum","Faiyum"),("Minya","Minya"),("Qena","Qena"),("Hurghada","Red Sea")]:
    data.append((city,state,"Egypt"))
for city,state in [("Casablanca","Casablanca-Settat"),("Rabat","Rabat-Sale-Kenitra"),("Marrakech","Marrakech-Safi"),("Fez","Fes-Meknes"),("Tangier","Tangier-Tetouan-Al Hoceima"),("Agadir","Souss-Massa"),("Oujda","Oriental"),("Meknes","Fes-Meknes"),("Kenitra","Rabat-Sale-Kenitra"),("Tetouan","Tangier-Tetouan-Al Hoceima"),("Safi","Marrakech-Safi"),("Errachidia","Draa-Tafilalet")]:
    data.append((city,state,"Morocco"))
for city,state in [("Algiers","Algiers"),("Oran","Oran"),("Constantine","Constantine"),("Annaba","Annaba"),("Blida","Blida"),("Setif","Setif"),("Batna","Batna"),("Tlemcen","Tlemcen"),("Bejaia","Bejaia"),("Tizi Ouzou","Tizi Ouzou"),("Biskra","Biskra"),("Ghardaia","Ghardaia"),("Tamanrasset","Tamanrasset"),("Bechar","Bechar"),("Ouargla","Ouargla")]:
    data.append((city,state,"Algeria"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-14-OK added {len(data)}")
