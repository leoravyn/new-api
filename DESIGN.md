# TOKEX Design System (`DESIGN.md`)

> **Brand**: TOKEX (`https://tokex.vip`)  
> **Visual Aesthetic**: Linear-inspired **Cold Charcoal + Platinum Silver + Desaturated Ice-Indigo** — crisp `#F4F6FA` platinum-white primary actions over stepped cold-charcoal canvases (`#07080B` shell → `#0B0D12` workspace → `#11141B` cards → `#161A23` / `#191D28` inset/secondary), restrained desaturated ice-indigo (`#7C92E8`, `<5%` area, never neon), cold-silver `1px` `rgba(216, 226, 248, 0.08)` hairline borders, and tabular financial typography.  
> **Target Use**: Reference specification for TOKEX web UI, console layout shell, and **Waffo Pancake Hosted Checkout Customization** (upload directly to Waffo or map to Waffo `checkoutSettings`).

---

## 1. Waffo Pancake Checkout Quick-Config (`checkoutSettings`)

For direct mapping into **Waffo Dashboard → Settings → Checkout** (or AI-driven `DESIGN.md` theme generation):

### Dark Theme (Primary — Matches `https://tokex.vip` Production Theme)
| Waffo Field | Value | Notes |
|---|---|---|
| `checkoutColorPrimary` | `#F4F6FA` | High-contrast platinum-white CTA button fill (paired with `#090B10` button text) |
| `checkoutColorBackground` | `#0B0D12` | Main workspace / page canvas background (cold charcoal) |
| `checkoutColorCard` | `#11141B` | Checkout panel / order summary card background |
| `checkoutColorText` | `#F4F6FA` | Primary platinum silver text (secondary text: `#94A0B8`) |
| `checkoutBorderRadius` | `12px` | Balanced middle ground between `8px` controls (`rounded-lg`) and `16px` cards (`rounded-2xl`) |
| `checkoutLogo` | `https://tokex.vip/logo-tokex.svg` | Horizontal vector brand mark (`226 × 64 px`, `#06080E` badge + `#F8FAFC` wordmark) |

### Light Theme (Secondary Fallback)
| Waffo Field | Value | Notes |
|---|---|---|
| `checkoutColorPrimary` | `#090B10` | Deep cold-charcoal CTA button fill with `#F4F6FA` text |
| `checkoutColorBackground` | `#F4F6FA` | Clean cool neutral canvas |
| `checkoutColorCard` | `#FFFFFF` | Elevated card surface with `1px solid #E4E4E7` hairline |
| `checkoutColorText` | `#090B10` | Primary ink text (secondary text: `#52525B`) |
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
      "checkoutColorPrimary": "#F4F6FA",
      "checkoutColorBackground": "#0B0D12",
      "checkoutColorCard": "#11141B",
      "checkoutColorText": "#F4F6FA",
      "checkoutBorderRadius": "12px"
    },
    "light": {
      "checkoutLogo": "https://tokex.vip/logo-tokex.svg",
      "checkoutColorPrimary": "#090B10",
      "checkoutColorBackground": "#F4F6FA",
      "checkoutColorCard": "#FFFFFF",
      "checkoutColorText": "#090B10",
      "checkoutBorderRadius": "12px"
    }
  }
}
```

---

## 2. Design Principles

1. **Stepped Cold-Charcoal Hierarchy**: Replace flat neutral black with distinct cool-charcoal luminance steps (`#07080B` outer shell & sidebar → `#0B0D12` framed workspace → `#11141B` cards & popovers → `#161A23` muted inset → `#191D28` secondary surfaces) separated by crisp `1px` cold-silver hairlines (`rgba(216, 226, 248, 0.08)`).
2. **Restrained Desaturated Ice-Indigo Accent (`<5%` Area)**: Use `#7C92E8` / `#8FA4F0` sparingly for active sidebar indicators, focus rings, data visualization lead series, and subtle top ambient studio lighting (`rgba(124, 146, 232, 0.055)`). Never use neon glows, saturated gradients, or JS particle effects.
3. **High-Contrast Platinum Actions**: Primary CTA buttons stay crisp `#F4F6FA` with `#090B10` ink (`>18:1` contrast ratio), preserving unmistakable clarity on checkout and console actions.
4. **Linear Framed Console Shell**: On desktop (`md:`), the outer viewport, top bar, and sidebar share `#07080B` seamlessly without a harsh divider, while the main content area sits in a subtly lifted framed panel (`#0B0D12`, `rounded-xl`, `1px` cold-silver border, top specular rim). On mobile, the workspace stays clean and full-bleed with zero horizontal overflow.
5. **Financial Precision (`tabular-nums`)**: All USD amounts (`$10.00 USD`), discount percentages (`5% OFF`), and pricing tables use tabular numerals for strict vertical alignment.

