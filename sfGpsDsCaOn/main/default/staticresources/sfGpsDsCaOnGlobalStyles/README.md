# Ontario Design System - Static Resources for LWR

This static resource contains the fonts, icons, logos, and CSS required to implement the Ontario Design System v2.2.0 on Salesforce Lightning Web Runtime (LWR) Digital Experience sites.

## Contents

### Assets

- **fonts/** - Web fonts (woff2 format)
  - Open Sans (400, 600, 700 weights) - Primary body font
  - Raleway Modified (400, 600, 700 weights) - Heading font
  - Courier Prime (400 weight) - Monospace font

- **icons/** - SVG icon sprites
  - `ontario-icons-primary.svg` - Primary icon set
  - `ontario-icons-secondary.svg` - Secondary icons

- **logos/** - Ontario government logos
  - Desktop and mobile logo variants
  - Footer supergraphic logos

- **favicons/** - Favicon set
  - ICO, SVG, and PNG formats
  - Apple touch icons

### CSS Files

- **global.css** - CSS custom properties (design tokens), font-face declarations, base styles
- **ds-theme.css** - Full Ontario Design System theme CSS (minified)
- **byo_lwr.css** - LWR-specific overrides
- **byo_lwr_omnistudio.css** - OmniStudio form integration styles

### Configuration

- **head.txt** - Sample HTML head markup for LWR site configuration

## Usage in LWR Sites

### 1. Configure Site Head Markup

In Experience Builder, add the stylesheet references from `head.txt` to your site's head markup:

```html
<link rel="stylesheet" href="{ basePath }/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/global.css" />
<link rel="stylesheet" href="{ basePath }/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/ds-theme.css" />
```

### 2. Using Icons

Reference icons using SVG use syntax:

```html
<svg class="ontario-icon" aria-hidden="true">
  <use xlink:href="{ basePath }/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/assets/icons/ontario-icons-primary.svg#ontario-icon-search"></use>
</svg>
```

### 3. OmniStudio Forms

For OmniStudio integration, also include:

```html
<link rel="stylesheet" href="{ basePath }/sfsites/c/resource/sfGpsDsCaOnGlobalStyles/byo_lwr_omnistudio.css" />
```

## CSS Custom Properties

The global.css file defines CSS custom properties (design tokens) that can be used throughout your site:

- Colors: `--ontario-colour-*`
- Typography: `--ontario-font-*`
- Spacing: `--ontario-spacing-*`
- Breakpoints: `--ontario-breakpoint-*`

## Source

Based on Ontario Design System v2.2.0
https://designsystem.ontario.ca/
