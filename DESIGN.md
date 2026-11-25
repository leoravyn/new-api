# TOKEX Design System (`DESIGN.md`)

> **Brand**: TOKEX (`https://tokex.vip`)  
> **Visual Aesthetic**: **Deep Obsidian + Brushed Platinum + Refined Mineral Accents** — crisp high-contrast obsidian surfaces (`#050506` outer shell → `#08080A` workspace → `#0E0E11` cards → `#141418` / `#19191E` inset/secondary), ultra-fine film-grain canvas texture (`feTurbulence`, `0.014` opacity), restrained top studio light (`rgba(255, 255, 255, 0.022)`), brushed-platinum metallic primary CTAs (`#FAFAFA` → `#D6D6DB` with `#08080A` ink), `1px` `rgba(255, 255, 255, 0.08)` neutral hairlines, clean moderate-chroma jade/amber/coral/steel-blue semantics & charts, and tabular financial typography.  
> **Target Use**: Reference specification for TOKEX web UI, console layout shell, and **Waffo Pancake Hosted Checkout Customization** (upload directly to Waffo or map to Waffo `checkoutSettings`).

---

## 1. Waffo Pancake Checkout Quick-Config (`checkoutSettings`)

For direct mapping into **Waffo Dashboard → Settings → Checkout** (or AI-driven `DESIGN.md` theme generation):

### Dark Theme (Primary — Matches `https://tokex.vip` Production Theme)
| Waffo Field | Value | Notes |
|---|---|---|
| `checkoutColorPrimary` | `#FAFAFA` | High-contrast platinum-white CTA button fill (paired with `#08080A` button text) |
| `checkoutColorBackground` | `#08080A` | Main workspace / page canvas background (deep obsidian) |
| `checkoutColorCard` | `#0E0E11` | Checkout panel / order summary card background |
| `checkoutColorText` | `#FAFAFA` | Primary platinum ink (secondary text: `#A1A1AA`) |
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
      "checkoutColorPrimary": "#FAFAFA",
      "checkoutColorBackground": "#08080A",
      "checkoutColorCard": "#0E0E11",
      "checkoutColorText": "#FAFAFA",
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

1. **Crisp Deep Obsidian Surface Hierarchy**: Every structural surface, border, hover state, active pill, and focus ring uses pure neutral obsidian, silver, and platinum (`#050506` outer shell & sidebar → `#08080A` workspace → `#0E0E11` cards & popovers → `#141418` muted inset → `#19191E` secondary) separated by `1px` `rgba(255, 255, 255, 0.08)` neutral hairlines. Cards and menus stay strictly black/platinum (`rgba(255, 255, 255, 0.065)` neutral hover/accent).
2. **Tactile Materiality Without Milky Haze**: Depth comes from subtle physical cues — an ultra-fine monochrome SVG `feTurbulence` film-grain overlay (`opacity: 0.014`), restrained top studio lighting (`rgba(255, 255, 255, 0.022)`), `inset 0 1px 0 0 rgba(255, 255, 255, 0.06)` card specular rims, and brushed-platinum primary CTAs (`#FAFAFA` → `#D6D6DB`).
3. **Clean Alive Moderate-Chroma Semantics**: Status indicators and explicit semantic badges have crisp clarity without neon glare — refined emerald (`oklch(0.73 0.115 162)`) for active/OK states, warm amber (`oklch(0.79 0.125 78)`) for warnings, coral-red (`oklch(0.67 0.165 24)`) for destructive alerts, and cool silver-blue (`oklch(0.76 0.085 245)`) for informational badges.
4. **Seamless Public Header & Framed Console Shell**: On public pages, the top header starts fully transparent with no border over the `#08080A` canvas and transitions to a translucent `backdrop-blur-xl` bar with a faint `rgba(255, 255, 255, 0.07)` hairline only after scrolling (`> 8px`). On desktop console routes (`md:`), the outer shell and sidebar share `#050506` while the workspace sits in a framed `#08080A` panel (`rounded-xl`, `1px` neutral border, top specular rim).
5. **Financial Precision (`tabular-nums`)**: All USD amounts (`$10.00 USD`), discount percentages (`5% OFF`), and pricing tables use tabular numerals for strict vertical alignment.

---

## 3. Color Palette & Design Tokens

