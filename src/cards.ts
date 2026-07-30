export type CardData = {
  id: string
  kind: 'intro' | 'project'
  dx: number
  dy: number
  rot: number
  tab: string
  name?: string
  tagline?: string
  pitch?: string
  links?: { label: string; href: string }[]
  heading?: string
  subtitle?: string
  stack?: string
  role?: string
  period?: string
  bullets?: string[]
  metric?: string
  href?: string
}

export const cards: CardData[] = [
  {
    id: 'intro',
    kind: 'intro',
    dx: 0,
    dy: 0,
    rot: -1.5,
    tab: 'me',
    name: 'Fyke Simon V. Tonel',
    tagline: 'Solo Developer — Moss',
    pitch:
      'Systems & mobile engineer. I write Rust DSP, ship Flutter apps, and build the backend too — making slow things fast and fragile things hold.',
    links: [
      { label: 'github.com/ultraelectronica', href: 'https://github.com/ultraelectronica' },
      { label: 'fyketonel22@protonmail.com', href: 'mailto:fyketonel22@protonmail.com' },
      { label: 'fykelabs.vercel.app', href: 'https://fykelabs.vercel.app' },
    ],
  },
  {
    id: 'flick',
    kind: 'project',
    dx: 6,
    dy: -5,
    rot: 1.8,
    tab: 'Flick',
    heading: 'Flick',
    subtitle: 'Music Player with Custom UAC 2.0',
    stack: 'Flutter · Dart · Rust · Kotlin',
    role: 'Lead Developer — Maintainer',
    period: 'Jan 2026 – Present',
    bullets: [
      'Four Rust audio engines for direct USB output, bypassing the Android audio pipeline entirely.',
      'Hybrid differential library scanner (MediaStore + Rust + fingerprint cache): scan time from ~11s to 85–328ms — up to 34× faster across 1,000+ tracks.',
    ],
    metric: '3,000+ installs',
    links: [
      { label: 'GitHub', href: 'https://github.com/moss-apps/Flick' },
      { label: 'Play Store', href: 'https://play.google.com/store/apps/details?id=com.mossapps.flick' },
    ],
  },
  {
    id: 'latch',
    kind: 'project',
    dx: -7,
    dy: 4,
    rot: -2.4,
    tab: 'Latch',
    heading: 'Latch',
    subtitle: 'Secure Private Media Vault',
    stack: 'Flutter · Dart · Kotlin',
    role: 'Lead Developer — Maintainer',
    period: 'Nov 2025 – Present',
    bullets: [
      'AES-256-GCM/CTR dual-engine encryption with PBKDF2 + Argon2id key derivation.',
      'Multi-tier auth: PIN, password, biometrics, and a Decoy Mode. Hands secure audio off straight to Flick\'s engine.',
    ],
    metric: '200+ installs',
    links: [
      { label: 'GitHub', href: 'https://github.com/moss-apps/Latch' },
      { label: 'Play Store', href: 'https://play.google.com/store/apps/details?id=com.mossapps.locker' },
    ],
  },
  {
    id: 'br41ndmg',
    kind: 'project',
    dx: 5,
    dy: 6,
    rot: 2.1,
    tab: 'br41ndmg',
    heading: 'br41ndmg',
    subtitle: 'High-Fidelity Audio Resampling',
    stack: 'Rust · DSP',
    role: 'Lead Developer — Maintainer',
    period: 'Jan 2026 – Present',
    bullets: [
      'Polyphase sinc-based resampling for accurate sample-rate conversion; configurable FIR filters (Hann, Hamming, Blackman, Kaiser).',
      '>100 dB stopband attenuation and <0.1 dB passband ripple — validated with impulse, sine, and sweep tests under Criterion benches.',
    ],
    metric: '70+ installs',
    links: [
      { label: 'GitHub', href: 'https://github.com/ultraelectronica/br41ndmg' },
      { label: 'crates.io', href: 'https://crates.io/crates/br41ndmg' },
      { label: 'crates.io (cli)', href: 'https://crates.io/crates/br41ndmg-cli' },
    ],
  },
  {
    id: 'shellist',
    kind: 'project',
    dx: -6,
    dy: 5,
    rot: -2.2,
    tab: 'shellist',
    heading: 'shellist',
    subtitle: 'Shell-History Frequency Analyzer',
    stack: 'Rust',
    role: 'Lead Developer — Maintainer',
    bullets: [
      'Parses bash, zsh, and fish history, counts commands, and ranks them by frequency — shipped as both a CLI and a Rust library.',
      'CLI offers bars/percent output, JSON/CSV export, regex filters, date-range trends, and shell completions; the library exposes the full analyze → parse → count → rank → filter pipeline.',
    ],
    links: [
      { label: 'crates.io', href: 'https://crates.io/crates/shellist' },
      { label: 'GitHub', href: 'https://github.com/ultraelectronica/shellist' },
    ],
  },
  {
    id: 'pasada',
    kind: 'project',
    dx: -6,
    dy: -4,
    rot: -1.9,
    tab: 'Pasada',
    heading: 'Pasada',
    subtitle: 'Ride-Hailing & Fleet Ecosystem',
    stack: 'Flutter · TypeScript · React · Supabase · GCP',
    role: 'Lead Full-Stack Developer',
    period: 'Dec 2024 – Nov 2025',
    bullets: [
      'Four apps (Passenger, Driver, Admin, Web) unified by shared auth, RBAC, and a 7-day demand-forecast pipeline.',
      'Gemini turns live + predicted data into actionable summaries. Live-tested with real drivers on the road.',
    ],
    metric: '132 passengers · 32 drivers live',
  },
  {
    id: 'mochi',
    kind: 'project',
    dx: 7,
    dy: 3,
    rot: 2.6,
    tab: 'Mochi',
    heading: 'Mochi',
    subtitle: 'Family-Shared AI Companion',
    stack: 'Flutter · Node.js · llama.cpp · Gemini',
    role: 'Lead Developer',
    period: 'Apr 2026',
    bullets: [
      'Multi-user AI with persistent memory, mood tracking, and relationship-state modeling.',
      'Hybrid inference: local LLM (llama.cpp) with cloud fallback (Gemini), running on Termux + Cloudflare Tunnel for always-on availability.',
    ],
  },
  {
    id: 'lootbx',
    kind: 'project',
    dx: -5,
    dy: 5,
    rot: -2.8,
    tab: 'LootBX',
    heading: 'LootBX Mobile',
    subtitle: 'Real-Time Streaming & Rewards',
    stack: 'React Native · Expo · TypeScript · MongoDB',
    role: 'Full-Stack Developer',
    period: 'Feb 2026',
    bullets: [
      'API integrations powering real-time data flow on a streaming + interactive-rewards platform.',
      'State-management work during the web → unified-mobile migration; contributed to a low-latency full-stack system.',
    ],
  },
  {
    id: 'papaburger',
    kind: 'project',
    dx: 6,
    dy: -3,
    rot: 1.4,
    tab: 'Papa Burger',
    heading: 'Papa Burger',
    subtitle: 'Multi-Platform Restaurant Ops',
    stack: 'React · PHP · PostgreSQL · Next.js · Flutter',
    role: 'Full-Stack Developer',
    period: 'Feb – Mar 2026',
    bullets: [
      'Frontend architecture spanning POS, a driver portal, and a franchising interface.',
      'Reusable components + state management; backend APIs for orders, transactions, and operational workflows.',
    ],
  },
]

export const byId: Record<string, CardData> = Object.fromEntries(cards.map((c) => [c.id, c]))
