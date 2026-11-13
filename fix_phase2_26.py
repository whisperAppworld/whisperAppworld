import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Belize City","Belize"),("San Ignacio","Cayo"),("Orange Walk","Orange Walk"),("Belmopan","Cayo"),("Dangriga","Stann Creek")]:
    data.append((city,state,"Belize"))
for city,state in [("Georgetown","Demerara-Mahaica"),("Linden","Upper Demerara-Berbice"),("New Amsterdam","East Berbice-Corentyne"),("Bartica","Cuyuni-Mazaruni"),("Lethem","Upper Takutu-Upper Essequibo")]:
    data.append((city,state,"Guyana"))
for city,state in [("Paramaribo","Paramaribo"),("Lelydorp","Wanica"),("Nieuw Nickerie","Nickerie"),("Moengo","Marowijne"),("Albina","Marowijne")]:
    data.append((city,state,"Suriname"))
for city,state in [("Nassau","New Providence"),("Freeport","Grand Bahama"),("Marsh Harbour","Abaco"),("George Town","Exuma"),("Alice Town","Bimini")]:
    data.append((city,state,"Bahamas"))
for city,state in [("Bridgetown","Saint Michael"),("Speightstown","Saint Peter"),("Oistins","Christ Church")]:
    data.append((city,state,"Barbados"))
for city,state in [("St Georges","Saint George"),("Gouyave","Saint John"),("Grenville","Saint Andrew"),("Sauteurs","Saint Patrick")]:
    data.append((city,state,"Grenada"))
for city,state in [("Castries","Castries"),("Gros Islet","Gros Islet"),("Soufriere","Soufriere"),("Vieux Fort","Vieux Fort")]:
    data.append((city,state,"Saint Lucia"))
for city,state in [("Kingstown","Saint George"),("Georgetown","Charlotte"),("Barrouallie","Saint Patrick"),("Port Elizabeth","Grenadines")]:
    data.append((city,state,"Saint Vincent and the Grenadines"))
for city,state in [("Saint Johns","Saint John"),("All Saints","Saint Peter"),("Liberta","Saint Paul"),("Falmouth","Saint Paul")]:
    data.append((city,state,"Antigua and Barbuda"))
for city,state in [("Roseau","Saint George"),("Portsmouth","Saint John"),("Marigot","Saint Andrew")]:
    data.append((city,state,"Dominica"))
for city,state in [("Basseterre","Saint George Basseterre"),("Charlestown","Saint Paul Charlestown")]:
    data.append((city,state,"Saint Kitts and Nevis"))
for city,state in [("Oranjestad","Oranjestad"),("San Nicolas","San Nicolas")]:
    data.append((city,state,"Aruba"))
for city,state in [("Willemstad","Willemstad"),("Barber","Bandabou")]:
    data.append((city,state,"Curacao"))
for city,state in [("George Town","Grand Cayman"),("West Bay","West Bay")]:
    data.append((city,state,"Cayman Islands"))
for city,state in [("Hamilton","Pembroke"),("Saint Georges","Saint Georges")]:
    data.append((city,state,"Bermuda"))
for city,state in [("San Juan","San Juan"),("Ponce","Ponce"),("Mayaguez","Mayaguez"),("Caguas","Caguas"),("Arecibo","Arecibo"),("Bayamon","Bayamon")]:
    data.append((city,state,"Puerto Rico"))
for city,state in [("Hagatna","Hagatna"),("Dededo","Dededo")]:
    data.append((city,state,"Guam"))
for city,state in [("Charlotte Amalie","Saint Thomas"),("Christiansted","Saint Croix")]:
    data.append((city,state,"US Virgin Islands"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-26-OK added {len(data)}")
