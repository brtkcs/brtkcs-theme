# BRTKCS Hugo Theme

Egyedi Hugo theme podcast, filozófia, versek és posztok kezeléséhez. Letisztult, modern dizájn meleg színpalettával és light/dark mode támogatással.

## Funkciók

- ✨ **Szekció-specifikus dizájn** - Minden tartalomtípusnak saját színvilága
- 🎨 **Light/Dark mode** - Automatikus váltás támogatással
- 📱 **Reszponzív** - Mobil-first megközelítés
- 🎧 **Podcast player** - Beépített audio lejátszó
- 📚 **Table of Contents** - Automatikus tartalomjegyzék hosszú cikkekhez
- 🏷️ **Tag rendszer** - Szekció-specifikus tag színekkel
- 🖼️ **Certifications galéria** - About oldalon lightbox-szal
- 🔒 **GDPR-barát** - Lokális fontok, nincs külső tracking
- 🎯 **Monospace tipográfia** - IBM Plex Mono & Sans

---

## Gyors telepítés

### 1. Theme hozzáadása

```bash
cd your-hugo-site
git clone https://github.com/yourusername/brtkcs-theme themes/brtkcs
```

Vagy git submodule-ként:

```bash
git submodule add https://github.com/yourusername/brtkcs-theme themes/brtkcs
```

### 2. Konfiguráció

Hozd létre a `hugo.toml` fájlt a site gyökerében:

```toml
baseURL = "https://example.com/"
languageCode = "hu"
title = "BRTKCS"
theme = "brtkcs"

[params]
  description = "Filozófia, versek, gondolatok és podcast"
  author = "BRTKCS"

[params.social]
  github = "https://github.com/yourhandle"
  bluesky = "https://bsky.app/profile/yourhandle"
  instagram = "https://instagram.com/yourhandle"
  mastodon = "https://mastodon.social/@yourhandle"

[menu]
  [[menu.main]]
    name = "Posztok"
    url = "/posztok/"
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
  [[menu.main]]
    name = "About"
    url = "/about/"
    weight = 5
```

### 3. Fontok telepítése (kötelező)

A theme lokális fontokat használ. Töltsd le és helyezd el:

```bash
mkdir -p static/fonts static/css

# Fontok letöltése
cd static/fonts
curl -sLO "https://fonts.gstatic.com/s/ibmplexmono/v19/-F63fjptAgt5VM-kVkqdyU8n5igg1l9kn-s.woff2"
mv *5igg1l9kn-s.woff2 ibm-plex-mono-400.woff2

curl -sLO "https://fonts.gstatic.com/s/ibmplexmono/v19/-F6qfjptAgt5VM-kVkqdyU8n3twJ8ldPg-IUDNg.woff2"
mv *8ldPg-IUDNg.woff2 ibm-plex-mono-500.woff2

curl -sLO "https://fonts.gstatic.com/s/ibmplexmono/v19/-F6qfjptAgt5VM-kVkqdyU8n3vAO8ldPg-IUDNg.woff2"
mv *O8ldPg-IUDNg.woff2 ibm-plex-mono-600.woff2

curl -sLO "https://fonts.gstatic.com/s/ibmplexsans/v19/zYXgKVElMYYaJe8bpLHnCwDKhdzeFb5N.woff2"
mv *Fb5N.woff2 ibm-plex-sans-400.woff2

curl -sLO "https://fonts.gstatic.com/s/ibmplexsans/v19/zYX9KVElMYYaJe8bpLHnCwDKjSL9AIxsdO_q.woff2"
mv *dO_q.woff2 ibm-plex-sans-600.woff2
```

Hozd létre a `static/css/fonts.css` fájlt:

```css
@font-face {
  font-family: 'IBM Plex Mono';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/ibm-plex-mono-400.woff2') format('woff2');
}

@font-face {
  font-family: 'IBM Plex Mono';
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url('/fonts/ibm-plex-mono-500.woff2') format('woff2');
}

@font-face {
  font-family: 'IBM Plex Mono';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/ibm-plex-mono-600.woff2') format('woff2');
}

@font-face {
  font-family: 'IBM Plex Sans';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/ibm-plex-sans-400.woff2') format('woff2');
}

@font-face {
  font-family: 'IBM Plex Sans';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/ibm-plex-sans-600.woff2') format('woff2');
}
```

### 4. Hugo szerver indítása

```bash
hugo server -D
```

---

## Könyvtárstruktúra

