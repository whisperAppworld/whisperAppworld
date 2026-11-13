code = open('script.js').read()

# 1. Add chat variables at top after likedProfiles
if 'currentChat' not in code:
    code = code.replace('let likedProfiles = [];', 'let likedProfiles = [];\nlet currentChat = null;\nlet chats = {};')

# 2. Add openChat + send functions before Buttons section if not there
if 'function openChat' not in code:
    func = """
function openChat(person) {
  currentChat = person;
  // Go to Chats screen
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelector('[data-screen="chats"]').classList.add('active');
  document.getElementById('chats').classList.add('active');
  // Show window
  document.getElementById('chat-list').style.display = 'none';
  const noChats = document.getElementById('no-chats');
  if (noChats) noChats.style.display = 'none';
  const win = document.getElementById('chat-window');
  win.style.display = 'block';
  document.getElementById('chat-img').src = person.img;
  document.getElementById('chat-name').textContent = person.name;
  if (!chats[person.name]) chats[person.name] = [{from:'them', text:'Hey! Thanks for liking me. Tell me about you?'}];
  renderMessages();
}
function renderMessages() {
  const box = document.getElementById('chat-messages');
  if (!box || !currentChat) return;
  box.innerHTML = '';
  for (let m of chats[currentChat.name]) {
    const div = document.createElement('div');
    div.textContent = m.text;
    div.style.cssText = m.from === 'me' ? 'align-self:flex-end; background:#6C63FF; color:white; padding:10px 14px; border-radius:18px 18px 4px 18px; max-width:80%;' : 'align-self:flex-start; background:white; padding:10px 14px; border-radius:18px 18px 18px 4px; max-width:80%; box-shadow:0 1px 3px rgba(0,0,0,0.1);';
    box.appendChild(div);
  }
  box.scrollTop = box.scrollHeight;
}
function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text || !currentChat) return;
  chats[currentChat.name].push({from:'me', text:text});
  input.value = '';
  renderMessages();
  // Auto reply after 1 sec so you can test
  setTimeout(() => {
    const replies = ['That is interesting, tell me more...', 'Haha I like your vibe', 'So what do you do for fun?', 'I would love to talk more, what about you?'];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    chats[currentChat.name].push({from:'them', text: reply});
    renderMessages();
  }, 1000);
}
"""
    code = code.replace("document.querySelector('.btn.pass')", func + "\ndocument.querySelector('.btn.pass')")

# 3. Wire Send button and Back button - add at end of file
if 'send-btn' not in code:
    code += """
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('chat-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
document.getElementById('back-to-chats').addEventListener('click', () => {
  document.getElementById('chat-window').style.display = 'none';
  document.getElementById('chat-list').style.display = 'block';
  const noChats = document.getElementById('no-chats');
  if (noChats && Object.keys(chats).length === 0) noChats.style.display = 'block';
});
"""

# 4. Make Likes Chat button call openChat - replace the button in showLiked
# We replace the old Chat button HTML with one that calls openChat
code = code.replace('onclick="alert', 'data-old-alert="')
# In showLiked, we need the button to use openChat: patch the generation
# Easiest: after showLiked is defined, we will use delegation - add global listener
if 'chat-btn-click' not in code:
    code += """
document.addEventListener('click', (e) => {
  if (e.target.textContent === 'Chat') {
    const card = e.target.closest('div');
    const nameEl = card ? card.querySelector('strong') : null;
    if (nameEl) {
      const person = likedProfiles.find(p => p.name === nameEl.textContent);
      if (person) openChat(person);
    }
  }
});
"""

open('script.js','w').write(code)
print('CHAT FIX DONE')
