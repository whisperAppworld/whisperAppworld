// WhisperChat Calls - WebRTC + Supabase Realtime signaling
let _pc=null, _localStream=null, _callWith=null, _callType='voice', _callChannel=null;

function ensureCallUI(){
  if(document.getElementById('call-overlay')) return;
  let d=document.createElement('div');
  d.id='call-overlay';
  d.style.cssText='display:none;position:fixed;inset:0;background:#111;z-index:10000;flex-direction:column;align-items:center;justify-content:center;color:white;padding:16px';
  d.innerHTML=`<h3 id="call-status" style="margin:8px">Calling...</h3>
  <video id="remote-video" autoplay playsinline style="width:100%;max-width:480px;background:#000;border-radius:16px;display:none"></video>
  <video id="local-video" autoplay muted playsinline style="width:120px;height:160px;object-fit:cover;border-radius:12px;margin-top:10px;display:none"></video>
  <audio id="remote-audio" autoplay playsinline></audio>
  <div style="display:flex;gap:12px;margin-top:18px">
    <button onclick="toggleMute()" id="btn-mute" style="padding:12px 16px;border-radius:999px;border:none;background:#333;color:white;font-size:18px">🎤</button>
    <button onclick="toggleCamera()" id="btn-cam" style="padding:12px 16px;border-radius:999px;border:none;background:#333;color:white;font-size:18px">📷</button>
    <button onclick="endCall()" style="padding:12px 20px;border-radius:999px;border:none;background:#e11d48;color:white;font-weight:800;font-size:16px">📞 End</button>
  </div>`;
  document.body.appendChild(d);
}
function myName(){ return localStorage.getItem('whisper_name')||localStorage.getItem('whisper_username')||'Me'; }
function otherName(){ try{ if(window.currentChatWith) return window.currentChatWith; let el=document.getElementById('chat-title'); if(el) return el.textContent.replace('Chat with ','').replace('Chat','').trim(); return _callWith||'Friend'; }catch(e){ return _callWith||'Friend'; } }
function showCallUI(txt){ ensureCallUI(); let o=document.getElementById('call-overlay'); o.style.display='flex'; document.getElementById('call-status').textContent=txt; }
function hideCallUI(){ let o=document.getElementById('call-overlay'); if(o) o.style.display='none'; }

function getSupabase(){ return window.supabaseClient||window.supabase||window._supabase; }

async function startCall(type){
  _callType=type;
  let t2=otherName();
  if(t2===''||t2==='Chat'){ alert('Open a chat first, then call.'); return; }
  _callWith=t2;
  if(_callChannel===null){ let sb=getSupabase(); if(sb){ _callChannel=sb.channel('whisper-calls-global'); _callChannel.subscribe(); } }
  showCallUI('Sending call request to '+t2+'...');
  sendSignal({type:'call-request', from:myName(), to:t2, callType:type});
  return;
}
async function startCallAfterAccepted(type){
  _callType=type;
  let target=otherName();
  if(!target||target==='Chat'){ alert('Open a chat first, then call.'); return; }
  _callWith=target;
  showCallUI((type==='video'?'📹 Video calling ':'📞 Calling ')+target+'...');
  if(type==='video') document.getElementById('local-video').style.display='block';
  try{
    _localStream=await navigator.mediaDevices.getUserMedia({audio:true, video:type==='video'});
    let lv=document.getElementById('local-video'); if(type==='video'){ lv.srcObject=_localStream; }
    await createPeer(true, target);
  }catch(e){ alert('Need mic/camera permission: '+e.message); hideCallUI(); }
}
function startVoiceCall(){ startCall('voice'); }
function startVideoCall(){ startCall('video'); }

