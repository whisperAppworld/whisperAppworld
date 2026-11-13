import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Asuncion","Asuncion"),("Ciudad del Este","Alto Parana"),("Encarnacion","Itapua"),("Pedro Juan Caballero","Amambay"),("Concepcion","Concepcion"),("Coronel Oviedo","Caaguazu"),("Villarrica","Guaira"),("Pilar","Neembucu"),("Salto del Guaira","Canindeyu"),("Fuerte Olimpo","Alto Paraguay")]:
    data.append((city,state,"Paraguay"))
for city,state in [("Montevideo","Montevideo"),("Salto","Salto"),("Paysandu","Paysandu"),("Rivera","Rivera"),("Maldonado","Maldonado"),("Tacuarembo","Tacuarembo"),("Colonia del Sacramento","Colonia"),("Melo","Cerro Largo"),("Mercedes","Soriano"),("Artigas","Artigas")]:
    data.append((city,state,"Uruguay"))
for city,state in [("Georgetown","Demerara-Mahaica"),("Linden","Upper Demerara-Berbice"),("New Amsterdam","East Berbice-Corentyne"),("Bartica","Cuyuni-Mazaruni"),("Lethem","Upper Takutu-Upper Essequibo")]:
    data.append((city,state,"Guyana"))
for city,state in [("Paramaribo","Paramaribo"),("Nieuw Nickerie","Nickerie"),("Moengo","Marowijne"),("Albina","Marowijne"),("Brownsberg","Brokopondo")]:
    data.append((city,state,"Suriname"))
for city,state in [("Belize City","Belize"),("San Ignacio","Cayo"),("Orange Walk Town","Orange Walk"),("Corozal Town","Corozal"),("Dangriga","Stann Creek"),("Punta Gorda","Toledo")]:
    data.append((city,state,"Belize"))
for city,state in [("Guatemala City","Guatemala"),("Quetzaltenango","Quetzaltenango"),("Antigua Guatemala","Sacatepequez"),("Flores","Peten"),("Huehuetenango","Huehuetenango"),("Coban","Alta Verapaz"),("Escuintla","Escuintla"),("Chiquimula","Chiquimula")]:
    data.append((city,state,"Guatemala"))
for city,state in [("Tegucigalpa","Francisco Morazan"),("San Pedro Sula","Cortes"),("La Ceiba","Atlantida"),("Choluteca","Choluteca"),("Comayagua","Comayagua"),("Santa Rosa de Copan","Copan"),("Juticalpa","Olancho"),("La Esperanza","Intibuca")]:
    data.append((city,state,"Honduras"))
for city,state in [("San Salvador","San Salvador"),("Santa Ana","Santa Ana"),("San Miguel","San Miguel"),("La Libertad","La Libertad"),("Sonsonate","Sonsonate"),("Usulutan","Usulutan")]:
    data.append((city,state,"El Salvador"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-12-OK added {len(data)}")
