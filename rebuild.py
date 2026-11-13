html = open('index.html').read()
# 1. Make sure chat UI exists - if not, add it
if 'chat-window' not in html:
    chat_ui = '<div id="chat-list"></div><div id="chat-window" style="display:none;"><button id="back-to-chats" style="background:none;border:none;font-size:16px;color:#6C63FF;">Back</button><div style="display:flex;gap:10px;background:white;padding:10px;border-radius:15px;"><img id="chat-img" style="width:45px;height:45px;border-radius:50%;"><strong id="chat-name"></strong></div><div id="chat-messages" style="height:280px;overflow-y:auto;background:#f5f5f5;border-radius:15px;padding:12px;margin:12px 0;display:flex;flex-direction:column;gap:8px;"></div><div style="display:flex;gap:8px;"><input id="chat-input" placeholder="Type a message..." style="flex:1;padding:12px;border-radius:20px;border:1px solid #ddd;"><button id="send-btn" style="background:#6C63FF;color:white;border:none;padding:12px 18px;border-radius:20px;">Send</button></div></div><p id="no-chats">No chats yet.</p>'
    html = html.replace('<h2>Chats</h2>', '<h2>Chats</h2>' + chat_ui)
    open('index.html','w').write(html)
    print('HTML FIXED')
else:
    print('HTML OK')

js = open('script.js').read()
# 2. Add working chat functions if not there, using INDEX not name
if 'openChatByIndex' not in js:
    js += """
let currentChatIndex = -1;
let chatStore = {};
function openChatByIndex(i) {
  currentChatIndex = i;
  const person = likedProfiles[i];
  if (!person) { alert('No person'); return; }
  document.querySelectorAll('.nav-btn').forEach(function(b){ b.classList.remove('active'); });
  document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('active'); });
  document.querySelector('[data-screen="chats"]').classList.add('active');
  document.getElementById('chats').classList.add('active');
  document.getElementById('chat-window').style.display = 'block';
  document.getElementById('chat-list').style.display = 'none';
  const nc = document.getElementById('no-chats');
  if (nc) nc.style.display = 'none';
  document.getElementById('chat-img').src = person.img;
  document.getElementById('chat-name').textContent = person.name;
  if (!chatStore[person.name]) { chatStore[person.name] = ['Hey! Thanks for liking me.']; }
  renderChat();
}
function renderChat() {
  const person = likedProfiles[currentChatIndex];
  const box = document.getElementById('chat-messages');
  if (!box || !person) return;
  box.innerHTML = '';
  const msgs = chatStore[person.name] || [];
  for (let k=0;k<msgs.length;k++) {
    const d = document.createElement('div');
    d.textContent = msgs[k];
    d.style.cssText = 'background:white;padding:10px 14px;border-radius:15px;max-width:80%;';
    box.appendChild(d);
  }
}
function sendChat() {
  const inp = document.getElementById('chat-input');
  const t = inp.value.trim();
  if (!t) return;
  const person = likedProfiles[currentChatIndex];
  chatStore[person.name].push('You: ' + t);
  inp.value = '';
  renderChat();
  setTimeout(function(){
    chatStore[person.name].push('Alex: That is interesting, tell me more...');
    renderChat();
  }, 1000);
}
document.getElementById('send-btn').addEventListener('click', sendChat);
document.getElementById('back-to-chats').addEventListener('click', function(){
  document.getElementById('chat-window').style.display = 'none';
  document.getElementById('chat-list').style.display = 'block';
});
"""
    open('script.js','w').write(js)
    print('CHAT FUNCTIONS ADDED')
else:
    print('CHAT FUNCTIONS ALREADY THERE')

# 3. Fix showLiked button to use index
js2 = open('script.js').read()
# Replace any Chat button generation with index version - we patch by adding a new showLiked that overwrites old one
if 'NEW_SHOWLIKED' not in js2:
    js2 += """
function showLiked() {
  const list = document.getElementById('liked-list');
  const emptyMsg = document.getElementById('no-likes');
  if (!list) return;
  if (likedProfiles.length === 0) {
    list.innerHTML = '';
    if (emptyMsg) emptyMsg.style.display = 'block';
    return;
  }
  if (emptyMsg) emptyMsg.style.display = 'none';
  let html = '';
  for (let i=0;i<likedProfiles.length;i++) {
    const p = likedProfiles[i];
    html += '<div style="display:flex;align-items:center;gap:12px;background:white;padding:12px;border-radius:15px;margin-bottom:10px;"><img src="' + p.img + '" style="width:60px;height:60px;border-radius:50%;"><div style="flex:1;"><strong>' + p.name + '</strong><br><span style="color:#888;">' + p.location + '</span></div><button onclick="openChatByIndex(' + i + ')" style="background:#6C63FF;color:white;border:none;padding:8px 14px;border-radius:20px;">Chat</button></div>';
  }
  list.innerHTML = html;
}
// NEW_SHOWLIKED
"""
    open('script.js','w').write(js2)
    print('SHOWLIKED REPLACED WITH WORKING VERSION')
