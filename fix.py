import pathlib, re
p = pathlib.Path('chat-fix.js')
t = p.read_text()
old = 'fixEsc(m.content)'
assert old in t
new_js = "(m.content&&m.content.indexOf('IMG:')===0?'<img src="'+m.content.slice(4)+'" style="max-width:220px;border-radius:10px;display:block">':fixEsc(m.content))"
t = t.replace(old, new_js, 1)
new_photo = """photo.onclick=function(){
  var fi=document.createElement('input');
  fi.type='file'; fi.accept='image/*'; fi.setAttribute('capture','user');
  fi.onchange=function(){
    var f=fi.files[0]; if(!f) return;
    var img=new Image(); var url=URL.createObjectURL(f);
    img.onload=async function(){
      var c=document.createElement('canvas');
      var s=Math.min(1,800/Math.max(img.width,img.height));
      c.width=img.width*s; c.height=img.height*s;
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      var data=c.toDataURL('image/jpeg',0.7);
      var meId=await fixGetUid();
      if(!_fixOtherId){ await loadChat(); }
      var err=(await window.supabase.from('chat_messages').insert([{sender_id:meId, receiver_id:_fixOtherId, content:'IMG:'+data}])).error;
      if(err) alert('Send failed: '+err.message); else loadChat();
    };
    img.src=url;
  };
  fi.click();
};"""
t2, n = re.subn(r"photo\.onclick=function\(\)\{.*?;\s*\};", new_photo, t, count=1, flags=re.S)
assert n==1, 'photo not found'
p.write_text(t2)
print('done')
