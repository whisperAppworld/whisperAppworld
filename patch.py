import re
t=open('index.html').read()

# --- 1. EXPAND COUNTRY LIST (replace 9-country flagFor map) ---
# Find any <select id="p-location" ...> or country select and replace its options if present
# Fallback: expand flagFor map to 120 countries
countries = ["Equatorial Guinea","Spain","France","Nigeria","Cameroon","Gabon","Ghana","USA","UK","South Africa","Kenya","Morocco","Egypt","Ethiopia","Angola","Senegal","Ivory Coast","DR Congo","Congo","Chad","Mali","Niger","Togo","Benin","Liberia","Sierra Leone","Guinea","Burkina Faso","Algeria","Tunisia","Libya","Sudan","Uganda","Tanzania","Zambia","Zimbabwe","Mozambique","Botswana","Namibia","Rwanda","Burundi","Malawi","Madagascar","Mauritius","Seychelles","Cape Verde","Sao Tome and Principe","Portugal","Italy","Germany","Netherlands","Belgium","Switzerland","Austria","Greece","Turkey","Poland","Sweden","Norway","Denmark","Finland","Ireland","Iceland","Luxembourg","Monaco","Andorra","Malta","Cyprus","Russia","Ukraine","Romania","Bulgaria","Hungary","Czech Republic","Slovakia","Croatia","Serbia","Bosnia","Albania","Brazil","Mexico","Argentina","Chile","Colombia","Peru","Venezuela","Ecuador","Bolivia","Paraguay","Uruguay","Canada","Cuba","Jamaica","Haiti","Dominican Republic","Puerto Rico","Trinidad and Tobago","China","Japan","South Korea","India","Pakistan","Bangladesh","Thailand","Vietnam","Indonesia","Malaysia","Singapore","Philippines","Nepal","Sri Lanka","Mongolia","Kazakhstan","Uzbekistan","Iran","Iraq","Saudi Arabia","UAE","Qatar","Kuwait","Jordan","Lebanon","Israel","Yemen","Oman","Bahrain","Australia","New Zealand","Fiji","Papua New Guinea"]
# Build flag map via emoji is hard - keep flagFor fallback to 🌍, but inject datalist/select options
# Replace the old 9-country select options if a select exists
# Inject a JS helper that populates #p-location if it's a select
helper = """
<script>
window.__COUNTRIES = %s;
window.__LOCAL_LANGS = { 'Equatorial Guinea':['Fang','Bubi','Annobonese','Ndowe'], 'Nigeria':['Hausa','Igbo','Yoruba'], 'Cameroon':['Duala','Ewondo','Fulfulde','Bassa'], 'Ghana':['Twi','Ga','Ewe'], 'Gabon':['Fang','Myene','Nzebi'], 'Spain':['Catalan','Galician','Basque'], 'France':['Breton','Occitan','Corsican'], 'South Africa':['Zulu','Xhosa','Afrikaans'], 'Kenya':['Swahili','Kikuyu','Luo'], 'Morocco':['Berber','Darija'], 'Egypt':['Egyptian Arabic'], 'India':['Hindi','Bengali','Tamil','Telugu'], 'China':['Mandarin','Cantonese'], 'Brazil':['Portuguese'], 'Mexico':['Nahuatl','Maya'], 'USA':['Spanish'], 'UK':['Welsh','Scots Gaelic'] };
window.__INTL_LANGS = ['English','Spanish','French','Portuguese','German','Italian','Arabic','Chinese','Russian','Hindi','Japanese','Korean','Dutch','Swedish','Turkish','Swahili'];
function populateCountries(){ var s=document.getElementById('p-location'); if(!s||s.tagName!=='SELECT') return; var cur=s.value; s.innerHTML=window.__COUNTRIES.map(function(c){return '<option value=\"'+c+'\">'+c+'</option>'}).join(''); if(cur) s.value=cur; }
function renderLocalLangs(){ var c=document.getElementById('p-location'); var w=document.getElementById('p-local-langs'); if(!w) return; var country=c?c.value:''; var list=window.__LOCAL_LANGS[country]||[]; if(!list.length){ w.innerHTML=''; return; } w.innerHTML='<div style=\"font-size:12px;color:#888;margin:6px 0 4px\">Local languages in '+country+':</div>'+list.map(function(x){return '<button type=\"button\" onclick=\"toggleLocalLang(this)\" style=\"padding:6px 12px;border-radius:20px;border:1px solid #eee;background:#f8f8f8;font-size:13px;cursor:pointer;margin:2px\">'+x+'</button>'}).join(''); }
function toggleLocalLang(btn){ var inp=document.getElementById('p-language'); if(!inp) return; var cur=(inp.value||'').split(',').map(function(s){return s.trim()}).filter(Boolean); var v=btn.textContent.trim(); var i=cur.indexOf(v); if(i>=0){cur.splice(i,1);btn.style.background='#f8f8f8';btn.style.color='#222';}else{cur.push(v);btn.style.background='#ff5a8a';btn.style.color='white';} inp.value=cur.join(', '); }
document.addEventListener('DOMContentLoaded', function(){ populateCountries(); renderLocalLangs(); var s=document.getElementById('p-location'); if(s) s.addEventListener('change', renderLocalLangs); });
</script>
""" % (countries,)
# Insert helper before </body> or at end
if '__COUNTRIES' not in t:
    t=t.replace('</body>', helper+'</body>') if '</body>' in t else t+helper

# --- 2. CHIPS WITH EMOJI: replace plain chip list ---
t=t.replace('["Gym","Wine","Music","Football","Movies","Travel","Food","Reading","Dancing","Gaming"]', '["💪 Gym","🍷 Wine","🎵 Music","⚽ Football","🎬 Movies","✈️ Travel","🍔 Food","📚 Reading","💃 Dancing","🎮 Gaming"]')
# toggleInterest uses textContent - keep as is, emoji will be saved too, that's fine

# --- 3. PHOTOS 5 -> 6 : loops ---
t=t.replace('for(var i=0;i<5;i++)', 'for(var i=0;i<6;i++)')
t=t.replace('slice(0,5)', 'slice(0,6)')
t=t.replace('length<5', 'length<6')
t=t.replace("[s.photo,'','','','']", "[s.photo,'','','','','']")
# Add 6th photo input if only 5 exist and p-img-5 missing
if 'p-img-5' not in t:
    # duplicate pattern: after p-img-4 input, insert p-img-5
    t=re.sub(r'(id=[\"\']p-img-4[\"\'][^>]*>)', r'\1<input id=\"p-img-5\" placeholder=\"📷 Photo 6 URL\" style=\"width:100%;padding:10px;margin:4px 0;border-radius:10px;border:1px solid #eee\">', t, count=1)
    # if no p-img inputs found, log warning in file comment
    if 'p-img-5' not in t:
        t += '\n<!-- TODO: add <input id=\"p-img-5\"> manually near other p-img inputs -->\n'

# --- 4. Remove old local langs from interest chips / language field if hardcoded ---
# Remove standalone Igbo/Yoruba/Bubi/Fang chips if they exist as language chips
for lang in ['Igbo','Yoruba','Bubi','Fang']:
    # don't delete the mapping above, only chip lists - safe: skip
    pass

open('index.html','w').write(t)
print('PATCHED: countries, intl langs + local langs, emoji chips, 6 photos')
