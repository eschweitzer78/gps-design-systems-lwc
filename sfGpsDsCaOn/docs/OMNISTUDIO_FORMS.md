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

> **Architecture Details:** For the complete three-layer inheritance pattern, inherited properties reference, and component development patterns, see [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md).

---

## Available Form Components

### Text Input Components

| OmniScript Element | Ontario Component            | Description                          |
| ------------------ | ---------------------------- | ------------------------------------ |
| Text               | `sfGpsDsCaOnFormText`        | Single-line text input               |
| Text Area          | `sfGpsDsCaOnFormTextarea`    | Multi-line text input                |
| Email              | `sfGpsDsCaOnFormEmail`       | Email input with validation          |
| URL                | `sfGpsDsCaOnFormUrl`         | URL input with validation            |
| Telephone          | `sfGpsDsCaOnFormTelephone`   | Phone number input with tel keyboard |
| Range              | `sfGpsDsCaOnFormRange`       | Slider/range input                   |
| Number             | `sfGpsDsCaOnFormNumber`      | Numeric input                        |
| Password           | `sfGpsDsCaOnFormPassword`    | Password input (masked)              |
| Currency           | `sfGpsDsCaOnFormCurrency`    | Currency input with $ prefix         |
| Masked Input       | `sfGpsDsCaOnFormMaskedInput` | Input with format mask               |

### Date & Time Components

| OmniScript Element | Ontario Component         | Description            |
| ------------------ | ------------------------- | ---------------------- |
| Date               | `sfGpsDsCaOnFormDate`     | Date picker            |
| Time               | `sfGpsDsCaOnFormTime`     | Time input             |
| Date/Time          | `sfGpsDsCaOnFormDateTime` | Combined date and time |

### Selection Components

| OmniScript Element | Ontario Component                | Description                          |
| ------------------ | -------------------------------- | ------------------------------------ |
| Radio              | `sfGpsDsCaOnFormRadio`           | Radio button group                   |
| Checkbox           | `sfGpsDsCaOnFormCheckbox`        | Single checkbox                      |
| Select             | `sfGpsDsCaOnFormSelect`          | Dropdown select                      |
| Multi-select       | `sfGpsDsCaOnFormMultiselect`     | Checkbox group                       |
| Lookup             | `sfGpsDsCaOnFormLookup`          | Searchable dropdown                  |
| Typeahead          | `sfGpsDsCaOnFormTypeahead`       | Autocomplete input (DataRaptor/REST) |
| Places Typeahead   | `sfGpsDsCaOnFormPlacesTypeahead` | Google Maps address autocomplete     |

### File & Display Components

| OmniScript Element | Ontario Component           | Description                      |
| ------------------ | --------------------------- | -------------------------------- |
| File               | `sfGpsDsCaOnFormFile`       | File upload                      |
| Image              | `sfGpsDsCaOnFormImage`      | Image upload with preview        |
| Text Block         | `sfGpsDsCaOnFormTextBlock`  | Rich text/HTML content display   |
| Formula            | `sfGpsDsCaOnFormFormula`    | Read-only calculated value       |
| Disclosure         | `sfGpsDsCaOnFormDisclosure` | Acceptance checkbox with content |
| Messaging          | `sfGpsDsCaOnFormMessaging`  | Alert/notification display       |

### Structure Components

| OmniScript Element | Ontario Component               | Description                    |
| ------------------ | ------------------------------- | ------------------------------ |
| Step               | `sfGpsDsCaOnFormStep`           | Form step container            |
| Step Chart         | `sfGpsDsCaOnFormStepChart`      | Step progress indicator        |
| Block              | `sfGpsDsCaOnFormBlock`          | Collapsible/repeatable section |
| Edit Block         | `sfGpsDsCaOnFormEditBlock`      | Editable data block            |
| Edit Block Label   | `sfGpsDsCaOnFormEditBlockLabel` | Edit block heading             |
| Edit Block New     | `sfGpsDsCaOnFormEditBlockNew`   | Add new block button           |

---

## Component Features

### Standard Properties (All Components)

All form components support these OmniScript properties:

| Property      | Description                                 |
| ------------- | ------------------------------------------- |
| `label`       | Field label text                            |
| `help`        | Hint text displayed below label             |
| `required`    | Shows "(required)" flag, enables validation |
| `readOnly`    | Prevents user input                         |
| `disabled`    | Disables the field                          |
| `placeholder` | Placeholder text in input                   |

### Configuring Custom Properties (JSON Editor)