---

## 3. Color Palette & Design Tokens

### Background & Surface Hierarchy (Dark Mode)
| Token | Value | Usage |
|---|---|---|
| `--sidebar` | `#07080B` | Outer shell, console header, sidebar base |
| `--background` | `#0B0D12` | Main workspace canvas & framed desktop panel |
| `--ambient-glow` | `radial-gradient(920px circle at 50% -14%, rgba(124, 146, 232, 0.055), transparent 60%)` | Subtle top-center cold-indigo studio light |
| `--card` / `--popover` | `#11141B` | Primary cards, checkout containers, popovers |
| `--glass-surface` | `rgba(17, 20, 27, 0.80)` – `rgba(17, 20, 27, 0.90)` | Translucent card fill (`blur(20px)`) |
| `--glass-elevated` | `rgba(17, 20, 27, 0.92)` – `rgba(17, 20, 27, 0.96)` | Dialogs, sheets, dropdowns (`blur(24px)`) |
| `--muted` | `#161A23` | Subtle inset containers, code blocks, pills |
| `--secondary` | `#191D28` | Secondary button fill, inactive badges |
| `--surface-hover` | `rgba(25, 29, 40, 0.88)` | Interactive card hover state |
| `--accent` / `--sidebar-accent` | `rgba(124, 146, 232, 0.10)` (`0.12` active nav pill) | Hover row highlight, active nav pill |

### Text & Ink Hierarchy (Dark Mode)
| Token | Value | Usage |
|---|---|---|
| `--foreground` / `--primary` | `#F4F6FA` | Headings, primary copy, active values, primary button fill |
| `--primary-foreground` | `#090B10` | Text/icons inside `#F4F6FA` primary buttons |
| `--sidebar-foreground` | `#D8DEE9` | Navigation items, secondary headings |
| `--sidebar-primary` | `#7C92E8` | Active sidebar `2px` left bar, active icon tint |
| `--info` | `#8FA4F0` | Informational accents, subtle ice-indigo emphasis |
| `--muted-foreground` | `#94A0B8` | Descriptions, metadata, captions, placeholders |
| `--text-tertiary` | `#6E7A94` | Sidebar group labels (`11px` small-caps), strikethrough original prices |

### Borders, Rings & Specular Depth
| Token | Value | Usage |
|---|---|---|
| `--border` / `--sidebar-border` | `rgba(216, 226, 248, 0.08)` | Default `1px` card, workspace frame, and table hairline |
| `--input` | `rgba(216, 226, 248, 0.09)` | Default `1px` form input border |
| `--border-hover` | `rgba(216, 226, 248, 0.16)` | Interactive card / button hover border lift |
| `--ring` / `--sidebar-ring` | `rgba(124, 146, 232, 0.45)` | Keyboard focus outline (`focus-visible`) |
| `--shadow-card` | `inset 0 1px 0 0 rgba(226, 234, 255, 0.05), 0 12px 32px -16px rgba(0, 0, 0, 0.72)` | Card elevation + top specular rim |
| `--shadow-elevated` | `inset 0 1px 0 0 rgba(226, 234, 255, 0.06), 0 24px 64px -20px rgba(0, 0, 0, 0.88)` | Modal & checkout container elevation |

