// WhisperChat Calls - WebRTC + Supabase Realtime signaling - FIXED
// Fix: ONE shared channel 'whisper-calls' for everyone, filter by payload.to
let _pc=null, _localStream=null, _callWith=null, _callType='voice', _callChannel=null, _pendingIce=[], _inCall=false;

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
function myName(){ return localStorage.getItem('whisper_name')||localStorage.getItem('whisper_username')||localStorage.getItem('whisper_display_name')||'Me'; }
function otherName(){ try{ if(window.currentChatWith) return window.currentChatWith; let el=document.getElementById('chat-title'); if(el) return el.textContent.replace('Chat with ','').replace('Chat','').trim(); return _callWith||'Friend'; }catch(e){ return _callWith||'Friend'; } }
function showCallUI(txt){ ensureCallUI(); let o=document.getElementById('call-overlay'); o.style.display='flex'; document.getElementById('call-status').textContent=txt; }
function hideCallUI(){ let o=document.getElementById('call-overlay'); if(o) o.style.display='none'; }
function getSupabase(){ return window.supabase || window.supabaseClient || window._supabase; }

function makePeer(target){
  _pc=new RTCPeerConnection({iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]});
  _localStream.getTracks().forEach(t=>_pc.addTrack(t,_localStream));
  _pc.ontrack=e=>{
    let rv=document.getElementById('remote-video'), ra=document.getElementById('remote-audio');
    if(_callType==='video'){ rv.style.display='block'; rv.srcObject=e.streams[0]; }
    else { ra.srcObject=e.streams[0]; }
    document.getElementById('call-status').textContent='Connected with '+target;
  };
  _pc.onicecandidate=e=>{ if(e.candidate) sendSignal({type:'ice', candidate:e.candidate, from:myName(), to:target}); };
  _pc.onconnectionstatechange=()=>{ if(_pc && (_pc.connectionState==='failed'||_pc.connectionState==='disconnected')) document.getElementById('call-status').textContent='Connection lost...'; };
  return _pc;
}
async function flushIce(){
  while(_pendingIce.length && _pc){
    let c=_pendingIce.shift();
    try{ await _pc.addIceCandidate(new RTCIceCandidate(c)); }catch(e){}
  }
}
function sendSignal(msg){
  let sb=getSupabase();
  if(sb && _callChannel){ _callChannel.send({type:'broadcast', event:'call-signal', payload:msg}); }
  else { localStorage.setItem('whisper_call_signal', JSON.stringify({...msg, ts:Date.now()})); }
  console.log('[call] sent', msg.type, 'to', msg.to);
}
async function startCall(type){
  _callType=type;
  let target=otherName();
  if(!target||target==='Chat'){ alert('Open a chat first, then call.'); return; }
  if(_inCall){ alert('You are already in a call'); return; }
  _callWith=target; _inCall=true; _pendingIce=[];
  showCallUI((type==='video'?'📹 Video calling ':'📞 Calling ')+target+'...');
  if(type==='video') document.getElementById('local-video').style.display='block';
  try{
    _localStream=await navigator.mediaDevices.getUserMedia({audio:true, video:type==='video'});
    let lv=document.getElementById('local-video'); if(type==='video'){ lv.srcObject=_localStream; }
    makePeer(target);
    let offer=await _pc.createOffer(); await _pc.setLocalDescription(offer);
    sendSignal({type:'offer', sdp:offer, from:myName(), to:target, callType:_callType});
  }catch(e){ alert('Need mic/camera permission: '+e.message); endCall(); }
}
function startVoiceCall(){ startCall('voice'); }
function startVideoCall(){ startCall('video'); }
function toggleMute(){
  if(!_localStream) return;
  let t=_localStream.getAudioTracks()[0]; if(t){ t.enabled=!t.enabled; document.getElementById('btn-mute').textContent=t.enabled?'🎤':'🔇'; }
}
function toggleCamera(){
  if(!_localStream) return;
  let t=_localStream.getVideoTracks()[0]; if(t){ t.enabled=!t.enabled; document.getElementById('btn-cam').textContent=t.enabled?'📷':'📷‍🚫'; }
}
function endCall(sendEnd){
  if(sendEnd!==false && _callWith){ try{ sendSignal({type:'end', from:myName(), to:_callWith}); }catch(e){} }
  try{ _pc?.close(); }catch(e){}
  try{ _localStream?.getTracks().forEach(t=>t.stop()); }catch(e){}
  _pc=null; _localStream=null; _callWith=null; _inCall=false; _pendingIce=[];
  let rv=document.getElementById('remote-video'); if(rv){ rv.srcObject=null; rv.style.display='none'; }
  let lv=document.getElementById('local-video'); if(lv){ lv.srcObject=null; lv.style.display='none'; }
  let ra=document.getElementById('remote-audio'); if(ra) ra.srcObject=null;
  hideCallUI();
}
function listenForCalls(){
  ensureCallUI();
  let sb=getSupabase();
  if(!sb){ console.warn('[call] no supabase, retrying'); setTimeout(listenForCalls, 2000); return; }
  if(_callChannel) return;
  _callChannel=sb.channel('whisper-calls');
  _callChannel.on('broadcast',{event:'call-signal'}, async ({payload})=>{
    console.log('[call] got', payload.type, 'from', payload.from, 'to', payload.to, 'me=', myName());
    if(!payload || payload.to!==myName()) return;
    if(payload.type==='offer'){
      if(_inCall) return;
      let accept=confirm('📞 Incoming '+(payload.callType==='video'?'video':'voice')+' call from '+payload.from+'. Accept?');
      if(!accept){ sendSignal({type:'declined', from:myName(), to:payload.from}); return; }
      _callWith=payload.from; _callType=payload.callType||'voice'; _inCall=true; _pendingIce=[];
      showCallUI('Connecting with '+payload.from+'...');
      if(_callType==='video') document.getElementById('local-video').style.display='block';
      try{
        _localStream=await navigator.mediaDevices.getUserMedia({audio:true, video:_callType==='video'});
        if(_callType==='video') document.getElementById('local-video').srcObject=_localStream;
        makePeer(payload.from);
        await _pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
        await flushIce();
        let ans=await _pc.createAnswer(); await _pc.setLocalDescription(ans);
        sendSignal({type:'answer', sdp:ans, from:myName(), to:payload.from});
      }catch(e){ alert('Mic/camera needed: '+e.message); endCall(false); }
    } else if(payload.type==='answer'){
      if(!_pc) return;
      await _pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      await flushIce();
    } else if(payload.type==='ice'){
      if(!_pc){ _pendingIce.push(payload.candidate); return; }
      if(!_pc.remoteDescription){ _pendingIce.push(payload.candidate); return; }
      try{ await _pc.addIceCandidate(new RTCIceCandidate(payload.candidate)); }catch(e){}
    } else if(payload.type==='declined'){
      alert(payload.from+' declined the call'); endCall(false);
    } else if(payload.type==='end'){
      alert(payload.from+' ended the call'); endCall(false);
    }
  }).subscribe((s)=>console.log('[call] channel status', s));
}
document.addEventListener('DOMContentLoaded', ()=>{ setTimeout(listenForCalls, 1500); });
// also try immediately if DOM already ready
if(document.readyState!=='loading') setTimeout(listenForCalls, 1500);
