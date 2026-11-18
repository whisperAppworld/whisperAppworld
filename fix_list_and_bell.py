import pathlib
p = pathlib.Path("chat-fix.js")
t = p.read_text()
if "LIST_AND_BELL_V1" not in t:
    t += r'''
// LIST_AND_BELL_V1 - hide WhisperChat on list + hide bell inside chat
(function(){
  setInterval(function(){
    var navActive=document.querySelector(".nav-item.active, [data-tab].active, .tab.active");
    var navTxt=navActive?(navActive.textContent||"").toLowerCase():"";
    var isMessagesPage=navTxt.indexOf("message")>=0;
    var list=document.getElementById("chat-list")||document.querySelector("[id*=\"chat-list\"]");
    if(list && list.offsetParent!==null) isMessagesPage=true;
    var inChat=false;
    var msgList=document.getElementById("messages-list");
    var chatView=document.getElementById("chat-view");
    if((msgList && msgList.offsetParent!==null) || (chatView && chatView.offsetParent!==null)) inChat=true;
    if(isMessagesPage){
      document.querySelectorAll("h1,h2,h3,div,span,header").forEach(function(el){
        if((el.textContent||"").trim()==="WhisperChat"){
          el.style.display="none"; el.style.height="0"; el.style.margin="0"; el.style.padding="0";
        }
      });
    }
    // Bell: hide ONLY inside chat, show on list
    document.querySelectorAll("button,div,span,a").forEach(function(el){
      var txt=(el.textContent||"").trim();
      if(txt==="🔔" || txt.indexOf("🔔")>=0 && txt.length<5){
        if(inChat){ el.style.display="none"; }
        else if(isMessagesPage){ el.style.display=""; }
      }
      if(el.id && el.id.toLowerCase().indexOf("notif")>=0){
        if(inChat){ el.style.display="none"; }
        else if(isMessagesPage){ el.style.display=""; }
      }
    });
  },600);
})();
'''
    p.write_text(t)
    print("LIST + BELL DONE")
else:
    print("ALREADY DONE")
