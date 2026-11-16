(function(){
  var KEY='whisper_settings_v1';
  var defaults={inapp:true,sound:true,vibrate:true,lang:'English',visible:'Everyone'};
  function load(){ try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){return Object.assign({},defaults)} }
  function save(s){ localStorage.setItem(KEY,JSON.stringify(s)); return s; }
  var settings=load();
  window.whisperSettings=settings;
  var D={
  'Settings':['Ajustes','Parametres'],
  'Notifications':['Notificaciones','Notifications'],
  'Push Notifications':['Notificaciones push','Notifications push'],
  'Alerts even when app is closed':['Alertas aunque la app este cerrada','Alertes meme appli fermee'],
  'In-app Notifications':['Notificaciones en la app','Notifications dans appli'],
  'Banners + sound inside the app':['Avisos + sonido dentro de la app','Bannieres + son dans appli'],
  'Sound':['Sonido','Son'],
  'Beep for new messages':['Pitido para mensajes nuevos','Bip pour nouveaux messages'],
  'Vibration':['Vibracion','Vibration'],
  'Buzz for new messages':['Vibrar para mensajes nuevos','Vibrer pour nouveaux messages'],
  'Show my profile':['Mostrar mi perfil','Afficher mon profil'],
  'Language':['Idioma','Langue'],
  'Save Settings':['Guardar ajustes','Enregistrer'],
  'Saved!':['Guardado!','Enregistre!'],
  'Everyone':['Todos','Tout le monde'],
  'Only Matches':['Solo coincidencias','Seulement matchs'],
  'Hidden':['Oculto','Masque'],
  'English':['Ingles','Anglais'],
  'Spanish':['Espanol','Espagnol'],
  'French':['Frances','Francais'],
  'Discover':['Descubrir','Decouvrir'],
  'People':['Personas','Personnes'],
  'Matches':['Coincidencias','Matchs'],
  'Messages':['Mensajes','Messages'],
  'Whisper':['Susurro','Murmure'],
  'Profile':['Perfil','Profil'],
  'People by Country':['Personas por pais','Personnes par pays'],
  'Your Name':['Tu nombre','Ton nom'],
  'Age':['Edad','Age'],
  'Login / Sign Up':['Iniciar sesion / Registrarse','Connexion / Inscription'],
  'Login':['Iniciar sesion','Connexion'],
  'Sign Up':['Registrarse','Inscription'],
  'Logout':['Cerrar sesion','Deconnexion'],
  'Logged in as':['Conectado como','Connecte en tant que'],
  'Profile Photos':['Fotos de perfil','Photos de profil'],
  'About You':['Sobre ti','A propos de toi'],
  'Your name':['Tu nombre','Ton nom'],
  'Gender':['Genero','Genre'],
  'Female':['Mujer','Femme'],
  'Male':['Hombre','Homme'],
  'Other':['Otro','Autre'],
  'Looking for':['Buscando','Recherche'],
  'Anyone':['Cualquiera','Tout le monde'],
  'Relationship status':['Estado civil','Statut relationnel'],
  'Single':['Soltero','Celibataire'],
  'In a relationship':['En una relacion','En couple'],
  'Engaged':['Comprometido','Fiance'],
  'Married':['Casado','Marie'],
  'Bio - about you...':['Biografia - sobre ti...','Bio - a propos de toi...'],
  'Interests - e.g. Music, Football, Movies':['Intereses - p. ej. Musica, Futbol, Peliculas','Centres d\'interet - ex. Musique, Foot, Films'],
  'Language - e.g. Spanish, English, French':['Idioma - p. ej. Espanol, Ingles, Frances','Langue - ex. Espagnol, Anglais, Francais'],
  'Save Profile':['Guardar perfil','Enregistrer profil'],
  'Make it beautiful, get more matches':['Hazlo bonito, consigue mas coincidencias','Rends-le beau, obtiens plus de matchs'],
  'Send Whisper':['Enviar susurro','Envoyer murmure'],
  'Write a whisper...':['Escribe un susurro...','Ecris un murmure...'],
  'Chat':['Chat','Discussion'],
  'No messages yet.':['Aun no hay mensajes.','Aucun message pour le moment.'],
  'No matches yet. Like people in Discover.':['Aun no hay coincidencias. Dale me gusta a personas en Descubrir.','Aucun match. Aime des personnes dans Decouvrir.'],
  'Type a message...':['Escribe un mensaje...','Ecris un message...'],
  'Send':['Enviar','Envoyer'],
  'Close':['Cerrar','Fermer'],
  'People Near You':['Personas cerca de ti','Personnes pres de toi'],
  'Loading people...':['Cargando personas...','Chargement des personnes...'],
  'Likes left today':['Me gusta restantes hoy','Likes restants aujourd\'hui'],
  'All Countries':['Todos los paises','Tous les pays'],
  'Email':['Correo','Email'],
  'Password':['Contrasena','Mot de passe'],
  'Country - City e.g. Equatorial Guinea - Malabo':['Pais - Ciudad p. ej. Guinea Ecuatorial - Malabo','Pays - Ville ex. Guinee equatoriale - Malabo']
  };
  function tr(orig,lang){
    if(lang==='English'||!orig) return orig;
    var i=lang==='Spanish'?0:1;
    if(D[orig]) return D[orig][i];
    return orig;
  }
  var isApplying=false;
  var observer=null;
  function applyLanguage(){
    if(isApplying) return;
    isApplying=true;
    if(observer) observer.disconnect();
    try{
      var lang=settings.lang||'English';
      // ONLY leaf elements - never div/a/li that contain other HTML
      document.querySelectorAll('label, span, small, h2, h3, p, button, option').forEach(function(el){
        if(el.children.length>0) return;
        var txt=el.textContent.trim();
        if(!txt) return;
        if(!el.dataset.orig) el.dataset.orig=txt;
        var orig=el.dataset.orig;
        var next=lang==='English'?orig:tr(orig,lang);
        if(el.textContent!==next) el.textContent=next;
      });
      document.querySelectorAll('[placeholder]').forEach(function(el){
        if(!el.dataset.phOrig) el.dataset.phOrig=el.getAttribute('placeholder')||'';
        var o=el.dataset.phOrig; if(!o) return;
        var next=lang==='English'?o:tr(o,lang);
        if(el.getAttribute('placeholder')!==next) el.setAttribute('placeholder',next);
      });
      var sel=document.getElementById('s-lang'); if(sel) sel.value=lang;
      var vis=document.getElementById('s-visible'); if(vis) vis.value=settings.visible;
    }catch(e){ console.log('lang error',e); }
    // Re-attach observer AFTER, with debounce
    setTimeout(function(){
      isApplying=false;
      if(observer) observer.observe(document.body,{childList:true,subtree:true});
    },100);
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
    ['t-inapp','t-sound','t-vibrate'].forEach(function(id){
      var el=document.getElementById(id); if(!el) return;
      var key=id==='t-inapp'?'inapp':id==='t-sound'?'sound':'vibrate';
      el.checked=!!settings[key];
    });
    applyLanguage();
  }
  var debounceTimer=null;
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
      if((txt==='Save Settings'||txt==='Guardar ajustes'||txt==='Enregistrer')&&!btn.dataset.bound){
        btn.dataset.bound='1'; btn.removeAttribute('onclick');
        btn.addEventListener('click',function(){
          var l=document.getElementById('s-lang'),v=document.getElementById('s-visible'),t=document.getElementById('t-inapp'),s=document.getElementById('t-sound'),vb=document.getElementById('t-vibrate');
          if(l) settings.lang=l.value; if(v) settings.visible=v.value; if(t) settings.inapp=t.checked; if(s) settings.sound=s.checked; if(vb) settings.vibrate=vb.checked;
          save(settings); syncUI();
          btn.textContent=settings.lang==='Spanish'?'Guardado!':settings.lang==='French'?'Enregistre!':'Saved!';
          setTimeout(function(){ applyLanguage(); },1200);
          playAlert();
        });
      }
    });
    if(!observer){
      observer=new MutationObserver(function(){
        if(isApplying) return;
        clearTimeout(debounceTimer);
        debounceTimer=setTimeout(applyLanguage,300);
      });
      observer.observe(document.body,{childList:true,subtree:true});
    }
  }
  document.addEventListener('DOMContentLoaded',bind);
  setTimeout(bind,500); setTimeout(bind,1500);
})();
