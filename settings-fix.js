(function(){
  if(window._whisperFixV2) return; window._whisperFixV2=1;
  var KEY='whisper_settings_v1';
  var defaults={inapp:true,sound:true,vibrate:true,push:false,lang:'English',visible:'Everyone'};
  function load(){ try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){return Object.assign({},defaults)} }
  function save(s){ localStorage.setItem(KEY,JSON.stringify(s)); try{ localStorage.setItem('whisper_lang', s.lang||'English'); }catch(e){} return s; }
  var settings=load(); window.whisperSettings=settings; try{ localStorage.setItem('whisper_lang', settings.lang||'English'); }catch(e){}
  // --- Push toggle: was missing, so browser kept asking ---
  window.handlePushToggle=function(el){
    settings.push=!!el.checked; save(settings);
    if(settings.push && 'Notification' in window && Notification.permission==='default'){
      try{ Notification.requestPermission(); }catch(e){}
    }
    var st=document.getElementById('notif-status');
    if(st) st.textContent = settings.push ? 'Push: on' : 'Push: off';
  };
  // --- Sound: soft beep ONLY on real message, never on toggle/Save ---
  var lastBeep=0;
  function playAlert(){
    if(!settings.inapp || !settings.sound) return;
    var now=Date.now(); if(now-lastBeep<800) return; lastBeep=now;
    try{ if(settings.vibrate&&navigator.vibrate) navigator.vibrate(40); }catch(e){}
    try{
      var AC=window.AudioContext||window.webkitAudioContext; if(!AC) return;
      var ctx=new AC(),o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type='sine'; o.frequency.value=660; g.gain.value=0.05;
      o.start(); o.stop(ctx.currentTime+0.08);
      setTimeout(function(){try{ctx.close()}catch(e){}},150);
    }catch(e){}
  }
  window.whisperPlayAlert=playAlert; window.whisperTestAlert=playAlert;
  // --- Language: emoji-aware, whole app ---
  var D={
  'Settings':['Ajustes','Parametres'],'Notifications':['Notificaciones','Notifications'],
  'Push Notifications':['Notificaciones push','Notifications push'],
  'Alerts even when app is closed':['Alertas aunque la app este cerrada','Alertes meme appli fermee'],
  'In-app Notifications':['Notificaciones en la app','Notifications dans appli'],
  'Banners + sound inside the app':['Avisos + sonido dentro de la app','Bannieres + son dans appli'],
  'Sound':['Sonido','Son'],'Beep for new messages':['Pitido para mensajes nuevos','Bip pour nouveaux messages'],
  'Vibration':['Vibracion','Vibration'],'Buzz for new messages':['Vibrar para mensajes nuevos','Vibrer pour nouveaux messages'],
  'Show my profile':['Mostrar mi perfil','Afficher mon profil'],'Language':['Idioma','Langue'],
  'Save Settings':['Guardar ajustes','Enregistrer'],'Saved!':['Guardado!','Enregistre!'],
  'Everyone':['Todos','Tout le monde'],'Only Matches':['Solo coincidencias','Seulement matchs'],
  'Hidden':['Oculto','Masque'],'English':['Ingles','Anglais'],'Spanish':['Espanol','Espagnol'],'French':['Frances','Francais'],
  'Discover':['Descubrir','Decouvrir'],'People':['Personas','Personnes'],'Matches':['Coincidencias','Matchs'],
  'Messages':['Mensajes','Messages'],'Whisper':['Susurro','Murmure'],'Profile':['Perfil','Profil'],
  'People by Country':['Personas por pais','Personnes par pays'],'Your Name':['Tu nombre','Ton nom'],
  'Age':['Edad','Age'],'Login / Sign Up':['Iniciar sesion / Registrarse','Connexion / Inscription'],
  'Login':['Iniciar sesion','Connexion'],'Sign Up':['Registrarse','Inscription'],
  'Logout':['Cerrar sesion','Deconnexion'],'Logged in as':['Conectado como','Connecte en tant que'],
  'Profile Photos':['Fotos de perfil','Photos de profil'],'About You':['Sobre ti','A propos de toi'],
  'Your name':['Tu nombre','Ton nom'],'Gender':['Genero','Genre'],'Female':['Mujer','Femme'],
  'Male':['Hombre','Homme'],'Other':['Otro','Autre'],'Looking for':['Buscando','Recherche'],
  'Anyone':['Cualquiera','Tout le monde'],'Relationship status':['Estado civil','Statut relationnel'],
  'Single':['Soltero','Celibataire'],'In a relationship':['En una relacion','En couple'],
  'Engaged':['Comprometido','Fiance'],'Married':['Casado','Marie'],
  'Save Profile':['Guardar perfil','Enregistrer profil'],
  'Make it beautiful, get more matches':['Hazlo bonito, consigue mas coincidencias','Rends-le beau, obtiens plus de matchs'],
  'Send Whisper':['Enviar susurro','Envoyer murmure'],'Write a whisper...':['Escribe un susurro...','Ecris un murmure...'],
  'Chat':['Chat','Discussion'],'No messages yet.':['Aun no hay mensajes.','Aucun message pour le moment.'],
  'No matches yet. Like people in Discover.':['Aun no hay coincidencias. Dale me gusta a personas en Descubrir.','Aucun match. Aime des personnes dans Decouvrir.'],
  'Type a message...':['Escribe un mensaje...','Ecris un message...'],'Send':['Enviar','Envoyer'],
  'Close':['Cerrar','Fermer'],'People Near You':['Personas cerca de ti','Personnes pres de toi'],
  'Loading people...':['Cargando personas...','Chargement des personnes...'],
  'Likes left today':['Me gusta restantes hoy','Likes restants aujourd\'hui'],
  'All Countries':['Todos los paises','Tous les pays'],'Email':['Correo','Email'],
  'Password':['Contrasena','Mot de passe'],

  'Tap photo for next':['Toca la foto para siguiente','Touche la photo pour suivant'],
  'Tap a circle to Like. Each Like uses 1 of your 30 daily. Resets tomorrow.':['Toca un circulo para dar Me gusta. Cada Me gusta usa 1 de tus 30 diarios. Se reinicia manana.','Touche un cercle pour Liker. Chaque Like utilise 1 de tes 30 quotidiens. Reinitialise demain.'],
  'No Likes left today - come back tomorrow!':['Sin Me gusta hoy - vuelve manana!','Plus de Likes aujourd\'hui - reviens demain!'],
  'Out of Likes!':['Sin Me gusta!','Plus de Likes!'],
  'Likes Left Today':['Me gusta restantes hoy','Likes restants aujourd\'hui'],
  'Likes left today':['Me gusta restantes hoy','Likes restants aujourd\'hui'],
  'Pass':['Pasar','Passer'],'Like':['Me gusta','J\'aime'],'Message':['Mensaje','Message'],
  'Chat Now':['Chatear ahora','Discuter maintenant'],
  'Looking for:':['Buscando:','Recherche:'],
  'Verification & Badges':['Verificacion e insignias','Verification et badges'],
  'Verified profiles get more matches. We never show your ID or selfie to other users.':['Los perfiles verificados consiguen mas coincidencias. Nunca mostramos tu ID ni tu selfie a otros usuarios.','Les profils verifies obtiennent plus de matchs. Nous ne montrons jamais ta piece ni ton selfie aux autres.'],
  'Email Verification':['Verificacion de correo','Verification email'],
  'Confirms you own this email. Sent when you signed up.':['Confirma que este correo es tuyo. Enviado al registrarte.','Confirme que cet email est a toi. Envoye a l\'inscription.'],
  'Photo Verification':['Verificacion de foto','Verification photo'],
  'Take a live selfie copying the pose. Our team reviews it — usually within 24h.':['Hazte un selfie en vivo copiando la pose. Nuestro equipo lo revisa - normalmente en 24h.','Prends un selfie en direct en copiant la pose. Notre equipe le verifie - generalement sous 24h.'],
  'Verify My Photo':['Verificar mi foto','Verifier ma photo'],
  'ID Verification':['Verificacion de ID','Verification ID'],
  'Passport / national ID. Coming soon — we are building secure ID handling first.':['Pasaporte / ID nacional. Proximamente - primero estamos creando un manejo seguro de ID.','Passeport / piece nationale. Bientot - nous construisons d\'abord une gestion securisee des ID.'],
  'Photo Verification':['Verificacion de foto','Verification photo'],
  'Cancel':['Cancelar','Annuler'],'CHECKING…':['COMPROBANDO…','VERIFICATION…'],
  'NOT VERIFIED':['NO VERIFICADO','NON VERIFIE'],'SOON':['PRONTO','BIENTOT'],
  'Email Verified':['Correo verificado','Email verifie'],
  'Photo Verified':['Foto verificada','Photo verifiee'],
  'Copy this pose exactly, so we can match it to your profile photos.':['Copia esta pose exactamente, para compararla con tus fotos de perfil.','Copie cette pose exactement, pour la comparer a tes photos de profil.'],
  'Loading chats...':['Cargando chats...','Chargement des discussions...'],
  'Loading chat...':['Cargando chat...','Chargement de la discussion...'],
  'Loading...':['Cargando...','Chargement...'],
  'Online':['En linea','En ligne'],
  'Offline':['Sin conexion','Hors ligne'],
  'Notifications':['Notificaciones','Notifications'],
  'Mark all read':['Marcar todo como leido','Tout marquer comme lu'],
  'No notifications yet':['Sin notificaciones aun','Aucune notification pour le moment'],
  'Country - City e.g. Equatorial Guinea - Malabo':['Pais - Ciudad p. ej. Guinea Ecuatorial - Malabo','Pays - Ville ex. Guinee equatoriale - Malabo']
  };
  function tr(orig,lang){
    if(lang==='English'||!orig) return orig;
    var i=lang==='Spanish'?0:1;
    var mNum=orig.match(/^(\W*\s*)(\d+)\s+Likes\s+left\s+today\s*$/i);
    if(mNum) return mNum[1]+mNum[2]+(lang==='Spanish'?' Me gusta restantes hoy':' Likes restants aujourd\'hui');
    var mNum2=orig.match(/^(\W*\s*)(\d+)\s+Likes\s+Left\s+Today\s*$/i);
    if(mNum2) return mNum2[1]+mNum2[2]+(lang==='Spanish'?' Me gusta restantes hoy':' Likes restants aujourd\'hui');
    var mLike=orig.match(/^(.*liked\s+)(.+)(!\s*)(\d+)(\s+left today.*)$/i);
    if(mLike) return orig; // leave alert text, it is rebuilt by JS

    // strip leading emoji / symbols, translate rest, put emoji back
    var m=orig.match(/^(\W*\s*)/); var pre='', rest=orig;
    if(m){ pre=m[0]; rest=orig.slice(pre.length); }
    if(D[rest]) return pre + D[rest][i];
    if(D[orig]) return D[orig][i];
    return orig;
  }
  var isApplying=false, observer=null, debounceTimer=null;
  function applyLanguage(){
    if(isApplying) return; isApplying=true;
    if(observer) observer.disconnect();
    try{
      var lang=settings.lang||'English';
      // translate TEXT NODES, not whole divs - keeps icons + buttons intact
      var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null);
      var nodes=[]; var n; while(n=walker.nextNode()) nodes.push(n);
      nodes.forEach(function(t){
        var txt=t.nodeValue; if(!txt||!txt.trim()) return;
        var parent=t.parentNode; if(!parent) return;
        var tag=parent.tagName||''; if(tag==='SCRIPT'||tag==='STYLE'||tag==='TEXTAREA'||tag==='INPUT') return;
        if(!t._orig) t._orig=txt;
        var orig=t._orig; var next=lang==='English'?orig:tr(orig,lang);
        if(t.nodeValue!==next) t.nodeValue=next;
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
    setTimeout(function(){ isApplying=false; if(observer) observer.observe(document.body,{childList:true,subtree:true}); },100);
  }
  function syncUI(){
    [['t-push','push'],['t-inapp','inapp'],['t-sound','sound'],['t-vibrate','vibrate']].forEach(function(p){
      var el=document.getElementById(p[0]); if(el) el.checked=!!settings[p[1]];
    });
    applyLanguage();
  }
  function bind(){
    syncUI();
    [['t-inapp','inapp'],['t-sound','sound'],['t-vibrate','vibrate']].forEach(function(pair){
      var el=document.getElementById(pair[0]);
      if(el&&!el.dataset.bound){ el.dataset.bound='1'; el.addEventListener('change',function(){ settings[pair[1]]=el.checked; save(settings); }); }
    });
    var langSel=document.getElementById('s-lang');
    if(langSel&&!langSel.dataset.bound){ langSel.dataset.bound='1'; langSel.addEventListener('change',function(){ settings.lang=langSel.value; save(settings); applyLanguage(); }); }
    var visSel=document.getElementById('s-visible');
    if(visSel&&!visSel.dataset.bound){ visSel.dataset.bound='1'; visSel.addEventListener('change',function(){ settings.visible=visSel.value; save(settings); }); }
    document.querySelectorAll('button').forEach(function(btn){
      var txt=(btn.textContent||'').trim();
      if((txt==='Save Settings'||txt==='Guardar ajustes'||txt==='Enregistrer')&&!btn.dataset.bound){
        btn.dataset.bound='1'; btn.removeAttribute('onclick');
        btn.addEventListener('click',function(){
          var l=document.getElementById('s-lang'),v=document.getElementById('s-visible'),tp=document.getElementById('t-push'),t=document.getElementById('t-inapp'),s=document.getElementById('t-sound'),vb=document.getElementById('t-vibrate');
          if(l) settings.lang=l.value; if(v) settings.visible=v.value; if(tp) settings.push=tp.checked; if(t) settings.inapp=t.checked; if(s) settings.sound=s.checked; if(vb) settings.vibrate=vb.checked;
          save(settings); syncUI();
          btn.textContent=settings.lang==='Spanish'?'Guardado!':settings.lang==='French'?'Enregistre!':'Saved!';
          setTimeout(applyLanguage,1200);
          // NO sound on Save
        });
      }
    });
    if(!observer){
      observer=new MutationObserver(function(){
        if(isApplying) return;
        clearTimeout(debounceTimer); debounceTimer=setTimeout(applyLanguage,300);
      });
      observer.observe(document.body,{childList:true,subtree:true});
    }
  }
  // --- Map: keep Online filter selected + don't flash 0 count ---
  try{
    var savedFilter=localStorage.getItem('whisper_map_filter');
    if(savedFilter) window.mapFilter=savedFilter;
    // persist filter on click
    document.addEventListener('click',function(e){
      if(e.target&&e.target.classList&&e.target.classList.contains('map-filter')){
        var f=e.target.getAttribute('data-filter'); if(f){ localStorage.setItem('whisper_map_filter',f); window.mapFilter=f; }
      }
    });
    // wrap renderMap: re-apply highlight + don't overwrite count with 0 while loading
    var _origRenderMap=window.renderMap;
    if(_origRenderMap && !window._mapWrapV2){
      window._mapWrapV2=1;
      window.renderMap=function(){
        var countEl=document.getElementById('map-count');
        var prevCount=countEl?countEl.textContent:'';
        var hadProfiles=(typeof profiles!=='undefined' && profiles && profiles.length>0);
        _origRenderMap.apply(this,arguments);
        // restore highlight
        var cur=localStorage.getItem('whisper_map_filter')||window.mapFilter||'all';
        document.querySelectorAll('.map-filter').forEach(function(b){
          var on=b.getAttribute('data-filter')===cur;
          b.style.background=on?'#6C63FF':'#eee'; b.style.color=on?'white':'black';
        });
        // if profiles not loaded yet, don't show 0
        if(!hadProfiles && countEl && (!countEl.textContent || countEl.textContent.indexOf('0 ')===0)){
          countEl.textContent = prevCount && prevCount.indexOf('0 ')!==0 ? prevCount : 'Loading...';
        }
      };
    }
  }catch(e){ console.log('map fix',e); }
  document.addEventListener('DOMContentLoaded',bind);
  setTimeout(bind,500); setTimeout(bind,1500);
})();
