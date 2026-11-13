import pathlib
p = pathlib.Path("script.js")
t = p.read_text()
data = []
for city,state in [("Ouagadougou","Centre"),("Bobo-Dioulasso","Hauts-Bassins"),("Koudougou","Centre-Ouest"),("Ouahigouya","Nord"),("Kaya","Centre-Nord"),("Banfora","Cascades"),("Dedougou","Boucle du Mouhoun"),("Tenkodogo","Centre-Est"),("Fada NGourma","Est"),("Dori","Sahel"),("Gaoua","Sud-Ouest"),("Ziniare","Plateau-Central"),("Manga","Centre-Sud")]:
    data.append((city,state,"Burkina Faso"))
for city,state in [("Niamey","Niamey"),("Zinder","Zinder"),("Maradi","Maradi"),("Agadez","Agadez"),("Tahoua","Tahoua"),("Dosso","Dosso"),("Diffa","Diffa")]:
    data.append((city,state,"Niger"))
for city,state in [("NDjamena","NDjamena"),("Moundou","Logone Occidental"),("Sarh","Moyen-Chari"),("Abeche","Ouaddai"),("Kelo","Tandjile"),("Koumra","Mandoul"),("Pala","Mayo-Kebbi Ouest"),("Bongor","Mayo-Kebbi Est"),("Am Timan","Salamat"),("Mongo","Guera")]:
    data.append((city,state,"Chad"))
for city,state in [("Douala","Littoral"),("Yaounde","Centre"),("Garoua","Nord"),("Bamenda","Nord-Ouest"),("Bafoussam","Ouest"),("Ngaoundere","Adamaoua"),("Maroua","Extreme-Nord"),("Kumba","Sud-Ouest"),("Buea","Sud-Ouest"),("Ebolowa","Sud")]:
    data.append((city,state,"Cameroon"))
for city,state in [("Libreville","Estuaire"),("Port-Gentil","Ogooue-Maritime"),("Franceville","Haut-Ogooue"),("Oyem","Woleu-Ntem"),("Moanda","Haut-Ogooue"),("Mouila","Ngounie"),("Lambarene","Moyen-Ogooue"),("Tchibanga","Nyanga"),("Makokou","Ogooue-Ivindo")]:
    data.append((city,state,"Gabon"))
for city,state in [("Brazzaville","Brazzaville"),("Pointe-Noire","Pointe-Noire"),("Dolisie","Niari"),("Nkayi","Bouenza"),("Owando","Cuvette"),("Ouesso","Sangha"),("Gamboma","Plateaux"),("Impfondo","Likouala"),("Madingou","Bouenza"),("Kinkala","Pool"),("Sibiti","Lekoumou"),("Djambala","Plateaux")]:
    data.append((city,state,"Congo"))
for city,state in [("Malabo","Bioko Norte"),("Bata","Litoral"),("Ebebiyin","Kie-Ntem"),("Aconibe","Wele-Nzas"),("Anisoc","Wele-Nzas"),("Evinayong","Centro Sur"),("Mongomo","Wele-Nzas"),("Luba","Bioko Sur")]:
    data.append((city,state,"Equatorial Guinea"))
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara"]
lines = []
for i,(city,state,country) in enumerate(data):
    nm = names[i % len(names)]
    lines.append(f'  {{ name: "{nm}, {22 + (i % 7)}", location: "{city}, {state}, {country}", bio: "From {city}, loves talks and good vibes.", promptQ: "A perfect day...", promptA: "Good food and deep talks.", img: "https://i.pravatar.cc/400?img={20 + (i % 50)}" }},')
old = '  { name: "Chris, 25", location: "New York, New York State, USA"'
t = t.replace(old, '\n'.join(lines) + '\n' + old)
p.write_text(t)
print(f"PHASE2-19-OK added {len(data)}")
