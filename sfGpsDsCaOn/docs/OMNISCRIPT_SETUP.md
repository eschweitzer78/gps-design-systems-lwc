# Ontario Design System - OmniScript Setup Guide

This guide explains how to configure OmniScripts to use the Ontario Design System form components.

---

## Prerequisites

Before configuring OmniScripts, ensure:

1. The Ontario Design System package (sfGpsDsCaOn) is deployed
2. Static resources are deployed (sfGpsDsCaOnGlobalStyles, sfGpsDsCaOnComponents)
3. The Experience Cloud site is configured (see [POST_DEPLOYMENT.md](./POST_DEPLOYMENT.md))

---

## Overview

OmniStudio supports custom LWC overrides that replace the default form element rendering. The Ontario Design System provides a complete set of LWC overrides that style all form elements with Ontario DS.

### How Overrides Work

```
┌─────────────────────────────────────────────────────────────┐
│ OmniScript Designer                                          │
│ - Configure form elements (Text, Radio, Select, etc.)        │
│ - Set properties (label, required, validation, etc.)         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ OmniScript Runtime                                           │
│ - Loads element definitions                                  │
│ - Checks for LWC override configuration                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ LWC Override (Ontario DS)                                    │
│ - sfGpsDsCaOnFormText instead of omniscriptText             │
│ - sfGpsDsCaOnFormRadio instead of omniscriptRadio           │
│ - etc.                                                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ Ontario Design System UI                                     │
│ - Ontario-styled form elements                               │
│ - WCAG 2.1 AA accessible                                     │
│ - Full OmniStudio functionality preserved                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 1: Create the LWC Override Configuration

### Option A: Using OmniStudio Standard Runtime

For OmniStudio Standard Runtime (non-managed package), create a custom LWC that defines the overrides.

1. Create a new LWC component for the override configuration
2. The component should extend the base OmniScript component
3. Configure the element mappings

**File: `sfGpsDsCaOnOmniscript/sfGpsDsCaOnOmniscript.js`**

```javascript
import OmniscriptBaseOsrt from "c/sfGpsDsOsrtOmniscript";

// Import all Ontario form components
import sfGpsDsCaOnFormText from "c/sfGpsDsCaOnFormText";
import sfGpsDsCaOnFormTextarea from "c/sfGpsDsCaOnFormTextarea";
import sfGpsDsCaOnFormEmail from "c/sfGpsDsCaOnFormEmail";
import sfGpsDsCaOnFormUrl from "c/sfGpsDsCaOnFormUrl";
import sfGpsDsCaOnFormTelephone from "c/sfGpsDsCaOnFormTelephone";
import sfGpsDsCaOnFormRange from "c/sfGpsDsCaOnFormRange";
import sfGpsDsCaOnFormNumber from "c/sfGpsDsCaOnFormNumber";
import sfGpsDsCaOnFormPassword from "c/sfGpsDsCaOnFormPassword";
import sfGpsDsCaOnFormCurrency from "c/sfGpsDsCaOnFormCurrency";
import sfGpsDsCaOnFormDate from "c/sfGpsDsCaOnFormDate";
import sfGpsDsCaOnFormTime from "c/sfGpsDsCaOnFormTime";
import sfGpsDsCaOnFormDateTime from "c/sfGpsDsCaOnFormDateTime";
import sfGpsDsCaOnFormRadio from "c/sfGpsDsCaOnFormRadio";
import sfGpsDsCaOnFormCheckbox from "c/sfGpsDsCaOnFormCheckbox";
import sfGpsDsCaOnFormSelect from "c/sfGpsDsCaOnFormSelect";
import sfGpsDsCaOnFormMultiselect from "c/sfGpsDsCaOnFormMultiselect";
import sfGpsDsCaOnFormLookup from "c/sfGpsDsCaOnFormLookup";
import sfGpsDsCaOnFormTypeahead from "c/sfGpsDsCaOnFormTypeahead";
import sfGpsDsCaOnFormPlacesTypeahead from "c/sfGpsDsCaOnFormPlacesTypeahead";
import sfGpsDsCaOnFormFile from "c/sfGpsDsCaOnFormFile";
import sfGpsDsCaOnFormImage from "c/sfGpsDsCaOnFormImage";
import sfGpsDsCaOnFormTextBlock from "c/sfGpsDsCaOnFormTextBlock";
import sfGpsDsCaOnFormFormula from "c/sfGpsDsCaOnFormFormula";
import sfGpsDsCaOnFormDisclosure from "c/sfGpsDsCaOnFormDisclosure";
import sfGpsDsCaOnFormMessaging from "c/sfGpsDsCaOnFormMessaging";
import sfGpsDsCaOnFormStep from "c/sfGpsDsCaOnFormStep";
import sfGpsDsCaOnFormStepChart from "c/sfGpsDsCaOnFormStepChart";
import sfGpsDsCaOnFormBlock from "c/sfGpsDsCaOnFormBlock";
import sfGpsDsCaOnFormEditBlock from "c/sfGpsDsCaOnFormEditBlock";
import sfGpsDsCaOnFormEditBlockLabel from "c/sfGpsDsCaOnFormEditBlockLabel";
import sfGpsDsCaOnFormEditBlockNew from "c/sfGpsDsCaOnFormEditBlockNew";

