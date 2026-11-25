# AgroVersa Theme System

AgroVersa supports **three colour palettes**, each with **light and dark** variants. Users can switch palettes and themes from Settings.

## How it works

All colours are CSS custom properties defined in `apps/desktop/src/styles/themes.css`. The active palette is controlled by the `data-palette` attribute on `<html>`, and light/dark mode by `data-theme`.

```
<html data-palette="forest" data-theme="dark">
```

When `data-theme` is unset, the app follows the device's `prefers-color-scheme`.

## The three palettes

### 1. Forest Elegant (default)

Refined dark green — your original direction, polished.

| Token | Light | Dark |
|-------|-------|------|
| `--bg` | `#eef1ea` | `#101A14` |
| `--sf` (surface) | `#fff` | `#192820` |
| `--ink` (text) | `#1f2a20` | `#E5EEE7` |
| `--sd` (sidebar) | `#24402d` | `#0D140F` |
| `--ac` (accent) | `#2d6a43` | `#61BD88` |
| `--wh` (warning) | `#a87a14` | `#e0b04a` |
| `--bad` (error) | `#b3392f` | `#e5766c` |
| `--bl` (info) | `#2563a8` | `#6aa8e8` |

**Best for:** A professional, premium-looking AgroVersa that feels like an agricultural technology platform.

### 2. Natural Studio

Warm earth & cream — softer, calmer, more natural.

| Token | Light | Dark |
|-------|-------|------|
| `--bg` | `#F5F2E8` | `#2A2520` |
| `--sf` (surface) | `#fff` | `#3A332B` |
| `--ink` (text) | `#443C31` | `#F0EBDF` |
| `--sd` (sidebar) | `#66794E` | `#1F1B16` |
| `--ac` (accent) | `#66794E` | `#B1B986` |
| `--wh` (warning) | `#B8902E` | `#D4A84E` |
| `--bad` (error) | `#A04539` | `#D67060` |
| `--bl` (info) | `#4A6B8A` | `#7BA0C0` |

**Best for:** A welcoming, easy-to-read app for farm managers working in bright outdoor conditions.

### 3. Precision Tech

Clean modern analytics — technical, data-driven.

| Token | Light | Dark |
|-------|-------|------|
| `--bg` | `#F7F9FC` | `#0F1822` |
| `--sf` (surface) | `#fff` | `#1A2530` |
| `--ink` (text) | `#172B40` | `#E6EBF2` |
| `--sd` (sidebar) | `#172B40` | `#0A1018` |
| `--ac` (accent) | `#1F8F91` | `#68C6A0` |
| `--wh` (warning) | `#E8A93C` | `#F0BC60` |
| `--bad` (error) | `#D14545` | `#E57670` |
| `--bl` (info) | `#2563A8` | `#6AA8E8` |

**Best for:** Feed formulation, nutrient analysis, precision calculations and productivity reporting.

## CSS tokens reference

| Token | Purpose |
|-------|---------|
| `--bg` | Page background |
| `--sf` | Card / surface background |
| `--ink` | Primary text colour |
| `--mut` | Muted / secondary text |
| `--ln` | Borders and dividers |
| `--sd` | Sidebar background |
| `--sdi` | Sidebar icon / text colour |
| `--ac` | Accent (buttons, active states, links) |
| `--wh` | Warning / amber |
| `--bad` | Error / danger |
| `--cof` | Coffee / brown (auth buttons) |
| `--bl` | Blue / info |
| `--sdgb` | Mobile nav glass background (rgba) |

## Switching palettes in code

```javascript
// Set palette (stored in localStorage as 'av_palette')
setPalette('natural');   // Natural Studio
setPalette('precision'); // Precision Tech
setPalette('forest');    // Forest Elegant (clears the key)

// Set light/dark mode (stored as 'av_theme')
setTheme('dark');
setTheme('light');
setTheme('');             // Match device
```

## Adding a new palette

1. Add a new block in `themes.css`:
```css
:root[data-palette="mytheme"]{--bg:#...;--sf:#...;...}
@media(prefers-color-scheme:dark){:root[data-palette="mytheme"]:not([data-theme=light]){--bg:#...;...}}
:root[data-palette="mytheme"][data-theme=dark]{--bg:#...;...}
```
2. Add an `<option>` in `settings.js` inside the palette `<select>`.
3. Document the palette in this file.
