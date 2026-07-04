---
name: Precision Utility
colors:
  surface: '#051424'
  surface-dim: '#051424'
  surface-bright: '#2c3a4c'
  surface-container-lowest: '#010f1f'
  surface-container-low: '#0d1c2d'
  surface-container: '#122131'
  surface-container-high: '#1c2b3c'
  surface-container-highest: '#273647'
  on-surface: '#d4e4fa'
  on-surface-variant: '#bdc8d1'
  inverse-surface: '#d4e4fa'
  inverse-on-surface: '#233143'
  outline: '#87929a'
  outline-variant: '#3e484f'
  surface-tint: '#7bd0ff'
  primary: '#8ed5ff'
  on-primary: '#00354a'
  primary-container: '#38bdf8'
  on-primary-container: '#004965'
  inverse-primary: '#00668a'
  secondary: '#bcc7de'
  on-secondary: '#263143'
  secondary-container: '#3e495d'
  on-secondary-container: '#aeb9d0'
  tertiary: '#ffc176'
  on-tertiary: '#472a00'
  tertiary-container: '#f1a02b'
  on-tertiary-container: '#613b00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c4e7ff'
  primary-fixed-dim: '#7bd0ff'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#004c69'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb960'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#051424'
  on-background: '#d4e4fa'
  surface-variant: '#273647'
typography:
  display-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  gutter: 12px
  edge_margin: 20px
---

## Brand & Style
The design system is engineered for high-density monitoring environments where speed of recognition and clarity of data are paramount. The personality is purely utilitarian, professional, and direct. It avoids all decorative flourishes to prioritize the hierarchy of information and system status.

The visual style is a refined **Minimalism** blended with **Corporate Modern** sensibilities. It utilizes a "Flat-Plus" approach—relying on high-contrast typography and functional color coding rather than depth or shadows to communicate state. The emotional response is one of controlled efficiency, reliability, and technical precision.

## Colors
The palette is centered on a "Deep Slate" foundation to reduce eye strain during long-term monitoring. 

- **Foundation:** The `background_deep` serves as the primary canvas, with `surface_card` providing a subtle step up in value for grouping content.
- **Status Indicators:** These are the most vibrant elements in the UI. **Emerald** (#10B981) signifies active/healthy states, **Amber** (#F59E0B) for warnings or paused processes, and **Ruby** (#EF4444) for critical errors. 
- **Accents:** A bright Sky Blue is used sparingly for primary actions and interactive focus states.
- **Data Neutral:** Mid-range slates are used for secondary labels and timestamps to maintain a clear information hierarchy against white primary values.

## Typography
Typography is treated as a functional tool. **Inter** provides high legibility for UI labels and headings due to its tall x-height. For technical values, timestamps, and IDs, **JetBrains Mono** is introduced to ensure character distinction (e.g., distinguishing '0' from 'O') and alignment in data columns.

- **Hierarchy:** Use `label-caps` for table headers and section overviews. 
- **Density:** Body text is capped at 14px to maximize information density without sacrificing readability.
- **Data Focus:** Any fluctuating value or system-generated ID must use the `data-mono` role.

## Layout & Spacing
The layout uses a **Fluid Grid** model optimized for high-density dashboards. 

- **Rhythm:** A strict 4px baseline grid governs all spacing. 
- **Density:** Gutters are kept tight (12px) to allow more cards to fit on a single viewport.
- **Breakpoints:** 
  - **Desktop (1440px+):** 12-column grid.
  - **Tablet (768px - 1439px):** 6-column grid, sidebar collapses to icons.
  - **Mobile (<767px):** Single column, horizontal scrolling for data tables.
- **Alignment:** All data points should be top-aligned within cards to maintain a clean horizontal scan line across the dashboard.

## Elevation & Depth
This design system eschews traditional shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Background):** `background_deep` (#0F172A).
- **Level 1 (Cards/Panels):** `surface_card` (#1E293B) with a 1px solid border of `border_subtle` (#334155).
- **Level 2 (Popovers/Tooltips):** A slightly lighter slate (#2D3748) with a 1px primary-colored border to indicate focus.

Interaction is communicated through background color shifts rather than physical lifts. When a user hovers over a row or card, the background should shift +5% in lightness.

## Shapes
The shape language is "Soft" but disciplined. A radius of **4px** (rounded-sm) is the standard for cards, buttons, and input fields. This provides just enough visual separation between elements without the "consumer" feel of pill-shaped or heavily rounded components. 

Status dots and small tags use a **2px** radius to maintain a sharper, more technical appearance.

## Components
- **Status Chips:** Small, rectangular badges. Use a low-opacity version of the status color for the background (10%) and the full-strength color for the text and a 2px side-accent bar.
- **Data Cards:** Flat containers with `border_subtle`. Headers should be separated by a thin horizontal rule.
- **Buttons:** 
  - *Primary:* Solid Sky Blue with white text. 
  - *Ghost:* No background, `border_subtle`, visible only on hover or focus to reduce visual noise.
- **Input Fields:** Darker than the card surface (#0F172A), 1px border, no glow on focus—only a color change of the border to the primary accent.
- **Lists/Tables:** Zebra-striping is prohibited. Use 1px horizontal dividers. On hover, the entire row should highlight in a subtle blue-tinted slate.
- **Toggles:** Small, rectangular switchers. When "On," the track should use the `status_active` color.