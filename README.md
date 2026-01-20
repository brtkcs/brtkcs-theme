# BRTKCS Hugo Theme

Egyedi Hugo theme podcast, filozófia, versek és posztok kezeléséhez. Letisztult, modern dizájn meleg színpalettával és light/dark mode támogatással.

## Funkciók

✨ **Szekció-specifikus dizájn** - Minden tartalomtípusnak saját színvilága  
🎨 **Light/Dark mode** - Automatikus váltás támogatással  
📱 **Reszponzív** - Mobil-first megközelítés  
🎧 **Podcast player** - Beépített audio lejátszó  
📚 **Table of Contents** - Automatikus tartalomjegyzék hosszú cikkekhez  
🎯 **Monospace tipográfia** - Tiszta, olvasható betűtípusok  

## Telepítés

```bash
cd your-hugo-site
git clone https://github.com/yourusername/brtkcs-theme themes/brtkcs
```

Vagy git submodule-ként:

```bash
git submodule add https://github.com/yourusername/brtkcs-theme themes/brtkcs
```

## Konfiguráció

Másold át a `hugo.toml` példát a site gyökérkönyvtárába és módosítsd az értékeket:

```toml
baseURL = "https://brtkcs.com/"
languageCode = "hu"
title = "BRTKCS"
theme = "brtkcs"

[params]
  description = "Filozófia, versek, gondolatok és podcast"
  author = "BRTKCS"
  
  [params.social]
    github = "https://github.com/yourhandle"
    bluesky = "https://bsky.app/profile/yourhandle.bsky.social"
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

## Könyvtárstruktúra

```
themes/brtkcs/
├── layouts/
│   ├── index.html               # Főoldal
│   ├── _default/
│   │   ├── baseof.html          # Alap template
│   │   ├── single.html          # Általános single
│   │   └── list.html            # Lista nézet
│   ├── partials/
│   │   ├── head.html
│   │   ├── header.html          # Top navbar
│   │   ├── footer.html
│   │   ├── toc.html             # Table of contents
│   │   └── podcast-player.html  # Audio player
│   ├── posztok/
│   │   └── single.html
│   ├── podcast/
│   │   └── single.html
│   ├── filozofia/
│   │   └── single.html
│   └── versek/
│       └── single.html
└── assets/
    └── css/
        └── main.css
```

## Content struktúra

```
content/
├── posztok/
│   └── elso-poszt.md
├── podcast/
│   └── 001-epizod.md
├── filozofia/
│   └── gondolat.md
├── versek/
│   └── vers.md
└── about.md
```

## Front Matter Példák

### Poszt (posztok/)

```yaml
---
title: "Poszt címe"
date: 2026-01-19
draft: false
tags: ["technológia", "gondolatok"]
summary: "Rövid összefoglaló a posztról"
callout: "Fontos megjegyzés a poszt végén"
---

A poszt tartalma...
```

### Podcast (podcast/)

```yaml
---
title: "001. Epizód - A kezdet"
date: 2026-01-19
draft: false
audioFile: "/audio/episode-001.mp3"
duration: "45:32"
description: "Első epizód leírása, amiről beszélgetünk"
showNotes: |
  - Témakör 1: Bevezetés
  - Témakör 2: Részletes beszélgetés
  - Témakör 3: Összefoglalás
tags: ["tech", "kultúra"]
---

További részletek az epizódról...
```

**Megjegyzés:** Az audio fájlokat a `static/audio/` mappába tedd.

### Filozófia (filozofia/)

```yaml
---
title: "Az identitás kérdése"
subtitle: "Gondolatok az énről és a valóságról"
date: 2026-01-19
draft: false
tags: ["identitás", "ontológia"]
epigraph:
  text: "Gondolkodom, tehát vagyok."
  author: "René Descartes"
references:
  - "Descartes, R. (1641). Elmélkedések az első filozófiáról"
  - "Hume, D. (1739). Értekezés az emberi természetről"
---

A filozófiai esszé tartalma...
```

**Speciális funkciók:**
- `subtitle`: Alcím az esszéhez
- `epigraph`: Mottó idézet a cikk elején
- `references`: Hivatkozások lista a végén
- Első bekezdés első betűje automatikusan nagy (drop cap)

### Versek (versek/)

```yaml
---
title: "Vers címe"
date: 2026-01-19
draft: false
tags: ["természet", "öngondolat"]
note: "Jegyzet vagy megjegyzés a vershez"
---

Ha pusztít a gyenge,
Rohan arccal hátra,
Megágyazott nyomorúságba,
Válaszra méltatva, a csodát!
```

**Tipp:** A versek formázásánál használj dupla sortörést (`<br><br>`) a versszakok között.

## Színpaletta

A theme az alábbi színeket használja:

| Szín | Hex | Használat |
|------|-----|-----------|
| Bézs | `#D7D4CD` | Versek accent, háttér |
| Olajzöld | `#848B23` | Posztok accent |
| Rozsdavörös | `#A8361B` | Podcast accent |
| Sötétbarna | `#433C22` | Szöveg, határok |
| Lila | `#31185A` | Filozófia accent |
| Közel-fekete | `#191202` | Dark mode háttér |

## Speciális Funkciók

### Table of Contents (TOC)

Automatikusan megjelenik 400 szónál hosszabb cikkeknél a sidebar-ban. Aktív szekció kiemelés scroll közben.

### Podcast Player

Beépített audio player kontrollokkal:
- Play/Pause
- Progress bar (kereshető)
- Időkijelzés
- Hangerő szabályozás
- Mute/Unmute

### Dark/Light Mode

Automatikus váltás a header jobb felső sarkában. A választás `localStorage`-ban tárolódik.

### Reszponzív Design

- Desktop: Teljes navbar + TOC sidebar
- Tablet: Collapse TOC
- Mobile: Wrap navbar, stack elemek

## Customizálás

### Színek módosítása

A `assets/css/main.css` fájlban a `:root` szekcióban:

```css
:root {
  --color-olive: #848B23;  /* Változtasd tetszés szerint */
  --color-rust: #A8361B;
  /* ... */
}
```

### Betűtípusok

A `layouts/partials/head.html`-ben módosítsd a Google Fonts linket:

```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```

Majd a CSS-ben:

```css
:root {
  --font-mono: 'Your Font', monospace;
}
```

## Fejlesztés

```bash
# Theme fejlesztése
cd themes/brtkcs
# Módosítsd a fájlokat

# Hugo szerver indítása
hugo server -D
```

## Licenc

MIT License - Használd szabadon, módosítsd kedvedre!

## Támogatás

Ha problémád van vagy kérdésed, nyiss egy issue-t a GitHub repo-ban.

---

**Készítette:** BRTKCS  
**Verzió:** 1.0.0  
**Hugo minimum verzió:** 0.112.0
