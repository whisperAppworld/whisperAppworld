import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Moscow","Moscow"),("Saint Petersburg","Saint Petersburg"),("Novosibirsk","Novosibirsk Oblast"),("Yekaterinburg","Sverdlovsk Oblast"),("Kazan","Tatarstan"),("Nizhny Novgorod","Nizhny Novgorod Oblast"),("Samara","Samara Oblast"),("Omsk","Omsk Oblast"),("Chelyabinsk","Chelyabinsk Oblast"),("Rostov-on-Don","Rostov Oblast"),("Ufa","Bashkortostan"),("Krasnoyarsk","Krasnoyarsk Krai"),("Perm","Perm Krai"),("Voronezh","Voronezh Oblast"),("Volgograd","Volgograd Oblast"),("Krasnodar","Krasnodar Krai"),("Saratov","Saratov Oblast"),("Tyumen","Tyumen Oblast"),("Vladivostok","Primorsky Krai"),("Irkutsk","Irkutsk Oblast")]:
    data.append((city,state,"Russia"))
for city,state in [("Istanbul","Istanbul"),("Ankara","Ankara"),("Izmir","Izmir"),("Antalya","Antalya"),("Adana","Adana"),("Bursa","Bursa"),("Gaziantep","Gaziantep"),("Konya","Konya"),("Kayseri","Kayseri"),("Mersin","Mersin"),("Trabzon","Trabzon"),("Samsun","Samsun"),("Eskisehir","Eskisehir"),("Diyarbakir","Diyarbakir"),("Sanliurfa","Sanliurfa"),("Van","Van"),("Erzurum","Erzurum"),("Denizli","Denizli"),("Tekirdag","Tekirdag"),("Aydin","Aydin")]:
    data.append((city,state,"Turkey"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-6-OK added {len(data)}")
