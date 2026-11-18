import pathlib
p = pathlib.Path("chat-fix.js")
t = p.read_text()
if "MESSAGES_HEADER_V1" not in t:
    t += r'''
// MESSAGES_HEADER_V1 - hide WhisperChat on Messages, style Messages title
(function(){
  var st=document.createElement("style");
  st.textContent=".messages-title-pro{font-size:28px!important;font-weight:900!important;letter-spacing:-0.5px!important;background:linear-gradient(135deg,#ff5a8a,#ff8a5c,#ffb86b)!important;-webkit-background-clip:text!important;-webkit-text-fill-color:transparent!important;background-clip:text!important;display:flex!important;align-items:center!important;gap:8px!important;margin:0!important;padding:4px 0 8px!important}";
  document.head.appendChild(st);
  setInterval(function(){
    var isMessages=false;
    var chatView=document.getElementById("chat-view");
    var msgList=document.getElementById("messages-list");
    // We are in Messages if chat view / messages list is visible
    if((chatView && chatView.offsetParent!==null) || (msgList && msgList.offsetParent!==null)) isMessages=true;
    // Also check nav: Messages tab active
    var activeTab=document.querySelector("[data-tab=\"messages\"].active, .nav-item.active");
    if(activeTab && (activeTab.textContent||"").toLowerCase().indexOf("message")>=0) isMessages=true;
    // Find all elements that say WhisperChat
    document.querySelectorAll("h1,h2,h3,div,header").forEach(function(el){
      if(el.children.length>0) return; // only leaf text
      if((el.textContent||"").trim()==="WhisperChat"){
        el.dataset.whisperTitle="1";
        el.style.display=isMessages?"none":"";
      }
    });
    // Style the Messages heading
    document.querySelectorAll("h1,h2,h3,div").forEach(function(el){
      if(el.children.length>0) return;
      var txt=(el.textContent||"").trim();
      if(txt==="💬 Messages"||txt==="Messages"||txt.indexOf("Messages")===0 && txt.length<20){
        if(!el.classList.contains("messages-title-pro")) el.classList.add("messages-title-pro");
        if(txt==="Messages") el.textContent="💬 Messages";
      }
    });
  },800);
})();
'''
    p.write_text(t)
    print("MESSAGES HEADER DONE")
else:
    print("ALREADY DONE")
