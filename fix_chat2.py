code = open('script.js').read()

if 'function openChat' not in code:
    print('ERROR: openChat missing')
else:
    print('openChat found')

if 'openChatByName' not in code:
    code += """
function openChatByName(name) {
  const person = likedProfiles.find(function(p){ return p.name === name; });
  if (person) { openChat(person); }
  else { alert('Person not found: ' + name); }
}
window.openChatByName = openChatByName;
"""
    print('Added openChatByName')

# Fix the Chat button in showLiked to use data-name instead of onclick
# This avoids all quote problems
if 'data-chat-name' not in code:
    code = code.replace('>Chat</button>', ' data-chat-name="PLACEHOLDER">Chat</button>')
    # The real fix: we will use delegation, so we just add a listener
    code += """
document.addEventListener('click', function(e) {
  if (e.target.hasAttribute && e.target.hasAttribute('data-chat-name')) {
    const card = e.target.closest('div');
    const nameEl = card ? card.querySelector('strong') : null;
    if (nameEl) { openChatByName(nameEl.textContent); }
  }
});
"""
    print('Added data-chat listener')

open('script.js','w').write(code)
print('DONE')