export default class SfGpsDsCaOnOmniscript extends OmniscriptBaseOsrt {
  // Map OmniScript element types to Ontario DS components
  static elementTypeToLwcConstructorMap = {
    ...OmniscriptBaseOsrt.elementTypeToLwcConstructorMap,
    "Text": sfGpsDsCaOnFormText,
    "Text Area": sfGpsDsCaOnFormTextarea,
    "Email": sfGpsDsCaOnFormEmail,
    "URL": sfGpsDsCaOnFormUrl,
    "Telephone": sfGpsDsCaOnFormTelephone,
    "Range": sfGpsDsCaOnFormRange,
    "Number": sfGpsDsCaOnFormNumber,
    "Password": sfGpsDsCaOnFormPassword,
    "Currency": sfGpsDsCaOnFormCurrency,
    "Date": sfGpsDsCaOnFormDate,
    "Time": sfGpsDsCaOnFormTime,
    "Date/Time": sfGpsDsCaOnFormDateTime,
    "Radio": sfGpsDsCaOnFormRadio,
    "Checkbox": sfGpsDsCaOnFormCheckbox,
    "Select": sfGpsDsCaOnFormSelect,
    "Multi-select": sfGpsDsCaOnFormMultiselect,
    "Lookup": sfGpsDsCaOnFormLookup,
    "Typeahead": sfGpsDsCaOnFormTypeahead,
    "Places Typeahead": sfGpsDsCaOnFormPlacesTypeahead,
    "File": sfGpsDsCaOnFormFile,
    "Image": sfGpsDsCaOnFormImage,
    "Text Block": sfGpsDsCaOnFormTextBlock,
    "Formula": sfGpsDsCaOnFormFormula,
    "Disclosure": sfGpsDsCaOnFormDisclosure,
    "Messaging": sfGpsDsCaOnFormMessaging,
    "Step": sfGpsDsCaOnFormStep,
    "Step Chart": sfGpsDsCaOnFormStepChart,
    "Block": sfGpsDsCaOnFormBlock,
    "Edit Block": sfGpsDsCaOnFormEditBlock,
    "Edit Block Label": sfGpsDsCaOnFormEditBlockLabel,
    "Edit Block New": sfGpsDsCaOnFormEditBlockNew
  };
}
```

### Option B: Using FlexCards

For FlexCards, configure the LWC override in the FlexCard designer.

---

## Step 2: Configure the OmniScript

### In OmniStudio Designer

1. Open the OmniScript in the OmniStudio Designer
2. Go to **Setup** > **Custom Lightning Web Component**
3. Set the LWC name to: `c-sf-gps-ds-ca-on-omniscript`
4. Save and Activate the OmniScript

### Via Metadata

In the OmniScript definition, set the `customJavaScript` property:

```json
{
  "customJavaScript": "c/sfGpsDsCaOnOmniscript"
}
```

---

## Step 3: Add Required CSS

### Experience Cloud Site CSS

Add the Ontario Design System CSS to your Experience Cloud site:

1. Go to **Experience Builder** > **Settings** > **Advanced**
2. Add the following CSS imports:

**Head Markup:**

```html
<!-- Ontario Design System Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Raleway:wght@400;700&display=swap" rel="stylesheet">

