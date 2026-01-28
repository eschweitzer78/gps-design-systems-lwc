# Ontario Design System - Developer Guide

This guide helps developers understand, debug, and extend the Ontario Design System OmniStudio form components.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Inherited Properties Reference](#inherited-properties-reference)
3. [Component Patterns](#component-patterns)
4. [Debugging](#debugging)
5. [Extending Components](#extending-components)
6. [Common Issues](#common-issues)

---

## Architecture Overview

### Three-Layer Inheritance Pattern

Every Ontario form component follows a three-layer inheritance pattern:

```
┌─────────────────────────────────────────────────────────────┐
│ Layer 1: OmniStudio Runtime Component                       │
│ e.g., omnistudio/omniscriptText                             │
│                                                             │
│ Provides:                                                   │
│ - OmniScript data binding (_jsonDef, _propSetMap)          │
│ - Value management (_value, _elementValue)                  │
│ - OmniScript integration (pubsub, navigation)              │
└─────────────────────────────────────────────────────────────┘
                              ↓ extends
┌─────────────────────────────────────────────────────────────┐
│ Layer 2: Stub + Base Form Class                             │
│ sfGpsDsOsrtOmniscriptText → sfGpsDsFormText                │
│                                                             │
│ Provides:                                                   │
│ - Validation mixin (sfGpsDsIsError, sfGpsDsErrorMessage)   │
│ - Merged field helpers (mergedLabel, mergedHelpText)       │
│ - Common form patterns                                      │
└─────────────────────────────────────────────────────────────┘
                              ↓ extends
┌─────────────────────────────────────────────────────────────┐
│ Layer 3: Ontario DS Component                               │
│ sfGpsDsCaOnFormText                                         │
│                                                             │
│ Provides:                                                   │
│ - Ontario DS template (render() → custom .html)            │
│ - Ontario-specific computed properties                      │
│ - CSS scoping (caon-scope class)                           │
└─────────────────────────────────────────────────────────────┘
```

### Why This Pattern?

1. **Separation of Concerns**: OmniStudio logic stays in OmniStudio, styling stays in DS
2. **Minimal Overrides**: Ontario components only override what's necessary (template)
3. **Maintainability**: OmniStudio updates don't break styling; DS updates don't break data
4. **Reusability**: Base classes work across all design systems (NSW, VIC, UK, etc.)

---

## Inherited Properties Reference

### From OmniStudio Runtime (`omniscript/*`)

These properties come from the OmniScript element configuration:

| Property | Type | Description | Example |
|----------|------|-------------|---------|
| `_jsonDef` | Object | Full element definition from OmniScript | `{ name: "FirstName", type: "Text", ... }` |
| `_propSetMap` | Object | Element properties map | `{ label: "First Name", required: true }` |
| `_value` | Any | Current field value | `"John"` |
| `_elementValue` | Any | Displayed value (may differ from _value) | `"John"` |
| `_name` | String | Element name/path | `"FirstName"` |
| `_index` | Number | Index in parent array (for repeating elements) | `0` |
| `jsonData` | Object | Complete OmniScript data object | `{ FirstName: "John", LastName: "Doe" }` |

#### `_propSetMap` Common Properties

| Property | Type | Description |
|----------|------|-------------|
| `label` | String | Field label text |
| `required` | Boolean | Field is required |
| `optional` | Boolean | Show (optional) flag |
| `readOnly` | Boolean | Field is read-only |
| `disabled` | Boolean | Field is disabled |
| `hide` | Boolean | Field is hidden |
| `help` | String | Help/hint text |
| `placeholder` | String | Placeholder text |
| `controlWidth` | Number | Bootstrap column width (1-12) |

### From Base Form Class (`sfGpsDsForm*`)

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `mergedLabel` | Getter | Label with merge field values resolved |
| `mergedHelpText` | Getter | Help text with merge fields resolved |
| `mergedPlaceholder` | Getter | Placeholder with merge fields resolved |
| `_handleHelpText` | String | Raw help text (before merge) |
| `_placeholder` | String | Raw placeholder (before merge) |
| `_messageWhenValueMissing` | String | Validation message for required |

### From Validation Mixin (`SfGpsDsOmniHasValidationMixin`)

| Property/Method | Type | Description |
|-----------------|------|-------------|
| `sfGpsDsIsError` | Boolean | True if field has validation error |
| `sfGpsDsErrorMessage` | String | Current error message to display |
| `_showValidation` | Boolean | True if validation UI should show |
| `reportValidity()` | Method | Triggers validation check |
| `checkValidity()` | Method | Returns validation state |
| `setCustomValidity(msg)` | Method | Sets custom error message |

---

## Component Patterns

### Standard Form Component Structure

```javascript
/*
 * Copyright notice...
 */

import SfGpsDsFormX from "c/sfGpsDsFormX";
import { computeClass } from "c/sfGpsDsHelpers";
import tmpl from "./sfGpsDsCaOnFormX.html";

// Debug flag - set to true to enable console logging
const DEBUG = false;
const CLASS_NAME = "SfGpsDsCaOnFormX";

/**
 * @slot X
 * @description Ontario Design System X input for OmniStudio forms.
 * 
 * Compliance:
 * - LWR: Uses Light DOM parent component
 * - LWS: No eval(), proper namespace imports
 * - Ontario DS: Uses ontario-* CSS classes
 * - WCAG 2.1 AA: Proper labeling, error messaging
 * 
 * @example
 * // Used automatically when OmniScript element type "X" is rendered
 * // with the Ontario DS LWC override configured.
 */
export default class extends SfGpsDsFormX {
  
  /* ========================================
   * COMPUTED PROPERTIES
   * Used in template bindings
   * ======================================== */

  /**
   * Computes CSS class for the label element.
   * @returns {string} Space-separated CSS classes
   * @template-binding: <label class={computedLabelClassName}>
   */
  get computedLabelClassName() {
    return computeClass({
      "ontario-label": true,
      "ontario-label--required": this._propSetMap.required
    });
  }

  /**
   * Determines if required/optional flag should display.
   * @returns {boolean} True if required or optional is set
   * @template-binding: <span lwc:if={showFlag}>
   */
  get showFlag() {
    return this._propSetMap?.required || this._propSetMap?.optional;
  }

  /**
   * Returns the flag text ("required" or "optional").
   * @returns {string} Flag text for display
   * @template-binding: ({flagText})
   */
  get flagText() {
    if (this._propSetMap?.required) return "required";
    if (this._propSetMap?.optional) return "optional";
    return "";
  }

  /**
   * Computes aria-describedby attribute value.
   * Links input to hint and error elements for screen readers.
   * @returns {string|null} Space-separated IDs or null
   * @template-binding: aria-describedby={computedAriaDescribedBy}
   */
  get computedAriaDescribedBy() {
    const ids = [];
    if (this.mergedHelpText) ids.push("hint-id");
    if (this.sfGpsDsIsError) ids.push("error-id");
    return ids.length > 0 ? ids.join(" ") : null;
  }

  /* ========================================
   * EVENT HANDLERS
   * Respond to user interactions
   * ======================================== */

  /**
   * Handles input value changes.
   * Updates the OmniScript data model via inherited methods.
   * @param {Event} event - The change event from the input
   */
  handleChange(event) {
    if (DEBUG) console.log(CLASS_NAME, "handleChange", event.target.value);
    
    // Call parent handler to update OmniScript value
    super.handleChange(event);
  }

  /* ========================================
   * LIFECYCLE HOOKS
   * Component initialization and updates
   * ======================================== */

  /**
   * Overrides render to use Ontario DS template.
   * @returns {Object} The component template
   */
  render() {
    return tmpl;
  }

  /**
   * Initializes component with Ontario DS classes.
   * IMPORTANT: Always call super.connectedCallback()
   */
  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    // Add CSS scoping class for Ontario DS styles
    this.classList.add("caon-scope");
    
    // Configure read-only styling class
    this._readOnlyClass = "sfgpsdscaon-read-only";
    
    if (DEBUG) console.log(CLASS_NAME, "connectedCallback", this._propSetMap);
  }
}
```

### Template Pattern

```html
<template>
  <!-- Ontario DS form group wrapper -->
  <div class="ontario-form-group">
    
    <!-- 1. LABEL -->
    <label 
      id="label-id" 
      class={computedLabelClassName} 
      for={inputId}
    >
      {mergedLabel}
      <!-- Required/Optional flag -->
      <span lwc:if={showFlag} class="ontario-label__flag">
        ({flagText})
      </span>
    </label>
    
    <!-- 2. HINT TEXT -->
    <p lwc:if={mergedHelpText} id="hint-id" class="ontario-hint">
      {mergedHelpText}
    </p>
    
    <!-- 3. ERROR MESSAGE (shown when invalid) -->
    <div 
      lwc:if={sfGpsDsIsError} 
      class="ontario-error-messaging" 
      id="error-id"
      role="alert"
      aria-live="assertive"
    >
      <svg class="ontario-icon" aria-hidden="true">
        <use href="#ontario-icon-alert-error"></use>
      </svg>
      <span class="ontario-error-messaging__content">
        {sfGpsDsErrorMessage}
      </span>
    </div>
    
    <!-- 4. INPUT ELEMENT -->
    <input
      type="text"
      id={inputId}
      class={computedInputClassName}
      value={_elementValue}
      placeholder={mergedPlaceholder}
      required={_propSetMap.required}
      disabled={_propSetMap.disabled}
      readonly={_propSetMap.readOnly}
      aria-describedby={computedAriaDescribedBy}
      aria-invalid={sfGpsDsIsError}
      aria-required={_propSetMap.required}
      data-omni-input
      onchange={handleChange}
      onblur={handleBlur}
    />
    
  </div>
</template>
```

---

## Debugging

For comprehensive debugging documentation, see the **[DEBUG_GUIDE.md](./DEBUG_GUIDE.md)**.

### Quick Start: Enable Debug Logging

Enable debug output in your browser console:

```javascript
window.sfGpsDsCaOnDebug = true;
```

Or via URL parameter:

```
https://your-site.com/s/page?debug=true
```

### Using the Logger Utility

Components use the `sfGpsDsCaOnDebugUtils` module for standardized logging:

```javascript
import { Logger } from "c/sfGpsDsCaOnDebugUtils";

const log = new Logger("SfGpsDsCaOnFormLookup");

// Usage
log.enter("methodName");
log.debug("Processing options", { count: options.length });
log.stateChange("value", oldValue, newValue);
log.error("Failed to load", error);
log.exit("methodName");
```

### Log Levels

| Level | Usage |
|-------|-------|
| `log.error()` | Failures that break functionality |
| `log.warn()` | Deprecated usage, potential issues |
| `log.info()` | User actions, important state changes |
| `log.debug()` | Development debugging, state details |
| `log.trace()` | Method entry/exit, verbose tracing |

### Browser DevTools

#### Inspect Component State

1. Select the component in Elements panel
2. Switch to Console
3. Use `$0` to reference selected element
4. Access properties: `$0._propSetMap`, `$0._value`

```javascript
// In browser console with component selected
$0._propSetMap        // View all OmniScript properties
$0._value             // Current value
$0.sfGpsDsIsError     // Validation state
$0.sfGpsDsErrorMessage // Current error message
```

#### Monitor OmniScript Events

```javascript
// Add to console to log all OmniScript pubsub events
window.addEventListener('omnistudio', (e) => console.log('OmniStudio:', e.detail));
```

### Common Debug Scenarios

#### Value Not Updating

```javascript
// Check if data-omni-input is present
const input = $0.template.querySelector('[data-omni-input]');
console.log('Has data-omni-input:', !!input);

// Check value binding
console.log('_value:', $0._value);
console.log('_elementValue:', $0._elementValue);
```

#### Validation Not Triggering

```javascript
// Check validation mixin is applied
console.log('Has validation:', typeof $0.reportValidity === 'function');

// Manually trigger validation
$0.reportValidity();
console.log('Is Error:', $0.sfGpsDsIsError);
console.log('Error Message:', $0.sfGpsDsErrorMessage);
```

#### Template Not Rendering

```javascript
// Check render() returns correct template
console.log('Render template:', $0.render());

// Check lifecycle ran
console.log('Has caon-scope:', $0.classList.contains('caon-scope'));
```

---

## Extending Components

### Adding a New Computed Property

```javascript
/**
 * Example: Add a character counter display.
 * @returns {string} Format: "X / Y characters"
 * @template-binding: <span class="char-count">{characterCount}</span>
 */
get characterCount() {
  const current = (this._elementValue || "").length;
  const max = this._propSetMap.maxLength || 0;
  
  if (max > 0) {
    return `${current} / ${max} characters`;
  }
  return `${current} characters`;
}
```

### Overriding a Method

When overriding inherited methods, always call `super`:

```javascript
/**
 * Override to add custom validation.
 * @override
 */
handleChange(event) {
  // Custom logic BEFORE parent
  const value = event.target.value;
  if (this.customValidation) {
    // Do something
  }
  
  // ALWAYS call parent to maintain OmniStudio binding
  super.handleChange(event);
  
  // Custom logic AFTER parent
  this.updateCharacterCount();
}
```

### Adding a New Event Handler

```javascript
/**
 * Handle custom interaction.
 * @param {Event} event - The triggering event
 * @fires CustomEvent#mycustomevent
 */
handleCustomAction(event) {
  if (DEBUG) console.log(CLASS_NAME, "handleCustomAction");
  
  // Prevent default if needed
  event.preventDefault();
  
  // Dispatch custom event
  this.dispatchEvent(new CustomEvent("mycustomevent", {
    detail: { value: this._value },
    bubbles: true,
    composed: true
  }));
}
```

### Creating a New Form Component

1. Create new folder: `sfGpsDsCaOnFormNewType/`
2. Create files:
   - `sfGpsDsCaOnFormNewType.js` - Component logic
   - `sfGpsDsCaOnFormNewType.html` - Template
   - `sfGpsDsCaOnFormNewType.css` - Styles (optional)
   - `sfGpsDsCaOnFormNewType.js-meta.xml` - Metadata

3. Extend appropriate base class
4. Register in element map (see OMNISCRIPT_SETUP.md)

---

## Common Issues

### Issue: Styles Not Applied

**Symptoms**: Component renders but looks like default OmniStudio

**Causes & Solutions**:

| Cause | Solution |
|-------|----------|
| Missing `caon-scope` class | Add `this.classList.add("caon-scope")` in connectedCallback |
| CSS not loaded | Verify static resources deployed |
| CSS specificity conflict | Use more specific selectors |

### Issue: Validation Messages Not Showing

**Symptoms**: Required field doesn't show error on submit

**Causes & Solutions**:

| Cause | Solution |
|-------|----------|
| Missing validation mixin | Ensure base class has `SfGpsDsOmniHasValidationMixin` |
| Missing `data-omni-input` | Add attribute to input element |
| Template missing error div | Add `{sfGpsDsErrorMessage}` binding |

### Issue: Value Not Saving to OmniScript

**Symptoms**: Input changes but data doesn't persist

**Causes & Solutions**:

| Cause | Solution |
|-------|----------|
| Missing `data-omni-input` | Add attribute: `data-omni-input` |
| Not calling `super.handleChange()` | Always call parent in overrides |
| Wrong event handler name | Must use `handleChange` not `onChange` |

### Issue: Keyboard Navigation Broken

**Symptoms**: Tab order wrong, arrow keys don't work

**Causes & Solutions**:

| Cause | Solution |
|-------|----------|
| Missing tabindex | Add appropriate tabindex values |
| Missing ARIA attributes | Add `role`, `aria-activedescendant` |
| Focus trap not working | Check `focusTrap` component usage |

---

## Related Documentation

- [OMNISTUDIO_FORMS.md](./OMNISTUDIO_FORMS.md) - OmniStudio forms overview
- [COMPONENT_API.md](./COMPONENT_API.md) - Component API reference
- [OMNISCRIPT_SETUP.md](./OMNISCRIPT_SETUP.md) - OmniScript configuration
- [LWR_COMPATIBILITY.md](./LWR_COMPATIBILITY.md) - LWR-specific guidance