Some components support additional custom properties beyond the standard OmniScript properties. For OmniScript LWC overrides, these custom properties must be configured via the **JSON Editor**.

#### How to Add Custom Properties

1. In OmniScript Designer, select the element you want to configure
2. Click the **JSON Editor** button (curly braces icon `{}`) in the Properties panel
3. Locate the `propSetMap` object in the JSON
4. **Add a nested `propSetMap` object** inside the existing `propSetMap` with your custom properties:

```json
{
  "name": "MyElement",
  "type": "Multi-select",
  "propSetMap": {
    "label": "Select options",
    "required": true,
    "propSetMap": {
      "customProperty1": "value1",
      "customProperty2": ["array", "values"],
      "optionsJson": [
        { "value": "opt1", "label": "Option 1", "description": "..." }
      ]
    }
  }
}
```

> **Important:** Custom properties must be placed inside a **nested `propSetMap`** object. OmniStudio uses the outer `propSetMap` for standard properties (label, required, options), while custom properties for LWC overrides go inside the nested `propSetMap`.

#### Using Merge Fields for Dynamic Values

Custom properties can reference OmniScript data using merge fields:

```json
{
  "propSetMap": {
    "optionsJson": "%DynamicOptionsFromSetValues%",
    "defaultValue": "%UserInput:Step1:FieldName%"
  }
}
```

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

## Messaging Component (Hard Stops & Alerts)

The `sfGpsDsCaOnFormMessaging` component displays alert messages using Ontario DS page alerts. It's commonly used for:

- **Hard Stop Messages** (Requirement type) - Blocking errors that prevent form submission
- **Success Messages** - Confirmation of completed actions
- **Warning Messages** - Non-blocking warnings
- **Informational Messages** - General information

### Message Types

| OmniScript Type | Ontario Alert   | Color    | Use Case                         |
| --------------- | --------------- | -------- | -------------------------------- |
| **Requirement** | `error`         | Red/Pink | Hard stops, eligibility failures |
| Success         | `success`       | Green    | Confirmation messages            |
| Warning         | `warning`       | Yellow   | Non-blocking warnings            |
| Comment         | `informational` | Blue     | General information              |

### Markdown Support

The Messaging component supports Markdown formatting in the message text, including:

- **Links**: `[link text](url)` - Creates clickable hyperlinks
- **Bold**: `**bold text**` - Makes text bold
- **Italic**: `*italic text*` - Makes text italic
- **Paragraphs**: Blank lines create paragraph breaks

### Example: Hard Stop Message with Links

When creating a hard stop (eligibility check failure) message in OmniScript:

**OmniScript Configuration:**

```
Element Type: Messaging
Message Type: Requirement
Title Text: Eligibility Check Failed
Message Text: Based on your answer, you do not meet the requirements to register. You may need to [apply for an Environmental Compliance Approval (ECA)](https://ontario.ca/eca).

The use of storm water management works is not prescribed for the purposes of [subsection 20.21 (1) of the Act](https://ontario.ca/laws/statute/90e19#BK40).
```

**Rendered Output:**

The message renders as a red/pink alert box with:

- Error icon on the left
- Title "Eligibility Check Failed" as heading
- Message text with clickable hyperlinks
- Accessible to screen readers with `role="alert"`

### Conditional Display

Messages can be shown conditionally based on form data:

```
Show Condition: %QuestionAnswer% = "No"
```

This displays the hard stop message only when the user answers "No" to an eligibility question.

### Blocking Form Submission

When the message type is **Requirement**:

- The form step is marked as invalid
- The user cannot proceed to the next step
- The "Save and continue" button is disabled (if configured)

### CSS Styling

The messaging component uses these Ontario DS classes:

| Class                               | Purpose                |
| ----------------------------------- | ---------------------- |
| `ontario-page-alert`                | Main alert container   |
| `ontario-page-alert--error`         | Red/pink error styling |
| `ontario-page-alert--success`       | Green success styling  |
| `ontario-page-alert--warning`       | Yellow warning styling |
| `ontario-page-alert--informational` | Blue info styling      |

### Accessibility

- Uses `role="alert"` for screen reader announcements
- Error messages are announced immediately when displayed
- Links are keyboard accessible (Tab to focus, Enter to activate)
- Color contrast meets WCAG 2.1 AA requirements

---

## Selectable Cards Component (Activity Selection)

The `sfGpsDsCaOnFormSelectableCards` component provides a card-based multi-select interface for OmniScripts. It's ideal for:

