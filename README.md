# BRTKCS Hugo Theme

Egyedi Hugo theme podcast, filozófia, versek és források kezeléséhez. Letisztult, monospace dizájn meleg színpalettával, light/dark mode és többnyelvű UI támogatással.

## Funkciók

- ✨ **Szekció-specifikus dizájn** — minden tartalomtípusnak saját színvilága
- 🎨 **Light/Dark mode** — automatikus váltás, localStorage mentéssel
- 🌍 **Többnyelvű** — HU / EN / DE, statikus (Hugo multilingual); a nyelvváltó csak a létező fordításokat mutatja
- 📱 **Reszponzív** — mobil-first megközelítés
- 🎧 **Podcast** — lejátszó epizódborítóval, időbélyeges átirat lejátszáskövetéssel, Apple-kompatibilis RSS feed
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

### 3. hugo.toml

```toml
baseURL = "https://example.com/"
defaultContentLanguage = "hu"
defaultContentLanguageInSubdir = false
title = "@brtkcs | ~/werkstatt"
theme = "brtkcs"

[languages]
  [languages.hu]
    weight = 1
    locale = "hu"
  [languages.en]
    weight = 2
    locale = "en"
    [languages.en.params]
      description = "Description"
  [languages.de]
    weight = 3
    locale = "de"
    [languages.de.params]
      description = "Beschreibung"

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

# Belső pont: identifier + pageRef (a felirat az i18n menu_<identifier> kulcsából jön,
# és csak azon a nyelven látszik, ahol a szekcióban van tartalom). Külső pont: url.
[menu]
  [[menu.main]]
    identifier = "source"
    name = "Források"
    pageRef = "/source"
    weight = 1
  [[menu.main]]
    identifier = "podcast"
    name = "Podcast"
    pageRef = "/podcast"
    weight = 2
  [[menu.main]]
    identifier = "filozofia"
    name = "Filozófia"
    pageRef = "/filozofia"
    weight = 3
  [[menu.main]]
    identifier = "versek"
    name = "Versek"
    pageRef = "/versek"
    weight = 4

[taxonomies]
  tag = "tags"
  category = "categories"

[permalinks]
  source = "/source/:year/:month/:slug/"
  podcast = "/podcast/:slug/"
  filozofia = "/filozofia/:slug/"
  versek = "/versek/:slug/"
  research = "/research/:year/:month/:slug/"

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
audioFile: "episode-001.mp3"
srtFile: "episode-001.srt"
image: "episode-001.png"
duration: "45:32"
description: "Epizód leírása"
showNotes: "Források, linkek"
tags: ["tech"]
---
```

> A fájlmezőkbe elég a fájlnév: `audioFile` és `srtFile` → `static/audio/`, `image` → `static/images/`. Teljes útvonal (`/audio/x.mp3`) vagy URL is megadható.

> Az `srtFile` és az `image` opcionális. Az átirat időbélyeges, lejátszás közben kiemeli az aktuális részt, időbélyegre kattintva oda ugrik. Kép nélkül a feedben a műsor borítója látszik.

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

## Többnyelvűség

- A fordítás az eredeti mellé kerül, a nyelvkód a fájlnévben: `cikk.md` (hu), `cikk.en.md`, `cikk.de.md`. Az azonos alapnév köti össze őket.
- URL-ek: a magyar a gyökérben (`/filozofia/cikk/`), a többi nyelv előtaggal (`/en/filozofia/article/`). A szekciónevek minden nyelven azonosak.
- A felület szövegei az `i18n/{hu,en,de}.yaml` fájlokból jönnek, build közben; JS nem kell hozzá.
- Nyelvváltó: link a cikk fordítására; ha nincs fordítás, a nyelv nem jelenik meg. Listaoldalakon (főoldal, tagek) csak az a nyelv látszik, amelyiken van tartalom.
- Belső linkhez a `partial "lang-url.html" "/about/"` az aktuális nyelvű oldalt adja, ha létezik, különben a magyart.
- A `slug` legyen ASCII (a-z, 0-9, kötőjel), különben megosztáskor `%C3%A1`-szerű URL lesz belőle.

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
│   ├── images/
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

MIT License — **Készítette:** BRTKCS | **Verzió:** 1.3.0 | **Hugo:** 0.164.0 extended-del tesztelve (régebbi verziók nem ellenőrzöttek)
