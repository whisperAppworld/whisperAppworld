import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
# Brazil - 26 states + DF
for city,state in [("Sao Paulo","Sao Paulo"),("Rio de Janeiro","Rio de Janeiro"),("Belo Horizonte","Minas Gerais"),("Salvador","Bahia"),("Fortaleza","Ceara"),("Recife","Pernambuco"),("Porto Alegre","Rio Grande do Sul"),("Curitiba","Parana"),("Goiania","Goias"),("Belem","Para"),("Manaus","Amazonas"),("Florianopolis","Santa Catarina"),("Vitoria","Espirito Santo"),("Campo Grande","Mato Grosso do Sul"),("Cuiaba","Mato Grosso"),("Natal","Rio Grande do Norte"),("Joao Pessoa","Paraiba"),("Maceio","Alagoas"),("Aracaju","Sergipe"),("Teresina","Piaui"),("Sao Luis","Maranhao"),("Palmas","Tocantins"),("Porto Velho","Rondonia"),("Rio Branco","Acre"),("Boa Vista","Roraima"),("Macapa","Amapa"),("Brasilia","Distrito Federal")]:
    data.append((city,state,"Brazil"))
# India - 28 states + 8 UTs
for city,state in [("Mumbai","Maharashtra"),("Kolkata","West Bengal"),("Chennai","Tamil Nadu"),("Bengaluru","Karnataka"),("Hyderabad","Telangana"),("Ahmedabad","Gujarat"),("Jaipur","Rajasthan"),("Lucknow","Uttar Pradesh"),("Patna","Bihar"),("Bhopal","Madhya Pradesh"),("Bhubaneswar","Odisha"),("Chandigarh","Punjab"),("Dehradun","Uttarakhand"),("Shimla","Himachal Pradesh"),("Srinagar","Jammu and Kashmir"),("Guwahati","Assam"),("Imphal","Manipur"),("Shillong","Meghalaya"),("Aizawl","Mizoram"),("Kohima","Nagaland"),("Agartala","Tripura"),("Gangtok","Sikkim"),("Itanagar","Arunachal Pradesh"),("Panaji","Goa"),("Raipur","Chhattisgarh"),("Ranchi","Jharkhand"),("Thiruvananthapuram","Kerala"),("Amaravati","Andhra Pradesh"),("New Delhi","Delhi"),("Puducherry","Puducherry"),("Port Blair","Andaman and Nicobar Islands"),("Leh","Ladakh"),("Kavaratti","Lakshadweep"),("Daman","Dadra and Nagar Haveli and Daman and Diu"),("Chandigarh","Chandigarh"),("Jammu","Jammu and Kashmir")]:
    data.append((city,state,"India"))
# Canada - 10 provinces + 3 territories
for city,state in [("Toronto","Ontario"),("Montreal","Quebec"),("Vancouver","British Columbia"),("Calgary","Alberta"),("Winnipeg","Manitoba"),("Halifax","Nova Scotia"),("Saskatoon","Saskatchewan"),("St Johns","Newfoundland and Labrador"),("Charlottetown","Prince Edward Island"),("Fredericton","New Brunswick"),("Whitehorse","Yukon"),("Yellowknife","Northwest Territories"),("Iqaluit","Nunavut")]:
    data.append((city,state,"Canada"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-1-OK added {len(data)}")
