import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Tokyo","Tokyo"),("Osaka","Osaka"),("Nagoya","Aichi"),("Fukuoka","Fukuoka"),("Sapporo","Hokkaido"),("Sendai","Miyagi"),("Hiroshima","Hiroshima"),("Kyoto","Kyoto"),("Kobe","Hyogo"),("Yokohama","Kanagawa"),("Chiba","Chiba"),("Saitama","Saitama"),("Niigata","Niigata"),("Shizuoka","Shizuoka"),("Okayama","Okayama"),("Kumamoto","Kumamoto"),("Kagoshima","Kagoshima"),("Naha","Okinawa"),("Matsuyama","Ehime"),("Takamatsu","Kagawa"),("Tokushima","Tokushima"),("Kochi","Kochi"),("Tottori","Tottori"),("Matsue","Shimane"),("Yamaguchi","Yamaguchi"),("Oita","Oita"),("Miyazaki","Miyazaki"),("Saga","Saga"),("Nagasaki","Nagasaki"),("Kanazawa","Ishikawa"),("Toyama","Toyama"),("Fukui","Fukui"),("Gifu","Gifu"),("Nagano","Nagano"),("Kofu","Yamanashi"),("Maebashi","Gunma"),("Utsunomiya","Tochigi"),("Mito","Ibaraki"),("Aomori","Aomori"),("Morioka","Iwate"),("Akita","Akita"),("Yamagata","Yamagata"),("Fukushima","Fukushima"),("Nara","Nara"),("Wakayama","Wakayama"),("Tsu","Mie"),("Otsu","Shiga")]:
    data.append((city,state,"Japan"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-4-OK added {len(data)}")
