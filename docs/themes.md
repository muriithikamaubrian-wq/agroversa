# AgroVersa Theme System

AgroVersa uses a **5-layer contrast system** with **three colour palettes**, each having **light and dark** variants. Users switch palettes and themes from Settings.

## How it works

All colours are CSS custom properties defined in `apps/desktop/src/styles/themes.css`. The active palette is controlled by `data-palette` on `<html>`, and light/dark mode by `data-theme`.

```html
<html data-palette="forest" data-theme="dark">
```

When `data-theme` is unset, the app follows the device's `prefers-color-scheme`.

## The 5-layer contrast system

Each palette assigns a distinct colour to every visual layer so they never blend:

| Layer | Token | Purpose |
|-------|-------|---------|
| Background | `--bg` | App background — the space between panels |
| Sidebar | `--sd` | Navigation surface, distinctly separate from content |
| Card | `--sf` | Primary containers, visibly lifted from background |
| Elevated | `--sf2` | Modals, secondary containers — lifted above cards |
| Hover/Selected | `--hover` | Active nav, selected items, hover surfaces |

## Text hierarchy

| Role | Token | Forest Dark | Purpose |
|------|-------|-------------|---------|
| Primary | `--ink` | `#F1F5F2` | Headings, KPIs, important numbers |
| Secondary | `--ink2` | `#C6D2C9` | Card titles, table headers, descriptions |
| Muted | `--mut` | `#93A79A` | Timestamps, hints, inactive icons |
| Placeholder | `--ph` | `#93A79A` | Input placeholder text |

## Border tokens

| Token | Forest Dark | Purpose |
|-------|-------------|---------|
| `--bd` | `#34463A` | Normal card border |
| `--bd2` | `#405746` | Elevated card / modal border |
| `--bdh` | `#42594A` | Hover card border |
| `--bdin` | `#3B4C40` | Input field border |
| `--ln` | `#2A3A30` | Table dividers, section lines, chart grid |

## Input tokens

| Token | Forest Dark | Purpose |
|-------|-------------|---------|
| `--inbg` | `#18231C` | Input background (darker than card = recessed) |
| `--ph` | `#93A79A` | Placeholder text |
| `--ac` | `#72C493` | Focus border + focus ring (25% opacity) |

## Navigation tokens

| Token | Forest Dark | Purpose |
|-------|-------------|---------|
| `--sd` | `#18231C` | Sidebar background |
| `--sdi` | `#C6D2C9` | Inactive nav text/icons |
| `--navon` | `#3D5745` | Active nav item background |
| `--ac` | `#72C493` | Active nav indicator (left bar) |

## The three palettes

### 1. Forest Elegant 2.0 (default)

Refined dark green with deliberate 5-layer separation.

| Token | Light | Dark |
|-------|-------|------|
| `--bg` | `#eef1ea` | `#101713` |
| `--sd` | `#24402d` | `#18231C` |
| `--sf` | `#ffffff` | `#202E25` |
| `--sf2` | `#f7f9f5` | `#29392E` |
| `--hover` | `#e8efe5` | `#3D5745` |
| `--ink` | `#1f2a20` | `#F1F5F2` |
| `--ink2` | `#4a5c50` | `#C6D2C9` |
| `--mut` | `#7a8b7e` | `#93A79A` |
| `--ac` | `#2d6a43` | `#72C493` |
| `--wh` | `#a87a14` | `#E3B65A` |
| `--bad` | `#b3392f` | `#E77878` |
| `--bd` | `#d7ddcf` | `#34463A` |
| `--bdin` | `#c4cdb8` | `#3B4C40` |
| `--inbg` | `#f7f9f5` | `#18231C` |

### 2. Natural Studio

Warm earth & cream with the same 5-layer separation.

| Token | Light | Dark |
|-------|-------|------|
| `--bg` | `#F5F2E8` | `#1E1A15` |
| `--sd` | `#66794E` | `#2A241D` |
| `--sf` | `#ffffff` | `#332D24` |
| `--sf2` | `#FAF8F2` | `#3D362B` |
| `--hover` | `#EDF0E5` | `#4D4536` |
| `--ink` | `#443C31` | `#F0EBDF` |
| `--ink2` | `#6B5D4E` | `#C9C0AE` |
| `--mut` | `#8A7F6E` | `#968B78` |
| `--ac` | `#66794E` | `#B1B986` |

### 3. Precision Tech

Clean modern analytics with navy/teal layering.

| Token | Light | Dark |
|-------|-------|------|
| `--bg` | `#F7F9FC` | `#0F1822` |
| `--sd` | `#172B40` | `#0A1018` |
| `--sf` | `#ffffff` | `#1A2530` |
| `--sf2` | `#F0F4F8` | `#243140` |
| `--hover` | `#E6EEF5` | `#2E4055` |
| `--ink` | `#172B40` | `#E6EBF2` |
| `--ink2` | `#3D5068` | `#B0C0D0` |
| `--mut` | `#6B7B92` | `#7A8BA0` |
| `--ac` | `#1F8F91` | `#68C6A0` |

## Typography

Font: **Inter** (400, 500, 600, 700) loaded via Google Fonts.

| Element | Weight | PC | Mobile |
|---------|--------|-----|--------|
| `h2` (page heading) | 700 | 26px | 28px |
| `h3` (card title) | 600 | 17px | 17px |
| `.kpi` (large numbers) | 700 | 28px | 26px |
| `button` | 600 | inherit | inherit |
| `th` (table header) | 500 | — | — |
| Body | 400 | 15px | 15px |

## Spacing

| Element | Value |
|---------|-------|
| Card border radius | 14px |
| Card padding | 18px |
| Card margin-bottom | 16px |
| Grid gap (between cards) | 15px |
| Card border thickness | 1px |
| Modal border radius | 14px |
| Modal padding | 20px |

## Switching palettes in code

```javascript
setPalette('forest');    // Forest Elegant (default, clears key)
setPalette('natural');   // Natural Studio
setPalette('precision'); // Precision Tech

setTheme('dark');  // Force dark
setTheme('light'); // Force light
setTheme('');       // Match device
```

## Adding a new palette

1. Add a new block in `themes.css` with all tokens:
```css
:root[data-palette="mytheme"]{--bg:#...;--sf:#...;--sf2:#...;--hover:#...;
  --ink:#...;--ink2:#...;--mut:#...;--ph:#...;
  --ln:#...;--bd:#...;--bd2:#...;--bdh:#...;--bdin:#...;--inbg:#...;
  --sd:#...;--sdi:#...;--navon:#...;--ac:#...;--wh:#...;--bad:#...;
  --cof:#5a3d2b;--bl:#...;--sdgb:rgba(...)}
```
2. Add dark mode blocks (`@media` + `[data-theme=dark]`).
3. Add an `<option>` in `settings.js` inside the palette `<select>`.
4. Document the palette here.
