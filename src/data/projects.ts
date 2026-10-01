export type Project = {
  id: string
  name: string
  subtitle: string
  stack: string
  role?: string
  status?: string
  period?: string
  metric?: string
  image?: string
  imageShape?: 'mark' | 'square' | 'wide'
  bullets: string[]
  links?: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    id: 'flick',
    name: 'Flick',
    subtitle: 'Music, straight to the hardware.',
    stack: 'Flutter · Dart · Rust · Kotlin',
    role: 'Lead developer & maintainer',
    period: 'Jan 2026 – Present',
    image: '/projects/flick.svg',
    imageShape: 'mark',
    metric: '3,000+ installs',
    bullets: [
      'Four Rust audio engines for direct USB output, bypassing the Android audio pipeline entirely.',
      'A hybrid differential library scanner combines MediaStore, Rust, and a fingerprint cache. Scan time went from around 11 seconds to 85–328 milliseconds, up to 34× faster across 1,000+ tracks.',
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/moss-apps/Flick' },
      { label: 'Play Store', href: 'https://play.google.com/store/apps/details?id=com.mossapps.flick' },
    ],
  },
  {
    id: 'latch',
    name: 'Latch',
    subtitle: 'A private place for private media.',
    stack: 'Flutter · Dart · Kotlin',
    role: 'Lead developer & maintainer',
    period: 'Nov 2025 – Present',
    image: '/projects/latch.svg',
    imageShape: 'mark',
    metric: '200+ installs',
    bullets: [
      'AES-256-GCM/CTR dual-engine encryption with PBKDF2 and Argon2id key derivation.',
      'Multi-tier authentication with PIN, password, biometrics, and a Decoy Mode. Secure audio goes straight to Flick’s engine.',
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/moss-apps/Latch' },
      { label: 'Play Store', href: 'https://play.google.com/store/apps/details?id=com.mossapps.locker' },
    ],
  },
  {
    id: 'norn',
    name: 'Norn',
    subtitle: 'An offline-first Android client for Norn.',
    stack: 'Android · Norn-Skuld · Hugging Face',
    status: 'Coming soon',
    image: '/projects/norn.svg',
    imageShape: 'mark',
    bullets: [
      'norn-local runs on the phone with no backend, account, or cloud bill.',
      'Norn-Skuld installs from Hugging Face and runs locally. Its Edge0-style mixture-of-experts weights stream from flash storage with a small resident set, bringing a large model to a normal device.',
      'Bring your own key (BYOK) remains an escape hatch for cloud models.',
    ],
  },
  {
    id: 'br41ndmg',
    name: 'br41ndmg',
    subtitle: 'High-fidelity audio resampling.',
    stack: 'Rust · DSP',
    role: 'Lead developer & maintainer',
    period: 'Jan 2026 – Present',
    metric: '70+ installs',
    bullets: [
      'Polyphase sinc-based resampling for accurate sample-rate conversion, with configurable Hann, Hamming, Blackman, and Kaiser FIR filters.',
      'More than 100 dB stopband attenuation and less than 0.1 dB passband ripple, validated with impulse, sine, and sweep tests under Criterion benchmarks.',
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/ultraelectronica/br41ndmg' },
      { label: 'crates.io', href: 'https://crates.io/crates/br41ndmg' },
      { label: 'CLI crate', href: 'https://crates.io/crates/br41ndmg-cli' },
    ],
  },
  {
    id: 'shellist',
    name: 'shellist',
    subtitle: 'Your shell history, understood.',
    stack: 'Rust',
    role: 'Lead developer & maintainer',
    bullets: [
      'Parses bash, zsh, and fish history, counts commands, and ranks them by frequency. Shipped as both a CLI and a Rust library.',
      'The CLI supports bars and percentages, JSON/CSV export, regex filters, date-range trends, and shell completions. The library exposes the full analysis pipeline.',
    ],
    links: [
      { label: 'GitHub', href: 'https://github.com/ultraelectronica/shellist' },
      { label: 'crates.io', href: 'https://crates.io/crates/shellist' },
    ],
  },
  {
    id: 'pasada',
    name: 'Pasada',
    subtitle: 'Ride-hailing. The whole ecosystem.',
    stack: 'Flutter · TypeScript · React · Supabase · GCP',
    role: 'Lead full-stack developer',
    period: 'Dec 2024 – Nov 2025',
    image: '/projects/pasada.webp',
    imageShape: 'square',
    metric: '132 passengers · 32 drivers live',
    bullets: [
      'Four apps for passengers, drivers, administrators, and the web, unified by shared authentication, role-based access control, and a seven-day demand-forecast pipeline.',
      'Gemini turns live and predicted data into actionable summaries. Live-tested with real drivers on the road.',
    ],
  },
  {
    id: 'mochi',
    name: 'Mochi',
    subtitle: 'An AI companion for the family.',
    stack: 'Flutter · Node.js · llama.cpp · Gemini',
    role: 'Lead developer',
    period: 'Apr 2026',
    image: '/projects/mochi.webp',
    imageShape: 'square',
    bullets: [
      'Multi-user AI with persistent memory, mood tracking, and relationship-state modeling.',
      'Hybrid inference combines a local LLM through llama.cpp with a Gemini cloud fallback. Runs on Termux and Cloudflare Tunnel for always-on availability.',
    ],
  },
  {
    id: 'lootbx',
    name: 'LootBX Mobile',
    subtitle: 'Live streaming meets interactive rewards.',
    stack: 'React Native · Expo · TypeScript · MongoDB',
    role: 'Full-stack developer',
    period: 'Feb 2026',
    image: '/projects/lootbx.webp',
    imageShape: 'wide',
    bullets: [
      'API integrations powering real-time data flow on a streaming and interactive-rewards platform.',
      'State-management work during the migration from web to unified mobile, contributing to a low-latency full-stack system.',
    ],
  },
  {
    id: 'papaburger',
    name: 'Papa Burger',
    subtitle: 'Restaurant operations, connected.',
    stack: 'React · PHP · PostgreSQL · Next.js · Flutter',
    role: 'Full-stack developer',
    period: 'Feb – Mar 2026',
    image: '/projects/papaburger.webp',
    imageShape: 'square',
    bullets: [
      'Frontend architecture spanning point of sale, a driver portal, and a franchising interface.',
      'Reusable components and state management, with backend APIs for orders, transactions, and operational workflows.',
    ],
  },
]

export const formatIndex = (index: number) => String(index + 1).padStart(2, '0')