### Background & Surface Hierarchy (Dark Mode)
| Token | Value | Usage |
|---|---|---|
| `--sidebar` | `#050506` | Outer shell, console header, sidebar base |
| `--background` | `#08080A` | Main workspace canvas, public page base, framed desktop panel |
| `--studio-light` | `radial-gradient(960px circle at 50% -14%, rgba(255, 255, 255, 0.022), transparent 62%)` | Restrained top-center neutral studio light |
| `--film-grain` | Inline SVG `feTurbulence` (`saturate=0`, `opacity: 0.014`, `fixed`) | Ultra-fine monochrome surface grain |
| `--card` / `--popover` | `#0E0E11` | Primary cards, checkout containers, popovers |
| `--glass-surface` | `rgba(14, 14, 17, 0.88)` – `rgba(14, 14, 17, 0.92)` | Translucent card fill (`blur(20px)`) |
| `--glass-elevated` | `rgba(14, 14, 17, 0.95)` – `rgba(14, 14, 17, 0.96)` | Dialogs, sheets, dropdowns (`blur(24px)`) |
| `--muted` | `#141418` | Subtle inset containers, code blocks, pills |
| `--secondary` | `#19191E` | Secondary button fill, inactive badges |
| `--surface-hover` | `rgba(25, 25, 30, 0.92)` | Interactive card hover state |
| `--accent` / `--sidebar-accent` | `rgba(255, 255, 255, 0.065)` | Neutral hover row highlight, active nav/menu pill |

### Text & Ink Hierarchy (Dark Mode)
| Token | Value | Usage |
|---|---|---|
| `--foreground` / `--primary` | `#FAFAFA` | Headings, primary copy, active values |
| `--primary-foreground` | `#08080A` | Text/icons inside brushed-platinum primary buttons |
| `--sidebar-foreground` | `#E4E4E7` | Navigation items, secondary headings |
| `--sidebar-primary` | `#FAFAFA` | Brushed-platinum active indicator lead |
| `--info` | `oklch(0.76 0.085 245)` | Crisp cool silver-blue informational emphasis |
| `--muted-foreground` | `#A1A1AA` | Descriptions, metadata, captions, placeholders |
| `--text-tertiary` | `#74747C` | Sidebar group labels (`11px` small-caps), strikethrough original prices |

### Borders, Rings & Specular Depth
| Token | Value | Usage |
|---|---|---|
| `--border` / `--sidebar-border` | `rgba(255, 255, 255, 0.08)` | Default `1px` card, workspace frame, and table hairline |
| `--input` | `rgba(255, 255, 255, 0.10)` | Default `1px` form input border |
| `--border-hover` | `rgba(255, 255, 255, 0.15)` | Interactive card / button hover border lift |
| `--ring` / `--sidebar-ring` | `rgba(255, 255, 255, 0.34)` | Neutral keyboard focus outline (`focus-visible`) |
| `--shadow-card` | `inset 0 1px 0 0 rgba(255, 255, 255, 0.06), 0 12px 32px -16px rgba(0, 0, 0, 0.78)` | Card elevation + top specular rim |
| `--shadow-elevated` | `inset 0 1px 0 0 rgba(255, 255, 255, 0.06), 0 24px 64px -20px rgba(0, 0, 0, 0.90)` | Modal & checkout container elevation |

### Platinum & Refined Mineral Chart Palette (Dark Mode)
| Token | Value | Role |
|---|---|---|
| `--chart-1` / `--overview-accent-1` | `#F4F4F5` | Primary series (Brushed Platinum) |
| `--chart-2` / `--overview-accent-2` | `#6F9CEB` | Secondary series (Steel Sapphire) |
| `--chart-3` / `--overview-accent-3` | `#52B792` | Tertiary series (Refined Jade) |
| `--chart-4` | `#D6AE63` | Quaternary series (Warm Gold) |
| `--chart-5` | `#9B8EC4` | Fifth series (Soft Amethyst) |

### Moderate-Chroma Semantic Status Colors
| State | CSS Token | Hex Approx. | Foreground |
|---|---|---|---|
| **Success** | `oklch(0.73 0.115 162)` | `#48B88A` | `#06130D` |
| **Warning** | `oklch(0.79 0.125 78)` | `#DFB054` | `#171206` |
| **Destructive / Error** | `oklch(0.67 0.165 24)` | `#E26860` | `#FAFAFA` |
| **Info** | `oklch(0.76 0.085 245)` | `#88B8DE` | `#080C12` |

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
