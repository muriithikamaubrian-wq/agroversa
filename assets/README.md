# Assets

Where logos, icons and pictures live.

| Folder | Put here |
|---|---|
| `logo/` | `agroversa-mark.svg` (round mark), `agroversa-logo.svg` (dark text), `agroversa-logo-light.svg` (for dark backgrounds) |
| `icons/ui/` | Interface line icons (plus, trash, edit, chevron, bell, tick, home, box, flask, pulse, bars, gear, refresh) |
| `icons/species/` | Simple species icons (egg, paw, fish, wheat, leaf, drop) |
| `avatars/species/` | Default species avatars. Users can pick their own from their device |
| `avatars/groups/` | Default flock / herd avatars |
| `images/backgrounds/` | Login landscape and other backgrounds |
| `fonts/` | Self-hosted Schibsted Grotesk so the app looks the same offline |

Rules: SVG for logos and icons (they take the text colour through `currentColor`), JPEG or WebP under 200 KB for pictures, lowercase names with hyphens.
App icons for Windows and Android are generated from `logo/agroversa-mark.svg`:

    npx tauri icon assets/logo/agroversa-mark.svg
