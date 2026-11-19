# BRTKCS Hugo Theme

Egyedi Hugo theme podcast, filozófia, versek és források kezeléséhez. Letisztult, monospace dizájn meleg színpalettával, light/dark mode és többnyelvű UI támogatással.

## Funkciók

- ✨ **Szekció-specifikus dizájn** — minden tartalomtípusnak saját színvilága
- 🎨 **Light/Dark mode** — automatikus váltás, localStorage mentéssel
- 🌍 **i18n UI** — HU / EN / DE nyelvváltó, JS alapú
- 📱 **Reszponzív** — mobil-first megközelítés
- 🎧 **Podcast player** — beépített audio lejátszó + transcript panel
- 📚 **Table of Contents** — automatikus tartalomjegyzék hosszú cikkeknél
- 🏷️ **Tag rendszer** — szekció-specifikus tag színekkel
- 🖼️ **Certifications galéria** — About oldalon lightbox-szal
- 🔒 **GDPR-barát** — lokális fontok, nincs külső tracking
- 🖨️ **Print CSS** — tiszta nyomtatás, forrás jelöléssel
- 💀 **404 oldal** — terminál stílusú

---

## Telepítés

### 1. Submodule-ként (ajánlott)

```bash
cd your-hugo-site
git submodule add https://github.com/brtkcs/brtkcs-theme themes/brtkcs
```

### 2. Fontok

A theme lokális fontokat használ. Hozd létre a `static/fonts/` és `static/css/` mappákat, töltsd le az IBM Plex fontokat, és készítsd el a `static/css/fonts.css` fájlt. Részletes útmutató a régebbi README verzióban.

### 3. i18n JS fájl

Másold a `static/js/i18n.js` fájlt a site `static/js/` mappájába — ez a JS nyelvváltó fordítási adatait tartalmazza.

### 4. hugo.toml

```toml
baseURL = "https://example.com/"
languageCode = "hu"
title = "@brtkcs | ~/werkstatt"
theme = "brtkcs"

[pagination]
  pagerSize = 10

enableRobotsTXT = true
enableGitInfo = true

[params]
  description = "Leírás"
  author = "brtkcs"

[params.social]
  github = "https://github.com/yourhandle"
  bluesky = "https://bsky.app/profile/yourhandle"
  instagram = "https://instagram.com/yourhandle"
  mastodon = "https://mastodon.social/@yourhandle"

[params.podcast]
  title = "Műsor címe"
  description = "Műsor leírása"
  author = "Szerző neve"
  email = "podcast@example.com"
  image = "/images/cover.png"
  explicit = false
  [[params.podcast.categories]]
    text = "Technology"
  [[params.podcast.categories]]
    text = "Society & Culture"
    sub = "Philosophy"

[menu]
  [[menu.main]]
    name = "@Források"
    url = "/source/"
    weight = 1
  [[menu.main]]
    name = "Podcast"
    url = "/podcast/"
    weight = 2
  [[menu.main]]
    name = "Filozófia"
    url = "/filozofia/"
    weight = 3
  [[menu.main]]
    name = "Versek"
    url = "/versek/"
    weight = 4

[taxonomies]
  tag = "tags"
  category = "categories"

[permalinks]
  source = "/source/:year/:month/:slug/"
  podcast = "/podcast/:slug/"
  filozofia = "/filozofia/:slug/"
  versek = "/versek/:slug/"

[outputs]
  home = ["HTML", "RSS"]
  section = ["HTML", "RSS"]
```

---

## Content típusok

### @Források (`content/source/`)

```yaml
---
title: "Poszt címe"
date: 2026-01-19
draft: false
tags: ["technológia"]
summary: "Rövid összefoglaló"
callout: "Megjegyzés a poszt végén"
---
```

### Podcast (`content/podcast/`)

```yaml
---
title: "001. Epizód"
slug: "001-epizod"
date: 2026-01-19
draft: false
audioFile: "/audio/episode-001.mp3"
duration: "45:32"
description: "Epizód leírása"
srtFile: "audio/episode-001.srt"
tags: ["tech"]
---
```

> Az `srtFile` opcionális — ha megadod, a transcript panel automatikusan megjelenik. Az SRT a `static/` alól töltődik (`static/audio/episode-001.srt`).

> A `slug` csak ASCII karaktert tartalmazzon (a-z, 0-9, kötőjel): az Apple Podcasts nem fogad el ékezetes URL-t. Az audio fájlnévre ugyanez vonatkozik.

> A podcast feed (`/podcast/index.xml`) a `[params.podcast]` adatait használja. Kategóriák: [Apple Podcasts categories](https://podcasters.apple.com/support/1691-apple-podcasts-categories). A borító 1400×1400–3000×3000 px, PNG vagy JPG, átlátszóság nélkül.

### Filozófia (`content/filozofia/`)

```yaml
---
title: "Esszé címe"
subtitle: "Alcím"
date: 2026-01-19
draft: false
tags: ["identitás"]
epigraph:
  text: "Idézet"
  author: "Szerző"
references:
  - "Hivatkozás 1"
---
```

### Versek (`content/versek/`)

```yaml
---
title: "Vers címe"
date: 2026-01-19
draft: false
tags: ["természet"]
note: "Jegyzet"
---
```

---

## Könyvtárstruktúra

```
your-site/
├── hugo.toml
├── content/
│   ├── source/
│   ├── podcast/
│   ├── filozofia/
│   ├── versek/
│   └── about/
├── static/
│   ├── fonts/
│   ├── css/
│   │   └── fonts.css
│   ├── js/
│   │   └── i18n.js
│   └── audio/
└── themes/
    └── brtkcs/
```

---

## Submodule frissítés

```bash
git submodule update --remote themes/brtkcs
git add themes/brtkcs
git commit -m "chore: update theme submodule"
git push origin main
```

---

## Színpaletta

| Szín | Hex | Használat |
|------|-----|-----------|
| Olajzöld | `#848B23` | @Források, logo |
| Rozsdavörös | `#A8361B` | Podcast |
| Lila | `#31185A` | Filozófia |
| Bézs | `#D7D4CD` | Versek, háttér |
| Sötétbarna | `#433C22` | Szöveg |
| Közel-fekete | `#191202` | Dark mode háttér |

---

## Licenc

MIT License — **Készítette:** BRTKCS | **Verzió:** 1.2.0 | **Hugo minimum:** 0.112.0
