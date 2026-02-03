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

---

## NAICS Code Picker Component

The `sfGpsDsCaOnNaicsCodePickerOmni` component provides 5 cascading dropdowns for selecting NAICS (North American Industry Classification System) codes.

### Features

- 5 cascading dropdown levels: Sector → Sub Sector → Industry Group → Industry → National Industry
- Each dropdown filters based on the previous selection
- Ontario Design System styling
- Stores each level in separate OmniScript data fields

### OmniScript Configuration

Add a Custom LWC element with the following configuration:

```json
{
  "lwcName": "sfGpsDsCaOnNaicsCodePickerOmni",
  "customAttributes": [
    { "name": "label", "source": "Select your NAICS Code" },
    { "name": "required", "source": "true" },

    { "name": "fieldName", "source": "NaicsCode" },
    { "name": "sectorFieldName", "source": "Sector" },
    { "name": "subSectorFieldName", "source": "SubSector" },
    { "name": "industryGroupFieldName", "source": "IndustryGroup" },
    { "name": "industryFieldName", "source": "Industry" },

    {
      "name": "sectorOptionsJson",
      "source": "[{\"value\":\"11\",\"label\":\"11 Agriculture\"}]"
    },
    {
      "name": "subSectorOptionsJson",
      "source": "[{\"value\":\"111\",\"label\":\"111 Crop production\",\"parentValue\":\"11\"}]"
    },
    {
      "name": "industryGroupOptionsJson",
      "source": "[{\"value\":\"1111\",\"label\":\"1111 Oilseed and Grain Farming\",\"parentValue\":\"111\"}]"
    },
    {
      "name": "industryOptionsJson",
      "source": "[{\"value\":\"11111\",\"label\":\"11111 Soybean Farming\",\"parentValue\":\"1111\"}]"
    },
    {
      "name": "nationalIndustryOptionsJson",
      "source": "[{\"value\":\"111110\",\"label\":\"111110 Soybean Farming\",\"parentValue\":\"11111\"}]"
    }
  ],
  "bStandalone": false
}
```

### Properties

| Property       | Type    | Description                     |
| -------------- | ------- | ------------------------------- |
| `label`        | String  | Main label for the component    |
| `required`     | Boolean | Whether a selection is required |
| `helpText`     | String  | Help text displayed below label |
| `disabled`     | Boolean | Disable all dropdowns           |
| `errorMessage` | String  | Error message to display        |

**Field Name Properties (for OmniScript data storage):**

| Property                 | Type   | Description                                             |
| ------------------------ | ------ | ------------------------------------------------------- |
| `fieldName`              | String | Field name for the final NAICS code (National Industry) |
| `sectorFieldName`        | String | Field name for Sector selection                         |
| `subSectorFieldName`     | String | Field name for Sub Sector selection                     |
| `industryGroupFieldName` | String | Field name for Industry Group selection                 |
| `industryFieldName`      | String | Field name for Industry selection                       |

**Options JSON Properties:**

| Property                      | Type         | Description                                                |
| ----------------------------- | ------------ | ---------------------------------------------------------- |
| `sectorOptionsJson`           | String/Array | Sector options: `[{value, label}]`                         |
| `subSectorOptionsJson`        | String/Array | Sub Sector options: `[{value, label, parentValue}]`        |
| `industryGroupOptionsJson`    | String/Array | Industry Group options: `[{value, label, parentValue}]`    |
| `industryOptionsJson`         | String/Array | Industry options: `[{value, label, parentValue}]`          |
| `nationalIndustryOptionsJson` | String/Array | National Industry options: `[{value, label, parentValue}]` |

**Label Properties:**

| Property                | Default             | Description                          |
| ----------------------- | ------------------- | ------------------------------------ |
| `sectorLabel`           | "Sector"            | Label for Sector dropdown            |
| `subSectorLabel`        | "Sub sector"        | Label for Sub Sector dropdown        |
| `industryGroupLabel`    | "Industry group"    | Label for Industry Group dropdown    |
| `industryLabel`         | "Industry"          | Label for Industry dropdown          |
| `nationalIndustryLabel` | "National industry" | Label for National Industry dropdown |

### Options JSON Format

Each options array should contain objects with:

- `value`: The NAICS code value
- `label`: Display label (typically includes the code)
- `parentValue`: (required for all except Sector) The value of the parent level

**Example:**

```json
[
  { "value": "111", "label": "111 Crop production", "parentValue": "11" },
  { "value": "112", "label": "112 Animal production", "parentValue": "11" },
  { "value": "211", "label": "211 Oil and gas extraction", "parentValue": "21" }
]
```

### OmniScript Data Output

When configured with field names, the component updates OmniScript data with each selection:

```json
{
  "NaicsCode": "111110",
  "Sector": "11",
  "SubSector": "111",
  "IndustryGroup": "1111",
  "Industry": "11111"
}
```

Each field is updated as soon as its dropdown value changes.

---

#### Components with Both LWR and OmniScript Versions

These components may be used in both LWR/Experience Cloud sites AND within OmniScripts:

| Component | OmniScript LWC Name        | Description                    |
| --------- | -------------------------- | ------------------------------ |
| Dropdown  | `sfGpsDsCaOnDropdownOmni`  | Select dropdown                |
| Accordion | `sfGpsDsCaOnAccordionOmni` | Collapsible accordion sections |
| Card      | `sfGpsDsCaOnCardOmni`      | Information card               |
| Callout   | `sfGpsDsCaOnCalloutOmni`   | Highlighted callout box        |

### Creating New OmniStudio-Compatible Components

To add OmniStudio Custom LWC support for components that need to update OmniScript data:

1. Create a new `*Omni` version (e.g., `sfGpsDsCaOnDropdownOmni`)
2. **Import and use `OmniscriptBaseMixin`** - required for data updates
3. Do NOT use `static renderMode = "light"` (Shadow DOM only)
4. Include Ontario DS CSS inline or reference static resources
5. Use `this.omniUpdateDataJson()` to update OmniScript data
6. Add `fieldName` as an @api property

### OmniscriptBaseMixin (Required for Data Updates)

All form components that need to update OmniScript data **must** use the `OmniscriptBaseMixin`:

```javascript
import { LightningElement, api, track } from "lwc";
import { OmniscriptBaseMixin } from "omnistudio/omniscriptBaseMixin";

export default class MyOmniComponent extends OmniscriptBaseMixin(
  LightningElement
) {
  @api fieldName = "";

  handleChange(event) {
    const value = event.target.value;

    // Update OmniScript data using mixin method
    if (this.fieldName) {
      this.omniUpdateDataJson({
        [this.fieldName]: value
      });
    }
  }
}
```

**Important:** Custom events like `omniupdatedata` do NOT work for Custom LWC elements. You must use `OmniscriptBaseMixin` and call `this.omniUpdateDataJson()`.

### Custom LWC Configuration

When adding a Custom LWC element in OmniScript, always include `fieldName` in the custom attributes:

```json
{
  "lwcName": "sfGpsDsCaOnTextInputOmni",
  "customAttributes": [
    { "name": "fieldName", "source": "MyFieldName" },
    { "name": "label", "source": "Enter your name" },
    { "name": "required", "source": "true" }
  ]
}
```

### Shared Utilities Module

The `sfGpsDsCaOnFormUtils` module contains shared logic for form components:

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
  createChangeEvent, // Standard change event
  createBlurEvent, // Standard blur event
  createFocusEvent // Standard focus event
} from "c/sfGpsDsCaOnFormUtils";
```

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
