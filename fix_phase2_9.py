import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Seoul","Seoul"),("Busan","Busan"),("Incheon","Incheon"),("Daegu","Daegu"),("Daejeon","Daejeon"),("Gwangju","Gwangju"),("Ulsan","Ulsan"),("Sejong","Sejong"),("Suwon","Gyeonggi"),("Chuncheon","Gangwon"),("Cheongju","North Chungcheong"),("Jeonju","North Jeolla"),("Gwangju","South Jeolla"),("Andong","North Gyeongsang"),("Changwon","South Gyeongsang"),("Jeju City","Jeju"),("Hongseong","South Chungcheong")]:
    data.append((city,state,"South Korea"))
for city,state in [("Karachi","Sindh"),("Lahore","Punjab"),("Peshawar","Khyber Pakhtunkhwa"),("Quetta","Balochistan"),("Islamabad","Islamabad Capital Territory"),("Muzaffarabad","Azad Kashmir"),("Gilgit","Gilgit-Baltistan"),("Hyderabad","Sindh")]:
    data.append((city,state,"Pakistan"))
for city,state in [("Dhaka","Dhaka Division"),("Chittagong","Chittagong Division"),("Khulna","Khulna Division"),("Rajshahi","Rajshahi Division"),("Sylhet","Sylhet Division"),("Barisal","Barisal Division"),("Rangpur","Rangpur Division"),("Mymensingh","Mymensingh Division")]:
    data.append((city,state,"Bangladesh"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-9-OK added {len(data)}")
