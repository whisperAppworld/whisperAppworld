/* REAL GATE - Supabase only */
(function(){
  window.__authed = false;
  var origShowTab = window.showTab;
  window.showTab = function(name){
    if(!window.__authed && name !== 'profile'){
      window.applyGate(false);
      return;
    }
    if(origShowTab) return origShowTab(name);
  };
  window.applyGate = function(loggedIn){
    window.__authed = !!loggedIn;
    var nav = document.querySelector('nav');
    if(nav) nav.style.display = loggedIn ? '' : 'none';
    var myBtn = document.getElementById('psub-my-btn');
    var setBtn = document.getElementById('psub-settings-btn');
    if(myBtn) myBtn.style.display = loggedIn ? '' : 'none';
    if(setBtn) setBtn.style.display = loggedIn ? '' : 'none';
    if(!loggedIn){
      var lb = document.getElementById('login-box');
      if(lb) lb.style.display = 'block';
      var ab = document.getElementById('account-bar');
      if(ab) ab.style.display = 'none';
      if(typeof showProfileSub === 'function') showProfileSub('login');
      document.querySelectorAll('section').forEach(function(s){ s.classList.remove('active'); });
      var tp = document.getElementById('tab-profile');
      if(tp) tp.classList.add('active');
      document.body.dataset.currentTab = 'profile';
    }
  };
  window.checkRealGate = async function(){
    try{
      if(!window.supabase){ setTimeout(window.checkRealGate, 500); return; }
      var r = await window.supabase.auth.getSession();
      var has = !!(r && r.data && r.data.session && r.data.session.user);
      window.applyGate(has);
    }catch(e){ window.applyGate(false); }
  };
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(window.checkRealGate, 600); });
  if(window.supabase && window.supabase.auth && window.supabase.auth.onAuthStateChange){
    window.supabase.auth.onAuthStateChange(function(e){
      if(e === 'SIGNED_IN') window.applyGate(true);
      if(e === 'SIGNED_OUT') window.applyGate(false);
    });
  }
})();
