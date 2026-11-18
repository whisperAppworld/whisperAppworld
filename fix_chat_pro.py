import pathlib
p = pathlib.Path("chat-fix.js")
t = p.read_text()
if "TRANSLATE_PRO" not in t:
    t += r'''
// TRANSLATE_PRO - professional chat translate
(function(){
  var st=document.createElement("style"); st.textContent=".translate-btn{background:#2a2a2a!important;border:1px solid #3a3a3a!important;color:#fff!important;padding:6px 10px!important;border-radius:999px!important;font-size:12px!important;font-weight:800!important;cursor:pointer!important;white-space:nowrap}.translate-btn.active{background:linear-gradient(135deg,#ff5a8a,#ff8a5c)!important;border-color:transparent!important}.msg-translated{display:block;margin-top:6px;padding-top:6px;border-top:1px dashed rgba(255,255,255,.25);font-size:13px;opacity:.85;font-style:italic}.msg-row.mine .msg-bubble{box-shadow:0 4px 14px rgba(255,90,138,.35)}#messages-list{scroll-behavior:smooth}"; document.head.appendChild(st);
  window._translateOn=false;
  window.toggleTranslateChat=async function(){
    window._translateOn=!window._translateOn;
    var btn=document.getElementById("translateBtn"); if(btn){btn.classList.toggle("active",window._translateOn); btn.textContent=window._translateOn?"🌐 Translating...":"🌐 Translate";}
    if(!window._translateOn){ document.querySelectorAll(".msg-translated").forEach(function(n){n.remove();}); return; }
    var myLang=(localStorage.getItem("whisper_lang")||"English");
    var target=myLang==="French"?"fr":myLang==="Spanish"?"es":"en";
    var bubbles=document.querySelectorAll("#messages-list .msg-bubble");
    for(var i=0;i<bubbles.length;i++){
      var b=bubbles[i]; if(b.querySelector(".msg-translated")) continue;
      var txt=b.childNodes[0]?b.childNodes[0].textContent:""; if(!txt||txt.length<2||txt.indexOf("IMG:")===0) continue;
      try{
        var r=await fetch("https://api.mymemory.translated.net/get?q="+encodeURIComponent(txt)+"&langpair=auto|"+target);
        var j=await r.json(); var tr=j.responseData&&j.responseData.translatedText?j.responseData.translatedText:"";
        if(tr && tr.toLowerCase()!==txt.toLowerCase()){ var s=document.createElement("span"); s.className="msg-translated"; s.textContent="🌐 "+tr; b.appendChild(s); }
      }catch(e){}
    }
  };
  setInterval(function(){
    var title=document.getElementById("chat-title"); if(!title||document.getElementById("translateBtn")) return;
    if(title.textContent.indexOf("Loading")>=0||title.textContent.indexOf("Chat")===0) return;
    var btn=document.createElement("button"); btn.id="translateBtn"; btn.className="translate-btn iconbtn"; btn.textContent="🌐 Translate"; btn.onclick=function(e){e.stopPropagation(); window.toggleTranslateChat();};
    title.appendChild(btn);
  },800);
})();
'''
    p.write_text(t)
    print("CHAT PRO DONE")
else:
    print("ALREADY DONE")
