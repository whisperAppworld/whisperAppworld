import pathlib
p = pathlib.Path('push.js')
t = p.read_text()
# Add direct handler that works even if DOMContentLoaded already fired
t = t.replace('window.setupPush = setupPush;', '''window.setupPush = setupPush;
window.handlePushToggle = async (el) => {
  console.log('Push toggle clicked', el.checked);
  if (el.checked) {
    const ok = await window.setupPush();
    if (!ok) el.checked = false;
  } else {
    await window.disablePush();
  }
  syncNotifToggles();
};''')
p.write_text(t)
print('push.js patched')
