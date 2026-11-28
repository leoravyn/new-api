# TOKEX Design System (`DESIGN.md`)

> **Brand**: TOKEX (`https://tokex.vip`)  
> **Visual Aesthetic**: **Deep Obsidian + Brushed Platinum + Frosted Liquid Glass** — pure neutral obsidian canvas (`#050506` outer shell → `#08080A` workspace → `rgba(14, 14, 17, 0.56)` frosted cards → `#141418` / `#19191E` inset/secondary), neutral silver ambient light planes (`AmbientBackdrop`), ultra-fine film-grain texture (`feTurbulence`, `0.014` opacity), brushed-platinum metallic primary CTAs (`#FAFAFA` → `#EBEBEF` → `#D6D6DB` with `#08080A` ink), `1px` `rgba(255, 255, 255, 0.08)` neutral hairlines, moderate-chroma mineral semantics/charts, and tabular financial typography.  
> **Target Use**: Design language and token specification for the TOKEX web application, public marketing shell, and authenticated console UI.

---

## 1. Design Principles & Design Language

1. **Neutral Obsidian & Platinum Hierarchy (Zero Blue Cast)**: Every structural surface, glass tint, border, ambient glow, hover state, and focus ring stays strictly achromatic obsidian/platinum (`#050506` outer shell & sidebar → `#08080A` canvas → `#0E0E11` / `rgba(14, 14, 17, 0.56)` primary surfaces → `#141418` muted → `#19191E` secondary).
2. **Tactile Frosted Glass + Ambient Depth**: Background light planes, hairline arcs, and dot matrices (`AmbientBackdrop`) sit behind translucent obsidian surfaces (`backdrop-filter: blur(12px) saturate(130%)`) with subtle cursor-reactive border illumination (`--lg-o`, `--lg-x`, `--lg-y`), `inset 0 1px 0 0 rgba(255, 255, 255, 0.055–0.06)` top specular rims, monochrome film-grain (`opacity: 0.014`), and restrained top studio light (`rgba(255, 255, 255, 0.022)`).
3. **Opaque Functional Table Chrome**: While card shells remain frosted, interactive data-table chrome is opaque so scrolling rows and horizontally pinned columns never bleed through: `--table-header: #121215` (sticky `z-20`) and pinned cells `#0B0B0E` (without stacked double `backdrop-blur`).
4. **Restrained Mineral Semantics**: Badges, charts, and alerts use calibrated moderate-chroma accents — emerald jade (`oklch(0.73 0.115 162)`), warm amber (`oklch(0.79 0.125 78)`), coral red (`oklch(0.67 0.165 24)`), and steel blue (`oklch(0.76 0.085 245)`) — preserving focus on monochrome hierarchy.
5. **Financial Precision (`tabular-nums`)**: All USD pricing, token quotas, table figures, and counters enforce `font-variant-numeric: tabular-nums`.

---

## 2. Color Palette & Design Tokens

### Background & Surface Hierarchy (Dark Mode)
| Token / Surface | Value | Usage |
|---|---|---|
| `--sidebar` | `#050506` | Outer app shell, sidebar base (`body:has([data-variant='inset'])` uses `#050507`) |
| `--background` | `#08080A` | Public page & console canvas base |
| Studio light (`html.dark body`) | `radial-gradient(960px circle at 50% -14%, rgba(255, 255, 255, 0.022), transparent 62%)` | Subtle top-center studio highlight on non-inset dark pages |
| Film grain (`html.dark body::after`) | Inline SVG `feTurbulence` (`saturate=0`, `opacity: 0.014`, `fixed`) | Monochrome surface texture |
| `--card` / `--popover` | `#0E0E11` | Solid card / modal / popover base token |
| Liquid Card / Console Panel (`.tokex-liquid-card`, `.tokex-console-panel`, `[data-slot='card']`, `[data-slot='sidebar-inner']`) | `rgba(14, 14, 17, 0.56)` + `blur(12px) saturate(130%)` | Primary frosted glass containers; hover lifts to `rgba(20, 20, 24, 0.6)` |
| `.tokex-glass` / `.tokex-glass-elevated` | `rgba(14, 14, 17, 0.52)` (`blur(12px)`) / `0.62` (`blur(16px)`) | Standalone frosted overlays; interactive hover `rgba(24, 24, 28, 0.58)` |
| `[data-slot='dialog-content']` / `popover` / `dropdown-menu` | `rgba(14, 14, 17, 0.96)` + `blur(20px)` | Elevated overlay menus & dialogs |
| `.tokex-surface-subtle` | `rgba(255, 255, 255, 0.03)` (`border: rgba(255, 255, 255, 0.065)`) | Nested tiles inside glass cards (no double blur) |
| `.tokex-surface-pill` | `rgba(11, 11, 14, 0.58)` (`border: rgba(255, 255, 255, 0.09)`) | Compact pill badges & segmented pill shells |
| `--muted` | `#141418` | Muted containers, code blocks, active chips |
| `--secondary` | `#19191E` | Secondary buttons, inactive badges |
| `--accent` / `--sidebar-accent` | `rgba(255, 255, 255, 0.065)` | Neutral hover highlights, active nav row pill |
| `--table-header` / `--table-header-hover` | `#121215` / `#17171B` | Opaque sticky table headers |
| Pinned Table Cells (dark) | `#0B0B0E` (hover `#121215`, selected `#19191D`) | Opaque pinned cells matched to composited card tone |

