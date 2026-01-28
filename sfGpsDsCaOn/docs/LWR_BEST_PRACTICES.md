# LWR (Lightning Web Runtime) Best Practices

This document outlines LWR best practices followed by the Ontario Design System components and recommendations for optimal performance in Experience Cloud LWR sites.

## Current Compliance

| Best Practice           | Status         | Notes                                        |
| ----------------------- | -------------- | -------------------------------------------- |
| Light DOM               | ✅ Implemented | All components use `lwc:render-mode="light"` |
| Keys in loops           | ✅ Implemented | All 33 `for:each` loops have proper keys     |
| Public properties       | ✅ Implemented | 776 `@api` uses, 51 `@track` uses            |
| No aura dependencies    | ✅ Verified    | No `aura:*` namespace usage                  |
| No restricted APIs      | ✅ Verified    | LWS-compatible patterns                      |
| postMessage for iframes | ✅ Implemented | GIS components use secure postMessage        |
| CSS variables           | ✅ Implemented | Design tokens with fallbacks                 |

---

## Best Practices Implemented

### 1. Light DOM Rendering

All components use Light DOM for Experience Cloud compatibility:

```html
<template lwc:render-mode="light">
  <!-- Component content -->
</template>
```

**Benefits:**

- CSS styling works across component boundaries
- Better SEO (content is in the main DOM)
- Required for LWR Experience Cloud sites

### 2. Keys in Loops

All `for:each` iterations include unique `key` attributes:

```html
<template for:each="{items}" for:item="item">
  <li key="{item.id}">{item.label}</li>
</template>
```

**Benefits:**

- Efficient DOM diffing and updates
- Prevents rendering issues when lists change
- Required by LWC compiler

### 3. Public Properties Over Private State

Components favor `@api` over `@track`:

```javascript
// ✅ Preferred: Public property
@api heading;

// ⚠️ Use sparingly: Private reactive state
@track _isOpen = false;
```

**Current ratio:** 94% `@api` / 6% `@track`

**Benefits:**

- Clear component API
- Better parent-child communication
- Reduced internal state management

### 4. Computed Getters for Derived Values

Instead of setting reactive properties, use getters:

```javascript
// ✅ Computed getter (no re-render trigger)
get computedClassName() {
  return `base-class ${this.isActive ? 'active' : ''}`;
}

// ❌ Avoid: Setting derived state
set isActive(value) {
  this._className = `base-class ${value ? 'active' : ''}`; // Triggers re-render
}
```

### 5. Avoiding Unnecessary Re-Renders in renderedCallback

The `renderedCallback` runs after every render cycle. Unguarded code causes performance issues:

```javascript
// ❌ BAD: Runs on every render
renderedCallback() {
  this.setAttribute("data-ready", "true");  // DOM update on every render
  const el = this.template.querySelector(".hint");  // DOM query on every render
  this.computedValue = el?.id;  // State change triggers another render!
}

// ✅ GOOD: Guard with initialization flag
_initialized = false;

renderedCallback() {
  if (!this._initialized) {
    this._initialized = true;
    this.setAttribute("data-ready", "true");
  }
}

// ✅ GOOD: Check if value actually changed
_previousErrorState = null;

renderedCallback() {
  const currentErrorState = Boolean(this.hasError);
  if (currentErrorState !== this._previousErrorState) {
    this._previousErrorState = currentErrorState;
    if (currentErrorState) {
      this.setAttribute("data-has-error", "true");
    } else {
      this.removeAttribute("data-has-error");
    }
  }
}
```

**Patterns to avoid:**

- DOM queries (`querySelector`) on every render
- Setting attributes/properties without change detection
- Modifying `@track` properties (triggers re-render loop)

### 6. No Aura or Restricted APIs

Components avoid:

- `$A` (Aura framework)
- `eval()` or `new Function()`
- `document.write()`
- Direct DOM manipulation outside Light DOM

For GIS/ESRI integration, components use Visualforce iframes with `postMessage`.

---

## Server-Side Rendering (SSR) Readiness

### SSR Target Configuration

When your Experience Cloud site has SSR enabled, add this target to static components:

```xml
<targets>
  <target>lightningCommunity__Page</target>
  <target>lightningCommunity__Default</target>
  <target>lightning__ServerRenderableWithHydration</target>
</targets>
```

### Components Suitable for SSR

These components are primarily static and can benefit from SSR:

