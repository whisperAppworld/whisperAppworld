import pathlib
p = pathlib.Path("chat-fix.js")
t = p.read_text()
if "CHAT_ALL_IN_ONE_V2" not in t:
    t += r'''
// CHAT_ALL_IN_ONE_V2 - photo design + translate per msg + block + YOUR exact badge + date
(function(){
  var st=document.createElement("style");
  st.textContent="#chat-view{background:#141428!important;border-radius:22px!important;padding:0!important;overflow:hidden}#chat-title{background:#1b1b2e!important;padding:12px!important;border-bottom:1px solid #2a2a44!important;min-height:64px!important;gap:6px!important}#chat-title .nm{font-size:17px!important;color:#fff!important}#chat-title .sub{color:#4ade80!important;font-size:12px!important;font-weight:600!important}#messages-list{background:#141428!important;padding:14px 12px 10px!important;gap:12px!important;max-height:62vh!important}.msg-row{max-width:85%!important;flex-direction:column!important;align-items:flex-start!important;gap:4px!important}.msg-row.mine{margin-left:auto!important;align-items:flex-end!important}.msg-bubble{font-size:15px!important;line-height:1.45!important;padding:11px 14px!important;border-radius:20px!important}.msg-row:not(.mine) .msg-bubble{background:#2e2e44!important;color:#fff!important;border-bottom-left-radius:6px!important}.msg-row.mine .msg-bubble{background:linear-gradient(135deg,#ff5a8a,#ff7a5c)!important;color:#fff!important;border-bottom-right-radius:6px!important;box-shadow:0 4px 14px rgba(255,90,138,.35)!important}.msg-time{color:#8b8b9e!important;font-size:11px!important}#chat-input-bar{background:#2a2a3e!important;border-radius:999px!important;padding:6px 6px 6px 12px!important;margin:10px 10px 12px!important;border:1px solid #3a3a55!important}#chat-input-bar button{background:linear-gradient(135deg,#ff5a8a,#ff8a5c)!important;width:40px!important;height:40px!important}.msg-translate{background:#2a2a3e!important;border:1px solid #3a3a55!important;color:#fff!important;padding:4px 10px!important;border-radius:999px!important;font-size:11px!important;font-weight:700!important;cursor:pointer!important;display:inline-block!important;margin-top:4px}.msg-translated{display:block;margin-top:5px;padding-top:5px;border-top:1px dashed rgba(255,255,255,.25);font-size:13px;opacity:.9}.verify-badge{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:16px!important;height:16px!important;min-width:16px!important;border-radius:50%!important;background:#1DA1F2!important;color:#fff!important;font-size:10px!important;font-weight:900!important;margin-left:5px!important;vertical-align:middle!important;line-height:1!important}.block-btn{background:#2a2a3e!important;border:1px solid #ff5a5a!important;color:#ff8a8a!important;padding:6px 10px!important;border-radius:999px!important;font-size:12px!important;font-weight:800!important;cursor:pointer!important;white-space:nowrap}.date-sep{display:flex;justify-content:center;margin:14px 0 6px}.date-sep span{background:#2a2a3e;border:1px solid #3a3a55;color:#b8b8cc;font-size:11px;font-weight:700;padding:5px 12px;border-radius:999px}";
  document.head.appendChild(st);
  window.translateOneMsg=async function(el){
    var row=el.closest(".msg-row"); if(!row) return;
    var bub=row.querySelector(".msg-bubble"); if(!bub) return;
    var old=row.querySelector(".msg-translated");
    if(old){ old.remove(); el.textContent="🌐 Translate"; return; }
    var txt=""; for(var i=0;i<bub.childNodes.length;i++){ if(bub.childNodes[i].nodeType===3) txt+=bub.childNodes[i].textContent; }
    txt=txt.trim(); if(!txt) return;
    el.textContent="⏳ Translating...";
    var myLang=(localStorage.getItem("whisper_lang")||"English");
    var target=myLang==="French"?"fr":myLang==="Spanish"?"es":"en";
    try{
      var r=await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl="+target+"&dt=t&q="+encodeURIComponent(txt));
      var j=await r.json(); var tr=""; try{ tr=j[0].map(function(x){return x[0]}).join(""); }catch(e){}
      if(tr && tr.toLowerCase()!==txt.toLowerCase()){ var s=document.createElement("span"); s.className="msg-translated"; s.textContent="🌐 "+tr; bub.appendChild(s); el.textContent="🌐 Hide translation"; }
      else el.textContent="🌐 Already in your language";
    }catch(e){ el.textContent="🌐 Tap again"; }
  };
  window.blockThisChat=async function(){
    var name=window.currentChatWith||"this user";
    if(!confirm("Block "+name+"? You will not receive messages from them.")) return;
    try{ if(window._fixOtherId && window.supabase){ var meId=null; try{ meId=JSON.parse(localStorage.getItem("my_profile")||"{}").id; }catch(e){} if(meId) await window.supabase.from("blocked_users").insert([{blocker_id:meId, blocked_id:window._fixOtherId}]); } }catch(e){}
    alert(name+" blocked");
    try{ if(typeof showChatList==="function") showChatList(); }catch(e){}
  };
  setInterval(function(){
    var title=document.getElementById("chat-title"); if(!title) return;
    var nmEl=title.querySelector(".nm");
    var prof=window._fixOtherProfile||{}; var isVer=prof.verified||prof.is_verified||prof.blue_check;
    if(nmEl && isVer && !nmEl.querySelector(".verify-badge")){ var b=document.createElement("span"); b.className="verify-badge"; b.textContent="✓"; b.title="Verified"; nmEl.appendChild(b); }
    var hb=document.getElementById("translateBtn"); if(hb) hb.remove();
    if(nmEl && !document.getElementById("blockChatBtn") && title.textContent.indexOf("Loading")<0){
      var btn=document.createElement("button"); btn.id="blockChatBtn"; btn.className="block-btn"; btn.textContent="🚫 Block";
      btn.onclick=function(e){ e.stopPropagation(); window.blockThisChat(); }; title.appendChild(btn);
    }
    document.querySelectorAll("#messages-list .msg-row").forEach(function(row){
      if(row.querySelector(".msg-translate")) return;
      var bub=row.querySelector(".msg-bubble"); if(!bub) return;
      var link=document.createElement("div"); link.className="msg-translate"; link.textContent="🌐 Translate";
      link.onclick=function(e){ e.stopPropagation(); window.translateOneMsg(link); };
      row.appendChild(link);
    });
    var list=document.getElementById("messages-list");
    if(list && list.children.length>0 && !list.querySelector(".date-sep")){
      var sep=document.createElement("div"); sep.className="date-sep"; var s=document.createElement("span");
      s.textContent="Today • "+new Date().toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
      sep.appendChild(s); list.insertBefore(sep, list.firstChild);
    }
  },900);
})();
'''
    p.write_text(t)
    print("CHAT ALL V2 DONE - YOUR badge kept")
else:
    print("ALREADY DONE")