### Ambient Backdrop (`AmbientBackdrop`)
| Layer | Neutral Platinum Silver Values | Behavior |
|---|---|---|
| Dot matrix | `radial-gradient(rgba(255, 255, 255, 0.24) 1px, transparent 1px)`, `30px` grid | Elliptical radial mask, preset opacity `0.42–0.50` |
| Radial optical glows | `rgba(218–235, 218–235, 224–240, 0.03–0.062)` → `rgba(182–200, 182–200, 188–206, 0.01–0.024)` | Soft neutral silver parallax planes (`home-0`, `home-1`, `default`, `console`) |
| Depth arcs & hairline beams | `rgba(226–240, 226–240, 232–244, 0.13–0.16)` & `white/[0.095–0.26]` | Diagonal architectural hairlines & peripheral SVG arcs |

### Text & Ink Hierarchy (Dark Mode)
| Token | Value | Usage |
|---|---|---|
| `--foreground` / `--primary` | `#FAFAFA` | Headings, primary copy, active emphasis |
| `--primary-foreground` | `#08080A` | Ink inside brushed-platinum primary buttons |
| `--sidebar-foreground` | `#E4E4E7` | Navigation labels, secondary headings |
| `--sidebar-primary` | `#FAFAFA` | Active sidebar indicator |
| `--muted-foreground` | `#A1A1AA` | Descriptions, metadata, captions, placeholders |
| `--text-tertiary` | `#74747C` | Uppercase table column headers (`11px`), secondary icons |

### Borders, Specular Rims & Proximity Glow
| Token | Value | Usage |
|---|---|---|
| `--border` / `--sidebar-border` | `rgba(255, 255, 255, 0.08)` | Default `1px` card, frame, and divider hairline |
| `--input` | `rgba(255, 255, 255, 0.10)` | Default `1px` input field border |
| `--border-hover` | `rgba(255, 255, 255, 0.115–0.15)` | Card & interactive control hover border |
| `--ring` / `--sidebar-ring` | `rgba(255, 255, 255, 0.34)` | Keyboard focus outline (`focus-visible`) |
| Card specular border (`::after`) | `radial-gradient(240px circle at var(--lg-x) var(--lg-y), rgba(244, 244, 246, 0.22), rgba(212, 212, 218, 0.07) 42%, transparent 72%)` | Pointer-tracked `1px` mask glow (`--lg-o`, `136px` proximity radius) |
| Card shadow | `inset 0 1px 0 0 rgba(255, 255, 255, 0.055), 0 14px 36px -18px rgba(0, 0, 0, 0.84)` | Recessed specular rim + obsidian drop shadow |

### Charts & Moderate-Chroma Semantics (Dark Mode)
| Token | Value | Role |
|---|---|---|
| `--chart-1` / `--overview-accent-1` | `#F4F4F5` | Primary series (Brushed Platinum) |
| `--chart-2` / `--overview-accent-2` | `#6F9CEB` | Secondary series (Steel Sapphire) |
| `--chart-3` / `--overview-accent-3` | `#52B792` | Tertiary series (Refined Jade) |
| `--chart-4` / `--chart-5` | `#D6AE63` / `#9B8EC4` | Warm Gold / Soft Amethyst |
| `--success` | `oklch(0.73 0.115 162)` (`#06130D` fg) | Active / healthy states |
| `--warning` | `oklch(0.79 0.125 78)` (`#171206` fg) | Caution / warning states |
| `--destructive` | `oklch(0.67 0.165 24)` (`#FAFAFA` fg) | Error / destructive states |
| `--info` | `oklch(0.76 0.085 245)` (`#080C12` fg) | Informational badges |

---

## 3. Typography & Scale

