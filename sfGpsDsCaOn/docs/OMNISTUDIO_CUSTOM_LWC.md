# OmniStudio Custom LWC - Compatibility Guide

This document describes the requirements and limitations for using Custom Lightning Web Components in OmniStudio OmniScripts with the Ontario Design System.

---

## Overview

OmniStudio allows adding Custom LWC elements to OmniScripts. However, there are specific compatibility requirements that differ from standard LWC development.

---

## Key Findings

### 1. Light DOM Components Do NOT Work

**Issue**: Components using Light DOM (`static renderMode = "light"`) fail to render in OmniStudio Custom LWC elements.

**Symptoms**:

- Component does not render (blank space)
- No JavaScript errors in console
- No debug messages appear

**Solution**: Create Shadow DOM versions of components intended for OmniStudio Custom LWC use.

### 2. LWC Name Format

**Issue**: The `lwcName` property requires a specific format.

**Correct Format**: `sfGpsDsCaOnComponentName` (PascalCase, no `c-` prefix)

**Incorrect Formats**:

- `c-sf-gps-ds-ca-on-component-name` (kebab-case with prefix) - Does NOT work
- `c/sfGpsDsCaOnComponentName` (namespace format) - Does NOT work

### 3. JSON Property Escaping

**Issue**: OmniStudio double-escapes JSON strings in `customAttributes`.

**Input from OmniStudio**: `\[{\"value\":\"11\",...}\]`
**Expected by Component**: `[{"value":"11",...}]`

**Solution**: Components must handle both escaped and non-escaped JSON:

```javascript
_parseJson(input) {
  if (!input) return [];

  // Already an array - return directly
  if (Array.isArray(input)) return input;

  // Object - check if single option
  if (typeof input === "object") {
    return input.value !== undefined ? [input] : [];
  }

  // String - unescape if needed, then parse
  if (typeof input === "string") {
    let jsonStr = input;

    // Unescape double-escaped JSON
    if (jsonStr.includes("\\[") || jsonStr.includes('\\"')) {
      jsonStr = jsonStr
        .replace(/\\\[/g, "[")
        .replace(/\\\]/g, "]")
        .replace(/\\\{/g, "{")
        .replace(/\\\}/g, "}")
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, "\\");
    }

    try {
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("JSON parse error", e);
      return [];
    }
  }

  return [];
}
```

### 4. Base Class Dependencies

**Issue**: Components extending `SfGpsDsLwc` or similar base classes may fail to load due to unresolved dependencies.

**Solution**: For OmniStudio Custom LWC, extend `LightningElement` directly and avoid base class dependencies.

### 5. Step Override Compatibility

**Issue**: The Ontario DS Step override (`sfGpsDsCaOnFormStep`) may not properly render Custom LWC children.

**Workaround**: Remove the Step `lwcComponentOverride` when using Custom LWC elements.

**Permanent Fix**: Under investigation.

---

## Creating OmniStudio-Compatible Custom LWC

### Template

```javascript
// sfGpsDsCaOnMyComponentOmni.js
import { LightningElement, api, track } from "lwc";

export default class SfGpsDsCaOnMyComponentOmni extends LightningElement {
  // NO Light DOM - use Shadow DOM (default)
  // NO base class - extend LightningElement directly

  @api myProperty;
  @api myJsonProperty;

  @track _internalState = "";

  connectedCallback() {
    // Parse JSON properties
    this._parsedData = this._parseJson(this.myJsonProperty);
  }

  _parseJson(input) {
    // ... use the parsing logic above
  }
}
```

### Metadata

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
  <apiVersion>65.0</apiVersion>
  <isExposed>true</isExposed>
  <masterLabel>My Component (OmniStudio)</masterLabel>
  <targets>
    <target>lightningCommunity__Page</target>
    <target>lightningCommunity__Default</target>
  </targets>
