# TOKEX Design System (`DESIGN.md`)

> **Brand**: TOKEX (`https://tokex.vip`)  
> **Visual Aesthetic**: Obsidian Dark & Liquid Glass Monochrome — ultra-high-contrast `#FAFAFA` primary actions over pure obsidian `#000000` / `#050506` canvases, layered `#0A0A0C` translucent glass surfaces, crisp `1px` `rgba(255, 255, 255, 0.08)` hairline borders, and tabular financial typography.  
> **Target Use**: Reference specification for TOKEX web UI and **Waffo Pancake Hosted Checkout Customization** (upload directly to Waffo or map to Waffo `checkoutSettings`).

---

## 1. Waffo Pancake Checkout Quick-Config (`checkoutSettings`)

For direct mapping into **Waffo Dashboard → Settings → Checkout** (or AI-driven `DESIGN.md` theme generation):

### Dark Theme (Primary — Matches `https://tokex.vip` Production Theme)
| Waffo Field | Value | Notes |
|---|---|---|
| `checkoutColorPrimary` | `#FAFAFA` | Monochrome high-contrast CTA button fill (paired with `#09090B` button text) |
| `checkoutColorBackground` | `#050506` | Page canvas background (obsidian black) |
| `checkoutColorCard` | `#0A0A0C` | Checkout panel / order summary card background |
| `checkoutColorText` | `#FAFAFA` | Primary foreground text (secondary text: `#A1A1AA`) |
| `checkoutBorderRadius` | `12px` | Balanced middle ground between `8px` controls (`rounded-lg`) and `16px` cards (`rounded-2xl`) |
| `checkoutLogo` | `https://tokex.vip/logo-tokex.svg` | Horizontal vector brand mark (`226 × 64 px`, `#06080E` badge + `#F8FAFC` wordmark) |

### Light Theme (Secondary Fallback)
| Waffo Field | Value | Notes |
|---|---|---|
| `checkoutColorPrimary` | `#09090B` | Deep obsidian CTA button fill with `#FAFAFA` text |
| `checkoutColorBackground` | `#FAFAFA` | Clean neutral canvas |
| `checkoutColorCard` | `#FFFFFF` | Elevated card surface with `1px solid #E4E4E7` hairline |
| `checkoutColorText` | `#09090B` | Primary ink text (secondary text: `#52525B`) |
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
      "checkoutColorBackground": "#050506",
      "checkoutColorCard": "#0A0A0C",
      "checkoutColorText": "#FAFAFA",
      "checkoutBorderRadius": "12px"
    },
    "light": {
      "checkoutLogo": "https://tokex.vip/logo-tokex.svg",
      "checkoutColorPrimary": "#09090B",
      "checkoutColorBackground": "#FAFAFA",
      "checkoutColorCard": "#FFFFFF",
      "checkoutColorText": "#09090B",
      "checkoutBorderRadius": "12px"
    }
  }
}
```

---

## 2. Design Principles

1. **Obsidian Monochrome Restraint**: Avoid neon gradients, saturated purple/blue SaaS clichés, or heavy drop shadows. Hierarchy comes from surface luminance steps (`#000000` → `#050506` → `#0A0A0C` → `#141417`) and `1px` white-alpha borders.
2. **Liquid Glass Depth**: Cards and modal surfaces use translucent `#0A0A0C` layers (`78%–95%` opacity) with `20px–24px` backdrop blur and a subtle `1px` top inner specular highlight (`inset 0 1px 0 0 rgba(255, 255, 255, 0.05)`).
3. **High-Contrast Monochrome Actions**: Primary buttons are pure crisp `#FAFAFA` with `#09090B` ink (`~19:1` contrast ratio), ensuring unmistakable checkout CTA clarity.
4. **Financial Precision (`tabular-nums`)**: All USD amounts (`$10.00 USD`), discount percentages (`5% OFF`), and pricing tables use tabular numerals for strict vertical alignment.

---

## 3. Color Palette & Design Tokens

