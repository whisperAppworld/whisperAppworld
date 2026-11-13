import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Asuncion","Asuncion"),("Ciudad del Este","Alto Parana"),("San Lorenzo","Central"),("Luque","Central"),("Encarnacion","Itapua"),("Pedro Juan Caballero","Amambay")]:
    data.append((city,state,"Paraguay"))
for city,state in [("Montevideo","Montevideo"),("Salto","Salto"),("Ciudad de la Costa","Canelones"),("Paysandu","Paysandu"),("Rivera","Rivera")]:
    data.append((city,state,"Uruguay"))
for city,state in [("La Paz","La Paz"),("Santa Cruz","Santa Cruz"),("Cochabamba","Cochabamba"),("Sucre","Chuquisaca"),("Oruro","Oruro"),("Potosi","Potosi")]:
    data.append((city,state,"Bolivia"))
for city,state in [("Quito","Pichincha"),("Guayaquil","Guayas"),("Cuenca","Azuay"),("Santo Domingo","Santo Domingo"),("Ambato","Tungurahua"),("Manta","Manabi")]:
    data.append((city,state,"Ecuador"))
for city,state in [("Caracas","Distrito Capital"),("Maracaibo","Zulia"),("Valencia","Carabobo"),("Barquisimeto","Lara"),("Maracay","Aragua"),("Merida","Merida")]:
    data.append((city,state,"Venezuela"))
for city,state in [("Lima","Lima"),("Arequipa","Arequipa"),("Trujillo","La Libertad"),("Chiclayo","Lambayeque"),("Piura","Piura"),("Cusco","Cusco")]:
    data.append((city,state,"Peru"))
for city,state in [("Bogota","Bogota"),("Medellin","Antioquia"),("Cali","Valle del Cauca"),("Barranquilla","Atlantico"),("Cartagena","Bolivar"),("Bucaramanga","Santander")]:
    data.append((city,state,"Colombia"))
for city,state in [("Kingston","Saint Andrew"),("Montego Bay","Saint James"),("Spanish Town","Saint Catherine"),("Portmore","Saint Catherine"),("Ocho Rios","Saint Ann")]:
    data.append((city,state,"Jamaica"))
for city,state in [("Port of Spain","Port of Spain"),("San Fernando","San Fernando"),("Chaguanas","Chaguanas"),("Arima","Arima"),("Scarborough","Tobago")]:
    data.append((city,state,"Trinidad and Tobago"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-27-OK added {len(data)}")
