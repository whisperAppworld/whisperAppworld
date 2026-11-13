import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = [("Saint Johns","Saint John","Antigua and Barbuda"),("Buenos Aires","Buenos Aires","Argentina"),("Nassau","New Providence","Bahamas"),("Bridgetown","Saint Michael","Barbados"),("Belmopan","Cayo","Belize"),("Sucre","Chuquisaca","Bolivia"),("Brasilia","Federal District","Brazil"),("Ottawa","Ontario","Canada"),("Santiago","Santiago","Chile"),("Bogota","Bogota","Colombia"),("San Jose","San Jose","Costa Rica"),("Havana","Havana","Cuba"),("Roseau","Saint George","Dominica"),("Santo Domingo","Santo Domingo","Dominican Republic"),("Quito","Pichincha","Ecuador"),("San Salvador","San Salvador","El Salvador"),("Saint Georges","Saint George","Grenada"),("Guatemala City","Guatemala","Guatemala"),("Georgetown","Demerara-Mahaica","Guyana"),("Port-au-Prince","Ouest","Haiti"),("Tegucigalpa","Francisco Morazan","Honduras"),("Kingston","Surrey","Jamaica"),("Mexico City","Mexico City","Mexico"),("Managua","Managua","Nicaragua"),("Panama City","Panama","Panama"),("Asuncion","Asuncion","Paraguay"),("Lima","Lima","Peru"),("Basseterre","Saint George Basseterre","Saint Kitts and Nevis"),("Castries","Castries","Saint Lucia"),("Kingstown","Saint George","Saint Vincent and the Grenadines"),("Paramaribo","Paramaribo","Suriname"),("Port of Spain","Port of Spain","Trinidad and Tobago"),("Montevideo","Montevideo","Uruguay"),("Caracas","Caracas","Venezuela"),("Canberra","Australian Capital Territory","Australia"),("Suva","Central","Fiji"),("Tarawa","South Tarawa","Kiribati"),("Majuro","Majuro","Marshall Islands"),("Palikir","Pohnpei","Micronesia"),("Yaren","Yaren","Nauru"),("Wellington","Wellington","New Zealand"),("Ngerulmud","Melekeok","Palau"),("Port Moresby","National Capital District","Papua New Guinea"),("Apia","Tuamasaga","Samoa"),("Honiara","Honiara","Solomon Islands"),("Nukualofa","Tongatapu","Tonga"),("Funafuti","Funafuti","Tuvalu"),("Port Vila","Shefa","Vanuatu")]
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, "\\n".join(lines) + "\\n" + old)
p.write_text(t)
print(f"AMERICAS-OCEANIA-OK added {len(data)}")
