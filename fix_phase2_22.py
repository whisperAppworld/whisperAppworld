import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Almaty","Almaty"),("Astana","Astana"),("Shymkent","Shymkent"),("Karaganda","Karaganda"),("Aktobe","Aktobe"),("Taraz","Jambyl"),("Pavlodar","Pavlodar"),("Oskemen","East Kazakhstan"),("Semey","Abai"),("Atyrau","Atyrau")]:
    data.append((city,state,"Kazakhstan"))
for city,state in [("Tashkent","Tashkent"),("Samarkand","Samarkand"),("Namangan","Namangan"),("Andijan","Andijan"),("Bukhara","Bukhara"),("Nukus","Karakalpakstan"),("Qarshi","Qashqadaryo"),("Fergana","Fergana")]:
    data.append((city,state,"Uzbekistan"))
for city,state in [("Bishkek","Bishkek"),("Osh","Osh"),("Jalal-Abad","Jalal-Abad"),("Karakol","Issyk-Kul"),("Tokmok","Chuy")]:
    data.append((city,state,"Kyrgyzstan"))
for city,state in [("Dushanbe","Dushanbe"),("Khujand","Sughd"),("Kulob","Khatlon"),("Bokhtar","Khatlon")]:
    data.append((city,state,"Tajikistan"))
for city,state in [("Ashgabat","Ashgabat"),("Turkmenabat","Lebap"),("Dashoguz","Dashoguz"),("Mary","Mary")]:
    data.append((city,state,"Turkmenistan"))
for city,state in [("Ulaanbaatar","Ulaanbaatar"),("Erdenet","Orkhon"),("Darkhan","Darkhan-Uul"),("Choibalsan","Dornod"),("Moron","Khuvsgul"),("Khovd","Khovd")]:
    data.append((city,state,"Mongolia"))
for city,state in [("Kabul","Kabul"),("Herat","Herat"),("Kandahar","Kandahar"),("Mazar-i-Sharif","Balkh"),("Jalalabad","Nangarhar"),("Kunduz","Kunduz"),("Ghazni","Ghazni"),("Bamyan","Bamyan")]:
    data.append((city,state,"Afghanistan"))
for city,state in [("Kathmandu","Bagmati"),("Pokhara","Gandaki"),("Lalitpur","Bagmati"),("Bharatpur","Bagmati"),("Biratnagar","Koshi")]:
    data.append((city,state,"Nepal"))
for city,state in [("Colombo","Western"),("Kandy","Central"),("Galle","Southern"),("Jaffna","Northern"),("Negombo","Western")]:
    data.append((city,state,"Sri Lanka"))
for city,state in [("Yangon","Yangon"),("Mandalay","Mandalay"),("Naypyidaw","Naypyidaw"),("Mawlamyine","Mon"),("Bago","Bago")]:
    data.append((city,state,"Myanmar"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-22-OK added {len(data)}")
