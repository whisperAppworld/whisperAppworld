import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Santiago","Santiago Metropolitan"),("Valparaiso","Valparaiso"),("Concepcion","Biobio"),("La Serena","Coquimbo"),("Antofagasta","Antofagasta"),("Temuco","Araucania"),("Rancagua","OHiggins"),("Talca","Maule"),("Arica","Arica y Parinacota"),("Iquique","Tarapaca"),("Copiapo","Atacama"),("Chillan","Nuble"),("Puerto Montt","Los Lagos"),("Coyhaique","Aysen"),("Punta Arenas","Magallanes"),("Valdivia","Los Rios")]:
    data.append((city,state,"Chile"))
for city,state in [("Caracas","Capital District"),("Maracaibo","Zulia"),("Valencia","Carabobo"),("Barquisimeto","Lara"),("Maracay","Aragua"),("Ciudad Guayana","Bolivar"),("San Cristobal","Tachira"),("Merida","Merida"),("Barcelona","Anzoategui"),("Maturin","Monagas"),("Cumana","Sucre"),("Barinas","Barinas"),("Los Teques","Miranda"),("Trujillo","Trujillo"),("Guanare","Portuguesa"),("San Fernando de Apure","Apure"),("La Asuncion","Nueva Esparta"),("San Juan de los Morros","Guarico"),("Tucupita","Delta Amacuro"),("Puerto Ayacucho","Amazonas")]:
    data.append((city,state,"Venezuela"))
for city,state in [("Quito","Pichincha"),("Guayaquil","Guayas"),("Cuenca","Azuay"),("Ambato","Tungurahua"),("Manta","Manabi"),("Loja","Loja"),("Riobamba","Chimborazo"),("Ibarra","Imbabura"),("Machala","El Oro"),("Esmeraldas","Esmeraldas"),("Puyo","Pastaza"),("Tena","Napo")]:
    data.append((city,state,"Ecuador"))
for city,state in [("La Paz","La Paz"),("Santa Cruz","Santa Cruz"),("Cochabamba","Cochabamba"),("Sucre","Chuquisaca"),("Oruro","Oruro"),("Potosi","Potosi"),("Tarija","Tarija"),("Trinidad","Beni"),("Cobija","Pando")]:
    data.append((city,state,"Bolivia"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-11-OK added {len(data)}")