### Cohesive Chart & Overview Palette (Dark Mode)
| Token | Value | Role |
|---|---|---|
| `--chart-1` / `--overview-accent-1` | `#7C92E8` | Primary series (Desaturated Ice-Indigo) |
| `--chart-2` / `--overview-accent-2` | `#5FA8D3` | Secondary series (Cool Steel Cyan) |
| `--chart-3` / `--overview-accent-3` | `#9BA7C2` | Tertiary series (Platinum Slate) |
| `--chart-4` | `#5E9E8D` | Quaternary series (Muted Sage Teal) |
| `--chart-5` | `#64708A` | Fifth series (Deep Slate) |

### Semantic Status Colors
| State | CSS Token | Hex Approx. | Foreground |
|---|---|---|---|
| **Success** | `oklch(0.72 0.16 162)` | `#10B981` | `#052E16` |
| **Warning** | `oklch(0.78 0.16 75)` | `#F59E0B` | `#1E1B08` |
| **Destructive / Error** | `oklch(0.68 0.20 24)` | `#EF4444` | `#F4F6FA` |

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
| **Checkout Title / Hero** | `24px–32px` / `1.2` | `600–700` | `-0.02em` | `#F4F6FA` |
| **Order Total / Price** | `20px–28px` / `1.2` | `600` (`tabular-nums`) | `-0.02em` | `#F4F6FA` |
| **Section Heading** | `16px` / `1.4` | `500–600` | `-0.01em` | `#F4F6FA` |
| **Body / Form Labels** | `14px` / `1.5` | `400–500` | `0` | `#D8DEE9` / `#F4F6FA` |
| **Helper / Legal Text** | `12px–13px` / `1.5` | `400` | `0` | `#94A0B8` |
| **Sidebar Group Label** | `11px` / `1.2` (`uppercase`) | `500` | `0.08em` | `#6E7A94` |
| **Strikethrough Original Price** | `12px` / `1.4` | `400` (`line-through`) | `0` | `#6E7A94` |

---

## 5. Layout, Radius & Spacing System

- **Console Shell Geometry**:
  - **Outer Shell & Sidebar**: `#07080B` (`--sidebar`), desktop sidebar width `14rem` (`3.25rem` collapsed icon rail), header height `3.25rem` (`52px`).
  - **Framed Workspace Panel (`md:`)**: `#0B0D12` (`--background`), `rounded-xl` (`12px`), `border rgba(216, 226, 248, 0.08)`, `my-2 mr-2`, top specular rim `inset 0 1px 0 0 rgba(226, 234, 255, 0.05)`.
  - **Sidebar Rhythm**: `gap-5` (`20px`) between nav groups, `h-9 px-2.5 rounded-lg` menu rows, active row with `rgba(124, 146, 232, 0.12)` translucent pill + `2px` `#7C92E8` left indicator bar + `#7C92E8` icon tint.
- **Base Radius (`--radius`)**: `16px` (`1rem`)
  - **Inputs, Buttons & Nav Items**: `8px` (`0.5rem`, `rounded-lg`)
  - **Framed Workspace, Pills & Checkout Option Tiles**: `12px` (`0.75rem`, `rounded-xl`) — *recommended single `checkoutBorderRadius` value for Waffo*
  - **Cards & Checkout Containers**: `16px` (`1rem`, `rounded-2xl`)
- **Spacing Rhythm**: `4px` base grid; card padding `16px–24px`; vertical stack gap `12px–16px` inside forms, `24px–32px` between major sections.
- **Checkout Container Width**: Centered single-column or split two-column layout (`max-width: 960px` desktop, `100%` with `16px` gutter mobile).

---

## 6. Component Specifications (For Checkout UI Parity)

