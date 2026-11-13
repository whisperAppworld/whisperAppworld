code = open('script.js').read()
if 'likesLeft' not in code:
    code += """
// --- 30 LIKES / DAY SYSTEM ---
let likesLeft = 30;
function loadLikes() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem('whisper_like_date');
  const savedCount = localStorage.getItem('whisper_likes_left');
  if (savedDate !== today) {
    likesLeft = 30;
    localStorage.setItem('whisper_like_date', today);
    localStorage.setItem('whisper_likes_left', '30');
  } else if (savedCount !== null) {
    likesLeft = parseInt(savedCount);
  }
  updateLikesCircle();
}
function updateLikesCircle() {
  const ring = document.getElementById('likes-ring');
  const countEl = document.getElementById('likes-count');
  const label = document.getElementById('likes-label');
  if (!ring) return;
  const total = 138.2;
  const pct = likesLeft / 30;
  ring.style.strokeDashoffset = total * (1 - pct);
  ring.style.stroke = likesLeft === 0 ? '#FF6B9D' : '#6C63FF';
  if (countEl) countEl.textContent = likesLeft;
  if (label) label.textContent = likesLeft === 0 ? 'Out of Likes!' : likesLeft + ' Likes Left Today';
}
function useLike() {
  loadLikes();
  if (likesLeft <= 0) {
    if (confirm('Out of likes for today!\\nGo Premium for unlimited likes?')) {
      document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
      document.getElementById('premium').classList.add('active');
    }
    return false;
  }
  likesLeft--;
  localStorage.setItem('whisper_likes_left', String(likesLeft));
  updateLikesCircle();
  return true;
}
// Hook the reset link
document.addEventListener('DOMContentLoaded', function(){
  loadLikes();
  const r = document.getElementById('likes-reset');
  if (r) r.addEventListener('click', function(){
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById('premium').classList.add('active');
  });
});
// Call load on start too (if DOM already loaded)
loadLikes();
// Wrap original like: if your like button calls likedProfiles.push, we block when 0
// We patch by intercepting the Like button click
document.addEventListener('click', function(e){
  const btn = e.target.closest('button');
  if (!btn) return;
  const txt = (btn.textContent || '').toLowerCase();
  if (txt.includes('like') && !txt.includes('liked') && btn.id !== 'upgrade-btn') {
    // Only count if it's in Discover screen
    const disc = document.getElementById('discover');
    if (disc && disc.classList.contains('active')) {
      // If likes are 0, stop it - useLike will show popup
      if (likesLeft <= 0) {
        e.stopPropagation();
        e.preventDefault();
        useLike();
      }
    }
  }
});
"""
    # Also decrement when a like actually happens via Alex-like flow: patch the first likedProfiles.push to use like
    # We add a check before push in the main like handler by replacing first occurrence logic - simple: after push, decrement if not already
    # Instead, we hook: every time showLiked is called with new like, we decrement once - we do it via wrapping showLiked
    code = code.replace("function showLiked()", "let _lastLikedCount = 0;\nfunction showLiked() { if (likedProfiles.length > _lastLikedCount) { _lastLikedCount = likedProfiles.length; if (likesLeft > 0) { likesLeft--; localStorage.setItem('whisper_likes_left', String(likesLeft)); updateLikesCircle(); } }")
    open('script.js','w').write(code)
    print('LIKES SYSTEM ADDED')
else:
    print('ALREADY THERE')