async function createPeer(isCaller, target){
  _pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'}]});
  _localStream.getTracks().forEach(t=>_pc.addTrack(t,_localStream));
  _pc.ontrack=e=>{
    let rv=document.getElementById('remote-video'), ra=document.getElementById('remote-audio');
    if(_callType==='video'){ rv.style.display='block'; rv.srcObject=e.streams[0]; }
    else { ra.srcObject=e.streams[0]; }
    document.getElementById('call-status').textContent='Connected with '+target;
  };
  _pc.onicecandidate=e=>{
    if(e.candidate) sendSignal({type:'ice', candidate:e.candidate, from:myName(), to:target});
  };
  // Supabase Realtime signaling
  let sb=getSupabase();
  if(sb){
    _callChannel=sb.channel('whisper-calls-global');
    _callChannel.on('broadcast',{event:'call-signal'},({payload})=>{
      if(payload.to!==myName()) return;
      handleSignal(payload, target);
    }).subscribe();
  }
  if(isCaller){
    let offer=await _pc.createOffer(); await _pc.setLocalDescription(offer);
    sendSignal({type:'offer', sdp:offer, from:myName(), to:target, callType:_callType});
  }
}
function sendSignal(msg){
  let sb=getSupabase();
  if(sb && _callChannel===null){ _callChannel=sb.channel('whisper-calls-global'); _callChannel.subscribe(); }
  if(sb && _callChannel){ _callChannel.send({type:'broadcast', event:'call-signal', payload:msg}); }
  else { localStorage.setItem('whisper_call_signal', JSON.stringify({...msg, ts:Date.now()})); }
}
async function handleSignal(msg, target){
  if(!_pc) return;
  if(msg.type==='offer'){
    // Incoming handled in listenForCalls, ignore here if not in call
  } else if(msg.type==='answer'){
    await _pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
  } else if(msg.type==='ice'){
    try{ await _pc.addIceCandidate(new RTCIceCandidate(msg.candidate)); }catch(e){}
  }
}
function toggleMute(){
  if(!_localStream) return;
  let t=_localStream.getAudioTracks()[0]; if(t){ t.enabled=!t.enabled; document.getElementById('btn-mute').textContent=t.enabled?'🎤':'🔇'; }
}
function toggleCamera(){
  if(!_localStream) return;
  let t=_localStream.getVideoTracks()[0]; if(t){ t.enabled=!t.enabled; document.getElementById('btn-cam').textContent=t.enabled?'📷':'📷‍🚫'; }
}
function endCall(){
  try{ _pc?.close(); }catch(e){}
  try{ _localStream?.getTracks().forEach(t=>t.stop()); }catch(e){}
  _pc=null; _localStream=null;
  try{ _callChannel?.unsubscribe(); }catch(e){}
  hideCallUI();
}
function listenForCalls(){
  ensureCallUI();
  let sb=getSupabase();
  if(sb){
    let ch=sb.channel('whisper-calls-global');
    ch.on('broadcast',{event:'call-signal'}, async ({payload})=>{
      if(payload.to!==myName()) return; if(payload.type==='call-request'){ let ok=confirm('Call request from '+payload.from+' ('+(payload.callType==='video'?'video':'voice')+'). Accept?'); if(ok===false){ sendSignal({type:'call-declined', from:myName(), to:payload.from}); return; } sendSignal({type:'call-accepted', from:myName(), to:payload.from, callType:payload.callType}); return; } if(payload.type==='call-accepted'){ alert(payload.from+' accepted the call request'); _callType=payload.callType; startCallAfterAccepted(payload.callType); return; } if(payload.type==='call-declined'){ alert(payload.from+' declined the call request'); return; } if(payload.type!=='offer') return;
      let accept=true; alert('📞 Ringing... Incoming '+(payload.callType==='video'?'video':'voice')+' call from '+payload.from);
      if(!accept){ return; }
      _callWith=payload.from; _callType=payload.callType||'voice';
      showCallUI('Connecting with '+payload.from+'...');
      if(_callType==='video') document.getElementById('local-video').style.display='block';
      try{
        _localStream=await navigator.mediaDevices.getUserMedia({audio:true, video:_callType==='video'});
        if(_callType==='video') document.getElementById('local-video').srcObject=_localStream;
        _callChannel=ch;
        _pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'}]});
        _localStream.getTracks().forEach(t=>_pc.addTrack(t,_localStream));
        _pc.ontrack=e=>{
          if(_callType==='video'){ let rv=document.getElementById('remote-video'); rv.style.display='block'; rv.srcObject=e.streams[0]; }
          else document.getElementById('remote-audio').srcObject=e.streams[0];
          document.getElementById('call-status').textContent='Connected with '+payload.from;
        };
        _pc.onicecandidate=e=>{ if(e.candidate) sendSignal({type:'ice', candidate:e.candidate, from:myName(), to:payload.from}); };
        await _pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        let ans=await _pc.createAnswer(); await _pc.setLocalDescription(ans);
        sendSignal({type:'answer', sdp:ans, from:myName(), to:payload.from});
      }catch(e){ alert('Mic/camera needed: '+e.message); hideCallUI(); }
    }).subscribe();
    _callChannel=ch;
  }
}
document.addEventListener('DOMContentLoaded', ()=>{ setTimeout(listenForCalls, 1500); });
