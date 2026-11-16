(function(){
  var KEY='whisper_settings_v1';
  var defaults={inapp:true,sound:true,vibrate:true,lang:'English',visible:'Everyone'};
  function load(){ try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){return Object.assign({},defaults)} }
  function save(s){ localStorage.setItem(KEY,JSON.stringify(s)); return s; }
  var settings=load();
  window.whisperSettings=settings;
  var DICT={
    'Settings':{Spanish:'Ajustes',French:'Parametres'},
    'Notifications':{Spanish:'Notificaciones',French:'Notifications'},
    'Push Notifications':{Spanish:'Notificaciones push',French:'Notifications push'},
    'Alerts even when app is closed':{Spanish:'Alertas aunque la app este cerrada',French:'Alertes meme appli fermee'},
    'In-app Notifications':{Spanish:'Notificaciones en la app',French:'Notifications dans appli'},
    'Banners + sound inside the app':{Spanish:'Avisos + sonido dentro de la app',French:'Bannieres + son dans appli'},
    'Sound':{Spanish:'Sonido',French:'Son'},
    'Beep for new messages':{Spanish:'Pitido para mensajes nuevos',French:'Bip pour nouveaux messages'},
    'Vibration':{Spanish:'Vibracion',French:'Vibration'},
    'Buzz for new messages':{Spanish:'Vibrar para mensajes nuevos',French:'Vibrer pour nouveaux messages'},
    'Show my profile':{Spanish:'Mostrar mi perfil',French:'Afficher mon profil'},
    'Language':{Spanish:'Idioma',French:'Langue'},
    'Save Settings':{Spanish:'Guardar ajustes',French:'Enregistrer'},
    'Everyone':{Spanish:'Todos',French:'Tout le monde'},
    'Only Matches':{Spanish:'Solo coincidencias',French:'Seulement matchs'},
    'Hidden':{Spanish:'Oculto',French:'Masque'},
    'English':{Spanish:'Ingles',French:'Anglais'},
    'Spanish':{Spanish:'Espanol',French:'Espagnol'},
    'French':{Spanish:'Frances',French:'Francais'},
    'Discover':{Spanish:'Descubrir',French:'Decouvrir'},
    'People':{Spanish:'Personas',French:'Personnes'},
    'Matches':{Spanish:'Coincidencias',French:'Matchs'},
    'Messages':{Spanish:'Mensajes',French:'Messages'},
    'Whisper':{Spanish:'Susurro',French:'Murmure'},
    'Profile':{Spanish:'Perfil',French:'Profil'}
  };
  function tr(orig,lang){ if(lang==='English') return orig; return (DICT[orig]&&DICT[orig][lang])?DICT[orig][lang]:orig; }
  function applyLanguage(){
    var lang=settings.lang||'English';
    document.querySelectorAll('label, span, small, h2, button, option').forEach(function(el){
      if(!el.dataset.orig) el.dataset.orig=el.textContent.trim();
      var orig=el.dataset.orig;
      el.textContent=tr(orig,lang);
      if(el.tagName==='OPTION'&&el.dataset.orig) el.value=el.dataset.orig;
    });
    var sel=document.getElementById('s-lang'); if(sel) sel.value=lang;
    var vis=document.getElementById('s-visible'); if(vis) vis.value=settings.visible;
  }
  function playAlert(){
    if(!settings.inapp) return;
    try{ if(settings.vibrate&&navigator.vibrate) navigator.vibrate(60); }catch(e){}
    if(!settings.sound) return;
    try{
      var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
      var ctx=new AC(),o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value=880; g.gain.value=0.12;
      o.start(); o.stop(ctx.currentTime+0.15);
      setTimeout(function(){ctx.close()},250);
    }catch(e){}
  }
  window.whisperPlayAlert=playAlert; window.whisperTestAlert=playAlert;
  function syncUI(){
    var ids={ 't-inapp':'inapp','t-sound':'sound','t-vibrate':'vibrate' };
    Object.keys(ids).forEach(function(id){ var el=document.getElementById(id); if(el) el.checked=!!settings[ids[id]]; });
    var vis=document.getElementById('s-visible'); if(vis) vis.value=settings.visible;
    applyLanguage();
  }
  function bind(){
    syncUI();
    [['t-inapp','inapp'],['t-sound','sound'],['t-vibrate','vibrate']].forEach(function(pair){
      var el=document.getElementById(pair[0]);
      if(el&&!el.dataset.bound){ el.dataset.bound='1'; el.addEventListener('change',function(){ settings[pair[1]]=el.checked; save(settings); if(settings.inapp) playAlert(); }); }
    });
    var langSel=document.getElementById('s-lang');
    if(langSel&&!langSel.dataset.bound){ langSel.dataset.bound='1'; langSel.addEventListener('change',function(){ settings.lang=langSel.value; save(settings); applyLanguage(); }); }
    var visSel=document.getElementById('s-visible');
    if(visSel&&!visSel.dataset.bound){ visSel.dataset.bound='1'; visSel.addEventListener('change',function(){ settings.visible=visSel.value; save(settings); }); }
    document.querySelectorAll('button').forEach(function(btn){
      var txt=(btn.dataset.orig||btn.textContent||'').trim();
      if(txt==='Save Settings'&&!btn.dataset.bound){
        btn.dataset.bound='1'; btn.removeAttribute('onclick');
        btn.addEventListener('click',function(){
          var l=document.getElementById('s-lang'),v=document.getElementById('s-visible'),t=document.getElementById('t-inapp'),s=document.getElementById('t-sound'),vb=document.getElementById('t-vibrate');
          if(l) settings.lang=l.value; if(v) settings.visible=v.value; if(t) settings.inapp=t.checked; if(s) settings.sound=s.checked; if(vb) settings.vibrate=vb.checked;
          save(settings); syncUI();
          var old=btn.textContent;
          btn.textContent=settings.lang==='Spanish'?'Guardado!':settings.lang==='French'?'Enregistre!':'Saved!';
          setTimeout(function(){ applyLanguage(); },1200);
          playAlert();
        });
      }
    });
  }
  document.addEventListener('DOMContentLoaded',bind);
  setTimeout(bind,500); setTimeout(bind,1500);
})();
