// faceCheck.js - Photo Must Be Only You
let _faceLoaded = false;
async function loadFaceModels(){
  if(_faceLoaded) return;
  const URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(URL)
  ]);
  _faceLoaded = true;
}
function faceSimilarity(a,b){
  let dot=0, ma=0, mb=0;
  for(let i=0;i<a.length;i++){ dot+=a[i]*b[i]; ma+=a[i]*a[i]; mb+=b[i]*b[i]; }
  return dot / (Math.sqrt(ma)*Math.sqrt(mb));
}
async function checkPhotoIsOnlyYou(file, referenceDescriptor){
  await loadFaceModels();
  const img = await faceapi.bufferToImage(file);
  const det = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
  if(det.length===0) return {ok:false, msg:'No face found. Photo must show YOUR face.'};
  if(det.length>1) return {ok:false, msg:'More than 1 person found. Photo must be ONLY you.'};
  const desc = Array.from(det[0].descriptor);
  if(!referenceDescriptor) return {ok:true, descriptor:desc, match:100};
  const sim = faceSimilarity(desc, referenceDescriptor);
  const match = Math.round(sim*100);
  if(match < 85) return {ok:false, match, msg:'This photo does not match your main photo ('+match+'% match). All photos must be only you.'};
  return {ok:true, descriptor:desc, match};
}
window.checkPhotoIsOnlyYou = checkPhotoIsOnlyYou;
window.loadFaceModels = loadFaceModels;