- **Activity Selection** - Selecting multiple activities to register
- **Service Selection** - Choosing from available services
- **Category Selection** - Multi-select with descriptions and expandable content

### Features

| Feature                | Description                                    |
| ---------------------- | ---------------------------------------------- |
| **Card-based UI**      | Each option displays as a selectable card      |
| **Descriptions**       | Rich descriptions with multi-line support      |
| **Badges**             | Status indicators (NEW, IN PROGRESS, etc.)     |
| **Links**              | Optional links within each card                |
| **Expandable Content** | Additional details shown when card is selected |

### OmniScript Configuration

**Element Type:** Multi-select (with Custom LWC override)
**LWC Override:** `c-sf-gps-ds-ca-on-form-selectable-cards`

**Standard Options:** Configure via OmniScript Multi-select options (Picklist)

> **Important:** OmniScript picklist options only provide basic label/value pairs. To display descriptions, badges, links, and expandable content, you **must** configure the `optionsJson` Custom LWC Property.

### Configuring Extended Options (Step-by-Step)

Follow these steps to add descriptions, badges, and expanded content to selectable cards:

#### Step 1: Create the Multi-select Element

1. In OmniScript Designer, add a **Multiselect** element
2. Set the **Custom LWC Override** to `c-sf-gps-ds-ca-on-form-selectable-cards`
3. Configure the basic picklist options (these provide the values for data binding)

#### Step 2: Add optionsJson via JSON Editor

For OmniScript LWC overrides, custom properties are configured through the **JSON Editor**.

1. With the Multiselect element selected, click the **JSON Editor** button (curly braces icon `{}`) in the Properties panel
2. In the JSON Editor, locate the `propSetMap` object
3. Add a **nested `propSetMap`** object inside the existing `propSetMap` with your `optionsJson`:

```json
{
  "name": "AddActivityOptions",
  "type": "Multi-select",
  "propSetMap": {
    "label": "Add activity",
    "required": false,
    "controlWidth": 12,
    "propSetMap": {
      "optionsJson": [
        {
          "value": "air-emissions",
          "label": "Air emissions",
          "description": "If your business engages in activities...",
          "expandedContent": "Additional details..."
        }
      ]
    }
  }
}
```

> **Important:** Custom properties must be placed inside a **nested `propSetMap`** object. OmniStudio uses the outer `propSetMap` for standard properties (label, required, options), while custom properties for LWC overrides go inside the inner `propSetMap`.

#### Alternative: Using a Formula or Set Values Element

For dynamic extended options, you can use a Set Values or Formula element to generate the JSON, then reference it:

1. Create a **Set Values** element earlier in the OmniScript
2. Set the element name (e.g., `ExtendedOptions`)
3. Configure it to output the JSON array
4. In the Multiselect element's JSON Editor, add the nested `propSetMap` with a merge field reference:

```json
{
  "propSetMap": {
    "propSetMap": {
      "optionsJson": "%ExtendedOptions%"
    }
  }
}
```

#### Step 3: Format the optionsJson Value

The `optionsJson` property must be a valid JSON array. Each object in the array corresponds to one card:

```json
[
  {
    "value": "air-emissions",
    "label": "Air emissions",
    "description": "If your business engages in activities that result in air emissions.",
    "linkLabel": "More details in your profile",
    "linkUrl": "/profile/sites/air-emissions",
    "badge": "NEW",
    "badgeVariant": "success",
    "expandedContent": "Additional details about requirements..."
  },
  {
    "value": "stormwater",
    "label": "Stormwater management works",
    "description": "Discharge of stormwater into the natural environment.",
    "badge": "IN PROGRESS",
    "badgeVariant": "info"
  }
]
```

> **Note:** The `value` field in `optionsJson` must match the value configured in the OmniScript picklist options.

### Extended Options Properties

| Property          | Required | Description                                    |
| ----------------- | -------- | ---------------------------------------------- |
| `value`           | Yes      | Unique identifier (must match picklist option) |
| `label`           | Yes      | Card title displayed in bold                   |
| `description`     | No       | Text displayed below the title                 |
| `expandedContent` | No       | Content shown when "View more" is clicked      |
| `linkLabel`       | No       | Text for an optional link                      |
| `linkUrl`         | No       | URL for the optional link                      |
| `badge`           | No       | Badge text (e.g., "NEW", "IN PROGRESS")        |
| `badgeVariant`    | No       | Badge color (see variants below)               |

### Badge Variants