</LightningComponentBundle>
```

### OmniScript Configuration

```json
{
  "type": "Custom Lightning Web Component",
  "name": "MyCustomElement",
  "propSetMap": {
    "lwcName": "sfGpsDsCaOnMyComponentOmni",
    "customAttributes": [
      {
        "name": "myProperty",
        "source": "Some Value"
      },
      {
        "name": "myJsonProperty",
        "source": "[{\"value\":\"1\",\"label\":\"Option 1\"}]"
      }
    ]
  }
}
```

---

## Affected Components

### Components NOT Compatible with OmniStudio Custom LWC

The following **38 Comm components** extend `SfGpsDsLwc` and use Light DOM - they will NOT work as OmniStudio Custom LWC elements:

| Component                           | Issue                  |
| ----------------------------------- | ---------------------- |
| sfGpsDsCaOnAccordionComm            | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnAccordionGroupComm       | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnActionCardCollectionComm | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnActionCardComm           | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnAsideComm                | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnBackButtonComm           | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnBackToTopComm            | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnBadgeComm                | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnBlockquoteComm           | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnBreadcrumbsComm          | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnCalloutComm              | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnCardComm                 | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnCheckboxGroupComm        | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnCriticalAlertComm        | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnDateInputComm            | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnDecisionExplainerComm    | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnDropdownComm             | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnFeatureCardComm          | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnFieldsetComm             | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnFooterExpandedComm       | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnFooterSimpleComm         | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnFormReviewComm           | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnHeaderComm               | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnInPageNavComm            | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnLinkCardComm             | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnLoadingIndicatorComm     | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnNaicsCodePickerComm      | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnNotificationCardComm     | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnPageAlertComm            | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnRadioGroupComm           | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnSiteTaskCardComm         | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnStepIndicatorComm        | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnSummaryListComm          | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnTableComm                | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnTaskListComm             | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnTaskListSalesforceComm   | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnTextAreaComm             | Light DOM + SfGpsDsLwc |
| sfGpsDsCaOnTextInputComm            | Light DOM + SfGpsDsLwc |

### OmniStudio-Compatible Components

The following components are specifically designed for OmniStudio Custom LWC (Shadow DOM, no base class dependencies).

#### OmniScript-Only Form Components

These form components are **exclusively used within OmniScripts** - no LWR/Experience Cloud version needed:

| Component         | OmniScript LWC Name              | Description                         |
| ----------------- | -------------------------------- | ----------------------------------- |
| NAICS Code Picker | `sfGpsDsCaOnNaicsCodePickerOmni` | Cascading dropdowns for NAICS codes |
| Text Input        | `sfGpsDsCaOnTextInputOmni`       | Single-line text input              |
| TextArea          | `sfGpsDsCaOnTextAreaOmni`        | Multi-line text input               |
| Radio Group       | `sfGpsDsCaOnRadioGroupOmni`      | Single-select radio buttons         |
| Checkbox Group    | `sfGpsDsCaOnCheckboxGroupOmni`   | Multi-select checkboxes             |
| Date Input        | `sfGpsDsCaOnDateInputOmni`       | Day/Month/Year date picker          |

> **Note:** The existing `*Comm` versions of these components (CheckboxGroup, DateInput, NaicsCodePicker, RadioGroup, TextArea, TextInput) in the nested LWR structure are **not used**. These form elements are designed specifically for OmniStudio Custom LWC use only.

#### Components with Both LWR and OmniScript Versions

These components may be used in both LWR/Experience Cloud sites AND within OmniScripts:

| Component | OmniScript LWC Name        | Description                    |
| --------- | -------------------------- | ------------------------------ |
| Dropdown  | `sfGpsDsCaOnDropdownOmni`  | Select dropdown                |
| Accordion | `sfGpsDsCaOnAccordionOmni` | Collapsible accordion sections |
| Card      | `sfGpsDsCaOnCardOmni`      | Information card               |
| Callout   | `sfGpsDsCaOnCalloutOmni`   | Highlighted callout box        |

#### Utility Components

| Component                  | Description                         |
| -------------------------- | ----------------------------------- |
| `sfGpsDsCaOnTestCustomLwc` | Simple test component for debugging |

### Creating New OmniStudio-Compatible Components

To add OmniStudio Custom LWC support for other components:

1. Create a new `*Omni` version (e.g., `sfGpsDsCaOnDropdownOmni`)
2. Extend `LightningElement` directly (not `SfGpsDsLwc`)
3. Do NOT use `static renderMode = "light"`
4. Include Ontario DS CSS inline or reference static resources
5. Import shared utilities from `c/sfGpsDsCaOnFormUtils`

### Shared Utilities Module

The `sfGpsDsCaOnFormUtils` module contains shared logic used by both Comm and Omni component versions:

```javascript
import {
  parseOptionsJson, // Parse JSON (handles OmniStudio double-escaping)
  generateId, // Generate unique accessibility IDs
  computeSelectClassName, // CSS class for dropdowns
  computeInputClassName, // CSS class for text inputs
  computeAriaDescribedBy, // Accessibility attributes
  getFlagText, // Required/optional labels
  decorateOptions, // Add selected state to options
  filterByParentValue, // Cascading dropdown filtering
  createOmniUpdateEvent, // OmniScript data update event
  createChangeEvent, // Standard change event
  createBlurEvent, // Standard blur event
  createFocusEvent // Standard focus event
} from "c/sfGpsDsCaOnFormUtils";
```

This approach reduces code duplication by ~80% between Comm and Omni versions.

---

## Troubleshooting

### Component Not Rendering

1. **Check lwcName format**: Must be PascalCase without `c-` prefix
2. **Check for Light DOM**: Remove `static renderMode = "light"`
3. **Check base class**: Extend `LightningElement` directly
4. **Check Step override**: Try removing `lwcComponentOverride`

### JSON Properties Not Working

1. **Check console for parse errors**: Look for "JSON parse error" messages
2. **Add unescape logic**: Handle double-escaped JSON strings
3. **Support multiple formats**: Handle both strings and arrays

### Debug Mode

Enable debug logging in component:

```javascript
const DEBUG = true;
// ...
if (DEBUG) console.log("MyComponent", "method", data);
```

---

## Related Documentation

- [OMNISCRIPT_SETUP.md](./OMNISCRIPT_SETUP.md) - OmniScript configuration
- [OMNISTUDIO_FORMS.md](./OMNISTUDIO_FORMS.md) - Form element overrides
- [LWR_GUIDE.md](./LWR_GUIDE.md) - Light DOM and LWR compatibility

---

## Version History

| Date       | Author       | Changes                                          |
| ---------- | ------------ | ------------------------------------------------ |
| 2026-01-30 | AI Assistant | Initial documentation based on debugging session |
