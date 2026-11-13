import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Manila","Metro Manila"),("Quezon City","Metro Manila"),("Cebu City","Central Visayas"),("Davao City","Davao Region"),("Iloilo City","Western Visayas"),("Baguio","Cordillera"),("Laoag","Ilocos Region"),("Tuguegarao","Cagayan Valley"),("San Fernando","Central Luzon"),("Calamba","Calabarzon"),("Legazpi","Bicol Region"),("Tacloban","Eastern Visayas"),("Zamboanga City","Zamboanga Peninsula"),("Cagayan de Oro","Northern Mindanao"),("Butuan","Caraga"),("Koronadal","Soccsksargen"),("Puerto Princesa","Mimaropa")]:
    data.append((city,state,"Philippines"))
for city,state in [("Hanoi","Hanoi"),("Ho Chi Minh City","Ho Chi Minh City"),("Da Nang","Da Nang"),("Haiphong","Haiphong"),("Can Tho","Can Tho"),("Hue","Hue"),("Nha Trang","Khanh Hoa"),("Da Lat","Lam Dong"),("Vinh","Nghe An"),("Thanh Hoa","Thanh Hoa"),("Hai Duong","Hai Phong"),("Quang Ninh","Quang Ninh"),("Thai Nguyen","Thai Nguyen"),("Son La","Son La"),("Lao Cai","Lao Cai"),("Dien Bien Phu","Dien Bien"),("Pleiku","Gia Lai"),("Buon Ma Thuot","Dak Lak"),("Rach Gia","An Giang"),("Ca Mau","Ca Mau")]:
    data.append((city,state,"Vietnam"))
for city,state in [("Bangkok","Bangkok"),("Chiang Mai","Chiang Mai"),("Phuket","Phuket"),("Pattaya","Chonburi"),("Khon Kaen","Khon Kaen"),("Udon Thani","Udon Thani"),("Nakhon Ratchasima","Nakhon Ratchasima"),("Songkhla","Songkhla"),("Surat Thani","Surat Thani"),("Chiang Rai","Chiang Rai"),("Ayutthaya","Phra Nakhon Si Ayutthaya"),("Kanchanaburi","Kanchanaburi"),("Hua Hin","Prachuap Khiri Khan"),("Krabi","Krabi"),("Trang","Trang"),("Nakhon Si Thammarat","Nakhon Si Thammarat"),("Ubon Ratchathani","Ubon Ratchathani"),("Phitsanulok","Phitsanulok"),("Lampang","Lampang"),("Rayong","Rayong")]:
    data.append((city,state,"Thailand"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-8-OK added {len(data)}")