| Variant   | Color  | Use Case                  |
| --------- | ------ | ------------------------- |
| `success` | Green  | Completed, approved       |
| `info`    | Blue   | New, informational        |
| `warning` | Yellow | Pending, attention needed |
| `error`   | Red    | Error, rejected           |

### Troubleshooting Selectable Cards

#### Cards only show value identifiers (e.g., "air-emissions") instead of proper labels

**Cause:** The `optionsJson` property is not configured in the **nested** `propSetMap`.

**Solution:** Open the JSON Editor and add a nested `propSetMap` object inside the existing `propSetMap`, then add `optionsJson` inside the nested object (see Step 2 above).

#### Cards show no description, badge, or "View more" content

**Cause:** Same as above - the extended options data is missing from the nested `propSetMap`.

**Solution:** Configure `optionsJson` in the nested `propSetMap` via JSON Editor with all the extended properties (`description`, `expandedContent`, `badge`, etc.).

#### Card value doesn't match when submitted

**Cause:** The `value` in `optionsJson` doesn't match the picklist option value.

**Solution:** Ensure the `value` field in each `optionsJson` object exactly matches the corresponding OmniScript picklist option value.

#### Using Dynamic Content

For dynamic extended options (from DataRaptor, Integration Procedure, or formula), use a merge field reference in the nested `propSetMap`:

```json
{
  "propSetMap": {
    "propSetMap": {
      "optionsJson": "%ExtendedOptionsFormula%"
    }
  }
}
```

Where `ExtendedOptionsFormula` is a Set Values or Formula element that produces the JSON array.

---

## NAICS Code Picker Component

The `sfGpsDsCaOnFormNaicsCodePicker` provides a cascading 5-level dropdown for selecting NAICS (North American Industry Classification System) codes.

### OmniScript Configuration

**Element Type:** Select (with Custom LWC override)
**LWC Override:** `c-sf-gps-ds-ca-on-form-naics-code-picker`

### Custom Properties (via JSON Editor)

Add custom properties to a **nested `propSetMap`** via the JSON Editor:

```json
{
  "propSetMap": {
    "label": "NAICS Code",
    "helpText": "Select the industry code that best describes your operation.",
    "required": true,
    "propSetMap": {
      "sectorLabel": "Sector",
      "subSectorLabel": "Sub sector",
      "industryGroupLabel": "Industry group",
      "industryLabel": "Industry",
      "nationalIndustryLabel": "National industry",
      "sectorOptionsJson": [...],
      "subSectorOptionsJson": [...],
      "industryGroupOptionsJson": [...],
      "industryOptionsJson": [...],
      "nationalIndustryOptionsJson": [...]
    }
  }
}
```

| Property                      | Required | Description                             |
| ----------------------------- | -------- | --------------------------------------- |
| `sectorLabel`                 | No       | Label for sector dropdown               |
| `subSectorLabel`              | No       | Label for sub-sector dropdown           |
| `industryGroupLabel`          | No       | Label for industry group dropdown       |
| `industryLabel`               | No       | Label for industry dropdown             |
| `nationalIndustryLabel`       | No       | Label for national industry dropdown    |
| `sectorOptionsJson`           | Yes      | JSON array of sector options            |
| `subSectorOptionsJson`        | Yes      | JSON array of sub-sector options        |
| `industryGroupOptionsJson`    | Yes      | JSON array of industry group options    |
| `industryOptionsJson`         | Yes      | JSON array of industry options          |
| `nationalIndustryOptionsJson` | Yes      | JSON array of national industry options |

### Cascading Levels

| Level | Description       | Example                                    |
| ----- | ----------------- | ------------------------------------------ |
| 1     | Sector            | 31-33: Manufacturing                       |
| 2     | Subsector         | 311: Food Manufacturing                    |
| 3     | Industry Group    | 3114: Fruit and Vegetable Preserving       |
| 4     | Industry          | 31141: Frozen Food Manufacturing           |
| 5     | National Industry | 311411: Frozen Fruit, Juice, Vegetable Mfg |

### Output

The component outputs the full NAICS code and label:

```json
{
  "naicsCode": "311411",
  "naicsLabel": "Frozen Fruit, Juice, and Vegetable Manufacturing"
}
```

---

## Site Selector Tool Component

The `sfGpsDsCaOnFormSiteSelectorTool` provides ESRI-integrated address selection with geocoding and map visualization.

> For detailed documentation, see [GIS_GUIDE.md](./GIS_GUIDE.md).

### OmniScript Configuration