### Primary CTA Button (e.g., "Pay $95.00 USD")
- **Fill**: `#F4F6FA` (hover: `#E2E8F4`)
- **Text**: `#090B10`, `14px`, `font-weight: 500`, `tabular-nums`
- **Border**: `1px solid transparent`
- **Height**: `36px–44px` (`h-9` to `h-11` for checkout submit)
- **Radius**: `8px` (`12px` if unified with Waffo setting)
- **Active Feedback**: `transform: scale(0.98)` / `translateY(1px)`

### Secondary / Outline Button & Payment Method Tiles
- **Fill**: `#191D28` or `rgba(216, 226, 248, 0.04)` (selected: `rgba(124, 146, 232, 0.12)`)
- **Border**: `1px solid rgba(216, 226, 248, 0.08)` (selected: `1px solid rgba(124, 146, 232, 0.45)`)
- **Text**: `#F4F6FA` title, `#94A0B8` subtitle
- **Hover**: `background: rgba(25, 29, 40, 0.88)`, `border-color: rgba(216, 226, 248, 0.16)`

### Text Inputs & Card Fields
- **Fill**: `rgba(216, 226, 248, 0.03)` (`dark:bg-input/30`)
- **Border**: `1px solid rgba(216, 226, 248, 0.09)`
- **Focus State**: `border-color: rgba(124, 146, 232, 0.45)` + `box-shadow: 0 0 0 3px rgba(124, 146, 232, 0.16)`
- **Text**: `#F4F6FA`, `14px` desktop (`16px` on mobile `<768px` to prevent iOS auto-zoom)
- **Placeholder**: `#94A0B8`
- **Invalid State**: `border-color: rgba(239, 68, 68, 0.50)` + `ring: rgba(239, 68, 68, 0.25)`

### Order Summary & Surface Cards
- **Fill**: `#11141B` (or `rgba(17, 20, 27, 0.90)` with `backdrop-filter: blur(20px)`)
- **Border**: `1px solid rgba(216, 226, 248, 0.08)` (hover: `rgba(216, 226, 248, 0.16)`)
- **Highlight Rim**: `inset 0 1px 0 0 rgba(226, 234, 255, 0.05)`
- **Dividers**: `1px solid rgba(216, 226, 248, 0.08)`
- **Discount Badge**: subtle `#191D28` or `rgba(16, 185, 129, 0.12)` pill with `#10B981` text (e.g., `5% OFF`)

### Checkout Footer & Legal Disclosure
- Display subtle `12px` `#94A0B8` text with `#D8DEE9` underlined links:
  - `Terms of Service`: `https://tokex.vip/terms`
  - `Privacy Policy`: `https://tokex.vip/privacy-policy`
  - `Acceptable Use`: `https://tokex.vip/aup`
  - Support contact: `support@tokex.vip`

---

## 7. Brand Assets & Iconography

- **Full Logo (Horizontal)**: `https://tokex.vip/logo-tokex.svg` (`226 × 64 px`, SVG)
  - Dark square tile `#06080E` (`rx="14"`) + crisp `#F8FAFC` geometric `T` mark + `TOKEX` wordmark.
- **Square Icon / Favicon**: `https://tokex.vip/favicon.svg` (`64 × 64 px`, SVG)
- **Icon Style**: `lucide-react` clean `1.75px`–`2px` stroke icons (`#D8DEE9` / `#7E8BA6`, active sidebar icon `#7C92E8`).

---

## 8. Motion & Accessibility

- **Timing Curve**: `cubic-bezier(0.22, 1, 0.36, 1)` (`150ms–300ms`) for hover, focus, and state transitions.
- **Reduced Motion**: Respect `@media (prefers-reduced-motion: reduce)` by disabling transforms/animations.
- **Contrast**: Primary `#F4F6FA` on `#0B0D12` (`18.1:1`) and `#11141B` (`17.0:1`) exceeds WCAG AAA; muted `#94A0B8` on `#11141B` (`7.1:1`) exceeds WCAG AA/AAA.
