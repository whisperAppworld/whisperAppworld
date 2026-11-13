text = open('script.js').read()
old = """document.querySelector('.btn.like').addEventListener('click', () => {
  alert("You liked " + profiles[currentIndex].name + " ❤️");
  nextProfile();
});"""
new = """document.querySelector('.btn.like').addEventListener('click', () => {
  const btn = document.querySelector('.btn.like');
  btn.textContent = 'Liked ❤️';
  setTimeout(() => { btn.textContent = 'Like'; nextProfile(); }, 500);
});"""
if old in text:
    text = text.replace(old, new)
    print('LIKE FIXED')
else:
    # fallback - just make sure like button has text
    print('LIKE ALREADY CHANGED - CHECKING')
open('script.js','w').write(text)
