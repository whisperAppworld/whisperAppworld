import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Vientiane","Vientiane"),("Luang Prabang","Luang Prabang"),("Pakse","Champasak"),("Savannakhet","Savannakhet"),("Thakhek","Khammouane"),("Vang Vieng","Vientiane"),("Luang Namtha","Luang Namtha"),("Phonsavan","Xiangkhouang")]:
    data.append((city,state,"Laos"))
for city,state in [("Phnom Penh","Phnom Penh"),("Siem Reap","Siem Reap"),("Battambang","Battambang"),("Sihanoukville","Preah Sihanouk"),("Kampot","Kampot"),("Kratie","Kratie"),("Kep","Kep"),("Poipet","Banteay Meanchey"),("Koh Kong","Koh Kong"),("Takeo","Takeo")]:
    data.append((city,state,"Cambodia"))
for city,state in [("Bandar Seri Begawan","Brunei-Muara"),("Kuala Belait","Belait"),("Seria","Belait"),("Tutong","Tutong")]:
    data.append((city,state,"Brunei"))
for city,state in [("Dili","Dili"),("Baucau","Baucau"),("Maliana","Bobonaro"),("Suai","Cova Lima"),("Oecusse","Oecusse"),("Lospalos","Lautem")]:
    data.append((city,state,"Timor-Leste"))
for city,state in [("Thimphu","Thimphu"),("Phuentsholing","Chukha"),("Paro","Paro"),("Punakha","Punakha"),("Jakar","Bumthang")]:
    data.append((city,state,"Bhutan"))
for city,state in [("Male","Kaafu"),("Addu City","Seenu"),("Fuvahmulah","Gnaviyani"),("Kulhudhuffushi","Haa Dhaalu"),("Thinadhoo","Gaafu Dhaalu")]:
    data.append((city,state,"Maldives"))
for city,state in [("Andorra la Vella","Andorra la Vella"),("Escaldes-Engordany","Escaldes-Engordany"),("Encamp","Encamp")]:
    data.append((city,state,"Andorra"))
for city,state in [("Monaco","Monaco")]:
    data.append((city,state,"Monaco"))
for city,state in [("Vaduz","Vaduz"),("Schaan","Schaan"),("Triesen","Triesen")]:
    data.append((city,state,"Liechtenstein"))
for city,state in [("San Marino","San Marino"),("Serravalle","Serravalle"),("Borgo Maggiore","Borgo Maggiore")]:
    data.append((city,state,"San Marino"))
for city,state in [("Valletta","Valletta"),("Sliema","Sliema"),("Birkirkara","Birkirkara"),("Mdina","Mdina"),("Gozo","Gozo")]:
    data.append((city,state,"Malta"))
for city,state in [("Reykjavik","Capital Region"),("Akureyri","Northeastern"),("Keflavik","Southern Peninsula"),("Selfoss","Southern"),("Isafjordur","Westfjords"),("Egilsstadir","Eastern")]:
    data.append((city,state,"Iceland"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-24-OK added {len(data)}")
