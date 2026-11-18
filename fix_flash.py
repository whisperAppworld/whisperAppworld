import pathlib
p = pathlib.Path("chat-fix.js")
t = p.read_text()
if "KILL_FLASH_V1" not in t:
    t += r'''
// KILL_FLASH_V1 - stop flashing WhisperChat + CALL, remove not hide
(function(){
  // 1. CSS kill-switch - no flash, stays dead
  var st=document.createElement("style");
  st.textContent = `
    .kill-whisperchat{ display:none!important; visibility:hidden!important; height:0!important; }
  `;
  document.head.appendChild(st);
  window.BLOCK_CALLS = true; // flag for your call code to check
  // 2. Auto-Decline any CALL that appears - click Decline once, don't loop
  var declining = false;
  function killCall(){
    var btns = Array.from(document.querySelectorAll("button,div"));
    var dec = btns.find(function(b){ return (b.textContent||"").trim()==="Decline"; });
    if(dec && !declining){
      declining = true;
      try{ dec.click(); }catch(e){}
      setTimeout(function(){ declining=false; }, 3000);
    }
    // Remove CALL overlay node entirely
    document.querySelectorAll("div").forEach(function(el){
      var txt=(el.textContent||"");
      if(txt.indexOf("CALL")>=0 && txt.indexOf("Accept")>=0 && txt.indexOf("Decline")>=0 && txt.length<200){
        el.remove();
      }
    });
  }
  // 3. Remove WhisperChat node entirely on Messages page - not hide
  function killWhisper(){
    var isMessages = false;
    var nav=document.querySelector(".nav-item.active, [data-tab].active, .tab.active");
    if(nav && (nav.textContent||"").toLowerCase().indexOf("message")>=0) isMessages=true;
    var list=document.getElementById("chat-list");
    if(list && list.offsetParent!==null) isMessages=true;
    if(!isMessages) return;
    document.querySelectorAll("h1,h2,h3,div,span,header").forEach(function(el){
      if((el.textContent||"").trim()==="WhisperChat"){
        el.remove(); // gone, cannot flash back from same node
      }
    });
  }
  // 4. Watch for re-created nodes and kill instantly - no interval flash
  var obs = new MutationObserver(function(){
    killWhisper();
    killCall();
  });
  obs.observe(document.body, {childList:true, subtree:true});
  setInterval(function(){ killWhisper(); killCall(); }, 1000);
})();
'''
    p.write_text(t)
    print("FLASH FIX DONE")
else:
    print("ALREADY DONE")