### Background & Surface Hierarchy (Dark Mode)
| Token | Value | Usage |
|---|---|---|
| `--canvas-top` | `#000000` | Top radial ambient canvas stop |
| `--background` | `#050506` | Main page background & sidebar base |
| `--ambient-glow` | `radial-gradient(880px circle at 50% -14%, rgba(255, 255, 255, 0.035), transparent 60%)` | Subtle top-center studio light |
| `--card` / `--popover` | `#0A0A0C` | Primary cards, checkout containers, popovers |
| `--glass-surface` | `rgba(10, 10, 12, 0.78)` – `rgba(10, 10, 12, 0.85)` | Translucent card fill (`blur(20px)`) |
| `--glass-elevated` | `rgba(10, 10, 12, 0.90)` – `rgba(10, 10, 12, 0.95)` | Dialogs, sheets, dropdowns (`blur(24px)`) |
| `--muted` | `#121215` | Subtle inset containers, code blocks, pills |
| `--secondary` | `#141417` | Secondary button fill, inactive badges |
| `--surface-hover` | `rgba(20, 20, 23, 0.88)` | Interactive card hover state |
| `--accent` | `rgba(255, 255, 255, 0.08)` | Hover row highlight, active nav pill |

### Text & Ink Hierarchy (Dark Mode)
| Token | Value | Usage |
|---|---|---|
| `--foreground` / `--primary` | `#FAFAFA` | Headings, primary copy, active values, primary button fill |
| `--primary-foreground` | `#09090B` | Text/icons inside `#FAFAFA` primary buttons |
| `--sidebar-foreground` | `#E4E4E7` | Navigation items, secondary headings |
| `--info` | `#D4D4D8` | Informational labels, subtle emphasis |
| `--muted-foreground` | `#A1A1AA` | Descriptions, metadata, captions, placeholders |
| `--text-tertiary` | `#71717A` | Strikethrough original prices, footnotes |
| `--text-disabled` | `#52525B` | Disabled text, hairline dividers |

### Borders, Rings & Shadows
| Token | Value | Usage |
|---|---|---|
| `--border` / `--input` | `rgba(255, 255, 255, 0.08)` | Default `1px` card, table, and input border |
| `--border-hover` | `rgba(255, 255, 255, 0.16)` | Interactive card / button hover border |
| `--ring` | `rgba(255, 255, 255, 0.28)` | Keyboard focus outline (`focus-visible`) |
| `--shadow-card` | `inset 0 1px 0 0 rgba(255, 255, 255, 0.05), 0 12px 32px -16px rgba(0, 0, 0, 0.72)` | Card elevation + top specular rim |
| `--shadow-elevated` | `inset 0 1px 0 0 rgba(255, 255, 255, 0.07), 0 24px 64px -20px rgba(0, 0, 0, 0.90)` | Modal & checkout container elevation |

### Semantic Status Colors
| State | CSS Token | Hex Approx. | Foreground |
|---|---|---|---|
| **Success** | `oklch(0.72 0.16 162)` | `#10B981` | `#052E16` |
| **Warning** | `oklch(0.78 0.16 75)` | `#F59E0B` | `#1E1B08` |
| **Destructive / Error** | `oklch(0.68 0.20 24)` | `#EF4444` | `#FAFAFA` |

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
| **Checkout Title / Hero** | `24px–32px` / `1.2` | `600–700` | `-0.02em` | `#FAFAFA` |
| **Order Total / Price** | `20px–28px` / `1.2` | `600` (`tabular-nums`) | `-0.02em` | `#FAFAFA` |
| **Section Heading** | `16px` / `1.4` | `500–600` | `-0.01em` | `#FAFAFA` |
| **Body / Form Labels** | `14px` / `1.5` | `400–500` | `0` | `#E4E4E7` / `#FAFAFA` |
| **Helper / Legal Text** | `12px–13px` / `1.5` | `400` | `0` | `#A1A1AA` |
| **Strikethrough Original Price** | `12px` / `1.4` | `400` (`line-through`) | `0` | `#71717A` |

---

## 5. Layout, Radius & Spacing System

- **Base Radius (`--radius`)**: `16px` (`1rem`)
  - **Inputs & Buttons**: `8px` (`0.5rem`, `rounded-lg`)
  - **Medium Pills / Badges / Checkout Option Tiles**: `12px` (`0.75rem`, `rounded-xl`) — *recommended single `checkoutBorderRadius` value for Waffo*
  - **Cards & Checkout Containers**: `16px` (`1rem`, `rounded-2xl`)
