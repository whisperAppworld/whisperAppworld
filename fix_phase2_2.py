import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Mexico City","Mexico City"),("Guadalajara","Jalisco"),("Monterrey","Nuevo Leon"),("Puebla","Puebla"),("Tijuana","Baja California"),("Merida","Yucatan"),("Cancun","Quintana Roo"),("Oaxaca City","Oaxaca"),("Chihuahua City","Chihuahua"),("Hermosillo","Sonora"),("Culiacan","Sinaloa"),("Durango","Durango"),("Zacatecas","Zacatecas"),("San Luis Potosi","San Luis Potosi"),("Queretaro","Queretaro"),("Aguascalientes","Aguascalientes"),("Guanajuato","Guanajuato"),("Morelia","Michoacan"),("Cuernavaca","Morelos"),("Toluca","Mexico State"),("Pachuca","Hidalgo"),("Tlaxcala","Tlaxcala"),("Xalapa","Veracruz"),("Villahermosa","Tabasco"),("Tuxtla Gutierrez","Chiapas"),("Campeche","Campeche"),("La Paz","Baja California Sur"),("Colima","Colima"),("Tepic","Nayarit"),("Saltillo","Coahuila"),("Ciudad Victoria","Tamaulipas"),("Chilpancingo","Guerrero")]:
    data.append((city,state,"Mexico"))
for city,state in [("Berlin","Berlin"),("Munich","Bavaria"),("Hamburg","Hamburg"),("Cologne","North Rhine-Westphalia"),("Frankfurt","Hesse"),("Stuttgart","Baden-Wurttemberg"),("Dresden","Saxony"),("Hanover","Lower Saxony"),("Bremen","Bremen"),("Mainz","Rhineland-Palatinate"),("Saarbrucken","Saarland"),("Kiel","Schleswig-Holstein"),("Magdeburg","Saxony-Anhalt"),("Erfurt","Thuringia"),("Potsdam","Brandenburg"),("Schwerin","Mecklenburg-Vorpommern")]:
    data.append((city,state,"Germany"))
for city,state in [("Sydney","New South Wales"),("Melbourne","Victoria"),("Brisbane","Queensland"),("Perth","Western Australia"),("Adelaide","South Australia"),("Hobart","Tasmania"),("Canberra","Australian Capital Territory"),("Darwin","Northern Territory")]:
    data.append((city,state,"Australia"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-2-OK added {len(data)}")
