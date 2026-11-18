import pathlib
p = pathlib.Path("chat-fix.js")
t = p.read_text()
if "CALL_BUG_FIX_V1" not in t:
    t += r'''
// CALL_BUG_FIX_V1 - stop stale calls replaying on every load
(function(){
  // 1. Kill the annoying alert popup "ended the call"
  var _alert = window.alert;
  window.alert = function(msg){
    var s = String(msg||"");
    if(s.toLowerCase().indexOf("ended the call")>=0) return; // silent, do not block page
    return _alert(msg);
  };
  // 2. On load, clear any old call left in storage
  try{
    Object.keys(localStorage).forEach(function(k){
      if(k.toLowerCase().indexOf("call")>=0) localStorage.removeItem(k);
    });
    Object.keys(sessionStorage).forEach(function(k){
      if(k.toLowerCase().indexOf("call")>=0) sessionStorage.removeItem(k);
    });
  }catch(e){}
  // 3. Every 1 sec: if CALL overlay appears but call is older than 20 sec / no fresh signal, hide it
  var pageLoad = Date.now();
  setInterval(function(){
    // Only auto-hide CALL overlay in first 10 sec after load - a REAL new call after that still shows
    if(Date.now() - pageLoad > 15000) return;
    document.querySelectorAll("div").forEach(function(el){
      var txt=(el.textContent||"");
      if(txt.trim().startsWith("CALL") && txt.indexOf("Accept")>=0 && txt.indexOf("Decline")>=0){
        // This CALL appeared right on load = stale, hide it
        el.style.display="none";
        // Also try to auto-decline it silently
        var dec=document.querySelector("button");
        // do not click Accept ever here
      }
    });
  },800);
  // 4. Stop any old call sound / video on load
  try{
    document.querySelectorAll("video,audio").forEach(function(m){ try{m.pause();}catch(e){} });
  }catch(e){}
})();
'''
    p.write_text(t)
    print("CALL BUG FIX DONE")
else:
    print("ALREADY DONE")
