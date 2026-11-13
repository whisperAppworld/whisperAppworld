import pathlib, re, random
p = pathlib.Path("script.js")
t = p.read_text()
random.seed(42)
bios = [
    "Coffee first, deep talks second. Always up for a good story.",
    "Explorer at heart. Ask me about my favorite hidden spot in town.",
    "Music, movies, and late-night conversations. That's my vibe.",
    "Foodie who loves trying new places. Take me somewhere good.",
    "Bookworm by day, adventurer on weekends.",
    "Love art, travel, and meeting new people.",
    "Gym, good food, and good company. Simple life, happy life.",
    "Dreamer with big plans. Let's talk about yours.",
    "Chill vibes only. Good conversation > small talk.",
    "Local guide in training. I know all the best spots here.",
    "Photography lover. Always chasing golden hour.",
    "Old soul, new ideas. Let's skip the small talk.",
]
qs = ["A perfect day...", "My guilty pleasure...", "Unpopular opinion...", "My ideal weekend...", "Something I love...", "My happy place...", "Two truths and a lie...", "Best advice I've gotten..."]
ans = ["Good food and deep talks.", "Sunset, good music, no phone.", "Traveling with no plan, just vibes.", "A cozy cafe and a great book.", "Laughing until my stomach hurts.", "Road trip with my favorite playlist.", "Trying street food in a new city.", "A long walk and a real conversation."]
names = ["Ada","Kwame","Zain","Nia","Tobi","Ama","Leo","Maya","Ife","Sara","Liam","Sofia","Noah","Ava","Lucas","Mia","Ethan","Luna","Omar","Layla","Diego","Elena","Kenji","Yuki","Priya","Arjun","Fatima","Yusuf","Ingrid","Mateo","Chloe","Oscar","Nora","Felix","Ruby","Hugo","Ivy","Gabriel","Lena","Carlos"]
def repl(m):
    loc = m.group(1)
    name = random.choice(names)
    age = random.randint(21, 32)
    bio = random.choice(bios)
    q = random.choice(qs)
    a = random.choice(ans)
    img = random.randint(1, 70)
    return f'  {{ name: "{name}, {age}", location: "{loc}", bio: "{bio}", promptQ: "{q}", promptA: "{a}", img: "https://i.pravatar.cc/400?img={img}" }},'
pat = re.compile(r'\s*\{ name: "[^"]+", location: "([^"]+)", bio: "[^"]*", promptQ: "[^"]*", promptA: "[^"]*", img: "[^"]+" \},')
t2, n = pat.subn(lambda m: repl(m), t)
p.write_text(t2)
print(f"PHASE4-OK polished {n} profiles")
