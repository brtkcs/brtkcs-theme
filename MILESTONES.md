# 🛠️ Werkstatt Theme - Milestones

## ✅ v1.1.0 - Elkészült (2026. január)

### Alapstruktúra
- [x] Hugo theme alapok (baseof, head, header, footer)
- [x] Szekció-specifikus layoutok (source, podcast, filozófia, versek)
- [x] Reszponzív dizájn (mobil-first)

### Dizájn
- [x] Light/Dark mode toggle
- [x] Transzparens header görgetésnél
- [x] ~/brtkcs + werkstatt szöveges logo
- [x] Szekció-specifikus színpaletta (olive, rust, purple, beige)
- [x] IBM Plex Mono & Sans tipográfia (lokális fontok, GDPR)
- [x] Tag oldalak egyedi színekkel

### Funkciók
- [x] Table of Contents (automatikus, hosszú cikkeknél)
- [x] Certifications galéria lightbox-szal (159 cert, landscape)
- [x] Podcast player beépített
- [x] Tinnitus Napló RSS feed integráció
- [x] Cookie notice (őszinte, barátságos szöveg)

### Tartalom
- [x] Werkstatt manifesto oldal (I. Manifesto, II. Etikai, III. Technológiai záradék)
- [x] Home page hover előzetes a manifesto-hoz
- [x] About oldal cert galériával

### Dokumentáció
- [x] README teljes újraírás (telepítési útmutató)
- [x] Hidden gem elrejtve 🥚

---

## ✅ v1.2.0 - Elkészült (2026. február)

### Refactor
- [x] `posztok` → `source` átnevezés (layout, CSS, permalink, publi.sh)
- [x] Title: `@brtkcs | ~/werkstatt`
- [x] Dátumformátum universális (`2006-01-02`) minden layoutban

### Új funkciók
- [x] Transcript panel podcast epizódokhoz (SRT fájl alapú, `<details>`)
- [x] OG meta tagek (Open Graph + Twitter Card, dinamikus)
- [x] i18n — hu/en/de fordítások (yaml + JS nyelvváltó a headerben)
- [x] 404 oldal — terminál stílusú, dark/light módban
- [x] Print CSS — tiszta nyomtatás, forrás jelölés alul

---

## ✅ v1.3.0 - Elkészült (2026. november)

### Podcast (Werkstatt Napló)
- [x] RSS sablon a helyén (`layouts/podcast/rss.xml`), enclosure `length`-szel
- [x] Csatorna-adatok a `[params.podcast]` alól (cím, leírás, szerző, borító, két kategória, `explicit`)
- [x] Epizódborító (`image:`), oldalon és a feedben (`itunes:image`)
- [x] Epizód-doboz: borító, cím, adatok, lejátszó; alatta leírás, átirat, szöveg, show notes
- [x] Időbélyeges átirat lejátszáskövetéssel, időbélyegre ugrás
- [x] Fájlmezőkbe elég a fájlnév (`audioFile`, `srtFile`, `image`)
- [x] Mobil nézet: a lejátszó egy sorban 320 px-ig

### Többnyelvűség
- [x] Hugo multilingual: hu a gyökérben, `/en/`, `/de/`
- [x] Statikus nyelvváltó, csak a létező fordításokra; `hreflang`
- [x] Minden felületszöveg az `i18n/*.yaml`-ban; `i18n.js` kivezetve
- [x] Menü `pageRef`-fel, nyelvenként csak a tartalommal bíró szekciók

### Elrendezés és URL-ek
- [x] Tartalom középen, TOC-cal és anélkül
- [x] ASCII slugok, átirányítás a régi ékezetes URL-ekről (site oldalon)
- [x] Tinnitus-lista a site `data/tinnitus.yaml`-ból, nem a theme-ből

---

## 🚀 Jövőbeni fejlesztések

### Javítandó
- [x] Tag-oldalak: a `/tags/x/` a `taxonomy.html`-lel renderelődött (Hugo 0.146+ template-rendszer); `term.html` és `taxonomy.html` a `layouts/` gyökerében
- [x] Ékezetes tag- és kategória-URL-ek: term-oldal ékezet nélküli `url`-lel (a site `publi.sh`-ja generálja), átirányítás a régi címekről
- [x] Tag eredeti alakja a címben (`sophia.exe`, nem „Sophia.exe”), tag-összesítő címe az oldal nyelvén
- [x] Rövid, sima szöveges kivonat a listákban (címsor nélkül)

### Tartalom
- [ ] Podcast szekció feltöltése (saját epizódok); a show notes-ban a hivatkozott epizód rendes link legyen, ami az epizódhoz visz
- [ ] További filozófiai esszék
- [ ] Angol/Német tartalom fordítás (a theme már kész rá)

### Funkciók
- [ ] Keresés funkció
- [x] Olvasási idő kijelzés a prózai szekciókban (Források, Research, Filozófia); versnél és podcastnál nem kell, ott a hossz a mérvadó
- [x] Navigációs gombok (időrendi következő/előző), egy sorban a megosztás gombbal; mobilon cím nélkül
- [x] Mind-map: tag-térkép a `/tags/` oldalon (Felhő / Térkép), saját JS, csak tagek és cikkek
- [x] Mind-map finomítás: simább mozgás, két ujjas nagyítás, két kattintásos megnyitás
- [x] Mind-map: egymásra csúszó tag-feliratok szétválasztva; átfedő párok 5/6/23 → 0 (1440/1024/390 px)
  - a felirat helyet foglal a szimulációban; a feliratok legfelső rétegben, háttérszínű kontúrral
  - kicsinyítve az ütköző kisebb tag felirata rejtve, nagyításra és kiemelésre visszajön (mobilon a teljes nézetben ~38/72)
  - a `fit` a feliratokkal együtt mér, nem vágódik le felirat a szélen
- [x] Mini-map a cikk alján (Filozófia, Research, Források; versnél és podcastnál nincs): a teljes térkép kicsiben, halványan; kiemelve csak a cikk és a tagjei, névvel
  - a navigáció/megosztás sora fölött, mobilon is
  - alatta egy sor („A cikk helye a térképen”, hu/en/de); a doboz link a `/tags/#map` nézetre, erre a cikkre középre állítva
  - a gráf adata a `/tags/` HTML-jéből külön fájlba kerül (gzip ~4,9 KB, 130 csomópont), a `/tags/` oldal és a cikkek is ezt töltik, egyszer letöltve; kód: a `tag-map.js`
  - az elrendezés determinisztikus, ugyanaz a kép, mint a nagy térképen; a feliratátfedés javítása előtte
  - a szomszéd-listás változat elvetve: a széles tagek (`sophia.exe` 19, `vers` 14 cikk) miatt túl zajos
- [x] OG kép — terminál stílusú, build közben generált (Hugo images.Text, IBM Plex Mono TTF), kivonat a leírásban

### Dizájn
- [ ] Print CSS finomhangolás

### Megjegyzés
- Komment rendszer **nem tervezett** — visszajelzés Bluesky / Mastodon megosztáson keresztül

---

*Köztes tér. Mozgásban. A Werkstatt: mindig most.*