**Element Type:** Custom LWC
**LWC Name:** `c-sf-gps-ds-ca-on-form-site-selector-tool`

### Custom Properties (via JSON Editor)

Add custom properties to a **nested `propSetMap`** via the JSON Editor:

```json
{
  "propSetMap": {
    "label": "Site address",
    "helpText": "Use the site selector tool to find the address.",
    "required": true,
    "propSetMap": {
      "buttonLabel": "Site selector tool",
      "modalTitle": "Site",
      "vfPageUrl": "/apex/SiteSelectorVF"
    }
  }
}
```

| Property      | Required | Default              | Description                          |
| ------------- | -------- | -------------------- | ------------------------------------ |
| `label`       | No       | "Site address"       | Field label (outer propSetMap)       |
| `helpText`    | No       | ""                   | Help text below label (outer)        |
| `required`    | No       | false                | Makes field required (outer)         |
| `buttonLabel` | No       | "Site selector tool" | Text on the launcher button (nested) |
| `modalTitle`  | No       | "Site"               | Title of the modal dialog (nested)   |
| `vfPageUrl`   | No       | ""                   | URL to the Visualforce page (nested) |

### Output Fields

The component updates OmniScript data with:

| Field           | Type    | Description                |
| --------------- | ------- | -------------------------- |
| `streetAddress` | String  | Street address             |
| `city`          | String  | City name                  |
| `province`      | String  | Province code (e.g., "ON") |
| `postalCode`    | String  | Postal code                |
| `country`       | String  | Country name               |
| `fullAddress`   | String  | Complete formatted address |
| `latitude`      | Decimal | Latitude coordinate        |
| `longitude`     | Decimal | Longitude coordinate       |

---

## Discharge Point Selector Component

The `sfGpsDsCaOnFormDischargePointSelector` provides coordinate-based location entry with support for UTM, DMS, and Decimal formats.

> For detailed documentation, see [GIS_GUIDE.md](./GIS_GUIDE.md).

### OmniScript Configuration

**Element Type:** Custom LWC
**LWC Name:** `c-sf-gps-ds-ca-on-form-discharge-point-selector`

### Custom Properties (via JSON Editor)

Add custom properties to a **nested `propSetMap`** via the JSON Editor:

```json
{
  "propSetMap": {
    "label": "Discharge point location",
    "helpText": "Enter the coordinates of the discharge point.",
    "required": true,
    "propSetMap": {
      "buttonLabel": "Add discharge point",
      "modalTitle": "Source",
      "defaultLatitude": 43.6532,
      "defaultLongitude": -79.3832,
      "vfPageUrl": "/apex/DischargePointVF"
    }
  }
}
```

| Property           | Required | Default                    | Description                               |
| ------------------ | -------- | -------------------------- | ----------------------------------------- |
| `label`            | No       | "Discharge point location" | Field label (outer propSetMap)            |
| `helpText`         | No       | ""                         | Help text below label (outer)             |
| `required`         | No       | false                      | Makes field required (outer)              |
| `buttonLabel`      | No       | "Add discharge point"      | Text on the launcher button (nested)      |
| `modalTitle`       | No       | "Source"                   | Title of the modal dialog (nested)        |
| `defaultLatitude`  | No       | 43.6532                    | Default latitude for map center (nested)  |
| `defaultLongitude` | No       | -79.3832                   | Default longitude for map center (nested) |
| `vfPageUrl`        | No       | ""                         | URL to the Visualforce page (nested)      |

### Coordinate Formats

