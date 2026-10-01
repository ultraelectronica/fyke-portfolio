# Fyke / Portfolio V3

A single-page portfolio with a diagonal dot intro, an overlapping perspective-tile gallery of nine projects, in-place details, and an audio-reactive ECG. Built with React, TypeScript, Vite, Tailwind, and Motion. Fonts are self-hosted Geist and IBM Plex Mono.

## Development

```sh
pnpm install
pnpm dev
```

```sh
pnpm typecheck
pnpm build
pnpm preview
```

## Editing the portfolio

- Project content, links, artwork paths, and ordering: `src/data/projects.ts`.
- Identity, contact links, and personal descriptors: `src/App.tsx`.
- Styling and responsive layouts: `src/index.css`.
- Track configuration: `src/hooks/useAudioVisualizer.ts`. The local Pendulum track is loaded only when the visitor opts into sound, at 30% volume.
- CV and resume: the two PDFs in `public/`.

Scroll over the project tiles with a mouse wheel or trackpad, or drag the gallery on desktop and touch screens. The overlapping tiles fill the desktop viewport, travel diagonally, and loop through all nine projects. Hover a tile to pull it sideways and in front of its neighbors. Arrow buttons, keyboard arrows, and the project list also navigate.

Tile and spacing sizes are viewport-proportional, so browser zoom (Ctrl + and Ctrl -) scales interface text while the gallery artwork keeps a stable size.

Select a tile or “Project details” to animate its artwork into an accessible native dialog; Escape or the close button animates it back. Entry can be silent, and sound can be toggled afterward. Reduced-motion visitors get immediate hover reveals, navigation, and details transitions plus a static ECG; canvas rendering stops in hidden tabs.

## Artwork

The page uses optimized WebP artwork for Pasada, Papa Burger, LootBX, and Mochi; the supplied originals are retained. Flick, Latch, and Norn use SVG artwork.

| Project | Source | Display format |
| --- | --- | --- |
| Flick | [Flick repository](https://github.com/moss-apps/Flick/blob/HEAD/assets/icons/flicklogo_svg.svg) | Original vector |
| Latch | [Latch repository](https://github.com/moss-apps/Latch/blob/HEAD/assets/reverse_locker_logo_nobg.svg) | Original vector |
| Pasada | Supplied `pasadaicon.png` | Optimized WebP |
| Papa Burger | Supplied `papaburger.png` | Optimized WebP |
| LootBX | Supplied `lootbxlogo.svg` with embedded PNG | Optimized WebP |
| Mochi | Supplied `public/projects/mochi.png` | Optimized WebP |
| Norn | Supplied `public/projects/norn.svg` | Original vector |

br41ndmg and shellist currently have labeled artwork slots. Add artwork to `public/projects/`, then set the project’s `image` path and `imageShape` (`mark`, `square`, or `wide`) in `src/data/projects.ts`. Failed images also fall back to a readable project name.

The old paper-card implementation, paper textures, duplicate root PDFs, and handwriting fonts have been removed.

## Contact

- Email: fyketonel22@protonmail.com
- GitHub: [@ultraelectronica](https://github.com/ultraelectronica)
