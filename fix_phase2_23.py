import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Sanaa","Sanaa"),("Aden","Aden"),("Taiz","Taiz"),("Hodeidah","Hodeidah"),("Mukalla","Hadhramaut"),("Ibb","Ibb"),("Dhamar","Dhamar"),("Sayun","Hadhramaut")]:
    data.append((city,state,"Yemen"))
for city,state in [("Muscat","Muscat"),("Salalah","Dhofar"),("Sohar","North Al Batinah"),("Nizwa","Ad Dakhiliyah"),("Sur","South Ash Sharqiyah"),("Rustaq","South Al Batinah")]:
    data.append((city,state,"Oman"))
for city,state in [("Doha","Doha"),("Al Rayyan","Al Rayyan"),("Al Wakrah","Al Wakrah"),("Al Khor","Al Khor")]:
    data.append((city,state,"Qatar"))
for city,state in [("Manama","Capital"),("Riffa","Southern"),("Muharraq","Muharraq")]:
    data.append((city,state,"Bahrain"))
for city,state in [("Kuwait City","Al Asimah"),("Hawally","Hawally"),("Salmiya","Hawally"),("Farwaniya","Farwaniya")]:
    data.append((city,state,"Kuwait"))
for city,state in [("Amman","Amman"),("Zarqa","Zarqa"),("Irbid","Irbid"),("Aqaba","Aqaba"),("Salt","Balqa"),("Madaba","Madaba")]:
    data.append((city,state,"Jordan"))
for city,state in [("Beirut","Beirut"),("Tripoli","North"),("Sidon","South"),("Tyre","South"),("Zahle","Beqaa")]:
    data.append((city,state,"Lebanon"))
for city,state in [("Damascus","Damascus"),("Aleppo","Aleppo"),("Homs","Homs"),("Latakia","Latakia"),("Hama","Hama"),("Deir ez-Zor","Deir ez-Zor"),("Raqqa","Raqqa"),("Hasakah","Hasakah")]:
    data.append((city,state,"Syria"))
for city,state in [("Baghdad","Baghdad"),("Basra","Basra"),("Mosul","Nineveh"),("Erbil","Erbil"),("Kirkuk","Kirkuk"),("Najaf","Najaf"),("Karbala","Karbala"),("Sulaymaniyah","Sulaymaniyah")]:
    data.append((city,state,"Iraq"))
for city,state in [("Nicosia","Nicosia"),("Limassol","Limassol"),("Larnaca","Larnaca"),("Paphos","Paphos")]:
    data.append((city,state,"Cyprus"))
for city,state in [("Gaza City","Gaza"),("Ramallah","Ramallah"),("Hebron","Hebron"),("Nablus","Nablus")]:
    data.append((city,state,"Palestine"))
for city,state in [("Jerusalem","Jerusalem"),("Tel Aviv","Tel Aviv"),("Haifa","Haifa"),("Beersheba","Southern"),("Eilat","Southern")]:
    data.append((city,state,"Israel"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-23-OK added {len(data)}")
