# Ontario Design System - OmniStudio Forms Guide

This guide explains how to use the Ontario Design System form components within OmniStudio OmniScripts.

---

## Overview

The Ontario Design System (sfGpsDsCaOn) provides 32 OmniStudio form components that automatically style OmniScript forms with Ontario DS styling while preserving all OmniStudio functionality.

### Key Benefits

- **Automatic Styling**: OmniScript elements are automatically styled with Ontario DS
- **Full Compatibility**: All OmniStudio features work (validation, data binding, navigation)
- **WCAG 2.1 AA**: All components meet accessibility requirements
- **LWR Ready**: Components work in Lightning Web Runtime Experience Cloud sites

---

## How It Works

### Component Override Architecture

When you configure an OmniScript to use the Ontario Design System, each form element is automatically rendered using an Ontario-styled component instead of the default OmniStudio component.

```
OmniScript Configuration
    ↓
OmniStudio Runtime loads element (e.g., "Text")
    ↓
Override maps to Ontario component (sfGpsDsCaOnFormText)
    ↓
Ontario component renders with Ontario DS styling
    ↓
All OmniStudio behavior preserved (validation, data binding, etc.)
```

### Three-Layer Inheritance

Each Ontario form component follows this inheritance pattern:

```
Layer 1: OmniStudio Runtime (omnistudio/omniscriptText)
    ↓ extends
Layer 2: Stub Class (sfGpsDsOsrtOmniscriptText)
    ↓ extends
Layer 3: Base Form Class (sfGpsDsFormText) + Validation Mixin
    ↓ extends
Layer 4: Ontario Component (sfGpsDsCaOnFormText) - Template Override Only
```

This ensures:
- All OmniStudio behavior is inherited
- Validation and error handling are consistent
- Only the visual template is customized

---

## Available Form Components

### Text Input Components

| OmniScript Element | Ontario Component | Description |
|--------------------|-------------------|-------------|
| Text | `sfGpsDsCaOnFormText` | Single-line text input |
| Text Area | `sfGpsDsCaOnFormTextarea` | Multi-line text input |
| Email | `sfGpsDsCaOnFormEmail` | Email input with validation |
| URL | `sfGpsDsCaOnFormUrl` | URL input with validation |
| Telephone | `sfGpsDsCaOnFormTelephone` | Phone number input with tel keyboard |
| Range | `sfGpsDsCaOnFormRange` | Slider/range input |
| Number | `sfGpsDsCaOnFormNumber` | Numeric input |
| Password | `sfGpsDsCaOnFormPassword` | Password input (masked) |
| Currency | `sfGpsDsCaOnFormCurrency` | Currency input with $ prefix |
| Masked Input | `sfGpsDsCaOnFormMaskedInput` | Input with format mask |

### Date & Time Components

| OmniScript Element | Ontario Component | Description |
|--------------------|-------------------|-------------|
| Date | `sfGpsDsCaOnFormDate` | Date picker |
| Time | `sfGpsDsCaOnFormTime` | Time input |
| Date/Time | `sfGpsDsCaOnFormDateTime` | Combined date and time |

### Selection Components

| OmniScript Element | Ontario Component | Description |
|--------------------|-------------------|-------------|
| Radio | `sfGpsDsCaOnFormRadio` | Radio button group |
| Checkbox | `sfGpsDsCaOnFormCheckbox` | Single checkbox |
| Select | `sfGpsDsCaOnFormSelect` | Dropdown select |
| Multi-select | `sfGpsDsCaOnFormMultiselect` | Checkbox group |
| Lookup | `sfGpsDsCaOnFormLookup` | Searchable dropdown |
| Typeahead | `sfGpsDsCaOnFormTypeahead` | Autocomplete input (DataRaptor/REST) |
| Places Typeahead | `sfGpsDsCaOnFormPlacesTypeahead` | Google Maps address autocomplete |

### File & Display Components

| OmniScript Element | Ontario Component | Description |
|--------------------|-------------------|-------------|
| File | `sfGpsDsCaOnFormFile` | File upload |
| Image | `sfGpsDsCaOnFormImage` | Image upload with preview |
| Text Block | `sfGpsDsCaOnFormTextBlock` | Rich text/HTML content display |
| Formula | `sfGpsDsCaOnFormFormula` | Read-only calculated value |
| Disclosure | `sfGpsDsCaOnFormDisclosure` | Acceptance checkbox with content |
| Messaging | `sfGpsDsCaOnFormMessaging` | Alert/notification display |

### Structure Components

| OmniScript Element | Ontario Component | Description |
|--------------------|-------------------|-------------|
| Step | `sfGpsDsCaOnFormStep` | Form step container |
| Step Chart | `sfGpsDsCaOnFormStepChart` | Step progress indicator |
| Block | `sfGpsDsCaOnFormBlock` | Collapsible/repeatable section |
| Edit Block | `sfGpsDsCaOnFormEditBlock` | Editable data block |
| Edit Block Label | `sfGpsDsCaOnFormEditBlockLabel` | Edit block heading |
| Edit Block New | `sfGpsDsCaOnFormEditBlockNew` | Add new block button |

