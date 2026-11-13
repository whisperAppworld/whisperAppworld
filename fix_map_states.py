import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
# 1. Fix grouping to use LAST part as Country, MIDDLE as State
t = t.replace("    const country = parts[1] || 'Other';", "    const country = parts[parts.length-1] || 'Other';\n    const state = parts.length>=3 ? parts[1] : '';")
t = t.replace("      const city = person.location.split(',')[0].trim();", "      const pp = person.location.split(',').map(s=>s.trim());\n      const city = pp[0];\n      const state2 = pp.length>=3 ? pp[1]+', ' : '';")
t = t.replace("'<span style=\"color:#888;font-size:13px;\">📍 '+city+', '+country+'</span>", "'<span style=\"color:#888;font-size:13px;\">📍 '+city+', '+state2+country+'</span>")
# 2. Add many states per country - insert before "];" of profiles
old = '  { name: "Chris, 25", location: "New York, USA"'
new = '''  { name: "Adaeze, 24", location: "Enugu, Enugu State, Nigeria", bio: "Calm soul, loves music and talks.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img=48" },
  { name: "Tunde, 26", location: "Ibadan, Oyo State, Nigeria", bio: "Funny, loves football.", promptQ: "I get excited about...", promptA: "Good vibes and honest people.", img: "https://i.pravatar.cc/400?img=59" },
  { name: "Fatima, 23", location: "Kano, Kano State, Nigeria", bio: "Poetry and quiet nights.", promptQ: "My love language...", promptA: "Kind words.", img: "https://i.pravatar.cc/400?img=41" },
  { name: "Nia, 22", location: "Bata, Litoral, Equatorial Guinea", bio: "Beach lover, sunset walks.", promptQ: "A perfect day...", promptA: "Beach and music.", img: "https://i.pravatar.cc/400?img=46" },
  { name: "Carlos, 25", location: "Ebebiyin, Kie-Ntem, Equatorial Guinea", bio: "Calm and honest.", promptQ: "I get excited...", promptA: "New friends.", img: "https://i.pravatar.cc/400?img=68" },
  { name: "Efua, 23", location: "Kumasi, Ashanti, Ghana", bio: "Loves food and laughter.", promptQ: "My love language...", promptA: "Quality time.", img: "https://i.pravatar.cc/400?img=43" },
  { name: "Kojo, 24", location: "Takoradi, Western, Ghana", bio: "Beach, music, talks.", promptQ: "A perfect day...", promptA: "Sea breeze.", img: "https://i.pravatar.cc/400?img=14" },
  { name: "Wanjiru, 24", location: "Mombasa, Mombasa County, Kenya", bio: "Ocean lover.", promptQ: "A perfect day...", promptA: "Beach day.", img: "https://i.pravatar.cc/400?img=42" },
  { name: "Otis, 25", location: "Kisumu, Kisumu County, Kenya", bio: "Music and gym.", promptQ: "I get excited...", promptA: "Good music.", img: "https://i.pravatar.cc/400?img=60" },
  { name: "Zanele, 24", location: "Cape Town, Western Cape, South Africa", bio: "Art and sunsets.", promptQ: "My love language...", promptA: "Deep talks.", img: "https://i.pravatar.cc/400?img=40" },
  { name: "Sipho, 26", location: "Durban, KwaZulu-Natal, South Africa", bio: "Beach and football.", promptQ: "A perfect day...", promptA: "Beach with friends.", img: "https://i.pravatar.cc/400?img=61" },
  { name: "Youssef, 25", location: "Alexandria, Alexandria Governorate, Egypt", bio: "Sea, books, talks.", promptQ: "A perfect day...", promptA: "Sea walk.", img: "https://i.pravatar.cc/400?img=62" },
  { name: "Amina, 22", location: "Giza, Giza Governorate, Egypt", bio: "Art and poetry.", promptQ: "A secret...", promptA: "I overthink texts.", img: "https://i.pravatar.cc/400?img=39" },
  { name: "Yannick, 24", location: "Yaounde, Centre, Cameroon", bio: "Music and football.", promptQ: "I get excited...", promptA: "Good music.", img: "https://i.pravatar.cc/400?img=63" },
  { name: "Liam, 25", location: "Manchester, England, UK", bio: "Football and music.", promptQ: "A perfect day...", promptA: "Match day.", img: "https://i.pravatar.cc/400?img=64" },
  { name: "Ava, 23", location: "Los Angeles, California, USA", bio: "Movies and sunsets.", promptQ: "My love language...", promptA: "Quality time.", img: "https://i.pravatar.cc/400?img=38" },
  { name: "Chris, 25", location: "New York, New York State, USA"'''
assert old in t, "CHRIS-NOT-FOUND"
t = t.replace(old, new)
# Also fix old profiles to have State format
t = t.replace('location: "Lagos, Nigeria"', 'location: "Lagos, Lagos State, Nigeria"')
t = t.replace('location: "Malabo, Equatorial Guinea"', 'location: "Malabo, Bioko Norte, Equatorial Guinea"')
t = t.replace('location: "Abuja, Nigeria"', 'location: "Abuja, Federal Capital Territory, Nigeria"')
t = t.replace('location: "Douala, Cameroon"', 'location: "Douala, Littoral, Cameroon"')
t = t.replace('location: "Port Harcourt, Nigeria"', 'location: "Port Harcourt, Rivers State, Nigeria"')
t = t.replace('location: "Accra, Ghana"', 'location: "Accra, Greater Accra, Ghana"')
t = t.replace('location: "Nairobi, Kenya"', 'location: "Nairobi, Nairobi County, Kenya"')
t = t.replace('location: "Johannesburg, South Africa"', 'location: "Johannesburg, Gauteng, South Africa"')
t = t.replace('location: "Cairo, Egypt"', 'location: "Cairo, Cairo Governorate, Egypt"')
t = t.replace('location: "London, UK"', 'location: "London, England, UK"')
p.write_text(t)
print("MAP-STATES-OK")
