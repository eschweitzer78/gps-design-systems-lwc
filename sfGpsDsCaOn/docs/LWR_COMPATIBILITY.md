# Ontario Design System - LWR Compatibility Report

This document analyzes the `sfGpsDsCaOn` package for compatibility with Salesforce Lightning Web Runtime (LWR) Digital Experience sites.

---

## Executive Summary

| Category | Status | Notes |
|----------|--------|-------|
| Component Targets | ✅ Compatible | Uses `lightningCommunity__Page` and `lightningCommunity__Default` |
| Render Mode | ✅ Compatible | Uses Light DOM (`renderMode = "light"`) where needed |
| Navigation | ✅ Compatible | Uses `NavigationMixin` correctly |
| Web Components | ✅ Compatible | Uses `lwc:external` for Ontario DS web components |
| Slots | ✅ Compatible | Named slots configured for LWR |
| CSS Scoping | ✅ Compatible | Uses Light DOM for CSS inheritance |
| Wire Adapters | ✅ N/A | No problematic wire adapters used |

**Overall Status: ✅ LWR Compatible**

---

## Detailed Analysis

### 1. Component Targets

All exposed components use appropriate targets for Experience Cloud sites:

```xml
<targets>
  <target>lightningCommunity__Page</target>
  <target>lightningCommunity__Default</target>
</targets>
```

**Compatibility Notes:**
- These targets work in both Aura-based and LWR-based Experience Cloud sites
- `lightningCommunity__Default` provides property configuration in Experience Builder
- Components will appear in the Components panel when editing pages

**Components Reviewed:**
| Component | API Version | Targets |
|-----------|-------------|---------|
| sfGpsDsCaOnAsideComm | 65.0 | ✅ Community targets |
| sfGpsDsCaOnBadgeComm | 65.0 | ✅ Community targets |
| sfGpsDsCaOnBlockquoteComm | 65.0 | ✅ Community targets |
| sfGpsDsCaOnButtonComm | 65.0 | ✅ Community targets |
| sfGpsDsCaOnCalloutComm | 65.0 | ✅ Community targets |
| sfGpsDsCaOnCardComm | 64.0 | ✅ Community targets |
| sfGpsDsCaOnCardCollectionLwr | 65.0 | ✅ Community targets |
| sfGpsDsCaOnCriticalAlertComm | 65.0 | ✅ Community targets |
| sfGpsDsCaOnPageAlertComm | 65.0 | ✅ Community targets |

---

### 2. Light DOM Rendering

Several components use Light DOM rendering (`static renderMode = "light"`), which is **required for LWR slot support** and CSS inheritance:

| Component | Render Mode | Purpose |
|-----------|-------------|---------|
| sfGpsDsCaOnCard | Light | CSS styling, slot support |
| sfGpsDsCaOnCardCollectionLwr | Light | Slot support for cards |
| sfGpsDsCaOnCallout | Light | CSS styling, slot support |
| sfGpsDsCaOnAside | Light | CSS styling, slot support |

**Why Light DOM is Important for LWR:**
- Allows CSS from static resources to cascade into components
- Enables proper slot functionality in LWR
- Matches the Ontario Design System's expected DOM structure

**Verified Pattern:**
```typescript
export default class SfGpsDsCaOnCard extends SfGpsDsElement {
  static renderMode = "light";
  // ...
}
```

```html
<template lwc:render-mode="light">
  <!-- content -->
</template>
```

---

### 3. Navigation

The `sfGpsDsCaOnButtonComm` component uses `NavigationMixin` for programmatic navigation:

```typescript
import { NavigationMixin } from "lightning/navigation";

export default class SfGpsDsCaOnButtonComm 
extends NavigationMixin<SfGpsDsLwc>(SfGpsDsLwc) {
  handleClick(_event: MouseEvent): void {
    if (this.url) {
      this[NavigationMixin.Navigate]({
        type: "standard__webPage",
        attributes: { url: this.url }
      });
    }
  }
}
```

**Compatibility Status:** ✅ Compatible
- `NavigationMixin` is fully supported in LWR
- Uses `standard__webPage` page reference type which works correctly
- Hash navigation fallback is also implemented

---

### 4. External Web Components

The package uses Ontario Design System web components via `lwc:external`:

```html
<ontario-button lwc:external ...>
</ontario-button>

<ontario-badge lwc:external ...>
</ontario-badge>

<ontario-blockquote lwc:external ...>
</ontario-blockquote>
```