- **Spacing Rhythm**: `4px` base grid; card padding `16px–24px`; vertical stack gap `12px–16px` inside forms, `24px–32px` between major sections.
- **Checkout Container Width**: Centered single-column or split two-column layout (`max-width: 960px` desktop, `100%` with `16px` gutter mobile).

---

## 6. Component Specifications (For Checkout UI Parity)

### Primary CTA Button (e.g., "Pay $95.00 USD")
- **Fill**: `#FAFAFA` (hover: `rgba(250, 250, 250, 0.88)`)
- **Text**: `#09090B`, `14px`, `font-weight: 500`, `tabular-nums`
- **Border**: `1px solid transparent`
- **Height**: `36px–44px` (`h-9` to `h-11` for checkout submit)
- **Radius**: `8px` (`12px` if unified with Waffo setting)
- **Active Feedback**: `transform: scale(0.98)` / `translateY(1px)`

### Secondary / Outline Button & Payment Method Tiles
- **Fill**: `rgba(255, 255, 255, 0.03)` (selected: `rgba(255, 255, 255, 0.08)`)
- **Border**: `1px solid rgba(255, 255, 255, 0.08)` (selected: `1px solid #FAFAFA` or `rgba(255, 255, 255, 0.35)`)
- **Text**: `#FAFAFA` title, `#A1A1AA` subtitle
- **Hover**: `background: rgba(255, 255, 255, 0.06)`, `border-color: rgba(255, 255, 255, 0.16)`

### Text Inputs & Card Fields
- **Fill**: `rgba(255, 255, 255, 0.03)` (`dark:bg-input/30`)
- **Border**: `1px solid rgba(255, 255, 255, 0.08)`
- **Focus State**: `border-color: rgba(255, 255, 255, 0.28)` + `box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.14)`
- **Text**: `#FAFAFA`, `14px` desktop (`16px` on mobile `<768px` to prevent iOS auto-zoom)
- **Placeholder**: `#A1A1AA`
- **Invalid State**: `border-color: rgba(239, 68, 68, 0.50)` + `ring: rgba(239, 68, 68, 0.25)`

### Order Summary & Surface Cards
- **Fill**: `#0A0A0C` (or `rgba(10, 10, 12, 0.85)` with `backdrop-filter: blur(20px)`)
- **Border**: `1px solid rgba(255, 255, 255, 0.08)`
- **Highlight Rim**: `inset 0 1px 0 0 rgba(255, 255, 255, 0.05)`
- **Dividers**: `1px solid rgba(255, 255, 255, 0.08)`
- **Discount Badge**: subtle `#141417` or `rgba(16, 185, 129, 0.12)` pill with `#10B981` text (e.g., `5% OFF`)

### Checkout Footer & Legal Disclosure
- Display subtle `12px` `#A1A1AA` text with `#E4E4E7` underlined links:
  - `Terms of Service`: `https://tokex.vip/terms`
  - `Privacy Policy`: `https://tokex.vip/privacy-policy`
  - `Acceptable Use`: `https://tokex.vip/aup`
  - Support contact: `support@tokex.vip`

---

## 7. Brand Assets & Iconography

- **Full Logo (Horizontal)**: `https://tokex.vip/logo-tokex.svg` (`226 × 64 px`, SVG)
  - Dark square tile `#06080E` (`rx="14"`) + crisp `#F8FAFC` geometric `T` mark + `TOKEX` wordmark.
- **Square Icon / Favicon**: `https://tokex.vip/favicon.svg` (`64 × 64 px`, SVG)
- **Icon Style**: `lucide-react` clean `1.75px`–`2px` stroke monochrome icons (`#FAFAFA` / `#A1A1AA`).

---

## 8. Motion & Accessibility

- **Timing Curve**: `cubic-bezier(0.22, 1, 0.36, 1)` (`150ms–350ms`) for hover, focus, and state transitions.
- **Reduced Motion**: Respect `@media (prefers-reduced-motion: reduce)` by disabling transforms/animations.
- **Contrast**: Primary `#FAFAFA` on `#050506` (`19.2:1`) and `#0A0A0C` (`18.5:1`) exceeds WCAG AAA; muted `#A1A1AA` on `#0A0A0C` (`7.8:1`) exceeds WCAG AA/AAA.
