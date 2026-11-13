import pathlib
p = pathlib.Path("index.html")
t = p.read_text()
old = """    <!-- Location Screen -->
    <section id="location" class="screen">
      <div class="header">
        <h1>Location</h1>
      </div>
      <div class="content">
        <p>Location search will be here</p>
      </div>
    </section>"""
new = """    <!-- Map Screen -->
    <section id="location" class="screen">
      <div class="header">
        <h1>Map</h1>
      </div>
      <div class="content">
        <div style="display:flex;gap:8px;margin-bottom:12px;">
          <input id="map-search" placeholder="Search city... e.g. Malabo, Lagos" style="flex:1;padding:12px;border-radius:20px;border:1px solid #ddd;">
          <button id="map-search-btn" style="background:#6C63FF;color:white;border:none;padding:12px 16px;border-radius:20px;font-weight:bold;">Search</button>
        </div>
        <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
          <button class="map-filter" data-filter="all" style="background:#6C63FF;color:white;border:none;padding:8px 14px;border-radius:20px;">All</button>
          <button class="map-filter" data-filter="near" style="background:#eee;border:none;padding:8px 14px;border-radius:20px;">Near Me</button>
          <button class="map-filter" data-filter="online" style="background:#eee;border:none;padding:8px 14px;border-radius:20px;">Online Now</button>
        </div>
        <div id="map-box" style="height:280px;background:#e8eef7;border-radius:20px;position:relative;overflow:hidden;">
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
            <div style="font-size:40px;">📍</div>
            <strong id="map-center-label">Malabo</strong><br><span style="color:#888;font-size:13px;" id="map-center-sub">You are here</span>
          </div>
          <div id="map-pins" style="position:absolute;inset:0;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin:14px 0 8px;">
          <strong>Nearby People</strong><span id="map-count" style="color:#888;font-size:13px;"></span>
        </div>
        <div id="map-list" style="display:flex;flex-direction:column;gap:10px;"></div>
        <p id="map-empty" style="color:#888;text-align:center;display:none;">No people found here.<br>Try another city.</p>
      </div>
    </section>"""
assert old in t, "LOCATION-SECTION-NOT-FOUND"
p.write_text(t.replace(old, new))
print("MAP-HTML-OK")
