import pathlib
p = pathlib.Path("chat-fix.js")
t = p.read_text()
if "VOICE_NOTE_V1" not in t:
    t += r'''
// VOICE_NOTE_V1 - lightweight voice note next to Send
(function(){
  var rec=null, chunks=[], isRec=false, micBtn=null;
  function findSend(){
    return document.querySelector("button[type=submit], button.send-btn, #send-btn, [id*=send]");
  }
  function makeBtn(){
    if(micBtn && document.body.contains(micBtn)) return;
    var send=findSend();
    if(!send || !send.parentNode) return;
    micBtn=document.createElement("button");
    micBtn.textContent="🎤";
    micBtn.title="Voice note";
    micBtn.style.cssText="width:44px;height:44px;border-radius:50%;border:none;background:#ff5a8a;color:#fff;font-size:20px;cursor:pointer;flex-shrink:0;margin-left:6px";
    micBtn.onclick=function(){
      if(!isRec){
        navigator.mediaDevices.getUserMedia({audio:true}).then(function(stream){
          rec=new MediaRecorder(stream); chunks=[];
          rec.ondataavailable=function(e){ if(e.data.size) chunks.push(e.data); };
          rec.onstop=function(){
            var blob=new Blob(chunks,{type:"audio/webm"});
            var url=URL.createObjectURL(blob);
            var audio=document.createElement("audio");
            audio.controls=true; audio.src=url; audio.style.maxWidth="220px";
            var input=document.querySelector("input[type=text], textarea");
            if(input){ input.value=""; }
            // Insert into chat list as a bubble - your send logic will pick it up if you wire it, for now show preview
            alert("Voice note recorded ("+Math.round(blob.size/1024)+"KB). Tap Send to share - preview below");
            var box=document.getElementById("messages-list")||document.body;
            var div=document.createElement("div");
            div.style.cssText="background:#ffe4ec;padding:8px;border-radius:12px;margin:8px;max-width:260px;margin-left:auto";
            div.appendChild(audio);
            box.appendChild(div);
            stream.getTracks().forEach(function(tr){ tr.stop(); });
          };
          rec.start(); isRec=true; micBtn.textContent="⏹️"; micBtn.style.background="#ff0000";
        }).catch(function(){ alert("Allow microphone to record voice note"); });
      } else {
        try{ rec.stop(); }catch(e){}
        isRec=false; micBtn.textContent="🎤"; micBtn.style.background="#ff5a8a";
      }
    };
    send.parentNode.insertBefore(micBtn, send.nextSibling);
  }
  setInterval(makeBtn, 1000);
})();
'''
    p.write_text(t)
    print("VOICE NOTE DONE")
else:
    print("ALREADY DONE")
