import pathlib, re
p = pathlib.Path("index.html")
t = p.read_text()
# Remove old interval fix
t = t.replace("setInterval(fixProfileBoxVisibility, 300);", "")
js = """
<style>#my-profile-box{display:none !important} body[data-current-tab="profile"] #my-profile-box{display:block !important}</style>
<script>
// Track real current tab
(function(){
  var origShowTab = window.showTab;
  function setTab(name){
    document.body.setAttribute('data-current-tab', String(name).toLowerCase());
    var box=document.getElementById('my-profile-box');
    if(box) box.style.display = (String(name).toLowerCase().includes('profile') ? 'block' : 'none');
  }
  if(typeof origShowTab==='function'){
    window.showTab = function(name){ setTab(name); return origShowTab.apply(this, arguments); };
  }
  // Also watch nav clicks - for tabs that don't call showTab
  document.addEventListener('click', function(e){
    var btn = e.target.closest ? e.target.closest('button, a, [onclick], [data-tab]') : null;
    if(!btn) return;
    var txt = (btn.getAttribute('data-tab')||btn.getAttribute('onclick')||btn.textContent||'').toLowerCase();
    if(txt.includes('profile')) setTab('profile');
    else if(txt.includes('discover')||txt.includes('chats')||txt.includes('likes')||txt.includes('settings')||txt.includes('messages')) setTab('other');
  });
  // Default = discover
  document.body.setAttribute('data-current-tab','discover');
  var b=document.getElementById('my-profile-box'); if(b) b.style.display='none';
})();
</script>
"""
if 'data-current-tab' not in t:
    t = t.replace('</body>', js+'</body>')
p.write_text(t)
print("VISIBILITY2 DONE")
