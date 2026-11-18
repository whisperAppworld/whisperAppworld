
// WhisperChat Calls - WebRTC + Supabase Realtime signaling (fixed)
let _pc=null, _localStream=null, _callWith=null, _callType='voice', _callChannel=null, _channelReady=null, _listening=false, _inCall=false;

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
function otherName(){
  try{
    if(window.currentChatWith) return window.currentChatWith;
    let el=document.getElementById('chat-title');
    if(el){ let t=el.textContent.replace('Chat with ','').replace('Chat','').trim(); if(t) return t; }
    return _callWith||'';
  }catch(e){ return _callWith||''; }
}
function showCallUI(txt){ ensureCallUI(); let o=document.getElementById('call-overlay'); o.style.display='flex'; document.getElementById('call-status').textContent=txt; }
function hideCallUI(){ let o=document.getElementById('call-overlay'); if(o) o.style.display='none'; }
function getSupabase(){ return window.supabaseClient||window.supabase||window._supabase; }

// ONE shared channel, wait for SUBSCRIBED before sending
async function getChannel(){
  if(_channelReady) return _channelReady;
  _channelReady = new Promise((resolve)=>{
    let sb=getSupabase();
    if(!sb){ resolve(null); return; }
    _callChannel = sb.channel('whisper-calls-global');
    _callChannel.on('broadcast',{event:'call-signal'}, async ({payload})=>{
      if(!payload || payload.to!==myName()) return;
      await handleSignal(payload);
    });
    _callChannel.subscribe((status)=>{
      if(status==='SUBSCRIBED') resolve(_callChannel);
    });
    setTimeout(()=>resolve(_callChannel), 3000); // fallback, don't hang forever
  });
  return _channelReady;
}
async function sendSignal(msg){
  let ch = await getChannel();
  if(ch){ try{ await ch.send({type:'broadcast', event:'call-signal', payload:msg}); return; }catch(e){} }
  localStorage.setItem('whisper_call_signal', JSON.stringify({...msg, ts:Date.now()}));
}
async function startCall(type){
  _callType=type;
  let t2=otherName();
  if(!t2){ alert('Open a chat first, then call.'); return; }
  if(t2===myName()){ alert('You cannot call yourself. Check the chat name.'); return; }
  _callWith=t2;
  showCallUI('Sending call request to '+t2+'...');
  await getChannel();
  await sendSignal({type:'call-request', from:myName(), to:t2, callType:type});
}
function startVoiceCall(){ startCall('voice'); }
function startVideoCall(){ startCall('video'); }

async function startCallAfterAccepted(type){
  _callType=type; _inCall=true;
  let target=_callWith||otherName();
  showCallUI((type==='video'?'📹 Video calling ':'📞 Calling ')+target+'...');
  if(type==='video') document.getElementById('local-video').style.display='block';
  try{
    _localStream=await navigator.mediaDevices.getUserMedia({audio:true, video:type==='video'});
    if(type==='video') document.getElementById('local-video').srcObject=_localStream;
    await createPeer(true, target);
  }catch(e){ alert('Need mic/camera permission: '+e.message); hideCallUI(); _inCall=false; }
}
async function createPeer(isCaller, target){
  _pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'}]});
  _localStream.getTracks().forEach(t=>_pc.addTrack(t,_localStream));
  _pc.ontrack=e=>{
    let rv=document.getElementById('remote-video'), ra=document.getElementById('remote-audio');
    if(_callType==='video'){ rv.style.display='block'; rv.srcObject=e.streams[0]; }
    else { ra.srcObject=e.streams[0]; }
    document.getElementById('call-status').textContent='Connected with '+target;
  };
  _pc.onicecandidate=e=>{ if(e.candidate) sendSignal({type:'ice', candidate:e.candidate, from:myName(), to:target}); };
  if(isCaller){
    let offer=await _pc.createOffer(); await _pc.setLocalDescription(offer);
    await sendSignal({type:'offer', sdp:offer, from:myName(), to:target, callType:_callType});
  }
}
async function handleSignal(msg){
  if(msg.type==='call-request'){
    if(_inCall) return;
    let ok=confirm('Call request from '+msg.from+' ('+(msg.callType==='video'?'video':'voice')+'). Accept?');
    if(!ok){ await sendSignal({type:'call-declined', from:myName(), to:msg.from}); return; }
    _callWith=msg.from; _callType=msg.callType||'voice';
    await sendSignal({type:'call-accepted', from:myName(), to:msg.from, callType:_callType});
    return;
  }
  if(msg.type==='call-accepted'){ _callType=msg.callType||_callType; startCallAfterAccepted(_callType); return; }
  if(msg.type==='call-declined'){ alert(msg.from+' declined the call request'); hideCallUI(); return; }
  if(msg.type==='offer'){
    if(_inCall) return;
    _inCall=true; _callWith=msg.from; _callType=msg.callType||'voice';
    showCallUI('Connecting with '+msg.from+'...');
    if(_callType==='video') document.getElementById('local-video').style.display='block';
    try{
      _localStream=await navigator.mediaDevices.getUserMedia({audio:true, video:_callType==='video'});
      if(_callType==='video') document.getElementById('local-video').srcObject=_localStream;
      _pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'}]});
      _localStream.getTracks().forEach(t=>_pc.addTrack(t,_localStream));
      _pc.ontrack=e=>{
        if(_callType==='video'){ let rv=document.getElementById('remote-video'); rv.style.display='block'; rv.srcObject=e.streams[0]; }
        else document.getElementById('remote-audio').srcObject=e.streams[0];
        document.getElementById('call-status').textContent='Connected with '+msg.from;
      };
      _pc.onicecandidate=e=>{ if(e.candidate) sendSignal({type:'ice', candidate:e.candidate, from:myName(), to:msg.from}); };
      await _pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
      let ans=await _pc.createAnswer(); await _pc.setLocalDescription(ans);
      await sendSignal({type:'answer', sdp:ans, from:myName(), to:msg.from});
    }catch(e){ alert('Mic/camera needed: '+e.message); hideCallUI(); _inCall=false; }
    return;
  }
  if(!_pc) return;
  if(msg.type==='answer'){ try{ await _pc.setRemoteDescription(new RTCSessionDescription(msg.sdp)); }catch(e){} }
  if(msg.type==='ice'){ try{ await _pc.addIceCandidate(new RTCIceCandidate(msg.candidate)); }catch(e){} }
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
  _pc=null; _localStream=null; _inCall=false;
  hideCallUI();
}
async function listenForCalls(){
  if(_listening) return; _listening=true;
  ensureCallUI();
  await getChannel(); // subscribes once, handler is inside getChannel
  console.log('Whisper calls listening as', myName());
}
document.addEventListener('DOMContentLoaded', ()=>{ setTimeout(listenForCalls, 800); });
