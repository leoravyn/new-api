# TOKEX Design System (`DESIGN.md`)

> **Brand**: TOKEX (`https://tokex.vip`)  
> **Visual Aesthetic**: **Monochrome Graphite + Brushed Platinum + Silver** — zero-hue neutral graphite surfaces (`#08080A` outer shell → `#0C0C0E` workspace → `#121214` cards → `#17171A` / `#1B1B1F` inset/secondary), tactile film-grain canvas texture (`feTurbulence`), soft neutral top studio light (`rgba(255, 255, 255, 0.04)`), brushed-platinum metallic primary CTAs (`#FAFAFA` → `#D6D6DB` with `#0A0A0B` ink), `1px` `rgba(255, 255, 255, 0.07)` neutral hairlines, desaturated sage/champagne/rose semantic states, and tabular financial typography.  
> **Target Use**: Reference specification for TOKEX web UI, console layout shell, and **Waffo Pancake Hosted Checkout Customization** (upload directly to Waffo or map to Waffo `checkoutSettings`).

---

## 1. Waffo Pancake Checkout Quick-Config (`checkoutSettings`)

For direct mapping into **Waffo Dashboard → Settings → Checkout** (or AI-driven `DESIGN.md` theme generation):

### Dark Theme (Primary — Matches `https://tokex.vip` Production Theme)
| Waffo Field | Value | Notes |
|---|---|---|
| `checkoutColorPrimary` | `#F4F4F5` | High-contrast platinum-white CTA button fill (paired with `#0A0A0B` button text) |
| `checkoutColorBackground` | `#0C0C0E` | Main workspace / page canvas background (neutral graphite) |
| `checkoutColorCard` | `#121214` | Checkout panel / order summary card background |
| `checkoutColorText` | `#F4F4F5` | Primary platinum ink (secondary text: `#9A9AA2`) |
| `checkoutBorderRadius` | `12px` | Balanced middle ground between `8px` controls (`rounded-lg`) and `16px` cards (`rounded-2xl`) |
| `checkoutLogo` | `https://tokex.vip/logo-tokex.svg` | Horizontal vector brand mark (`226 × 64 px`) |

### Light Theme (Secondary Fallback)
| Waffo Field | Value | Notes |
|---|---|---|
| `checkoutColorPrimary` | `#0A0A0B` | Deep graphite CTA button fill with `#F4F4F5` text |
| `checkoutColorBackground` | `#F4F4F5` | Clean neutral canvas |
| `checkoutColorCard` | `#FFFFFF` | Elevated card surface with `1px solid #E4E4E7` hairline |
| `checkoutColorText` | `#0A0A0B` | Primary ink text (secondary text: `#52525B`) |
| `checkoutBorderRadius` | `12px` | Consistent corner geometry |

### Store & Compliance Metadata
| Field | Value |
|---|---|
| **Store Name** | `TOKEX` |
| **Support Email** | `support@tokex.vip` |
| **Terms of Service URL** | `https://tokex.vip/terms` |
| **Privacy Policy URL** | `https://tokex.vip/privacy-policy` |
| **Acceptable Use Policy URL** | `https://tokex.vip/aup` |
| **Settlement Currency** | `USD` (`$`) |

```json
{
  "checkoutSettings": {
    "dark": {
      "checkoutLogo": "https://tokex.vip/logo-tokex.svg",
      "checkoutColorPrimary": "#F4F4F5",
      "checkoutColorBackground": "#0C0C0E",
      "checkoutColorCard": "#121214",
      "checkoutColorText": "#F4F4F5",
      "checkoutBorderRadius": "12px"
    },
    "light": {
      "checkoutLogo": "https://tokex.vip/logo-tokex.svg",
      "checkoutColorPrimary": "#0A0A0B",
      "checkoutColorBackground": "#F4F4F5",
      "checkoutColorCard": "#FFFFFF",
      "checkoutColorText": "#0A0A0B",
      "checkoutBorderRadius": "12px"
    }
  }
}
```

---

## 2. Design Principles

