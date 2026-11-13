import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Panama City","Panama"),("Colon","Colon"),("David","Chiriqui"),("Santiago","Veraguas"),("Chitre","Herrera"),("Penonome","Cocle")]:
    data.append((city,state,"Panama"))
for city,state in [("San Jose","San Jose"),("Alajuela","Alajuela"),("Cartago","Cartago"),("Heredia","Heredia"),("Puntarenas","Puntarenas"),("Limon","Limon"),("Liberia","Guanacaste")]:
    data.append((city,state,"Costa Rica"))
for city,state in [("Guatemala City","Guatemala"),("Quetzaltenango","Quetzaltenango"),("Escuintla","Escuintla"),("Antigua","Sacatepequez"),("Huehuetenango","Huehuetenango"),("Coban","Alta Verapaz"),("Chiquimula","Chiquimula"),("Petén","Peten")]:
    data.append((city,state,"Guatemala"))
for city,state in [("Tegucigalpa","Francisco Morazan"),("San Pedro Sula","Cortes"),("Choloma","Cortes"),("La Ceiba","Atlantida"),("El Progreso","Yoro"),("Choluteca","Choluteca")]:
    data.append((city,state,"Honduras"))
for city,state in [("San Salvador","San Salvador"),("Santa Ana","Santa Ana"),("San Miguel","San Miguel"),("Soyapango","San Salvador"),("Santa Tecla","La Libertad"),("Usulutan","Usulutan")]:
    data.append((city,state,"El Salvador"))
for city,state in [("Managua","Managua"),("Leon","Leon"),("Masaya","Masaya"),("Granada","Granada"),("Matagalpa","Matagalpa"),("Esteli","Esteli")]:
    data.append((city,state,"Nicaragua"))
for city,state in [("Havana","La Habana"),("Santiago de Cuba","Santiago de Cuba"),("Camaguey","Camaguey"),("Holguin","Holguin"),("Santa Clara","Villa Clara"),("Cienfuegos","Cienfuegos"),("Pinar del Rio","Pinar del Rio"),("Matanzas","Matanzas")]:
    data.append((city,state,"Cuba"))
for city,state in [("Santo Domingo","Distrito Nacional"),("Santiago","Santiago"),("La Vega","La Vega"),("Puerto Plata","Puerto Plata"),("San Pedro de Macoris","San Pedro"),("La Romana","La Romana"),("San Francisco de Macoris","Duarte"),("Bani","Peravia")]:
    data.append((city,state,"Dominican Republic"))
for city,state in [("Port-au-Prince","Ouest"),("Cap-Haitien","Nord"),("Les Cayes","Sud"),("Gonaives","Artibonite"),("Jacmel","Sud-Est")]:
    data.append((city,state,"Haiti"))
for city,state in [("Cayenne","Cayenne"),("Saint-Laurent-du-Maroni","Saint-Laurent"),("Kourou","Kourou")]:
    data.append((city,state,"French Guiana"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-28-OK added {len(data)}")