| Format  | Fields                                        |
| ------- | --------------------------------------------- |
| UTM     | Zone (1-60), East (M), North (M)              |
| DMS     | Latitude (°, ', "), Longitude (°, ', ")       |
| Decimal | Latitude (-90 to 90), Longitude (-180 to 180) |

### Output Fields

| Field       | Type    | Description                  |
| ----------- | ------- | ---------------------------- |
| `latitude`  | Decimal | Decimal latitude             |
| `longitude` | Decimal | Decimal longitude            |
| `utmZone`   | Integer | UTM zone (if entered as UTM) |
| `utmEast`   | Decimal | UTM east coordinate          |
| `utmNorth`  | Decimal | UTM north coordinate         |

---

## Places Typeahead Component

The `sfGpsDsCaOnFormPlacesTypeahead` provides Google Maps-powered address autocomplete with optional embedded map display.

### OmniScript Configuration

**Element Type:** Typeahead (with Custom LWC override)
**LWC Override:** `c-sf-gps-ds-ca-on-form-places-typeahead`

### Custom Properties (via JSON Editor)

Add these properties to `propSetMap` via the JSON Editor:

```json
{
  "propSetMap": {
    "label": "Address",
    "helpText": "Start typing to search for an address.",
    "required": true,
    "googleMapsAPIKey": "YOUR_GOOGLE_MAPS_API_KEY",
    "googleAddressCountry": "ca",
    "googleAddressTypes": "address",
    "hideMap": false
  }
}
```

| Property               | Required | Default   | Description                                  |
| ---------------------- | -------- | --------- | -------------------------------------------- |
| `label`                | No       | "Address" | Field label                                  |
| `helpText`             | No       | ""        | Help text below label                        |
| `required`             | No       | false     | Makes field required                         |
| `googleMapsAPIKey`     | Yes      | ""        | Your Google Maps API key                     |
| `googleAddressCountry` | No       | ""        | Country bias for search results (e.g., "ca") |
| `googleAddressTypes`   | No       | ""        | Types of places to search (e.g., "address")  |
| `hideMap`              | No       | false     | Hide the embedded map after selection        |

> **Note:** You must configure a valid Google Maps API key with the Places API enabled for this component to work.

---

## Typeahead Component

The `sfGpsDsCaOnFormTypeahead` provides an autocomplete dropdown powered by DataRaptor or REST data sources.

### OmniScript Configuration

**Element Type:** Typeahead (with Custom LWC override)
**LWC Override:** `c-sf-gps-ds-ca-on-form-typeahead`

### Custom Properties (via JSON Editor)

Add these properties to `propSetMap` via the JSON Editor:

```json
{
  "propSetMap": {
    "label": "Search",
    "helpText": "Type to search...",
    "required": true,
    "dataJson": "%SearchResultsFromDataRaptor%"
  }
}
```

| Property   | Required | Default  | Description                              |
| ---------- | -------- | -------- | ---------------------------------------- |
| `label`    | No       | "Search" | Field label                              |
| `helpText` | No       | ""       | Help text below label                    |
| `required` | No       | false    | Makes field required                     |
| `dataJson` | No       | ""       | JSON array of options or merge field ref |

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
  <p class="ontario-hint" id="hint-id">Helpful information for the user.</p>

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

| Class                     | Purpose                      |
| ------------------------- | ---------------------------- |
| `ontario-form-group`      | Container for form field     |
| `ontario-label`           | Label styling                |
| `ontario-label__flag`     | Required/optional indicator  |
| `ontario-hint`            | Hint text styling            |
| `ontario-input`           | Input field styling          |
| `ontario-input__error`    | Error state (3px red border) |
| `ontario-error-messaging` | Error message container      |
| `ontario-checkboxes`      | Checkbox group container     |
| `ontario-radios`          | Radio group container        |

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

| Key        | Action                        |
| ---------- | ----------------------------- |
| Tab        | Move between fields           |
| Enter      | Submit form / activate button |
| Space      | Toggle checkbox               |
| Arrow keys | Navigate radio/select options |
| Escape     | Close dropdowns               |

---

## Troubleshooting

### Component Not Rendering with Ontario Styling

**Cause**: OmniScript not configured to use the Ontario DS override.

**Solution**: Ensure the OmniScript is configured with the correct LWC override. See [OMNISCRIPT_SETUP.md](./OMNISCRIPT_SETUP.md).

### Validation Not Working

**Cause**: Missing `data-omni-input` attribute.

**Solution**: All input elements must have `data-omni-input` for OmniStudio to bind to them:

```html
<input data-omni-input onchange="{handleChange}" />
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
<div lwc:if="{sfGpsDsIsError}" class="ontario-error-messaging">
  {sfGpsDsErrorMessage}
</div>
```

---

## Related Documentation

- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Architecture, inheritance patterns, debugging, and extending components
- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Initial setup and deployment
- [OMNISCRIPT_SETUP.md](./OMNISCRIPT_SETUP.md) - OmniScript configuration
- [COMPONENT_API.md](./COMPONENT_API.md) - Component properties reference
- [GIS_GUIDE.md](./GIS_GUIDE.md) - GIS components (Site Selector, Discharge Point, ESRI integration)
- [LWR_GUIDE.md](./LWR_GUIDE.md) - LWR compatibility and best practices
- [INDUSTRY_ELIGIBILITY_OMNISCRIPT.md](./INDUSTRY_ELIGIBILITY_OMNISCRIPT.md) - Industry Eligibility Check implementation guide
