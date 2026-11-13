import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
# City, State - one person per missing state
add = [
 ("Amara","Umuahia","Abia State"),("Yusuf","Yola","Adamawa State"),
 ("Ekaette","Uyo","Akwa Ibom State"),("Obi","Awka","Anambra State"),
 ("Aisha","Bauchi","Bauchi State"),("Tamara","Yenagoa","Bayelsa State"),
 ("Terna","Makurdi","Benue State"),("Zainab","Maiduguri","Borno State"),
 ("Ekanem","Calabar","Cross River State"),("Oghene","Asaba","Delta State"),
 ("Chidinma","Abakaliki","Ebonyi State"),("Osas","Benin City","Edo State"),
 ("Tobi","Ado Ekiti","Ekiti State"),("Hafsat","Gombe","Gombe State"),
 ("Ngozi","Owerri","Imo State"),("Sani","Dutse","Jigawa State"),
 ("Bilkisu","Kaduna","Kaduna State"),("Musa","Katsina","Katsina State"),
 ("Halima","Birnin Kebbi","Kebbi State"),("Ojo","Lokoja","Kogi State"),
 ("Funke","Ilorin","Kwara State"),("Rahila","Lafia","Nasarawa State"),
 ("Ibrahim","Minna","Niger State"),("Segun","Abeokuta","Ogun State"),
 ("Ayodele","Akure","Ondo State"),("Adebayo","Osogbo","Osun State"),
 ("Danjuma","Jos","Plateau State"),("Amina","Sokoto","Sokoto State"),
 ("Emmanuel","Jalingo","Taraba State"),("Fatima2","Damaturu","Yobe State"),
 ("Bello","Gusau","Zamfara State"),
]
lines = []
for i,(name,city,state) in enumerate(add):
    img = 20 + (i % 50)
    lines.append(f'  {{ name: "{name}, {22 + (i % 6)}", location: "{city}, {state}, Nigeria", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={img}" }},')
block = "\n".join(lines)
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
assert old in t, "CHRIS-NOT-FOUND"
t = t.replace(old, block + "\n" + old)
p.write_text(t)
print(f"NIGERIA-36-OK added {len(add)}")
