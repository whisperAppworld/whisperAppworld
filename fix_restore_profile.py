import pathlib, re
p = pathlib.Path("chat-fix.js")
t = p.read_text()
# Remove both bad voice note blocks completely
t = re.sub(r"// VOICE_NOTE_V1.*?// VOICE_NOTE_V2", "// VOICE_NOTE_REMOVED - was breaking profile\n", t, flags=re.S)
t = re.sub(r"// VOICE_NOTE_V2.*", "// VOICE_NOTE_V2_REMOVED - was breaking profile\n", t, flags=re.S)
# Also remove any leftover mic button if it was saved in file
t = t.replace("whisper-mic-btn", "whisper-mic-btn-removed")
# Safety: never touch profile inputs again - only run chat fixes inside a chat
t += r'''
// RESTORE_PROFILE_V1 - guard: do NOT run chat fixes on profile/discover pages
(function(){
  // If we are on profile/edit page, remove any floating mic left over
  var mic=document.getElementById("whisper-mic-btn");
  if(mic) mic.remove();
  document.querySelectorAll("button").forEach(function(b){
    if(b.id && b.id.indexOf("whisper-mic")>=0) b.remove();
  });
})();
'''
p.write_text(t)
print("PROFILE RESTORED - voice note code removed")
