import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Dar es Salaam","Dar es Salaam"),("Mwanza","Mwanza"),("Arusha","Arusha"),("Dodoma","Dodoma"),("Mbeya","Mbeya"),("Morogoro","Morogoro"),("Tanga","Tanga"),("Zanzibar City","Zanzibar"),("Kigoma","Kigoma"),("Moshi","Kilimanjaro"),("Tabora","Tabora"),("Iringa","Iringa")]:
    data.append((city,state,"Tanzania"))
for city,state in [("Kampala","Kampala"),("Gulu","Gulu"),("Lira","Lira"),("Mbarara","Mbarara"),("Jinja","Jinja"),("Bwizibwera","Mbarara"),("Mbale","Mbale"),("Masaka","Masaka"),("Entebbe","Wakiso"),("Fort Portal","Kabarole")]:
    data.append((city,state,"Uganda"))
for city,state in [("Kigali","Kigali"),("Butare","Southern"),("Gisenyi","Western"),("Musanze","Northern"),("Rwamagana","Eastern")]:
    data.append((city,state,"Rwanda"))
for city,state in [("Kinshasa","Kinshasa"),("Lubumbashi","Haut-Katanga"),("Mbuji-Mayi","Kasai-Oriental"),("Kananga","Kasai-Central"),("Kisangani","Tshopo"),("Bukavu","South Kivu"),("Goma","North Kivu"),("Likasi","Haut-Katanga"),("Kolwezi","Lualaba"),("Matadi","Kongo Central"),("Bunia","Ituri"),("Kindu","Maniema")]:
    data.append((city,state,"DR Congo"))
for city,state in [("Luanda","Luanda"),("Huambo","Huambo"),("Lobito","Benguela"),("Benguela","Benguela"),("Kuito","Bie"),("Lubango","Huila"),("Malanje","Malanje"),("Uige","Uige"),("Cabinda","Cabinda"),("Soyo","Zaire")]:
    data.append((city,state,"Angola"))
for city,state in [("Lusaka","Lusaka"),("Kitwe","Copperbelt"),("Ndola","Copperbelt"),("Kabwe","Central"),("Chingola","Copperbelt"),("Mufulira","Copperbelt"),("Livingstone","Southern"),("Luanshya","Copperbelt")]:
    data.append((city,state,"Zambia"))
for city,state in [("Harare","Harare"),("Bulawayo","Bulawayo"),("Mutare","Manicaland"),("Gweru","Midlands"),("Kwekwe","Midlands"),("Kadoma","Mashonaland West"),("Masvingo","Masvingo"),("Chinhoyi","Mashonaland West")]:
    data.append((city,state,"Zimbabwe"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-16-OK added {len(data)}")
