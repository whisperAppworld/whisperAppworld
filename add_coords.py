import pathlib, re, random
p = pathlib.Path("script.js")
t = p.read_text()
random.seed(7)
# country -> [lat, lng] centre
C = {
"Nigeria":[9.08,8.67],"Equatorial Guinea":[1.65,10.27],"France":[46.22,2.21],"Spain":[40.46,-3.74],
"United States":[37.09,-95.71],"United Kingdom":[55.37,-3.43],"Germany":[51.16,10.45],"Italy":[41.87,12.56],
"Canada":[56.13,-106.34],"Brazil":[-14.23,-51.92],"Mexico":[23.63,-102.55],"India":[20.59,78.96],
"China":[35.86,104.19],"Japan":[36.20,138.25],"South Korea":[35.90,127.76],"Australia":[-25.27,133.77],
"South Africa":[-30.55,22.93],"Kenya":[-0.02,37.90],"Ghana":[7.94,-1.02],"Egypt":[26.82,30.80],
"Morocco":[31.79,-7.09],"Chile":[-35.67,-71.54],"Argentina":[-38.41,-63.61],"Colombia":[4.57,-74.29],
"Peru":[-9.19,-75.01],"Dominican Republic":[18.73,-70.16],"Puerto Rico":[18.22,-66.59],"Jamaica":[18.10,-77.29],
"Philippines":[12.87,121.77],"Indonesia":[-0.78,113.92],"Thailand":[15.87,100.99],"Vietnam":[14.05,108.27],
"Turkey":[38.96,35.24],"Saudi Arabia":[23.88,45.07],"United Arab Emirates":[23.42,53.84],"Russia":[61.52,105.31],
"Netherlands":[52.13,5.29],"Belgium":[50.50,4.46],"Switzerland":[46.81,8.22],"Austria":[47.51,14.55],
"Sweden":[60.12,18.64],"Norway":[60.47,8.46],"Denmark":[56.26,9.50],"Portugal":[39.39,-8.22],
"Poland":[51.91,19.14],"Greece":[39.07,21.82],"Ukraine":[48.37,31.16],"Israel":[31.04,34.88],
}
def repl(m):
    loc = m.group(1)
    country = loc.split(",")[-1].strip()
    lat0, lng0 = C.get(country, [20, 0])
    lat = round(lat0 + random.uniform(-1.5, 1.5), 4)
    lng = round(lng0 + random.uniform(-1.5, 1.5), 4)
    # keep original, add lat/lng before closing }
    inner = m.group(0)
    return inner[:-3] + f', lat: {lat}, lng: {lng} }},'
pat = re.compile(r'\s*\{ name: "[^"]+", location: "([^"]+)", bio: "[^"]*", promptQ: "[^"]*", promptA: "[^"]*", img: "[^"]+" \},')
t2, n = pat.subn(lambda m: repl(m), t)
p.write_text(t2)
print(f"COORDS-OK {n}")
