import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Managua","Managua"),("Leon","Leon"),("Granada","Granada"),("Masaya","Masaya"),("Matagalpa","Matagalpa"),("Esteli","Esteli"),("Chinandega","Chinandega"),("Juigalpa","Chontales"),("Bluefields","South Caribbean Coast"),("Puerto Cabezas","North Caribbean Coast")]:
    data.append((city,state,"Nicaragua"))
for city,state in [("San Jose","San Jose"),("Alajuela","Alajuela"),("Cartago","Cartago"),("Heredia","Heredia"),("Puntarenas","Puntarenas"),("Limon","Limon"),("Liberia","Guanacaste")]:
    data.append((city,state,"Costa Rica"))
for city,state in [("Panama City","Panama"),("Colon","Colon"),("David","Chiriqui"),("Santiago","Veraguas"),("Chitre","Herrera"),("Las Tablas","Los Santos"),("Penonome","Cocle"),("La Palma","Darien"),("Bocas del Toro","Bocas del Toro"),("Portobelo","Colon")]:
    data.append((city,state,"Panama"))
for city,state in [("Kingston","Kingston"),("Montego Bay","St James"),("Ocho Rios","St Ann"),("Negril","Westmoreland"),("Port Antonio","Portland"),("Mandeville","Manchester")]:
    data.append((city,state,"Jamaica"))
for city,state in [("Port-au-Prince","Ouest"),("Cap-Haitien","Nord"),("Les Cayes","Sud"),("Jacmel","Sud-Est"),("Gonaives","Artibonite"),("Jeremie","GrandAnse")]:
    data.append((city,state,"Haiti"))
for city,state in [("Santo Domingo","Distrito Nacional"),("Santiago","Santiago"),("Puerto Plata","Puerto Plata"),("La Romana","La Romana"),("Punta Cana","La Altagracia"),("Barahona","Barahona"),("San Pedro de Macoris","San Pedro de Macoris"),("La Vega","La Vega"),("Moca","Espaillat"),("Higuey","La Altagracia")]:
    data.append((city,state,"Dominican Republic"))
for city,state in [("Havana","Havana"),("Santiago de Cuba","Santiago de Cuba"),("Camaguey","Camaguey"),("Holguin","Holguin"),("Santa Clara","Villa Clara"),("Matanzas","Matanzas"),("Cienfuegos","Cienfuegos"),("Pinar del Rio","Pinar del Rio"),("Guantanamo","Guantanamo"),("Bayamo","Granma")]:
    data.append((city,state,"Cuba"))
for city,state in [("Port of Spain","Port of Spain"),("San Fernando","San Fernando"),("Chaguanas","Chaguanas")]:
    data.append((city,state,"Trinidad and Tobago"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-13-OK added {len(data)}")
