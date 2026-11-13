import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Johannesburg","Gauteng"),("Cape Town","Western Cape"),("Durban","KwaZulu-Natal"),("Pretoria","Gauteng"),("Port Elizabeth","Eastern Cape"),("Bloemfontein","Free State"),("Polokwane","Limpopo"),("Nelspruit","Mpumalanga"),("Kimberley","Northern Cape")]:
    data.append((city,state,"South Africa"))
for city,state in [("Maputo","Maputo"),("Matola","Maputo"),("Beira","Sofala"),("Nampula","Nampula"),("Chimoio","Manica"),("Nacala","Nampula"),("Quelimane","Zambezia"),("Tete","Tete"),("Xai-Xai","Gaza"),("Inhambane","Inhambane"),("Pemba","Cabo Delgado")]:
    data.append((city,state,"Mozambique"))
for city,state in [("Antananarivo","Analamanga"),("Toamasina","Atsinanana"),("Antsirabe","Vakinankaratra"),("Fianarantsoa","Haute Matsiatra"),("Mahajanga","Boeny"),("Toliara","Atsimo-Andrefana"),("Antsiranana","Diana"),("Antsiranana","Diana"),("Morondava","Menabe"),("Sambava","Sava"),("Tamatave","Atsinanana"),("Ambositra","Amoron'i Mania")]:
    data.append((city,state,"Madagascar"))
for city,state in [("Lilongwe","Central Region"),("Blantyre","Southern Region"),("Mzuzu","Northern Region"),("Zomba","Southern Region"),("Kasungu","Central Region"),("Mangochi","Southern Region"),("Karonga","Northern Region"),("Salima","Central Region"),("Dedza","Central Region"),("Mzimba","Northern Region")]:
    data.append((city,state,"Malawi"))
for city,state in [("Gaborone","South-East"),("Francistown","North-East"),("Molepolole","Kweneng"),("Serowe","Central"),("Maun","North-West"),("Kanye","Southern"),("Mahalapye","Central"),("Mochudi","Kgatleng"),("Palapye","Central"),("Kasane","North-West")]:
    data.append((city,state,"Botswana"))
for city,state in [("Windhoek","Khomas"),("Rundu","Kavango East"),("Walvis Bay","Erongo"),("Oshakati","Oshana"),("Swakopmund","Erongo"),("Katima Mulilo","Zambezi"),("Otjiwarongo","Otjozondjupa"),("Grootfontein","Otjozondjupa"),("Mariental","Hardap"),("Keetmanshoop","Karas")]:
    data.append((city,state,"Namibia"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-17-OK added {len(data)}")