1. **Zero-Hue Monochrome Graphite Hierarchy**: Every structural surface, border, hover state, active pill, and focus ring uses pure neutral black, graphite, silver, and platinum (`#08080A` outer shell & sidebar → `#0C0C0E` workspace → `#121214` cards & popovers → `#17171A` muted inset → `#1B1B1F` secondary) separated by `1px` `rgba(255, 255, 255, 0.07)` neutral hairlines. Zero blue or indigo tint anywhere in the UI.
2. **Tactile Materiality Without Gimmicks**: Depth comes from physical material cues — a subtle fixed monochrome SVG `feTurbulence` film-grain overlay (`opacity: 0.028`), soft neutral top studio lighting (`rgba(255, 255, 255, 0.04)`), `inset 0 1px 0 0 rgba(255, 255, 255, 0.06)` card specular rims, and brushed-platinum primary CTAs (`#FAFAFA` → `#D6D6DB`). No particles, no neon, no glow halos.
3. **Calm Desaturated Semantics**: Status indicators communicate meaning without visual glare — muted sage (`oklch(0.74 0.055 160)`) for active/OK states, muted champagne (`oklch(0.80 0.08 80)`) for warnings, and muted rose (`oklch(0.66 0.13 22)`) for destructive alerts, backed by centralized `.dark` Tailwind v4 palette overrides (`emerald`/`green`/`lime` → sage; `blue`/`sky`/`indigo` → silver/graphite).
4. **Seamless Public Header & Framed Console Shell**: On public pages, the top header starts fully transparent with no border over the `#0C0C0E` canvas and transitions to a translucent `backdrop-blur-xl` bar with a faint `rgba(255, 255, 255, 0.06)` hairline only after scrolling (`> 8px`). On desktop console routes (`md:`), the outer shell and sidebar share `#08080A` while the workspace sits in a framed `#0C0C0E` panel (`rounded-xl`, `1px` neutral border, top specular rim).
5. **Financial Precision (`tabular-nums`)**: All USD amounts (`$10.00 USD`), discount percentages (`5% OFF`), and pricing tables use tabular numerals for strict vertical alignment.

---

## 3. Color Palette & Design Tokens

### Background & Surface Hierarchy (Dark Mode)
| Token | Value | Usage |
|---|---|---|
| `--sidebar` | `#08080A` | Outer shell, console header, sidebar base |
| `--background` | `#0C0C0E` | Main workspace canvas, public page base, framed desktop panel |
| `--studio-light` | `radial-gradient(960px circle at 50% -14%, rgba(255, 255, 255, 0.04), transparent 62%)` | Soft top-center neutral studio light |
| `--film-grain` | Inline SVG `feTurbulence` (`saturate=0`, `opacity: 0.028`, `fixed`) | Subtle monochrome surface grain |
| `--card` / `--popover` | `#121214` | Primary cards, checkout containers, popovers |
| `--glass-surface` | `rgba(18, 18, 20, 0.84)` – `rgba(18, 18, 20, 0.92)` | Translucent card fill (`blur(20px)`) |
| `--glass-elevated` | `rgba(18, 18, 20, 0.94)` – `rgba(18, 18, 20, 0.96)` | Dialogs, sheets, dropdowns (`blur(24px)`) |
| `--muted` | `#17171A` | Subtle inset containers, code blocks, pills |
| `--secondary` | `#1B1B1F` | Secondary button fill, inactive badges |
| `--surface-hover` | `rgba(27, 27, 31, 0.90)` | Interactive card hover state |
| `--accent` / `--sidebar-accent` | `rgba(255, 255, 255, 0.06)` | Hover row highlight, active nav/menu pill |

### Text & Ink Hierarchy (Dark Mode)
| Token | Value | Usage |
|---|---|---|
| `--foreground` / `--primary` | `#F4F4F5` | Headings, primary copy, active values |
| `--primary-foreground` | `#0A0A0B` | Text/icons inside brushed-platinum primary buttons |
| `--sidebar-foreground` | `#D4D4D8` | Navigation items, secondary headings |
| `--sidebar-primary` | `#E4E4E7` | Brushed-platinum active indicator lead |
| `--info` | `#C9CDD4` | Neutral silver informational emphasis |
| `--muted-foreground` | `#9A9AA2` | Descriptions, metadata, captions, placeholders |
| `--text-tertiary` | `#74747C` | Sidebar group labels (`11px` small-caps), strikethrough original prices |

### Borders, Rings & Specular Depth
| Token | Value | Usage |
|---|---|---|
| `--border` / `--sidebar-border` | `rgba(255, 255, 255, 0.07)` | Default `1px` card, workspace frame, and table hairline |
| `--input` | `rgba(255, 255, 255, 0.09)` | Default `1px` form input border |
| `--border-hover` | `rgba(255, 255, 255, 0.14)` | Interactive card / button hover border lift |
| `--ring` / `--sidebar-ring` | `rgba(255, 255, 255, 0.32)` | Neutral keyboard focus outline (`focus-visible`) |
| `--shadow-card` | `inset 0 1px 0 0 rgba(255, 255, 255, 0.06), 0 12px 32px -16px rgba(0, 0, 0, 0.72)` | Card elevation + top specular rim |
| `--shadow-elevated` | `inset 0 1px 0 0 rgba(255, 255, 255, 0.06), 0 24px 64px -20px rgba(0, 0, 0, 0.88)` | Modal & checkout container elevation |

