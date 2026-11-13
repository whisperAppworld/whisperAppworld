import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Sydney","New South Wales"),("Newcastle","New South Wales"),("Wollongong","New South Wales"),("Melbourne","Victoria"),("Geelong","Victoria"),("Brisbane","Queensland"),("Gold Coast","Queensland"),("Cairns","Queensland"),("Townsville","Queensland"),("Perth","Western Australia"),("Fremantle","Western Australia"),("Adelaide","South Australia"),("Hobart","Tasmania"),("Canberra","Australian Capital Territory"),("Darwin","Northern Territory"),("Alice Springs","Northern Territory")]:
    data.append((city,state,"Australia"))
for city,state in [("Auckland","Auckland"),("Wellington","Wellington"),("Christchurch","Canterbury"),("Hamilton","Waikato"),("Tauranga","Bay of Plenty"),("Dunedin","Otago"),("Palmerston North","Manawatu-Wanganui"),("Napier","Hawkes Bay"),("Nelson","Nelson"),("Rotorua","Bay of Plenty"),("New Plymouth","Taranaki"),("Whangarei","Northland")]:
    data.append((city,state,"New Zealand"))
for city,state in [("Suva","Central"),("Lautoka","Western"),("Nadi","Western"),("Labasa","Northern")]:
    data.append((city,state,"Fiji"))
for city,state in [("Port Moresby","National Capital District"),("Lae","Morobe"),("Mount Hagen","Western Highlands"),("Madang","Madang"),("Wewak","East Sepik"),("Goroka","Eastern Highlands"),("Kokopo","East New Britain"),("Kimbe","West New Britain")]:
    data.append((city,state,"Papua New Guinea"))
for city,state in [("Apia","Upolu"),("Nukualofa","Tongatapu"),("Port Vila","Shefa"),("Honiara","Guadalcanal"),("South Tarawa","Tarawa"),("Palikir","Pohnpei"),("Ngerulmud","Melekeok"),("Majuro","Majuro"),("Funafuti","Funafuti"),("Yaren","Yaren")]:
    data.append((city,state,"Pacific Islands"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-21-OK added {len(data)}")
