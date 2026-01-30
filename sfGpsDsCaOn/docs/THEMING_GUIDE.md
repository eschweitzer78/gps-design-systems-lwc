# Ontario Design System - Theming Guide

This guide explains how to customize the appearance of Ontario Design System components in Salesforce LWR sites using CSS custom properties.

---

## Table of Contents

1. [Overview](#overview)
2. [CSS Custom Properties](#css-custom-properties)
3. [Color Token Reference](#color-token-reference)
4. [Overriding Tokens in LWR Sites](#overriding-tokens-in-lwr-sites)
5. [Component Scoping](#component-scoping)
6. [Light DOM Requirements](#light-dom-requirements)
7. [Best Practices](#best-practices)

---

## Overview

The Ontario Design System components use CSS custom properties (CSS variables) for theming, with SCSS variable fallbacks for environments that don't support CSS custom properties. This approach allows:

- Runtime theming without recompilation
- Site-specific customization in Experience Builder
- Consistent color tokens across all components
- Fallback support for older browsers

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ LWR Site Theme (CSS Custom Properties)                      │
│ --ontario-color-link: #0066cc                               │
└─────────────────────────────────────────────────────────────┘
                              ↓ overrides
┌─────────────────────────────────────────────────────────────┐
│ Component SCSS                                               │
│ color: var(--ontario-color-link, #{$ontario-color-link});   │
└─────────────────────────────────────────────────────────────┘
                              ↓ fallback
┌─────────────────────────────────────────────────────────────┐
│ SCSS Variables (_ontario-variables.scss)                     │
│ $ontario-color-link: #0066cc !default;                       │
└─────────────────────────────────────────────────────────────┘
```

---

## CSS Custom Properties

### How They Work

Components reference CSS custom properties with SCSS fallbacks:

```scss
// In component SCSS
.ontario-button--primary {
  background-color: var(--ontario-color-link, #{$ontario-color-link});
}
```

This means:

1. First, the browser looks for `--ontario-color-link`
2. If not found, it uses the SCSS variable value (`#0066cc`)

### Setting Custom Properties

You can override these properties at different levels:

```css
/* Site-wide override */
:root {
  --ontario-color-link: #0055b8;
}

/* Component-specific override */
.my-custom-section {
  --ontario-color-link: #003d7a;
}
```

---

## Color Token Reference

### Core Colors

| Token | CSS Custom Property     | Default Value | Usage                    |
| ----- | ----------------------- | ------------- | ------------------------ |
| Black | `--ontario-color-black` | `#1a1a1a`     | Primary text, headings   |
| White | `--ontario-color-white` | `#ffffff`     | Backgrounds, button text |

### Greyscale Palette

| Token   | CSS Custom Property      | Default Value | Usage             |
| ------- | ------------------------ | ------------- | ----------------- |
| Grey 5  | `--ontario-greyscale-5`  | `#f5f5f5`     | Light backgrounds |
| Grey 10 | `--ontario-greyscale-10` | `#e6e6e6`     | Subtle borders    |
| Grey 20 | `--ontario-greyscale-20` | `#cccccc`     | Borders, dividers |
| Grey 60 | `--ontario-greyscale-60` | `#6b6b6b`     | Secondary text    |
| Grey 70 | `--ontario-greyscale-70` | `#4d4d4d`     | Darker text       |

### Interactive Colors

| Token        | CSS Custom Property            | Default Value | Usage                     |
| ------------ | ------------------------------ | ------------- | ------------------------- |
| Link         | `--ontario-color-link`         | `#0066cc`     | Links, primary buttons    |
| Link Hover   | `--ontario-color-link-hover`   | `#00478f`     | Link/button hover states  |
| Link Active  | `--ontario-color-link-active`  | `#002d5c`     | Link/button active states |
| Link Visited | `--ontario-color-link-visited` | `#551a8b`     | Visited links             |
| Focus        | `--ontario-color-focus`        | `#009adb`     | Focus rings, outlines     |

### Semantic Colors

| Token         | CSS Custom Property             | Default Value | Usage                          |
| ------------- | ------------------------------- | ------------- | ------------------------------ |
| Error         | `--ontario-color-error`         | `#d81a21`     | Error messages, invalid states |
| Error Light   | `--ontario-color-error-light`   | `#fcf2f2`     | Error backgrounds              |
| Success       | `--ontario-color-success`       | `#118847`     | Success messages               |
| Success Light | `--ontario-color-success-light` | `#e8f4ed`     | Success backgrounds            |
| Warning       | `--ontario-color-warning`       | `#ffd440`     | Warning messages               |
| Warning Light | `--ontario-color-warning-light` | `#fef6dc`     | Warning backgrounds            |
| Info          | `--ontario-color-info`          | `#1080a6`     | Information messages           |
| Info Light    | `--ontario-color-info-light`    | `#e8f4f7`     | Information backgrounds        |

---

## Overriding Tokens in LWR Sites

### Method 1: Site Theme CSS

In Experience Builder, add custom CSS to your site theme:

1. Go to **Builder** > **Theme** > **Edit CSS**
2. Add your overrides:

```css
:root {
  /* Override primary link color */
  --ontario-color-link: #0055b8;
  --ontario-color-link-hover: #004090;

  /* Override focus color */
  --ontario-color-focus: #0066cc;
}
```

### Method 2: Page-Level Overrides

For page-specific theming, wrap content in a container:

```html
<div class="custom-theme-section">
  <c-sf-gps-ds-ca-on-button-comm
    label="Custom Button"
    type="primary"
  ></c-sf-gps-ds-ca-on-button-comm>
</div>
```

```css
.custom-theme-section {
  --ontario-color-link: #7b2d8e; /* Purple accent */
}
```

### Method 3: Head Markup

In Experience Builder settings, add CSS via Head Markup:

1. Go to **Settings** > **Advanced** > **Edit Head Markup**
2. Add a `<style>` block:

```html
<style>
  :root {
    --ontario-color-link: #0055b8;
  }
</style>
```

---

## Component Scoping

### The `caon-scope` Class

All Ontario Design System components add the `caon-scope` class to their host element in the `connectedCallback`:

```typescript
connectedCallback() {
  super.connectedCallback?.();
  this.classList.add("caon-scope");
}
```

This enables:

- CSS scoping for Ontario DS styles
- Preventing style conflicts with other design systems
- Targeted overrides using the scope class

### Scoped Overrides

```css
/* Only affects Ontario DS components */
.caon-scope {
  --ontario-color-link: #0055b8;
}

/* Affects all Ontario buttons */
.caon-scope .ontario-button {
  border-radius: 8px;
}
```

---

## Light DOM Requirements

### Why Light DOM?

Ontario Design System components use Light DOM (`lwc:render-mode="light"`) for LWR compatibility:

```html
<template lwc:render-mode="light">
  <!-- Component content rendered in Light DOM -->
</template>
```

```typescript
export default class MyComponent extends SfGpsDsLwc {
  static renderMode = "light";
}
```

### Benefits

1. **CSS Inheritance**: CSS custom properties cascade properly
2. **Theme Integration**: Site-level themes apply to component internals
3. **Accessibility**: Screen readers access content normally
4. **LWR Compatibility**: Required for LWR sites

### Considerations

- Styles are not encapsulated - use specific class names
- Follow BEM naming convention (`ontario-component__element--modifier`)
- Use scoped CSS files (`.scoped.css`) for component-specific styles

---

## Best Practices

### Do

1. **Use semantic tokens**: Choose tokens based on purpose, not visual appearance

   ```css
   /* Good - semantic */
   color: var(--ontario-color-error);

   /* Avoid - specific color */
   color: #d81a21;
   ```

2. **Maintain contrast ratios**: When overriding colors, ensure WCAG 2.1 AA compliance
   - Normal text: 4.5:1 contrast ratio
   - Large text: 3:1 contrast ratio

3. **Test all states**: Verify hover, focus, active, and disabled states work correctly

4. **Document overrides**: Track any custom theming in your project documentation

### Don't

1. **Don't override structural styles**: Focus on colors, not layout or spacing

   ```css
   /* Avoid - structural changes */
   .ontario-button {
     padding: 20px; /* Breaks ODS specifications */
   }
   ```

2. **Don't remove focus indicators**: Always maintain visible focus states for accessibility

3. **Don't hard-code colors in components**: Always use CSS custom properties or SCSS functions

---

## SCSS Function Reference

The `_ontario-variables.scss` file provides helper functions:

```scss
// Import in your SCSS file
@import "../../../../staticresources/sfGpsDsCaOnGlobalStyles/_ontario-variables.scss";

// Use functions
.my-custom-element {
  color: ontario-color-text();
  background-color: ontario-color-bg();
  border-color: ontario-color-border-light();
}

// Use mixins
.my-focusable-element:focus {
  @include ontario-focus-ring;
}

.my-input.has-error {
  @include ontario-error-state;
}
```

### Available Functions

| Function                         | Returns              |
| -------------------------------- | -------------------- |
| `ontario-color-text()`           | Primary text color   |
| `ontario-color-text-secondary()` | Secondary text color |
| `ontario-color-text-muted()`     | Muted/disabled text  |
| `ontario-color-bg()`             | Background color     |
| `ontario-color-bg-light()`       | Light background     |
| `ontario-color-bg-disabled()`    | Disabled background  |
| `ontario-color-border()`         | Primary border       |
| `ontario-color-border-light()`   | Light border         |
| `ontario-color-focus()`          | Focus ring color     |
| `ontario-color-link()`           | Link color           |
| `ontario-color-error()`          | Error color          |
| `ontario-color-success()`        | Success color        |
| `ontario-color-warning()`        | Warning color        |
| `ontario-color-info()`           | Info color           |

### Available Mixins

| Mixin                    | Purpose                    |
| ------------------------ | -------------------------- |
| `ontario-focus-ring`     | Standard 4px focus outline |
| `ontario-error-state`    | Error border styling       |
| `ontario-disabled-state` | Disabled element styling   |

---

## Troubleshooting

### CSS Custom Properties Not Working

1. **Check browser support**: CSS custom properties work in all modern browsers
2. **Check cascade order**: Later declarations override earlier ones
3. **Check specificity**: More specific selectors may override your values
4. **Check for typos**: Variable names are case-sensitive

### Colors Look Wrong

1. **Verify hex values**: Ensure proper 6-digit hex format
2. **Check contrast**: Use tools like WebAIM Contrast Checker
3. **Test in context**: Colors may appear different on various backgrounds

### Styles Not Applying

1. **Verify Light DOM**: Components must use `static renderMode = "light"`
2. **Check `caon-scope`**: Ensure component adds this class
3. **Inspect element**: Use browser dev tools to trace style application

---

## Related Documentation

- [Ontario Design System - Colours](https://designsystem.ontario.ca/components/detail/colours.html)
- [AODA Compliance Guide](./AODA_COMPLIANCE.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
