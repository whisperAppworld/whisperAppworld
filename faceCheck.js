let _detector = null, _landmarker = null, _vision = null;
async function loadFaceModels(){
  if(_detector) return true;
  const { FilesetResolver, FaceDetector, FaceLandmarker } = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.mjs");
  _vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm");
  _detector = await FaceDetector.createFromOptions(_vision, { baseOptions:{ modelAssetPath:"https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite", delegate:"GPU" }, runningMode:"IMAGE", minDetectionConfidence:0.5 });
  _landmarker = await FaceLandmarker.createFromOptions(_vision, { baseOptions:{ modelAssetPath:"https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task", delegate:"GPU" }, runningMode:"IMAGE", numFaces:3 });
  return true;
}
window.loadFaceModels = loadFaceModels;
function fileToImage(file){
  return new Promise((res,rej)=>{
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = ()=>{ URL.revokeObjectURL(url); res(img); };
    img.onerror = rej; img.src = url;
  });
}
function landmarksToVector(lm){
  // Normalize by face size + center, so pose/lighting don't fool it
  let cx=0, cy=0; lm.forEach(p=>{cx+=p.x; cy+=p.y;}); cx/=lm.length; cy/=lm.length;
  let scale=0; lm.forEach(p=>{scale+=Math.hypot(p.x-cx,p.y-cy);}); scale/=lm.length;
  const v=[]; lm.forEach(p=>{ v.push((p.x-cx)/scale, (p.y-cy)/scale); }); return v;
}
function distance(a,b){
  let s=0; for(let i=0;i<a.length;i++){ const d=a[i]-b[i]; s+=d*d; }
  return Math.sqrt(s/a.length);
}
window.checkPhotoIsOnlyYou = async function(file, refDescriptor){
  const timeout = new Promise((_,rej)=> setTimeout(()=>rej(new Error("timeout")), 8000));
  try{
    await Promise.race([loadFaceModels(), timeout]);
    const img = await fileToImage(file);
    const det = _detector.detect(img);
    if(!det.detections || det.detections.length===0) return {ok:false, msg:"No face found. Use a clear selfie with your face visible."};
    if(det.detections.length>1) return {ok:false, msg:"More than 1 person found ("+det.detections.length+"). Photos must be ONLY you."};
    const lmRes = _landmarker.detect(img);
    if(!lmRes.faceLandmarks || !lmRes.faceLandmarks.length) return {ok:false, msg:"Could not read face. Try a clearer photo."};
    const vec = landmarksToVector(lmRes.faceLandmarks[0]);
    if(!refDescriptor) return {ok:true, descriptor:vec, msg:"OK"};
    const dist = distance(vec, refDescriptor);
    const match = Math.max(0, Math.round((1 - dist*2.2)*100));
    console.log("Face distance:", dist, "match:", match+"%");
    if(dist > 0.28) return {ok:false, match, msg:"This photo does not match your main photo ("+match+"% match). All photos must be only you."};
    return {ok:true, descriptor:vec, match, msg:"OK"};
  }catch(e){
    console.error(e);
    if(e.message==="timeout") return {ok:false, msg:"Face check timed out (slow network). Please try again."};
    throw e;
  }
};
