# Ontario Design System - LWR Compatibility Report

This document analyzes the `sfGpsDsCaOn` package for compatibility with Salesforce Lightning Web Runtime (LWR) Digital Experience sites.

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
| sfGpsDsCaOnButtonComm | 65.0 | ✅ Community targets (with icons) |
| sfGpsDsCaOnCalloutComm | 65.0 | ✅ Community targets |
| sfGpsDsCaOnCardComm | 64.0 | ✅ Community targets |
| sfGpsDsCaOnCardCollectionLwr | 65.0 | ✅ Community targets |
| sfGpsDsCaOnCriticalAlertComm | 65.0 | ✅ Community targets |
| sfGpsDsCaOnPageAlertComm | 65.0 | ✅ Community targets |
| sfGpsDsCaOnActionCardCollectionComm | 65.0 | ✅ Community targets |
| sfGpsDsCaOnModalComm | 65.0 | ✅ Community targets |
| sfGpsDsCaOnSiteSelectorTool | 65.0 | ✅ Community targets |
| sfGpsDsCaOnDischargePointSelector | 65.0 | ✅ Community targets |
| sfGpsDsCaOnActivityStatusCardComm | 65.0 | ✅ Community targets |
| sfGpsDsCaOnSiteTaskCardComm | 65.0 | ✅ Community targets |

---

### 2. Light DOM Rendering

Several components use Light DOM rendering (`static renderMode = "light"`), which is **required for LWR slot support** and CSS inheritance:

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

### 3. Navigation

The `sfGpsDsCaOnButtonComm` component uses `NavigationMixin` for programmatic navigation:

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

**Compatibility Status:** ✅ Compatible

- `NavigationMixin` is fully supported in LWR
- Uses `standard__webPage` page reference type which works correctly
- Hash navigation fallback is also implemented

---

### 4. External Web Components

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

**LWR Requirement:**

- External web components require `lwc:external` attribute ✅
- The Ontario Design System component library must be loaded (see [POST_DEPLOYMENT.md](./POST_DEPLOYMENT.md))

---

### 5. Slot Usage

The package uses named slots which are supported in LWR with Light DOM:

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

---

### 7. New Components Added (LWR/LWS Compatible)

The following components have been added with full LWR/LWS compatibility:

| Component                           | Render Mode | LWR Features Used                         |
| ----------------------------------- | ----------- | ----------------------------------------- |
| `sfGpsDsCaOnModal`                  | Light       | Focus trapping, keyboard navigation, ARIA |
| `sfGpsDsCaOnSiteSelectorTool`       | Light       | postMessage, iframe communication         |
| `sfGpsDsCaOnCoordinateInput`        | Light       | Multi-format input handling               |
| `sfGpsDsCaOnDischargePointSelector` | Light       | Composite component, event delegation     |
| `sfGpsDsCaOnSelectableCard`         | Light       | Badge support, link integration           |
| `sfGpsDsCaOnActionCard`             | Light       | Markdown parsing, slot support            |
| `sfGpsDsCaOnActivityStatusCard`     | Light       | Progress indicators, computed properties  |
| `sfGpsDsCaOnSiteTaskCard`           | Light       | Task list integration                     |
| `sfGpsDsCaOnDecisionExplainerComm`  | Light       | API callouts, ARIA live regions           |

---

### 7.1. Decision Explainer Component - LWR Considerations

The `sfGpsDsCaOnDecisionExplainerComm` component calls Salesforce APIs via Apex. For LWR sites, special configuration is required:

**LWR Guest User Compatibility:**

| Scenario                  | Session ID  | Named Credential | Status      |
| ------------------------- | ----------- | ---------------- | ----------- |
| Aura site - Authenticated | ✅ Works    | Optional         | ✅ Works    |
| Aura site - Guest         | ❌ Null     | Required         | ⚠️ Needs NC |
| LWR site - Authenticated  | ⚠️ May work | Recommended      | ✅ Works    |
| LWR site - Guest          | ❌ Null     | **Required**     | ⚠️ Needs NC |

**Issue:** `UserInfo.getSessionId()` returns `null` for guest users in LWR Experience Cloud sites.

**Solution:** The Apex controller (`SfGpsDsCaOnDecisionExplainerController`) automatically:

1. Checks for Named Credential `SfGpsDsCaOnDecisionExplainer`
2. Uses Named Credential if available (handles auth automatically)
3. Falls back to Session ID for backward compatibility

**Required Setup for LWR Guest Users:**

1. Create External Credential with OAuth 2.0 Client Credentials flow
2. Create Named Credential `SfGpsDsCaOnDecisionExplainer` pointing to your org
3. Grant External Credential access to the guest user profile
4. See [DECISION_EXPLAINER_SETUP.md](./DECISION_EXPLAINER_SETUP.md) for detailed instructions

**Error Handling:**

If authentication fails, the component displays a helpful error message guiding administrators to configure the Named Credential

---

### 8. LWR/LWS Pattern: Avoiding Template Negation

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

**Components Updated with this Pattern:**

- `sfGpsDsCaOnSiteSelectorTool` - `hasVfPageUrl`, `hasNoVfPageUrl`
- `sfGpsDsCaOnFormSiteSelectorTool` - `hasSelectedAddress`, `hasNoSelectedAddress`
- `sfGpsDsCaOnDischargePointSelector` - `hasVfPageUrl`, `hasNoVfPageUrl`

---

### 9. LWR/LWS Pattern: postMessage Communication

For Visualforce iframe integration, use `postMessage` with explicit origin validation:

**LWC Side (sending to VF):**

```javascript
sendMessageToMap(action, detail) {
  const iframe = this.template.querySelector("iframe");
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(
      { action, detail },
      this._vfOrigin  // Explicit origin, never use '*'
    );
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
  // Critical: Clean up event listeners in LWR
  window.removeEventListener("message", this._messageHandler);
}

handleMapMessage(event) {
  // Validate origin
  if (!event.origin.includes(".force.com")) return;

  const { action, detail } = event.data;
  // Handle message...
}
```

**VF Page Side:**

```javascript
// Send to LWC
window.parent.postMessage(
  { action: "addressSelected", detail: addressData },
  "{!communityUrl}" // Use Apex-provided origin
);

// Receive from LWC
window.addEventListener("message", function (event) {
  if (!event.origin.includes(".site.com")) return;
  // Handle message...
});
```

---

### 10. LWR/LWS Pattern: Event Listener Cleanup

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

---

### 11. LWR/LWS Pattern: Boolean Property Initialization

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

---

### 12. Focus Trapping in Modals

The `sfGpsDsCaOnModal` component implements accessible focus trapping for LWR:

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

## References

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
