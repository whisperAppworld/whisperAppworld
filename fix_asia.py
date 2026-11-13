import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = [("Kabul","Kabul","Afghanistan"),("Yerevan","Yerevan","Armenia"),("Baku","Baku","Azerbaijan"),("Manama","Capital","Bahrain"),("Dhaka","Dhaka","Bangladesh"),("Thimphu","Thimphu","Bhutan"),("Bandar Seri Begawan","Brunei-Muara","Brunei"),("Phnom Penh","Phnom Penh","Cambodia"),("Beijing","Beijing","China"),("Tbilisi","Tbilisi","Georgia"),("New Delhi","Delhi","India"),("Jakarta","Jakarta","Indonesia"),("Tehran","Tehran","Iran"),("Baghdad","Baghdad","Iraq"),("Jerusalem","Jerusalem","Israel"),("Tokyo","Tokyo","Japan"),("Amman","Amman","Jordan"),("Astana","Astana","Kazakhstan"),("Kuwait City","Capital","Kuwait"),("Bishkek","Bishkek","Kyrgyzstan"),("Vientiane","Vientiane","Laos"),("Beirut","Beirut","Lebanon"),("Kuala Lumpur","Kuala Lumpur","Malaysia"),("Male","Male","Maldives"),("Ulaanbaatar","Ulaanbaatar","Mongolia"),("Naypyidaw","Naypyidaw","Myanmar"),("Kathmandu","Bagmati","Nepal"),("Pyongyang","Pyongyang","North Korea"),("Muscat","Muscat","Oman"),("Islamabad","Islamabad","Pakistan"),("Ramallah","Ramallah","Palestine"),("Manila","Metro Manila","Philippines"),("Doha","Doha","Qatar"),("Riyadh","Riyadh","Saudi Arabia"),("Singapore","Singapore","Singapore"),("Seoul","Seoul","South Korea"),("Colombo","Western","Sri Lanka"),("Damascus","Damascus","Syria"),("Taipei","Taipei","Taiwan"),("Dushanbe","Dushanbe","Tajikistan"),("Bangkok","Bangkok","Thailand"),("Dili","Dili","Timor-Leste"),("Ankara","Ankara","Turkey"),("Ashgabat","Ashgabat","Turkmenistan"),("Abu Dhabi","Abu Dhabi","UAE"),("Tashkent","Tashkent","Uzbekistan"),("Hanoi","Hanoi","Vietnam"),("Sanaa","Sanaa","Yemen")]
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, "\\n".join(lines) + "\\n" + old)
p.write_text(t)
print(f"ASIA-OK added {len(data)}")
