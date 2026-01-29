# Ontario Design System - LWR Compatibility & Best Practices Guide

This document covers Lightning Web Runtime (LWR) compatibility analysis and best practices for the `sfGpsDsCaOn` package in Salesforce Experience Cloud sites.

---

## Executive Summary

| Category          | Status        | Notes                                                             |
| ----------------- | ------------- | ----------------------------------------------------------------- |
| Component Targets | ✅ Compatible | Uses `lightningCommunity__Page` and `lightningCommunity__Default` |
| Render Mode       | ✅ Compatible | Uses Light DOM (`renderMode = "light"`) where needed              |
| Navigation        | ✅ Compatible | Uses `NavigationMixin` correctly                                  |
| Web Components    | ✅ Compatible | Uses `lwc:external` for Ontario DS web components                 |
| Slots             | ✅ Compatible | Named slots configured for LWR                                    |
| CSS Scoping       | ✅ Compatible | Uses Light DOM for CSS inheritance                                |
| Wire Adapters     | ✅ N/A        | No problematic wire adapters used                                 |

**Overall Status: ✅ LWR Compatible**

---

## Best Practices Compliance

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

## Light DOM Rendering

All components use Light DOM rendering (`static renderMode = "light"`), which is **required for LWR slot support** and CSS inheritance:

| Component                         | Render Mode | Purpose                       |
| --------------------------------- | ----------- | ----------------------------- |
| sfGpsDsCaOnCard                   | Light       | CSS styling, slot support     |
| sfGpsDsCaOnCardCollectionLwr      | Light       | Slot support for cards        |
| sfGpsDsCaOnCallout                | Light       | CSS styling, slot support     |
| sfGpsDsCaOnAside                  | Light       | CSS styling, slot support     |
| sfGpsDsCaOnModal                  | Light       | Focus trapping, ARIA, slots   |
| sfGpsDsCaOnSiteSelectorTool       | Light       | iframe embedding, postMessage |
| sfGpsDsCaOnCoordinateInput        | Light       | Multi-format input, CSS       |
| sfGpsDsCaOnDischargePointSelector | Light       | Modal integration, tabs       |
| sfGpsDsCaOnSelectableCard         | Light       | Badge/link support, CSS       |
| sfGpsDsCaOnActionCard             | Light       | CSS styling, slot support     |
| sfGpsDsCaOnActivityStatusCard     | Light       | Progress indicators, CSS      |
| sfGpsDsCaOnSiteTaskCard           | Light       | Task list integration, CSS    |

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

## Keys in Loops

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

---

## Navigation Patterns

### Standard Web Page Navigation

```typescript
import { NavigationMixin } from "lightning/navigation";

export default class SfGpsDsCaOnButtonComm extends NavigationMixin<SfGpsDsLwc>(
  SfGpsDsLwc
) {
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

### Record Page Navigation (LWR Critical)

> **LWR Fix:** The `standard__recordPage` page reference requires `objectApiName` in LWR. Without it, navigation fails silently.

**Invalid Pattern (fails in LWR):**

```javascript
// Missing objectApiName - will fail silently in LWR
this[NavigationMixin.Navigate]({
  type: "standard__recordPage",
  attributes: {
    recordId: recordId,
    actionName: "view"
  }
});
```

**Valid Pattern (LWR compatible):**

```javascript
/**
 * Navigate to a record detail page.
 * LWR CRITICAL: objectApiName is required for routing.
 */