**Components Using External Web Components:**
- `sfGpsDsCaOnButtonComm` → `<ontario-button>`
- `sfGpsDsCaOnBadgeComm` → `<ontario-badge>`
- `sfGpsDsCaOnBlockquoteComm` → `<ontario-blockquote>`
- `sfGpsDsCaOnPageAlertComm` → `<ontario-page-alert>`
- `sfGpsDsCaOnCriticalAlertComm` → `<ontario-critical-alert>`

**LWR Requirement:**
- External web components require `lwc:external` attribute ✅
- The Ontario Design System component library must be loaded (see [POST_DEPLOYMENT.md](./POST_DEPLOYMENT.md))

---

### 5. Slot Usage

The package uses named slots which are supported in LWR with Light DOM:

| Component | Slots | Notes |
|-----------|-------|-------|
| sfGpsDsCaOnCardComm | `Card-Description` | Named slot |
| sfGpsDsCaOnCardCollectionLwr | `Cards` | Named slot for child cards |
| sfGpsDsCaOnCalloutComm | `Callout-Heading`, `Callout-Content` | Multiple named slots |
| sfGpsDsCaOnAsideComm | `Aside-Heading`, `Aside-Content` | Multiple named slots |

**LWR Slot Compatibility:**
- ✅ Named slots work correctly in Light DOM components
- ✅ Slot forwarding (`slot="heading"`) is properly implemented
- ✅ Default slot content with `lwc:dom="manual"` is used correctly

---

### 6. CSS Considerations

**Scoping:**
- Light DOM components allow global CSS to cascade in
- The `caon-scope` class is added to components for targeted styling:

```typescript
connectedCallback() {
  super.connectedCallback?.();
  this.classList.add("caon-scope");
}
```

**CSS Custom Properties:**
- Components can use CSS custom properties defined in `global.css`
- Example: `var(--ontario-colour-link)`

---

## Known Limitations

### 1. Ontario Design System Component Library Dependency

The following components depend on the Ontario Design System web component library:
- `sfGpsDsCaOnButtonComm`
- `sfGpsDsCaOnBadgeComm`
- `sfGpsDsCaOnBlockquoteComm`
- `sfGpsDsCaOnPageAlertComm`
- `sfGpsDsCaOnCriticalAlertComm`

**Action Required:** 
The Ontario Design System component library JavaScript must be loaded in the site. This can be done via:
1. Experience Builder head markup
2. A dedicated loader component

### 2. No Page Layout Components

Unlike `sfGpsDsAuVic2`, this package does not include LWR page layout components (`lightningCommunity__Page_Layout` target). 

**Recommendation:** Consider adding page layout components for full theme support:
- `sfGpsDsCaOnStandardPageLayoutLwr`
- `sfGpsDsCaOnSidebarPageLayoutLwr`

---

## Recommendations

### High Priority

1. **Load Ontario DS Component Library**
   - Add the Ontario Design System component library script to the site head
   - Required for `ontario-*` web components to function

2. **Configure Static Resources**
   - Deploy `sfGpsDsCaOnGlobalStyles` static resource
   - Add CSS references to site head markup

### Medium Priority

3. **Add Page Layout Components**
   - Create LWR page layout components with `lightningCommunity__Page_Layout` target
   - Provides consistent page structure across the site

4. **Create Theme Layout Component**
   - Implement a theme layout wrapper component
   - Include header, footer, and navigation

### Low Priority

5. **Add OmniStudio Integration Tests**
   - Verify OmniStudio forms render correctly with Ontario styling
   - Test form validation states

---

## Testing Checklist

Before deploying to production, verify:

- [ ] Components appear in Experience Builder component panel
- [ ] Drag-and-drop components render correctly on page
- [ ] Component properties are configurable in property panel
- [ ] Slots accept child components in Experience Builder
- [ ] Navigation works correctly (button clicks)
- [ ] CSS custom properties cascade correctly
- [ ] Fonts load from static resources
- [ ] Icons render from SVG sprites
- [ ] Responsive breakpoints work correctly
- [ ] Focus states are visible (accessibility)

---

## Version Compatibility

| Package | Minimum API Version | Recommended |
|---------|---------------------|-------------|
| sfGpsDsCaOn | 64.0 | 65.0+ |
| Salesforce | Winter '24+ | Spring '24+ |
| LWR | 1.0+ | Latest |

---

## References

- [LWR Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/)
- [Light DOM in LWC](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.create_light_dom)
- [Experience Builder Components](https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/template_custom_components.htm)
- [Ontario Design System](https://designsystem.ontario.ca/)
