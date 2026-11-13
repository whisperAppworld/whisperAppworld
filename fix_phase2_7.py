import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Jakarta","Jakarta"),("Bandung","West Java"),("Surabaya","East Java"),("Medan","North Sumatra"),("Semarang","Central Java"),("Yogyakarta","Yogyakarta"),("Denpasar","Bali"),("Makassar","South Sulawesi"),("Palembang","South Sumatra"),("Padang","West Sumatra"),("Pekanbaru","Riau"),("Banjarmasin","South Kalimantan"),("Pontianak","West Kalimantan"),("Balikpapan","East Kalimantan"),("Samarinda","East Kalimantan"),("Manado","North Sulawesi"),("Palu","Central Sulawesi"),("Kendari","Southeast Sulawesi"),("Gorontalo","Gorontalo"),("Mamuju","West Sulawesi"),("Ambon","Maluku"),("Ternate","North Maluku"),("Jayapura","Papua"),("Manokwari","West Papua"),("Sorong","Southwest Papua"),("Kupang","East Nusa Tenggara"),("Mataram","West Nusa Tenggara"),("Banda Aceh","Aceh"),("Jambi","Jambi"),("Bengkulu","Bengkulu"),("Bandar Lampung","Lampung"),("Pangkal Pinang","Bangka Belitung"),("Tanjung Pinang","Riau Islands"),("Palangkaraya","Central Kalimantan"),("Tanjung Selor","North Kalimantan"),("Serang","Banten"),("Nabire","Central Papua"),("Merauke","South Papua")]:
    data.append((city,state,"Indonesia"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-7-OK added {len(data)}")