navigateToRecord(recordId, objectApiName) {
  const pageRef = {
    type: "standard__recordPage",
    attributes: {
      recordId: recordId,
      objectApiName: objectApiName,  // REQUIRED for LWR
      actionName: "view"
    }
  };

  this[NavigationMixin.Navigate](pageRef);
}
```

---

## External Web Components

The package uses Ontario Design System web components via `lwc:external`:

```html
<ontario-button lwc:external ...> </ontario-button>
<ontario-badge lwc:external ...> </ontario-badge>
<ontario-blockquote lwc:external ...> </ontario-blockquote>
```

**Components Using External Web Components:**

- `sfGpsDsCaOnButtonComm` → `<ontario-button>`
- `sfGpsDsCaOnBadgeComm` → `<ontario-badge>`
- `sfGpsDsCaOnBlockquoteComm` → `<ontario-blockquote>`
- `sfGpsDsCaOnPageAlertComm` → `<ontario-page-alert>`
- `sfGpsDsCaOnCriticalAlertComm` → `<ontario-critical-alert>`

**LWR Requirement:** The Ontario Design System component library must be loaded (see [POST_DEPLOYMENT.md](./POST_DEPLOYMENT.md)).

---

## LWR/LWS Common Patterns

### Avoiding Template Negation

LWR with Lightning Web Security does **not** support unary expressions (negation) in templates.

**Invalid Pattern (will cause deployment error):**

```html
<!-- ERROR: Template expression doesn't allow UnaryExpression -->
<div lwc:if="{!hasValue}">No value</div>
```

**Valid Pattern (use computed property):**

```javascript
// In JavaScript
get hasNoValue() {
  return !this.hasValue;
}
```

```html
<!-- In template -->
<div lwc:if="{hasNoValue}">No value</div>
```

**Components Using this Pattern:**

- `sfGpsDsCaOnSiteSelectorTool` - `hasVfPageUrl`, `hasNoVfPageUrl`
- `sfGpsDsCaOnFormSiteSelectorTool` - `hasSelectedAddress`, `hasNoSelectedAddress`
- `sfGpsDsCaOnDischargePointSelector` - `hasVfPageUrl`, `hasNoVfPageUrl`

### Boolean Property Initialization

LWS does not allow public boolean properties initialized to `true`:

**Invalid Pattern:**

```javascript
// ERROR: Boolean public properties should not be initialized to "true"
@api allowRemove = true;
```

**Valid Pattern (use getter/setter):**

```javascript
_allowRemove = true;

@api
get allowRemove() {
  return this._allowRemove;
}
set allowRemove(value) {
  this._allowRemove = value;
}
```

### Event Listener Cleanup

Always remove event listeners in `disconnectedCallback` to prevent memory leaks:

```javascript
export default class MyComponent extends LightningElement {
  _resizeHandler;
  _messageHandler;

  connectedCallback() {
    this._resizeHandler = this.handleResize.bind(this);
    this._messageHandler = this.handleMessage.bind(this);

    window.addEventListener("resize", this._resizeHandler);
    window.addEventListener("message", this._messageHandler);
  }

  disconnectedCallback() {
    window.removeEventListener("resize", this._resizeHandler);
    window.removeEventListener("message", this._messageHandler);
  }
}
```

### postMessage Communication

For Visualforce iframe integration, use `postMessage` with explicit origin validation.

> **Security Update:** Components now use strict origin validation instead of wildcard `*` or substring matching.

**LWC Side - Origin Extraction and Validation:**

```javascript
_vfOrigin = null;

getVfOrigin() {
  if (this._vfOrigin) {
    return this._vfOrigin;
  }

  if (this.vfPageUrl) {
    try {
      const url = new URL(this.vfPageUrl);
      this._vfOrigin = url.origin;
      return this._vfOrigin;
    } catch {
      console.warn("Invalid vfPageUrl, cannot extract origin");
    }
  }

  return "*"; // Fallback - less secure but functional
}

isValidOrigin(eventOrigin) {
  const expectedOrigin = this.getVfOrigin();
  if (expectedOrigin === "*") {
    return true;
  }
  return eventOrigin === expectedOrigin; // Strict match
}
```

**LWC Side (sending to VF):**

```javascript
sendMessageToMap(message) {
  const iframe = this.querySelector(".map-iframe");
  if (iframe && iframe.contentWindow) {
    try {
      const targetOrigin = this.getVfOrigin();
      iframe.contentWindow.postMessage(JSON.stringify(message), targetOrigin);
    } catch (e) {
      console.warn("Failed to send message to map:", e.message);
    }
  }
}
```

**LWC Side (receiving from VF):**

```javascript
connectedCallback() {
  this._messageHandler = this.handleMapMessage.bind(this);
  window.addEventListener("message", this._messageHandler);
}

disconnectedCallback() {
  window.removeEventListener("message", this._messageHandler);
}

