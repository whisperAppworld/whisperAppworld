const FP_KEY = "h_Z69XM3qPSbr8QzXjkULzyKzOLHgfpQ";
const FP_SECRET = "YnMu7kCsxHUv3R2GBkwz52bYCy_Q59hq";
const FP_API = "https://api-us.faceplusplus.com/facepp/v3";

function fileToBase64(file){
  return new Promise((res,rej)=>{
    const r = new FileReader();
    r.onload = ()=> res(r.result.split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
async function fpDetect(b64){
  const fd = new FormData();
  fd.append('api_key', FP_KEY);
  fd.append('api_secret', FP_SECRET);
  fd.append('image_base64', b64);
  const r = await fetch(FP_API + '/detect', { method:'POST', body: fd });
  const j = await r.json();
  if(j.error_message) throw new Error(j.error_message);
  return j;
}
async function fpCompare(b64_1, b64_2){
  const fd = new FormData();
  fd.append('api_key', FP_KEY);
  fd.append('api_secret', FP_SECRET);
  fd.append('image_base64_1', b64_1);
  fd.append('image_base64_2', b64_2);
  const r = await fetch(FP_API + '/compare', { method:'POST', body: fd });
  const j = await r.json();
  if(j.error_message) throw new Error(j.error_message);
  return j;
}
window.checkPhotoIsOnlyYou = async function(file, refDescriptor){
  try{
    const b64 = await fileToBase64(file);
    const det = await fpDetect(b64);
    const n = det.faces ? det.faces.length : 0;
    if(n===0) return {ok:false, msg:"No face found. Use a clear selfie with your face visible."};
    if(n>1) return {ok:false, msg:"More than 1 person found ("+n+"). Photos must be ONLY you."};
    if(!refDescriptor) return {ok:true, descriptor:b64, msg:"OK"};
    const cmp = await fpCompare(refDescriptor, b64);
    const conf = cmp.confidence || 0;
    console.log("Face++ confidence:", conf, cmp);
    if(conf < 72) return {ok:false, match: Math.round(conf), msg:"This photo does not match your main photo ("+Math.round(conf)+"% match). All photos must be only you."};
    return {ok:true, descriptor:b64, match: Math.round(conf), msg:"OK"};
  }catch(e){
    console.error(e);
    return {ok:false, msg:"Face check failed: "+e.message+". Try again."};
  }
};
