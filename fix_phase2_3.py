import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Beijing","Beijing"),("Shanghai","Shanghai"),("Tianjin","Tianjin"),("Chongqing","Chongqing"),("Guangzhou","Guangdong"),("Shenzhen","Guangdong"),("Chengdu","Sichuan"),("Wuhan","Hubei"),("Xian","Shaanxi"),("Nanjing","Jiangsu"),("Hangzhou","Zhejiang"),("Shenyang","Liaoning"),("Harbin","Heilongjiang"),("Jinan","Shandong"),("Zhengzhou","Henan"),("Changsha","Hunan"),("Fuzhou","Fujian"),("Kunming","Yunnan"),("Nanchang","Jiangxi"),("Hefei","Anhui"),("Taiyuan","Shanxi"),("Shijiazhuang","Hebei"),("Haikou","Hainan"),("Lanzhou","Gansu"),("Xining","Qinghai"),("Guiyang","Guizhou"),("Nanning","Guangxi"),("Hohhot","Inner Mongolia"),("Yinchuan","Ningxia"),("Urumqi","Xinjiang"),("Lhasa","Tibet"),("Taipei","Taiwan"),("Hong Kong","Hong Kong"),("Macau","Macau")]:
    data.append((city,state,"China"))
for city,state in [("Paris","Ile-de-France"),("Lyon","Auvergne-Rhone-Alpes"),("Bordeaux","Nouvelle-Aquitaine"),("Lille","Hauts-de-France"),("Nantes","Pays de la Loire"),("Rennes","Brittany"),("Strasbourg","Grand Est"),("Dijon","Bourgogne-Franche-Comte"),("Rouen","Normandy"),("Orleans","Centre-Val de Loire"),("Toulouse","Occitanie"),("Marseille","Provence-Alpes-Cote dAzur"),("Ajaccio","Corsica"),("Fort-de-France","Martinique"),("Cayenne","French Guiana"),("Saint-Denis","Reunion"),("Mamoudzou","Mayotte"),("Basse-Terre","Guadeloupe")]:
    data.append((city,state,"France"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-3-OK added {len(data)}")
