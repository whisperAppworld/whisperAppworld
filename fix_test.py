code = open('script.js').read()
if 'test-chat-btn' not in code:
    code += """
document.getElementById('test-chat-btn').addEventListener('click', function() {
  const alex = profiles[0];
  if (!likedProfiles.find(function(p){ return p.name === alex.name; })) { likedProfiles.push(alex); }
  openChat(alex);
});
"""
    open('script.js','w').write(code)
    print('TEST WIRED')
