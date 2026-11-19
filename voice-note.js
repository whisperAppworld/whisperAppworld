var vnRec=null,vnChunks=[],vnSec=0,vnTimer=null,vnUrl=null;
function vnBtn(){var inp=document.querySelector('input[placeholder*="Ecris"],input[placeholder*="message"],input[placeholder*="Message"]');if(!inp)return;var bar=inp.parentElement;if(!bar||document.getElementById('vn-mic'))return;var b=document.createElement('button');b.id='vn-mic';b.textContent='🎙️';b.style.cssText='font-size:22px;background:none;border:0;padding:4px 6px';b.onclick=async function(){if(vnRec){vnRec.stop();return;}try{var st=await navigator.mediaDevices.getUserMedia({audio:true});vnChunks=[];vnSec=0;vnRec=new MediaRecorder(st);vnRec.ondataavailable=function(e){if(e.data.size)vnChunks.push(e.data);};vnRec.onstop=function(){st.getTracks().forEach(function(t){t.stop();});clearInterval(vnTimer);vnRec=null;var ind=document.getElementById('vn-ind');if(ind)ind.remove();b.textContent='🎙️';b.style.background='none';vnPreview();};vnRec.start();b.textContent='⏹️';b.style.background='#ff0000';b.style.borderRadius='50%';var ind=document.createElement('div');ind.id='vn-ind';ind.style.cssText='position:fixed;top:70px;left:50%;transform:translateX(-50%);background:#ff0000;color:#fff;padding:8px 16px;border-radius:999px;z-index:10002;font-weight:700';ind.textContent='🔴 REC 0:00';document.body.appendChild(ind);vnTimer=setInterval(function(){vnSec++;var m=Math.floor(vnSec/60),s=vnSec%60;var el=document.getElementById('vn-ind');if(el)el.textContent='🔴 REC '+m+':'+(s<10?'0':'')+s;},1000);}catch(e){alert('Mic blocked: '+e.message);}};bar.insertBefore(b,bar.lastElementChild);}
function vnPreview(){var bl=new Blob(vnChunks,{type:'audio/webm'});if(bl.size<1000){alert('Too short');return;}var rd=new FileReader();rd.onload=function(){vnUrl=rd.result;var o=document.createElement('div');o.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);z-index:10001;display:flex;align-items:center;justify-content:center;padding:16px';o.innerHTML='<div style="background:#1a1a1a;padding:20px;border-radius:20px;width:100%;max-width:340px;text-align:center;color:#fff"><div>🎙️ Voice note '+vnSec+'s</div><audio controls src="'+vnUrl+'" style="width:100%;margin:10px 0"></audio><button id="vs" style="width:100%;padding:12px;border:0;border-radius:12px;background:#ff5a8a;color:#fff;font-weight:700">Send</button><button id="vd" style="width:100%;padding:12px;border:0;border-radius:12px;background:#333;color:#fff;margin-top:8px">Delete</button></div>';document.body.appendChild(o);document.getElementById('vd').onclick=function(){o.remove();vnUrl=null;};document.getElementById('vs').onclick=async function(){o.remove();try{var me=await fixGetUid();var other=window._fixOtherId||null;if(!other&&window.currentChatWith){var r=await window.supabase.from('profiles').select('user_id').eq('name',window.currentChatWith).maybeSingle();if(r&&r.data)other=r.data.user_id;}if(!other){alert('Could not find '+window.currentChatWith+', reopen chat and try again');return;}var e=(await window.supabase.from('chat_messages').insert([{sender_id:me,receiver_id:other,content:'VOICE:'+vnUrl}])).error;if(e)alert(e.message);else loadChat();}catch(e){alert(e.message);}};};rd.readAsDataURL(bl);}
setInterval(vnBtn,1000);


// Render VOICE: list=preview text, chat=small player
function vnRender(){
  var chatInput = document.querySelector("input[placeholder*='Ecris'],input[placeholder*='message'],input[placeholder*='Message']");
  var inChat = (chatInput == null) ? false : true;
  document.querySelectorAll('div').forEach(function(d){
    if(d.dataset.vnDone) return;
    if(d.querySelector('div')) return;
    var t = d.textContent || '';
    if(t.indexOf('VOICE:data:audio') > -1 && t.length > 200){
      var j = t.indexOf('VOICE:');
      var url = t.slice(j+6).trim();
      d.dataset.vnDone = '1';
      if(inChat == false){
        d.textContent = '🎤 Voice message';
      } else {
        d.innerHTML = '<audio controls src="'+url+'" style="width:170px;max-width:170px;height:32px;display:block"></audio>';
        d.style.cssText += ';padding:6px 8px;max-width:190px';
      }
    }
  });
}
setInterval(vnRender,800);