handleMapMessage(event) {
  if (!this.isValidOrigin(event.origin)) {
    return; // Silently ignore untrusted origins
  }

  try {
    const data = event.data;
    // Handle message...
  } catch {
    // Ignore parsing errors
  }
}
```

### Focus Trapping in Modals

The `sfGpsDsCaOnModal` component implements accessible focus trapping:

```javascript
handleKeyDown(event) {
  if (event.key === "Escape") {
    this.close();
    return;
  }

  if (event.key === "Tab") {
    const focusableElements = this.getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
}

getFocusableElements() {
  return this.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
}
```

---

## Computed Getters for Derived Values

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

---

## Avoiding Unnecessary Re-Renders in renderedCallback

The `renderedCallback` runs after every render cycle. Unguarded code causes performance issues:

```javascript
// ❌ BAD: Runs on every render
renderedCallback() {
  this.setAttribute("data-ready", "true");
  const el = this.template.querySelector(".hint");
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

| Component                      | Reason                         |
| ------------------------------ | ------------------------------ |
| `sfGpsDsCaOnModal`             | Dynamic open/close, focus trap |
| `sfGpsDsCaOnSearch`            | API calls, dynamic suggestions |
| `sfGpsDsCaOnSiteSelectorTool`  | Iframe + postMessage           |
| `sfGpsDsCaOnDecisionExplainer` | API calls                      |
| Form components                | User input, validation         |

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

Components avoid:

- `$A` (Aura framework)
- `eval()` or `new Function()`
- `document.write()`
- Direct DOM manipulation outside Light DOM

---

## Decision Explainer - LWR Guest User Considerations

The `sfGpsDsCaOnDecisionExplainerComm` component calls Salesforce APIs via Apex. For LWR sites, special configuration is required:

| Scenario                  | Session ID  | Named Credential | Status      |
| ------------------------- | ----------- | ---------------- | ----------- |
| Aura site - Authenticated | ✅ Works    | Optional         | ✅ Works    |
| Aura site - Guest         | ❌ Null     | Required         | ⚠️ Needs NC |
| LWR site - Authenticated  | ⚠️ May work | Recommended      | ✅ Works    |
| LWR site - Guest          | ❌ Null     | **Required**     | ⚠️ Needs NC |

**Issue:** `UserInfo.getSessionId()` returns `null` for guest users in LWR Experience Cloud sites.

**Solution:** The Apex controller automatically checks for Named Credential `SfGpsDsCaOnDecisionExplainer` and uses it if available. See [DECISION_EXPLAINER_SETUP.md](./DECISION_EXPLAINER_SETUP.md) for detailed instructions.

---

## Component Targets

All exposed components use appropriate targets for Experience Cloud sites:

```xml
<targets>
  <target>lightningCommunity__Page</target>
  <target>lightningCommunity__Default</target>
</targets>
```

**Components Reviewed:**

| Component                           | API Version | Targets              |
| ----------------------------------- | ----------- | -------------------- |
| sfGpsDsCaOnAsideComm                | 65.0        | ✅ Community targets |
| sfGpsDsCaOnBadgeComm                | 65.0        | ✅ Community targets |
| sfGpsDsCaOnBlockquoteComm           | 65.0        | ✅ Community targets |
| sfGpsDsCaOnButtonComm               | 65.0        | ✅ Community targets |
| sfGpsDsCaOnCalloutComm              | 65.0        | ✅ Community targets |
| sfGpsDsCaOnCardComm                 | 64.0        | ✅ Community targets |
| sfGpsDsCaOnCardCollectionLwr        | 65.0        | ✅ Community targets |
| sfGpsDsCaOnCriticalAlertComm        | 65.0        | ✅ Community targets |
| sfGpsDsCaOnPageAlertComm            | 65.0        | ✅ Community targets |
| sfGpsDsCaOnActionCardCollectionComm | 65.0        | ✅ Community targets |
| sfGpsDsCaOnModalComm                | 65.0        | ✅ Community targets |
| sfGpsDsCaOnSiteSelectorTool         | 65.0        | ✅ Community targets |
| sfGpsDsCaOnDischargePointSelector   | 65.0        | ✅ Community targets |
| sfGpsDsCaOnActivityStatusCardComm   | 65.0        | ✅ Community targets |
| sfGpsDsCaOnSiteTaskCardComm         | 65.0        | ✅ Community targets |

---

## Slot Usage

| Component                    | Slots                                | Notes                      |
| ---------------------------- | ------------------------------------ | -------------------------- |
| sfGpsDsCaOnCardComm          | `Card-Description`                   | Named slot                 |
| sfGpsDsCaOnCardCollectionLwr | `Cards`                              | Named slot for child cards |
| sfGpsDsCaOnCalloutComm       | `Callout-Heading`, `Callout-Content` | Multiple named slots       |
| sfGpsDsCaOnAsideComm         | `Aside-Heading`, `Aside-Content`     | Multiple named slots       |

**LWR Slot Compatibility:**

- ✅ Named slots work correctly in Light DOM components
- ✅ Slot forwarding (`slot="heading"`) is properly implemented
- ✅ Default slot content with `lwc:dom="manual"` is used correctly

---

## CSS Scoping

Light DOM components allow global CSS to cascade in. The `caon-scope` class is added for targeted styling:

```typescript
connectedCallback() {
  super.connectedCallback?.();
  this.classList.add("caon-scope");
}
```

Components can use CSS custom properties defined in `global.css`:

```css
color: var(--ontario-colour-link);
```

---

## Known Limitations

### 1. Ontario Design System Component Library Dependency

The following components depend on the Ontario Design System web component library:

- `sfGpsDsCaOnButtonComm`
- `sfGpsDsCaOnBadgeComm`
- `sfGpsDsCaOnBlockquoteComm`
- `sfGpsDsCaOnPageAlertComm`
- `sfGpsDsCaOnCriticalAlertComm`

**Action Required:** Load the Ontario Design System component library JavaScript via Experience Builder head markup.

### 2. No Page Layout Components

Unlike `sfGpsDsAuVic2`, this package does not include LWR page layout components (`lightningCommunity__Page_Layout` target).

**Recommendation:** Consider adding page layout components for full theme support.

---

## Testing Checklist

### Basic Component Tests

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

### GIS Component Tests

- [ ] Modal opens and closes correctly
- [ ] Focus trapping works in modal
- [ ] Escape key closes modal
- [ ] Visualforce iframe loads in Site Selector
- [ ] postMessage communication works (LWC ↔ VF)
- [ ] Address search returns results
- [ ] Map markers display correctly
- [ ] Coordinate input validates properly (UTM, DMS, Decimal)
- [ ] CSP configured correctly (see [GIS_GUIDE.md](./GIS_GUIDE.md))

### OmniScript Tests

- [ ] Form components render with Ontario styling
- [ ] Selectable cards support multi-select
- [ ] Badge and link properties display correctly
- [ ] NAICS picker cascades through 5 levels
- [ ] Site selector updates OmniScript data
- [ ] Discharge point selector updates coordinates

---

## Version Compatibility

| Package     | Minimum API Version | Recommended |
| ----------- | ------------------- | ----------- |
| sfGpsDsCaOn | 64.0                | 65.0+       |
| Salesforce  | Winter '24+         | Spring '24+ |
| LWR         | 1.0+                | Latest      |

---

## Resources

### Internal Documentation

- [GIS_GUIDE.md](./GIS_GUIDE.md) - GIS components, CSP configuration, ESRI integration
- [COMPONENT_API.md](./COMPONENT_API.md) - Component properties reference
- [OMNISTUDIO_FORMS.md](./OMNISTUDIO_FORMS.md) - OmniStudio form components

### External Documentation

- [LWR Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/)
- [Light DOM in LWC](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.create_light_dom)
- [Lightning Web Security](https://developer.salesforce.com/docs/platform/lwc/guide/security-lwsec-intro.html)
- [Experience Builder Components](https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/template_custom_components.htm)
- [Ontario Design System](https://designsystem.ontario.ca/)
- [Experience Cloud SSR](https://help.salesforce.com/s/articleView?id=sf.exp_cloud_ssr.htm)
