import pathlib, re
p = pathlib.Path("index.html")
t = p.read_text()
# 1. Remove old text "30 people circling..."
t = re.sub(r'[^<]*30 people[^<]*', '', t)
t = re.sub(r'Tap to view[^<]*', '', t)
# 2. Ensure map + counter exists - insert before circles div
if 'daily-counter' not in t:
    t = t.replace('<div class="circles" id="circles"></div>',
        '<div class="counter" id="daily-counter">❤️ 30 Likes left today</div><div id="map" style="height:280px;border-radius:12px;margin:10px 0;background:#ddd"></div><div class="circles" id="circles"></div>')
# 3. Ensure Leaflet CSS/JS
if 'leaflet' not in t.lower():
    t = t.replace('</head>', "<link rel='stylesheet' href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'></head>")
    t = t.replace('</body>', "<script src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'></script></body>")
# 4. Ensure CSS for counter
if '.counter' not in t:
    t = t.replace('</style>', '.counter{background:#ff5a8a;padding:12px;border-radius:10px;text-align:center;font-weight:bold;color:white} #map{height:280px}</style>')
# 5. Force initMap on load + when Discover clicked
if 'invalidateSize' not in t:
    t = t.replace('setTimeout(initMap, 500);', 'setTimeout(()=>{initMap(); if(window._map) window._map.invalidateSize();}, 800);')
p.write_text(t)
print("FIXED2 DONE - counter?", 'daily-counter' in t, "map?", 'id="map"' in t, "leaflet?", 'leaflet' in t.lower())
