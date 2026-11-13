import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = [("Algiers","Algiers","Algeria"),("Luanda","Luanda","Angola"),("Porto-Novo","Oueme","Benin"),("Gaborone","South-East","Botswana"),("Ouagadougou","Centre","Burkina Faso"),("Gitega","Gitega","Burundi"),("Praia","Santiago","Cabo Verde"),("Bangui","Bangui","Central African Republic"),("NDjamena","Chari-Baguirmi","Chad"),("Moroni","Grande Comore","Comoros"),("Brazzaville","Brazzaville","Congo"),("Djibouti City","Djibouti","Djibouti"),("Kinshasa","Kinshasa","DR Congo"),("Asmara","Central","Eritrea"),("Mbabane","Hhohho","Eswatini"),("Addis Ababa","Addis Ababa","Ethiopia"),("Libreville","Estuaire","Gabon"),("Banjul","Banjul","Gambia"),("Conakry","Conakry","Guinea"),("Bissau","Bissau","Guinea-Bissau"),("Maseru","Maseru","Lesotho"),("Monrovia","Montserrado","Liberia"),("Tripoli","Tripoli","Libya"),("Antananarivo","Analamanga","Madagascar"),("Lilongwe","Lilongwe","Malawi"),("Bamako","Bamako","Mali"),("Nouakchott","Nouakchott","Mauritania"),("Port Louis","Port Louis","Mauritius"),("Rabat","Rabat-Sale-Kenitra","Morocco"),("Maputo","Maputo","Mozambique"),("Windhoek","Khomas","Namibia"),("Niamey","Niamey","Niger"),("Kigali","Kigali","Rwanda"),("Sao Tome","Sao Tome","Sao Tome and Principe"),("Dakar","Dakar","Senegal"),("Victoria","Mahe","Seychelles"),("Freetown","Western Area","Sierra Leone"),("Mogadishu","Banadir","Somalia"),("Juba","Central Equatoria","South Sudan"),("Khartoum","Khartoum","Sudan"),("Dodoma","Dodoma","Tanzania"),("Lome","Maritime","Togo"),("Tunis","Tunis","Tunisia"),("Kampala","Kampala","Uganda"),("Lusaka","Lusaka","Zambia"),("Harare","Harare","Zimbabwe")]
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, "\n".join(lines) + "\n" + old)
p.write_text(t)
print(f"AFRICA-REST-OK added {len(data)}")
