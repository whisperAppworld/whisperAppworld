import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Tunis","Tunis"),("Sfax","Sfax"),("Sousse","Sousse"),("Kairouan","Kairouan"),("Bizerte","Bizerte"),("Gabes","Gabes"),("Ariana","Ariana"),("Gafsa","Gafsa"),("Monastir","Monastir"),("Medenine","Medenine"),("Nabeul","Nabeul"),("Tozeur","Tozeur")]:
    data.append((city,state,"Tunisia"))
for city,state in [("Tripoli","Tripoli"),("Benghazi","Benghazi"),("Misrata","Misrata"),("Bayda","Jabal al Akhdar"),("Zawiya","Zawiya"),("Zliten","Murqub"),("Tobruk","Butnan"),("Sabha","Sabha"),("Kufra","Kufra"),("Gharyan","Jabal al Gharbi")]:
    data.append((city,state,"Libya"))
for city,state in [("Khartoum","Khartoum"),("Omdurman","Khartoum"),("Port Sudan","Red Sea"),("Kassala","Kassala"),("El Obeid","North Kordofan"),("Nyala","South Darfur"),("Wad Madani","Gezira"),("Atbara","River Nile"),("El Fasher","North Darfur"),("Kosti","White Nile")]:
    data.append((city,state,"Sudan"))
for city,state in [("Addis Ababa","Addis Ababa"),("Dire Dawa","Dire Dawa"),("Adama","Oromia"),("Gondar","Amhara"),("Mekelle","Tigray"),("Hawassa","Sidama"),("Bahir Dar","Amhara"),("Jimma","Oromia"),("Jijiga","Somali"),("Harar","Harari"),("Nekemte","Oromia"),("Dessie","Amhara")]:
    data.append((city,state,"Ethiopia"))
for city,state in [("Nairobi","Nairobi"),("Mombasa","Mombasa"),("Kisumu","Kisumu"),("Nakuru","Nakuru"),("Eldoret","Uasin Gishu"),("Thika","Kiambu"),("Malindi","Kilifi"),("Kitale","Trans Nzoia"),("Garissa","Garissa"),("Kakamega","Kakamega"),("Nyeri","Nyeri"),("Machakos","Machakos")]:
    data.append((city,state,"Kenya"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-15-OK added {len(data)}")