```
your-site/
├── hugo.toml
├── content/
│   ├── posztok/
│   │   └── *.md
│   ├── podcast/
│   │   └── *.md
│   ├── filozofia/
│   │   └── *.md
│   ├── versek/
│   │   └── *.md
│   └── about/
│       └── _index.md
├── data/
│   └── certs.yaml          # Certifications adatok (opcionális)
├── static/
│   ├── fonts/              # IBM Plex fontok
│   ├── css/
│   │   └── fonts.css
│   ├── certs/
│   │   └── thumbs/         # Cert thumbnailek (opcionális)
│   └── audio/              # Podcast audio fájlok
└── themes/
    └── brtkcs/
```

---

## Content típusok

### Posztok (`content/posztok/`)

```yaml
---
title: "Poszt címe"
date: 2026-01-19
draft: false
tags: ["technológia", "gondolatok"]
summary: "Rövid összefoglaló"
callout: "Fontos megjegyzés a poszt végén"
---

A poszt tartalma...
```

### Podcast (`content/podcast/`)

```yaml
---
title: "001. Epizód címe"
date: 2026-01-19
draft: false
audioFile: "/audio/episode-001.mp3"
duration: "45:32"
description: "Epizód leírása"
showNotes: |
  - Témakör 1
  - Témakör 2
tags: ["tech", "kultúra"]
---
```

> **Fontos:** Audio fájlokat a `static/audio/` mappába tedd.

### Filozófia (`content/filozofia/`)

```yaml
---
title: "Esszé címe"
subtitle: "Alcím"
date: 2026-01-19
draft: false
tags: ["identitás", "ontológia"]
epigraph:
  text: "Idézet szövege"
  author: "Szerző neve"
references:
  - "Hivatkozás 1"
  - "Hivatkozás 2"
---
```

**Speciális funkciók:**
- `subtitle` - Alcím
- `epigraph` - Mottó idézet a cikk elején
- `references` - Hivatkozások lista a végén
- Drop cap - Első bekezdés első betűje automatikusan nagy

### Versek (`content/versek/`)

```yaml
---
title: "Vers címe"
date: 2026-01-19
draft: false
tags: ["természet"]
note: "Jegyzet a vershez"
---

Vers első sora,
Második sor itt jön,
Harmadik befejezi.
```

---

## Certifications galéria (opcionális)

Az About oldalon megjeleníthetsz certifikációkat galériában.

### 1. Adatfájl létrehozása

Hozd létre a `data/certs.yaml` fájlt:

```yaml
featured:
  - name: "Professional Certificate neve"
    institution: "Coursera"
    date: "Sep 2025"
    thumb: "Coursera_ABC123-1.jpg"

regular:
  - name: "Course neve"
    institution: "Educative"
    date: "Aug 2025"
    thumb: "edu_XYZ789-1.jpg"
```

### 2. Thumbnailek

Helyezd a képeket ide: `static/certs/thumbs/`

### 3. About oldal

Add hozzá az About layout-hoz:

```html
{{ partial "certs-gallery.html" . }}
```

---

## Színpaletta

| Szín | Hex | Használat |
|------|-----|-----------|
| Olajzöld | `#848B23` | Posztok, logo accent |
| Rozsdavörös | `#A8361B` | Podcast |
| Lila | `#31185A` | Filozófia |
| Bézs | `#D7D4CD` | Versek, háttér |
| Sötétbarna | `#433C22` | Szöveg |
| Közel-fekete | `#191202` | Dark mode háttér |

---

## Header viselkedés

- **Oldal tetején:** Transzparens háttér
- **Görgetéskor:** Blur háttér megjelenik
- **Lefelé görgetés:** Header eltűnik
- **Felfelé görgetés:** Header visszajön

---

## Testreszabás

### Színek módosítása

`assets/css/main.css` - `:root` szekció:

```css
:root {
  --color-olive: #848B23;
  --color-rust: #A8361B;
  --color-purple: #31185A;
  --color-beige: #D7D4CD;
}
```

### Logo módosítása

`layouts/partials/header.html`:

```html
<a href="/" class="site-logo">
  <span class="logo-name"><span class="logo-tilde">~</span><span class="logo-slash">/</span>brtkcs</span>
  <span class="logo-subtitle">werkstatt</span>
</a>
```

---

## GDPR megfelelőség

A theme alapértelmezetten:
- ✅ Lokális fontokat használ (nincs Google Fonts hívás)
- ✅ Nincs külső tracking
- ✅ Cookie notice beépítve

---

## Fejlesztés

```bash
# Theme módosítása
cd themes/brtkcs

# Hugo szerver live reload-dal
hugo server -D

# Build
hugo
```

---

## Licenc

MIT License

---

**Készítette:** BRTKCS  
**Verzió:** 1.1.0  
**Hugo minimum verzió:** 0.112.0
