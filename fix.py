text = open('script.js').read()
# Add img to profiles
text = text.replace('promptA: "Rainy weather, coffee, and deep conversations."', 'promptA: "Rainy weather, coffee, and deep conversations.", img: "https://i.pravatar.cc/400?img=12"')
text = text.replace('promptA: "Deep talks and remembering small details."', 'promptA: "Deep talks and remembering small details.", img: "https://i.pravatar.cc/400?img=47"')
text = text.replace('promptA: "New music, good food, and honest people."', 'promptA: "New music, good food, and honest people.", img: "https://i.pravatar.cc/400?img=33"')
text = text.replace('promptA: "I overthink every text I send."', 'promptA: "I overthink every text I send.", img: "https://i.pravatar.cc/400?img=45"')
# Add image element
text = text.replace("const promptA = document.querySelector('.prompt p');", "const promptA = document.querySelector('.prompt p');\nconst profileImg = document.getElementById('profile-img');")
# Update image in showProfile
text = text.replace("  promptA.textContent = p.promptA;", "  promptA.textContent = p.promptA;\n  profileImg.src = p.img;")
open('script.js','w').write(text)
print('JS DONE')
