// WhisperChat Calls - WebRTC + Supabase DB signalling (no Realtime needed)
let _pc=null, _localStream=null, _callWith=null, _callType='voice', _pendingIce=[], _inCall=false, _lastSignalId=0, _pollTimer=null;

function ensureCallUI(){
  if(document.getElementById('call-overlay')) return;
  let d=document.createElement('div');
  d.id='call-overlay';
  d.style.cssText='display:none;position:fixed;inset:0;background:#111;z-index:10000;flex-direction:column;align-items:center;justify-content:center;color:white;padding:16px';
  d.innerHTML=`<h3 id="call-status" style="margin:8px">Calling...</h3>
  <video id="remote-video" autoplay playsinline style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000;border-radius:16px;display:none"></video>
  <video id="local-video" autoplay muted playsinline style="position:absolute;top:16px;right:16px;width:110px;height:150px;object-fit:cover;border-radius:12px;border:2px solid white;z-index:2;display:none"></video>
  <audio id="remote-audio" autoplay playsinline></audio>
  <div style="display:flex;gap:12px;margin-top:18px">
    <button onclick="toggleMute()" id="btn-mute" style="padding:12px 16px;border-radius:999px;border:none;background:#333;color:white;font-size:18px">🎤</button>
    <button onclick="toggleCamera()" id="btn-cam" style="padding:12px 16px;border-radius:999px;border:none;background:#333;color:white;font-size:18px">📷</button>
    <button onclick="endCall()" style="padding:12px 20px;border-radius:999px;border:none;background:#e11d48;color:white;font-weight:800;font-size:16px">📞 End</button>
  </div>`;
  document.body.appendChild(d);
}
function norm(s){ return (s||'').toString().trim().toLowerCase(); }
function myName(){
  try{ if(typeof getMyName==='function'){ var n=getMyName(); if(n && n!=='Me') return String(n).trim(); } }catch(e){}
  try{ var s=document.getElementById('send-as'); if(s && s.value) return s.value.trim(); }catch(e){}
  try{ var pr=JSON.parse(localStorage.getItem('my_profile')||'{}'); if(pr && pr.name) return String(pr.name).trim(); }catch(e){}
  return 'Me';
}
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
  return _pc;
}
async function flushIce(){
  while(_pendingIce.length && _pc){
    let c=_pendingIce.shift();
    try{ await _pc.addIceCandidate(new RTCIceCandidate(c)); }catch(e){}
  }
}
async function sendSignal(msg){
  console.log('[call] SEND', msg.type, 'to', msg.to, 'from', msg.from);
  let sb=getSupabase();
  if(!sb) return;
  let {error} = await sb.from('call_signals').insert([{from_name:msg.from, to_name:msg.to, type:msg.type, sdp:msg.sdp ? (typeof msg.sdp==='string' ? msg.sdp : JSON.stringify(msg.sdp)) : null, candidate:msg.candidate||null, call_type:msg.callType||_callType||null}]);
  if(error) console.error('[call] insert failed', error); let pe=document.getElementById('call-debug'); if(pe) pe.textContent='SEND '+(error?'FAILED: '+error.message : 'OK to '+msg.to);
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
    await sendSignal({type:'offer', sdp:offer, from:myName(), to:target, callType:_callType});
  }catch(e){ alert('Need mic/camera permission: '+e.message); endCall(false); }
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
  if(sendEnd!==false && _callWith){ sendSignal({type:'end', from:myName(), to:_callWith}); }
  try{ _pc?.close(); }catch(e){}
  try{ _localStream?.getTracks().forEach(t=>t.stop()); }catch(e){}
  _pc=null; _localStream=null; _callWith=null; _inCall=false; _pendingIce=[];
  let rv=document.getElementById('remote-video'); if(rv){ rv.srcObject=null; rv.style.display='none'; }
  let lv=document.getElementById('local-video'); if(lv){ lv.srcObject=null; lv.style.display='none'; }
  let ra=document.getElementById('remote-audio'); if(ra) ra.srcObject=null;
  hideCallUI();
}
function parseSdp(s){ if(!s) return null; if(typeof s==='string'){ try{ let j=JSON.parse(s); return j; }catch(e){ return {type:'offer', sdp:s}; } } return s; }
async function handleSignal(payload){
  if(!payload || norm(payload.to_name)!==norm(myName())) return;
  console.log('[call] GOT', payload.type, 'from', payload.from_name);
  if(payload.type==='offer'){
    if(_inCall) return;
    let accept=confirm('📞 Incoming '+(payload.call_type==='video'?'video':'voice')+' call from '+payload.from_name+'. Accept?');
    if(!accept){ await sendSignal({type:'declined', from:myName(), to:payload.from_name}); return; }
    _callWith=payload.from_name; _callType=payload.call_type||'voice'; _inCall=true; _pendingIce=[];
    showCallUI('Connecting with '+payload.from_name+'...');
    if(_callType==='video') document.getElementById('local-video').style.display='block';
    try{
      _localStream=await navigator.mediaDevices.getUserMedia({audio:true, video:_callType==='video'});
      if(_callType==='video') document.getElementById('local-video').srcObject=_localStream;
      makePeer(payload.from_name);
      await _pc.setRemoteDescription(new RTCSessionDescription(parseSdp(payload.sdp)));
      await flushIce();
      let ans=await _pc.createAnswer(); await _pc.setLocalDescription(ans);
      await sendSignal({type:'answer', sdp:ans, from:myName(), to:payload.from_name});
    }catch(e){ alert('Mic/camera needed: '+e.message); endCall(false); }
  } else if(payload.type==='answer'){
    if(!_pc) return;
    await _pc.setRemoteDescription(new RTCSessionDescription(parseSdp(payload.sdp)));
    await flushIce();
  } else if(payload.type==='ice'){
    if(!_pc || !_pc.remoteDescription){ _pendingIce.push(payload.candidate); return; }
    try{ await _pc.addIceCandidate(new RTCIceCandidate(payload.candidate)); }catch(e){}
  } else if(payload.type==='declined'){
    alert(payload.from_name+' declined the call'); endCall(false);
  } else if(payload.type==='end'){
    alert(payload.from_name+' ended the call'); endCall(false);
  }
}
async function pollSignals(){
  let sb=getSupabase();
  if(!sb) return;
  let {data, error} = await sb.from('call_signals').select('*').gt('id', _lastSignalId).order('id',{ascending:true}).limit(50);
  if(error){ console.warn('[call] poll error', error.message); return; }
  if(!data || !data.length) return;
  for(let row of data){
    _lastSignalId=Math.max(_lastSignalId, row.id);
    await handleSignal(row);
  }
}
function listenForCalls(){
  ensureCallUI();
  // start from latest id so old rows don't re-ring
  getSupabase().from('call_signals').select('id').order('id',{ascending:false}).limit(1).then(({data})=>{ if(data&&data[0]) _lastSignalId=data[0].id; });
  if(_pollTimer) clearInterval(_pollTimer);
  _pollTimer=setInterval(pollSignals, 1500);
  console.log('[call] polling started, myName=', myName());
}
document.addEventListener('DOMContentLoaded', ()=>{ setTimeout(listenForCalls, 1500); });
if(document.readyState!=='loading') setTimeout(listenForCalls, 1500);

// --- Mobile debug pill ---
(function(){
  function showDebug(){
    let el=document.getElementById('call-debug');
    if(!el){ el=document.createElement('div'); el.id='call-debug';
      el.style.cssText='position:fixed;bottom:8px;left:8px;z-index:99999;background:#000;color:#0f0;font-size:11px;padding:6px 8px;border-radius:8px;opacity:0.85;max-width:90vw;word-break:break-all';
      document.body.appendChild(el);
    }
    el.textContent='myName=' + myName() + ' | polling...';
    el.onclick=()=>{ alert('myName='+myName()); };
  }
  setTimeout(showDebug, 2000);
  setInterval(showDebug, 5000);
})();
document.addEventListener('click', async ()=>{ try{ let s=await navigator.mediaDevices.getUserMedia({audio:true,video:true}); s.getTracks().forEach(t=>t.stop()); }catch(e){} }, {once:true});
