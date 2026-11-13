import pathlib, re
p = pathlib.Path("index.html")
t = p.read_text()
# Remove any auto-open profile
t = t.replace("showTab('profile')", "showTab('discover')")
t = t.replace('showTab("profile")', 'showTab("discover")')
t = t.replace("showTab('Profile')", "showTab('discover')")
js = """
<script>
document.addEventListener('DOMContentLoaded', function(){
  try{
    // Hide all tab contents, show only discover
    var tabs = document.querySelectorAll('[id="discover"], [id="profile"], [id="chats"], [id="likes"], [id="settings"]');
    tabs.forEach(function(el){ el.style.display = (el.id==='discover' ? 'block' : 'none'); });
    // Also try common class
    var panes = document.querySelectorAll('.tab-pane, .tab-content, .page');
    // Only if we found discover, force it
    var d = document.getElementById('discover');
    if(d){ d.style.display='block'; }
    var pr = document.getElementById('profile');
    if(pr){ pr.style.display='none'; }
    if(typeof showTab==='function'){ try{ showTab('discover'); }catch(e){} }
    // Fix nav active state
    document.querySelectorAll('.nav-btn, .tab-btn, [data-tab]').forEach(function(b){
      var isDisc = (b.getAttribute('data-tab')==='discover' || b.textContent.toLowerCase().includes('discover') || b.textContent.includes('🔥'));
      b.classList.toggle('active', isDisc);
    });
  }catch(e){ console.log(e); }
});
</script>
"""
if 'FORCE DISCOVER DEFAULT' not in t:
    t = t.replace('</body>', '<!-- FORCE DISCOVER DEFAULT -->' + js + '</body>')
p.write_text(t)
print("DEFAULT FIX DONE")
