import pathlib
p = pathlib.Path("index.html")
t = p.read_text()
t = t.replace(
"nav button{background:none;color:#aaa;font-size:14px}",
"nav button{background:none;color:#aaa;font-size:11px;flex:1;padding:6px 2px}\n.circles{display:flex;gap:10px;overflow-x:auto;padding:10px 0}\n.circle{flex:0 0 62px;width:62px;height:62px;border-radius:50%;border:3px solid #ff5a8a;display:flex;align-items:center;justify-content:center;font-size:22px;background:#222;cursor:pointer}\n.circle span{font-size:10px;display:block;text-align:center}"
)
# Add new sections before <nav>
new_sections = """
<section id="tab-discover">
<h2>🔥 Discover</h2>
<div class="circles" id="circles"></div>
<p>30 people circling near you - tap a circle to view</p>
<div id="discover-list"></div>
</section>
<section id="tab-matches">
<h2>❤️ Matches</h2>
<div id="matches-list"><p>No matches yet. Like people in Discover.</p></div>
</section>
<section id="tab-messages">
<h2>💬 Messages</h2>
<div id="messages-list"><p>No messages yet.</p></div>
<input id="msg-input" placeholder="Type a message...">
<button onclick="sendMsg()">Send</button>
</section>
"""
t = t.replace("<nav>", new_sections + "<nav>")
# Replace nav buttons
old_nav = """<nav>
<button id="btn-profile" class="active" onclick="showTab('profile')">👤 Profile</button>
<button id="btn-people" onclick="showTab('people')">🌍 People</button>
<button id="btn-whisper" onclick="showTab('whisper')">💬 Whisper</button>
</nav>"""
new_nav = """<nav>
<button id="btn-discover" onclick="showTab('discover')">🔥 Discover</button>
<button id="btn-people" onclick="showTab('people')">🌍 People</button>
<button id="btn-matches" onclick="showTab('matches')">❤️ Matches</button>
<button id="btn-messages" onclick="showTab('messages')">💬 Messages</button>
<button id="btn-whisper" onclick="showTab('whisper')">🗣️ Whisper</button>
<button id="btn-profile" class="active" onclick="showTab('profile')">👤 Profile</button>
</nav>"""
t = t.replace(old_nav, new_nav)
# Add settings inside profile + circles JS
t = t.replace(
'<button onclick="saveProfile()">Save Profile</button>',
'''<button onclick="saveProfile()">Save Profile</button>
<h2>⚙️ Settings</h2>
<div class="card"><label>Notifications</label><select id="s-notif"><option>On</option><option>Off</option></select><label>Show my profile</label><select id="s-visible"><option>Everyone</option><option>Only Matches</option><option>Hidden</option></select><label>Language</label><select id="s-lang"><option>English</option><option>Spanish</option><option>French</option></select><button onclick="alert('Settings saved')">Save Settings</button></div>'''
)
t = t.replace(
"function showTab(name){",
"""// 30 circling profiles
const names=["Amina","Carlos","Maria","John","Fatima","David","Sofia","James","Luna","Peter","Nina","Alex","Marta","Kevin","Ada","Luis","Zoe","Emma","Noah","Mia","Liam","Ava","Ethan","Chloe","Lucas","Elena","Omar","Sara","Diego","Grace"];
let c=document.getElementById('circles');
if(c){ c.innerHTML=names.map((n,i)=>`<div class="circle" onclick="alert('Viewing '+n)"><div>👤<br><span>${n}</span></div></div>`).join(''); }
function sendMsg(){ let v=document.getElementById('msg-input').value; if(!v) return; document.getElementById('messages-list').innerHTML+='<div class="card">You: '+v+'</div>'; document.getElementById('msg-input').value=''; }
function showTab(name){"""
)
p.write_text(t)
print("DONE - 6 tabs + 30 circles + Settings added")