### Monochrome & Muted Mineral Chart Palette (Dark Mode)
| Token | Value | Role |
|---|---|---|
| `--chart-1` / `--overview-accent-1` | `#E4E4E7` | Primary series (Brushed Platinum) |
| `--chart-2` / `--overview-accent-2` | `#A1A1AA` | Secondary series (Anodized Silver) |
| `--chart-3` / `--overview-accent-3` | `#C4B48E` | Tertiary series (Muted Champagne) |
| `--chart-4` | `#8DA698` | Quaternary series (Muted Sage) |
| `--chart-5` | `#6B6B73` | Fifth series (Deep Graphite) |

### Desaturated Semantic Status Colors
| State | CSS Token | Hex Approx. | Foreground |
|---|---|---|---|
| **Success** | `oklch(0.74 0.055 160)` | `#8DA698` | `#0B130F` |
| **Warning** | `oklch(0.80 0.08 80)` | `#C9B58A` | `#17140B` |
| **Destructive / Error** | `oklch(0.66 0.13 22)` | `#C87A74` | `#F4F4F5` |

---

## 4. Typography & Scale

- **Primary Sans Font Stack**:
  ```css
  --font-ui-sans: 'Plus Jakarta Sans', 'Inter', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  ```
- **Monospace Stack** (API keys, model IDs, order IDs):
  `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
- **Numeric Style**:
  `font-variant-numeric: tabular-nums;` on all prices, totals, tax rows, discounts, and currency badges.

| Role | Size / Line Height | Weight | Tracking | Color |
|---|---|---|---|---|
| **Checkout Title / Hero** | `24px–32px` / `1.2` | `600–700` | `-0.02em` | `#F4F4F5` |
| **Order Total / Price** | `20px–28px` / `1.2` | `600` (`tabular-nums`) | `-0.02em` | `#F4F4F5` |
| **Section Heading** | `16px` / `1.4` | `500–600` | `-0.01em` | `#F4F4F5` |
| **Body / Form Labels** | `14px` / `1.5` | `400–500` | `0` | `#D4D4D8` / `#F4F4F5` |
| **Helper / Legal Text** | `12px–13px` / `1.5` | `400` | `0` | `#9A9AA2` |
| **Sidebar Group Label** | `11px` / `1.2` (`uppercase`) | `500` | `0.08em` | `#74747C` |
| **Strikethrough Original Price** | `12px` / `1.4` | `400` (`line-through`) | `0` | `#74747C` |

---

## 5. Layout, Radius & Spacing System

- **Console Shell Geometry**:
  - **Outer Shell & Sidebar**: `#08080A` (`--sidebar`), desktop sidebar width `14rem` (`3.25rem` collapsed icon rail), header height `3.25rem` (`52px`).
  - **Framed Workspace Panel (`md:`)**: `#0C0C0E` (`--background`), `rounded-xl` (`12px`), `border rgba(255, 255, 255, 0.07)`, `my-2 mr-2`, top specular rim `inset 0 1px 0 0 rgba(255, 255, 255, 0.06)`.
  - **Sidebar Rhythm**: `gap-5` (`20px`) between nav groups, `h-9 px-2.5 rounded-lg` menu rows, active row with `rgba(255, 255, 255, 0.06)` pill + `2px` brushed silver gradient left indicator (`#FAFAFA` → `#8E8E96`) + `#F4F4F5` text & icon.
- **Base Radius (`--radius`)**: `16px` (`1rem`)
  - **Inputs, Buttons & Nav Items**: `8px` (`0.5rem`, `rounded-lg`)
  - **Framed Workspace, Pills & Checkout Option Tiles**: `12px` (`0.75rem`, `rounded-xl`) — *recommended single `checkoutBorderRadius` value for Waffo*
  - **Cards & Checkout Containers**: `16px` (`1rem`, `rounded-2xl`)
- **Spacing Rhythm**: `4px` base grid; card padding `16px–24px`; vertical stack gap `12px–16px` inside forms, `24px–32px` between major sections.
- **Checkout Container Width**: Centered single-column or split two-column layout (`max-width: 960px` desktop, `100%` with `16px` gutter mobile).

