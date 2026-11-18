import pathlib
p = pathlib.Path("chat-fix.js")
t = p.read_text()
if "VOICE_NOTE_V2" not in t:
    t += r'''
// VOICE_NOTE_V2 - real mic icon, finds typing bar directly, always visible
(function(){
  var rec=null, chunks=[], isRec=false, micBtn=null;
  var MIC_SVG = '<svg width="22" height="22" viewBox="0 0 24 24" fill="white"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm7-3a7 7 0 0 1-14 0H3a9 9 0 0 0 18 0h-2zM12 19v3h-1v-3h1z"/></svg>';
  var STOP_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
  function makeMic(){
    if(micBtn) return micBtn;
    var b=document.createElement("button");
    b.id="whisper-mic-btn";
    b.innerHTML=MIC_SVG;
    b.style.cssText="width:46px;height:46px;min-width:46px;border-radius:50%;border:none;background:#ff5a8a;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;z-index:9999;box-shadow:0 2px 8px rgba(0,0,0,0.25)";
    b.onclick=function(){ toggleRec(b); };
    return b;
  }
  function findTypingBar(){
    // find the bottom-most visible text input - that's the chat input
    var inputs=Array.from(document.querySelectorAll("input[type=text], input:not([type]), textarea")).filter(function(el){
      var r=el.getBoundingClientRect(); return r.width>100 && r.height>20 && el.offsetParent!==null;
    });
    if(!inputs.length) return null;
    inputs.sort(function(a,b){ return b.getBoundingClientRect().top - a.getBoundingClientRect().top; });
    return inputs[0];
  }
  function placeMic(){
    var input=findTypingBar();
    micBtn=makeMic();
    if(input && input.parentNode){
      // if already in typing bar, keep it
      if(micBtn.parentNode===input.parentNode) return;
      // put it RIGHT after the input / inside its bar
      var bar=input.parentNode;
      bar.style.display=bar.style.display||"flex";
      bar.style.alignItems="center";
      if(!bar.contains(micBtn)) bar.appendChild(micBtn);
      micBtn.style.position="static"; micBtn.style.marginLeft="8px";
    } else {
      // fallback: floating, always visible above keyboard in chat view
      if(micBtn.style.position!=="fixed"){
        micBtn.style.position="fixed"; micBtn.style.bottom="86px"; micBtn.style.right="14px"; micBtn.style.marginLeft="0";
        document.body.appendChild(micBtn);
      }
    }
  }
  function toggleRec(btn){
    if(!isRec){
      navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
        rec=new MediaRecorder(stream); chunks=[];
        rec.ondataavailable=function(e){ if(e.data.size) chunks.push(e.data); };
        rec.onstop=function(){
          var blob=new Blob(chunks,{type:"audio/webm"});
          var url=URL.createObjectURL(blob);
          var box=document.querySelector("[id*=message], [class*=message-list], [class*=chat-body]")||document.body;
          var div=document.createElement("div");
          div.style.cssText="background:#ff5a8a;color:#fff;padding:10px 12px;border-radius:16px;margin:10px;max-width:280px;margin-left:auto;display:flex;align-items:center;gap:8px";
          div.innerHTML='<span style="font-size:20px">🎙️</span>';
          var audio=document.createElement("audio"); audio.controls=true; audio.src=url; audio.style.maxWidth="200px";
          div.appendChild(audio); box.appendChild(div); box.scrollTop=box.scrollHeight;
          stream.getTracks().forEach(function(tr){ tr.stop(); });
        };
        rec.start(); isRec=true; btn.innerHTML=STOP_SVG; btn.style.background="#e60000";
        btn.style.animation="pulse 1s infinite";
      }).catch(function(){ alert("Allow microphone to record voice note"); });
    } else {
      try{ rec.stop(); }catch(e){}
      isRec=false; btn.innerHTML=MIC_SVG; btn.style.background="#ff5a8a"; btn.style.animation="none";
    }
  }
  setInterval(placeMic, 800);
})();
'''
    p.write_text(t)
    print("VOICE NOTE V2 DONE")
else:
    print("ALREADY DONE")