| Component                  | Reason                               |
| -------------------------- | ------------------------------------ |
| `sfGpsDsCaOnHeader`        | Static layout, minimal interactivity |
| `sfGpsDsCaOnFooter`        | Static layout                        |
| `sfGpsDsCaOnBreadcrumbs`   | Static navigation                    |
| `sfGpsDsCaOnCallout`       | Text content                         |
| `sfGpsDsCaOnBlockquote`    | Text content                         |
| `sfGpsDsCaOnBadge`         | Static label                         |
| `sfGpsDsCaOnPageAlert`     | Static alert                         |
| `sfGpsDsCaOnCriticalAlert` | Static alert                         |
| `sfGpsDsCaOnInPageNav`     | Navigation links                     |
| `sfGpsDsCaOnSummaryList`   | Static data display                  |
| `sfGpsDsCaOnTable`         | Static data display                  |

### Components NOT Suitable for SSR

These require client-side rendering:

| Component                      | Reason                         |
| ------------------------------ | ------------------------------ |
| `sfGpsDsCaOnModal`             | Dynamic open/close, focus trap |
| `sfGpsDsCaOnSearch`            | API calls, dynamic suggestions |
| `sfGpsDsCaOnSiteSelectorTool`  | Iframe + postMessage           |
| `sfGpsDsCaOnDecisionExplainer` | API calls                      |
| Form components                | User input, validation         |

### Enabling SSR in Experience Cloud

1. Go to **Setup > Digital Experiences > Settings**
2. Enable **Server-Side Rendering (SSR)** for your site
3. Add `lightning__ServerRenderableWithHydration` target to component meta files
4. Deploy and test

> **Note:** SSR availability depends on org edition and configuration.

---

## Performance Optimization

### Lazy Loading (Future Enhancement)

For large components, consider dynamic imports:

```javascript
// Lazy load on demand
async loadMarkdownParser() {
  const { parseMarkdown } = await import('c/sfGpsDsMarkdown');
  return parseMarkdown(this.content);
}
```

### Bundle Size Considerations

- Avoid importing entire utility libraries
- Use tree-shaking-friendly imports
- Split large components into smaller sub-components

### Re-render Optimization

```javascript
// ✅ Good: Batch updates
updateState(data) {
  this._items = data.items;
  this._total = data.total;
  // Single re-render
}

// ❌ Avoid: Multiple sequential updates
updateStateSequential(data) {
  this._items = data.items;  // Re-render 1
  this._total = data.total;  // Re-render 2
}
```

---

## LWS (Lightning Web Security) Compatibility

All components are LWS-compatible:

| Pattern                  | Implementation |
| ------------------------ | -------------- |
| No `eval()`              | ✅             |
| No `with` statements     | ✅             |
| No `arguments.caller`    | ✅             |
| Bound event handlers     | ✅             |
| Safe `postMessage` usage | ✅             |

### Safe iframe Communication

```javascript
// Component sends message to iframe
sendMessageToMap(message) {
  const iframe = this.querySelector('.map-iframe');
  if (iframe?.contentWindow) {
    iframe.contentWindow.postMessage(JSON.stringify(message), '*');
  }
}

// Component receives message from iframe
handleMapMessage(event) {
  try {
    const data = event.data;
    // Validate and process data
  } catch {
    // Handle errors gracefully
  }
}
```

---

## Testing for LWR Compatibility

### Checklist

- [ ] Component renders in Light DOM
- [ ] No console errors in LWR preview
- [ ] Keyboard navigation works
- [ ] Focus management works
- [ ] CSS styling applies correctly
- [ ] No Aura namespace usage
- [ ] All loops have keys
- [ ] Event handlers are bound correctly

### Automated Testing

Include LWR compatibility in Jest tests:

```javascript
import { createElement } from "lwc";
import MyComponent from "c/myComponent";

describe("LWR Compatibility", () => {
  it("renders in light DOM", () => {
    const element = createElement("c-my-component", {
      is: MyComponent
    });
    document.body.appendChild(element);

    // Light DOM elements are direct children
    expect(element.querySelector(".my-class")).not.toBeNull();
  });
});
```

---

## Resources

- [LWR Developer Guide](https://developer.salesforce.com/docs/platform/lwr/overview)
- [LWC Best Practices](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.get_started_introduction)
- [Experience Cloud SSR](https://help.salesforce.com/s/articleView?id=sf.exp_cloud_ssr.htm)
- [Lightning Web Security](https://developer.salesforce.com/docs/platform/lwc/guide/security-lwsec.html)

---

## Changelog

| Date       | Change                                   |
| ---------- | ---------------------------------------- |
| 2026-01-28 | Initial LWR best practices documentation |