- **Primary Sans Stack (`--font-ui-sans`)**:
  ```css
  'Plus Jakarta Sans', 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif
  ```
- **Editorial Serif Stack (`--font-serif`)**: `'Lora Variable'`, `'Lora'`, `'Noto Serif SC'`, CJK/serif fallbacks.
- **Monospace**: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace` for API keys, model IDs, code snippets, and logs.
- **Tabular Numerals**: `.tabular-nums` / `[data-slot='table'] td` enforce `font-variant-numeric: tabular-nums`.

---

## 4. Layout, Header & Geometry

- **Radii (`--radius: 1rem` / `16px`)**:
  - Controls, inputs, nav items: `8px` (`rounded-lg`)
  - Subtle nested tiles & framed containers: `12px` (`rounded-xl`)
  - Glass cards, panels, dialogs, data-table frames: `16px` (`rounded-2xl`)
- **Public Shell (`PublicLayout`)**:
  - Top bar starts borderless & transparent (`dark:md:bg-transparent`), fading to frosted obsidian (`dark:md:bg-[#08080a]/48` + `backdrop-blur-2xl` + `dark:md:border-white/[0.05]`) once scrolled; full-width 3-slot header (`Logo` — centered links — controls + platinum `Console` CTA).
- **Console Shell (`AuthenticatedLayout`)**:
  - Header height `--app-header-height: 3.5rem` (`56px`); sidebar (`#050506` / frosted `rgba(14, 14, 17, 0.56)`) sits alongside transparent `SidebarInset` so `<AmbientBackdrop preset='console' />` shows cleanly through all frosted cards and tables.
- **Data Tables (`TableHead` / `TableCell`)**:
  - Both `TableHead` and `TableCell` share `px-3` (`12px`) horizontal padding (`pr-0` when containing `[role=checkbox]`) so selection checkboxes and column headers align vertically across every row.

---

## 5. Component Specifications

### Primary Platinum CTA
- **Gradient**: `bg-gradient-to-b from-[#fafafa] via-[#ebebef] to-[#d6d6db]` (hover `#ffffff → #f2f2f5 → #e0e0e5`)
- **Border & Rim**: `border-white/20` + `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),0_1px_2px_0_rgba(0,0,0,0.45)]`
- **Text**: `#08080A` / `#0A0A0B`

### Cards & Corner Clipping
- When interactive frosted cards place edge overlays or sheen inside rounded corners (`overflow-hidden transform-gpu`), clip inner sheen layers with `rounded-[inherit]` so corners stay crisp during GPU compositing.
- Never place a `backdrop-filter` glass child inside a container using animated `opacity`/`filter`/`transform`; place entrance motion on inner non-glass content instead.

---

## 6. Motion & Backdrop Root Architecture

- **Easing**: `--ease-liquid: cubic-bezier(0.22, 1, 0.36, 1)` (`180ms–420ms` surface transitions); JS motion primitives use `cubic-bezier(0.33, 1, 0.68, 1)` (`150ms–350ms`).
- **Backdrop Root Rule (Strict)**:
  - Route `<Outlet />` (`AuthenticatedLayout`) and outer card/layout shells (`OverviewDashboard`, `Pricing`, `Docs`, `HeroSection`, `HomeShowcase`, `LegalDocumentLayout`, etc.) must **never** wrap `.tokex-liquid-card`, `.tokex-console-panel`, `[data-slot='card']`, or `.tokex-glass` in ancestor `opacity`, `filter`, or `transform` transitions. Any ancestor opacity/transform creates a Backdrop Root that breaks `backdrop-filter` sampling against `<AmbientBackdrop />` until the animation completes (causing a transparent-to-frosted flash).
  - Animation belongs **inside** containers on non-glass content via `.tokex-content-enter` (`0.24s`), `.tokex-content-reveal` (`0.28s` staggered children), `tableRowEnter` (`[data-slot='table'] tbody tr > td:not(.sticky)`), or content-only Motion primitives (`FadeIn`, `StaggerContainer`/`StaggerItem`, `TableStaggerContainer`/`TableStaggerRow`), all releasing transform/opacity upon completion and respecting `prefers-reduced-motion: reduce`.

---

## 7. Brand Assets & Iconography

- **Horizontal Logo**: `https://tokex.vip/logo-tokex.svg`
- **Favicon**: `https://tokex.vip/favicon.svg`
- **Icons**: `lucide-react` / `@hugeicons/react` clean monochrome strokes (`#74747C` / `#A1A1AA` → `#FAFAFA`); provider marks via `@lobehub/icons`.
