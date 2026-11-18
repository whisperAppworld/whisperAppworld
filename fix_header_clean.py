import pathlib
p = pathlib.Path("chat-fix.js")
t = p.read_text()
if "HEADER_CLEAN_V1" not in t:
    t += r'''
// HEADER_CLEAN_V1 - remove duplicate Block + header Translate, keep shield
(function(){
  var st=document.createElement("style");
  st.textContent="#chat-title{flex-wrap:nowrap!important;overflow:hidden}#chat-title .nm{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;max-width:130px!important}#blockChatBtn{display:none!important}#translateBtn{display:none!important}[id*=\"translate\"][id*=\"Btn\"]{display:none!important}.msg-translate{display:inline-block!important}";
  document.head.appendChild(st);
  // Wire YOUR shield button to real block
  setInterval(function(){
    var myBlock=document.getElementById("blockChatBtn"); if(myBlock) myBlock.remove();
    // Find header Translate buttons (any button with Translate text in header only)
    document.querySelectorAll("#chat-title button, #chat-title .btn, #chat-title [onclick]").forEach(function(b){
      var txt=(b.textContent||"").toLowerCase();
      if(txt.indexOf("translat")>=0){ b.style.display="none"; b.remove(); }
    });
    // Find shield button - it contains shield emoji or has block in id/class/onclick
    var title=document.getElementById("chat-title"); if(!title) return;
    title.querySelectorAll("button").forEach(function(b){
      var txt=b.textContent||""; var id=(b.id||"").toLowerCase(); var cls=(b.className||"").toLowerCase();
      var isShield=txt.indexOf("🛡")>=0||txt.indexOf("🛡️")>=0||id.indexOf("block")>=0||cls.indexOf("block")>=0;
      if(isShield && !b.dataset.wired){
        b.dataset.wired="1";
        b.onclick=function(e){ e.stopPropagation(); if(window.blockThisChat) window.blockThisChat(); };
      }
    });
  },800);
})();
'''
    p.write_text(t)
    print("HEADER CLEAN DONE")
else:
    print("ALREADY DONE")