---

## Component Features

### Standard Properties (All Components)

All form components support these OmniScript properties:

| Property | Description |
|----------|-------------|
| `label` | Field label text |
| `help` | Hint text displayed below label |
| `required` | Shows "(required)" flag, enables validation |
| `readOnly` | Prevents user input |
| `disabled` | Disables the field |
| `placeholder` | Placeholder text in input |

### Validation

All components integrate with OmniStudio validation:

```javascript
// Validation is handled automatically via the base class
// Custom validation messages are supported:
{
  "messageWhenValueMissing": "Please enter your email address",
  "messageWhenPatternMismatch": "Please enter a valid email"
}
```

### Error Display

Errors are displayed using the Ontario DS error pattern:

```html
<div class="ontario-error-messaging" role="alert" aria-live="assertive">
  <svg class="ontario-icon">...</svg>
  <span class="ontario-error-messaging__content">Error message</span>
</div>
```

---

## Ontario DS Styling

### Form Field Structure

All components follow the Ontario DS form field structure:

```html
<div class="ontario-form-group">
  <!-- 1. Label -->
  <label class="ontario-label" for="input-id">
    Field Label
    <span class="ontario-label__flag">(required)</span>
  </label>
  
  <!-- 2. Hint Text -->
  <p class="ontario-hint" id="hint-id">
    Helpful information for the user.
  </p>
  
  <!-- 3. Error Message (when invalid) -->
  <div class="ontario-error-messaging" role="alert">
    <svg class="ontario-icon">...</svg>
    <span>Error message</span>
  </div>
  
  <!-- 4. Input Field -->
  <input 
    type="text" 
    class="ontario-input"
    id="input-id"
    aria-describedby="hint-id"
    aria-invalid="false"
  />
</div>
```

### CSS Classes Used

| Class | Purpose |
|-------|---------|
| `ontario-form-group` | Container for form field |
| `ontario-label` | Label styling |
| `ontario-label__flag` | Required/optional indicator |
| `ontario-hint` | Hint text styling |
| `ontario-input` | Input field styling |
| `ontario-input__error` | Error state (3px red border) |
| `ontario-error-messaging` | Error message container |
| `ontario-checkboxes` | Checkbox group container |
| `ontario-radios` | Radio group container |

---

## Accessibility Features

All components include WCAG 2.1 Level AA accessibility features:

### Labels and Descriptions

```html
<label for="input-id">Label</label>
<input 
  id="input-id" 
  aria-describedby="hint-id error-id"
  aria-invalid="true"
  aria-required="true"
/>
```

### Error Announcements

```html
<div role="alert" aria-live="assertive">
  Error message announced to screen readers
</div>
```

### Keyboard Navigation

| Key | Action |
|-----|--------|
| Tab | Move between fields |
| Enter | Submit form / activate button |
| Space | Toggle checkbox |
| Arrow keys | Navigate radio/select options |
| Escape | Close dropdowns |

---

## Troubleshooting

### Component Not Rendering with Ontario Styling

**Cause**: OmniScript not configured to use the Ontario DS override.

**Solution**: Ensure the OmniScript is configured with the correct LWC override. See [OMNISCRIPT_SETUP.md](./OMNISCRIPT_SETUP.md).

### Validation Not Working

**Cause**: Missing `data-omni-input` attribute.

**Solution**: All input elements must have `data-omni-input` for OmniStudio to bind to them:

```html
<input data-omni-input onchange={handleChange} />
```

### Styling Conflicts

**Cause**: Global CSS conflicting with Ontario DS.

**Solution**: Ensure the component uses `caon-scope` class for CSS scoping:

```javascript
connectedCallback() {
  super.connectedCallback?.();
  this.classList.add("caon-scope");
}
```

### Error Messages Not Displaying

**Cause**: Error message binding incorrect.

**Solution**: Use the `sfGpsDsErrorMessage` getter from the validation mixin:

```html
<div lwc:if={sfGpsDsIsError} class="ontario-error-messaging">
  {sfGpsDsErrorMessage}
</div>
```

---

## Related Documentation

- [SETUP.md](./SETUP.md) - Initial setup and deployment
- [OMNISCRIPT_SETUP.md](./OMNISCRIPT_SETUP.md) - OmniScript configuration
- [COMPONENT_API.md](./COMPONENT_API.md) - Component properties reference
- [LWR_COMPATIBILITY.md](./LWR_COMPATIBILITY.md) - LWR-specific guidance
- [PHASE4_IMPLEMENTATION_PLAN.md](./PHASE4_IMPLEMENTATION_PLAN.md) - Implementation details