---

## 6. Component Specifications (For Checkout UI Parity)

### Primary CTA Button (e.g., "Pay $95.00 USD")
- **Fill**: Brushed-platinum vertical gradient `linear-gradient(180deg, #FAFAFA 0%, #EBEBEF 52%, #D6D6DB 100%)` (hover: `#FFFFFF` → `#E0E0E5`; flat fallback `#F4F4F5`)
- **Highlight & Edge**: `1px solid rgba(255, 255, 255, 0.20)`, `inset 0 1px 0 0 rgba(255, 255, 255, 0.90), 0 1px 2px 0 rgba(0, 0, 0, 0.45)`
- **Text**: `#0A0A0B`, `14px`, `font-weight: 500`, `tabular-nums`
- **Height**: `36px–44px` (`h-9` to `h-11` for checkout submit)
- **Radius**: `8px` (`12px` if unified with Waffo setting)
- **Active Feedback**: `transform: translateY(1px)`

### Secondary / Outline Button & Payment Method Tiles
- **Fill**: `#1B1B1F` or `rgba(255, 255, 255, 0.03)` (selected: `rgba(255, 255, 255, 0.06)`)
- **Border**: `1px solid rgba(255, 255, 255, 0.07)` (selected: `1px solid rgba(255, 255, 255, 0.28)`)
- **Text**: `#F4F4F5` title, `#9A9AA2` subtitle
- **Hover**: `background: rgba(27, 27, 31, 0.90)`, `border-color: rgba(255, 255, 255, 0.14)`

### Text Inputs & Card Fields
- **Fill**: `rgba(255, 255, 255, 0.03)` (`dark:bg-input/30`)
- **Border**: `1px solid rgba(255, 255, 255, 0.09)`
- **Focus State**: `border-color: rgba(255, 255, 255, 0.32)` + `box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.12)`
- **Text**: `#F4F4F5`, `14px` desktop (`16px` on mobile `<768px` to prevent iOS auto-zoom)
- **Placeholder**: `#9A9AA2`
- **Invalid State**: `border-color: oklch(0.66 0.13 22 / 0.50)` + `ring: oklch(0.66 0.13 22 / 0.25)`

### Order Summary & Surface Cards
- **Fill**: `#121214` (or `rgba(18, 18, 20, 0.92)` with `backdrop-filter: blur(20px)`)
- **Border**: `1px solid rgba(255, 255, 255, 0.07)` (hover: `rgba(255, 255, 255, 0.14)`)
- **Highlight Rim**: `inset 0 1px 0 0 rgba(255, 255, 255, 0.06)`
- **Dividers**: `1px solid rgba(255, 255, 255, 0.07)`
- **Discount Badge**: subtle muted-sage pill (`oklch(0.67 0.055 160 / 0.12)` fill, `oklch(0.74 0.055 160)` text, e.g., `5% OFF`)

### Checkout Footer & Legal Disclosure
- Display subtle `12px` `#9A9AA2` text with `#D4D4D8` underlined links:
  - `Terms of Service`: `https://tokex.vip/terms`
  - `Privacy Policy`: `https://tokex.vip/privacy-policy`
  - `Acceptable Use`: `https://tokex.vip/aup`
  - Support contact: `support@tokex.vip`

---

## 7. Brand Assets & Iconography

- **Full Logo (Horizontal)**: `https://tokex.vip/logo-tokex.svg` (`226 × 64 px`, SVG)
- **Square Icon / Favicon**: `https://tokex.vip/favicon.svg` (`64 × 64 px`, SVG)
- **Icon Style**: `lucide-react` clean `1.75px`–`2px` stroke icons (`#85858D` idle → `#D4D4D8` hover → `#F4F4F5` active; provider brand icons via `@lobehub/icons` keep native marks).

---

## 8. Motion & Accessibility

- **Timing Curve**: `cubic-bezier(0.22, 1, 0.36, 1)` (`150ms–300ms`) for hover, focus, and state transitions.
- **Reduced Motion**: Respect `@media (prefers-reduced-motion: reduce)` by disabling transforms/animations.
- **Contrast**: Primary `#F4F4F5` on `#0C0C0E` (`17.9:1`) and `#121214` (`16.9:1`) exceeds WCAG AAA; muted `#9A9AA2` on `#121214` (`7.0:1`) exceeds WCAG AA/AAA.