<!-- Ontario Design System Styles -->
<link rel="stylesheet" href="{!$Resource.sfGpsDsCaOnGlobalStyles}/global.css">
<link rel="stylesheet" href="{!$Resource.sfGpsDsCaOnGlobalStyles}/byo_lwr.css">
<link rel="stylesheet" href="{!$Resource.sfGpsDsCaOnGlobalStyles}/byo_lwr_omnistudio.css">
```

Or reference the static resource using the content from `head.txt`:

```html
{!$Resource.sfGpsDsCaOnGlobalStyles}/head.txt
```

---

## Step 4: Configure OmniScript Properties

### Recommended Settings

| Property | Recommended Value | Description |
|----------|-------------------|-------------|
| **Track Changes** | Enabled | Required for proper data binding |
| **Auto Save** | As needed | Consider UX implications |
| **Client-Side Validation** | Enabled | Uses Ontario DS error styling |
| **Step Chart** | Enabled | Uses Ontario DS step indicator |

### Theme Settings

If using a custom theme, ensure it doesn't conflict with Ontario DS:

```json
{
  "theme": "sfgpsds",
  "useSldsToast": false
}
```

---

## Step 5: Verify the Configuration

### Test Checklist

- [ ] OmniScript loads without errors
- [ ] Form fields display with Ontario DS styling
- [ ] Labels show "(required)" or "(optional)" flags
- [ ] Validation errors display with Ontario DS error styling
- [ ] Navigation buttons (Next, Previous) use Ontario DS styling
- [ ] Step chart displays correctly (if enabled)
- [ ] All form element types render correctly

### Debug Mode

Enable debug mode to troubleshoot issues:

```javascript
// In browser console
localStorage.setItem('omniDebug', 'true');
```

---

## Common Configurations

### Multi-Step Form

```json
{
  "type": "OmniScript",
  "subType": "Application",
  "enableKnowledgeable": false,
  "allowSaveForLater": true,
  "showStepChart": true,
  "stepChartPosition": "top",
  "elements": [
    {
      "type": "Step",
      "name": "PersonalInfo",
      "label": "Personal Information",
      "elements": [
        { "type": "Text", "name": "FirstName", "label": "First Name", "required": true },
        { "type": "Text", "name": "LastName", "label": "Last Name", "required": true },
        { "type": "Email", "name": "Email", "label": "Email Address", "required": true }
      ]
    },
    {
      "type": "Step",
      "name": "Address",
      "label": "Address",
      "elements": [
        { "type": "Text", "name": "Street", "label": "Street Address" },
        { "type": "Text", "name": "City", "label": "City" },
        { "type": "Select", "name": "Province", "label": "Province", "options": "..." }
      ]
    }
  ]
}
```

### Repeatable Section (Edit Block)

```json
{
  "type": "Edit Block",
  "name": "Dependents",
  "label": "Dependents",
  "allowNew": true,
  "allowEdit": true,
  "allowDelete": true,
  "newLabel": "Add Dependent",
  "elements": [
    { "type": "Text", "name": "Name", "label": "Full Name", "required": true },
    { "type": "Date", "name": "DOB", "label": "Date of Birth", "required": true },
    { "type": "Select", "name": "Relationship", "label": "Relationship", "required": true }
  ]
}
```

---

## Troubleshooting

### Components Not Rendering with Ontario Styling

**Symptoms**: Form fields appear with default OmniStudio styling

**Solutions**:
1. Verify the LWC override is configured correctly
2. Check that the OmniScript is using the custom LWC
3. Ensure CSS is loaded (check Network tab in browser dev tools)
4. Clear browser cache and OmniStudio cache

### Validation Not Working

**Symptoms**: Required fields don't show errors, or errors don't display

**Solutions**:
1. Ensure `required` property is set on the element
2. Check that `data-omni-input` attribute is on the input element
3. Verify the validation mixin is applied to the component

### CSS Conflicts

**Symptoms**: Styling looks wrong, fonts are incorrect, colors don't match

**Solutions**:
1. Ensure Ontario DS CSS is loaded after SLDS CSS
2. Use the `caon-scope` class for CSS scoping
3. Check for conflicting CSS in the Experience Cloud site theme

### Step Chart Not Displaying

**Symptoms**: No step indicator visible despite configuration

**Solutions**:
1. Verify `showStepChart: true` in OmniScript settings
2. Check that `sfGpsDsCaOnFormStepChart` is in the element map
3. Ensure the Step Chart component is deployed

### Edit Block Issues

**Symptoms**: Add/Edit/Delete buttons not working, data not saving

**Solutions**:
1. Ensure all Edit Block components are deployed (EditBlock, EditBlockLabel, EditBlockNew)
2. Check that the mode property is set correctly (Table, Inline, Cards, FS)
3. Verify parent record ID is available for file attachments

---

## FlexCard Integration

### Using OmniScript in FlexCards

FlexCards can embed OmniScripts that use Ontario DS styling.

**FlexCard Action Configuration:**

```json
{
  "type": "OmniScript",
  "actionType": "Launch OmniScript",
  "omniscriptType": "MyType",
  "omniscriptSubType": "MySubType",
  "omniscriptLanguage": "English"
}
```

### Styling FlexCards with Ontario DS

Apply Ontario DS styling to FlexCards:

```html
<div class="caon-scope">
  <!-- FlexCard content -->
</div>
```

---

## Performance Optimization

### Lazy Loading

For large OmniScripts, consider lazy loading:

```javascript
// Only import components that are used
const { default: sfGpsDsCaOnFormText } = await import("c/sfGpsDsCaOnFormText");
```

### Minimize CSS

Use only the required CSS files:
- `global.css` - Always required
- `byo_lwr.css` - Required for LWR sites
- `byo_lwr_omnistudio.css` - Required for OmniStudio forms

---

## Related Documentation

- [OMNISTUDIO_FORMS.md](./OMNISTUDIO_FORMS.md) - OmniStudio forms overview
- [COMPONENT_API.md](./COMPONENT_API.md) - Component API reference
- [POST_DEPLOYMENT.md](./POST_DEPLOYMENT.md) - Post-deployment configuration
- [LWR_COMPATIBILITY.md](./LWR_COMPATIBILITY.md) - LWR-specific guidance
- [SETUP.md](./SETUP.md) - Initial setup
