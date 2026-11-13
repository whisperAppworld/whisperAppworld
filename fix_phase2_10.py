import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Buenos Aires","Buenos Aires"),("Cordoba","Cordoba"),("Rosario","Santa Fe"),("Mendoza","Mendoza"),("San Miguel de Tucuman","Tucuman"),("La Plata","Buenos Aires"),("Mar del Plata","Buenos Aires"),("Salta","Salta"),("Santa Fe","Santa Fe"),("San Juan","San Juan"),("Resistencia","Chaco"),("Posadas","Misiones"),("Corrientes","Corrientes"),("Santiago del Estero","Santiago del Estero"),("San Salvador de Jujuy","Jujuy"),("Neuquen","Neuquen"),("Formosa","Formosa"),("San Luis","San Luis"),("La Rioja","La Rioja"),("Catamarca","Catamarca"),("Rio Gallegos","Santa Cruz"),("Ushuaia","Tierra del Fuego"),("Rawson","Chubut"),("Viedma","Rio Negro")]:
    data.append((city,state,"Argentina"))
for city,state in [("Bogota","Bogota"),("Medellin","Antioquia"),("Cali","Valle del Cauca"),("Barranquilla","Atlantico"),("Cartagena","Bolivar"),("Bucaramanga","Santander"),("Pereira","Risaralda"),("Manizales","Caldas"),("Ibague","Tolima"),("Santa Marta","Magdalena"),("Villavicencio","Meta"),("Pasto","Narino"),("Monteria","Cordoba"),("Neiva","Huila"),("Armenia","Quindio"),("Popayan","Cauca"),("Tunja","Boyaca"),("Sincelejo","Sucre"),("Valledupar","Cesar"),("Quibdo","Choco")]:
    data.append((city,state,"Colombia"))
for city,state in [("Lima","Lima"),("Arequipa","Arequipa"),("Trujillo","La Libertad"),("Chiclayo","Lambayeque"),("Piura","Piura"),("Cusco","Cusco"),("Huancayo","Junin"),("Iquitos","Loreto"),("Pucallpa","Ucayali"),("Tacna","Tacna"),("Ayacucho","Ayacucho"),("Cajamarca","Cajamarca")]:
    data.append((city,state,"Peru"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-10-OK added {len(data)}")
