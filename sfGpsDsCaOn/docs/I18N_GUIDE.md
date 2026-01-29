# Internationalization (i18n) Guide

This guide explains how to implement English/French bilingual support in Ontario Design System components.

## Overview

Ontario is officially bilingual, and all government services must be available in both English and French. The components support dynamic language switching through Salesforce Custom Labels.

## Architecture

### Components

| Component                      | Purpose                                                      |
| ------------------------------ | ------------------------------------------------------------ |
| `CustomLabels.labels-meta.xml` | Defines all translatable strings with English (en_US) values |
| `fr_CA.translation-meta.xml`   | French (Canadian) translations                               |
| `sfGpsDsCaOnLabels`            | LWC module that imports and exports all labels               |
| `sfGpsDsCaOnUserMessages`      | Error messages utility using labels                          |

### How It Works

1. **Custom Labels** are defined in `labels/CustomLabels.labels-meta.xml`
2. **French translations** are in `translations/fr_CA.translation-meta.xml`
3. **The sfGpsDsCaOnLabels module** imports all labels and exports them organized by category
4. **Components import labels** and use them via getters
5. **Salesforce automatically** returns the correct translation based on user's language

## Usage

### Importing Labels in a Component

```javascript
import { LABELS } from "c/sfGpsDsCaOnLabels";

export default class MyComponent extends LightningElement {
  // Create getters for labels used in the template
  get searchButtonLabel() {
    return LABELS.Common.Search;
  }

  get saveButtonLabel() {
    return LABELS.Common.Save;
  }
}
```

### Using Labels in HTML Template

```html
<template>
  <button type="button">{searchButtonLabel}</button>
  <button type="button">{saveButtonLabel}</button>
</template>
```

### Using Error Messages

```javascript
import { formatUserError, getMessage } from "c/sfGpsDsCaOnUserMessages";

// In error handler
try {
  await this.callApex();
} catch (error) {
  // Automatically uses translated message
  this._errorMessage = formatUserError(error);
}
```

### Formatting Labels with Placeholders

Some labels include placeholders like `{0}`, `{1}`. Use `formatLabel`:

```javascript
import { LABELS, formatLabel } from "c/sfGpsDsCaOnLabels";

// LABELS.A11y.StepOf = "Step {0} of {1}"
const announcement = formatLabel(LABELS.A11y.StepOf, 2, 5);
// Result: "Step 2 of 5" (EN) or "Étape 2 de 5" (FR)
```

## Label Categories

### Common (`LABELS.Common.*`)

General UI labels used across components:

| Key        | English  | French       |
| ---------- | -------- | ------------ |
| `Search`   | Search   | Rechercher   |
| `Select`   | Select   | Sélectionner |
| `Loading`  | Loading  | Chargement   |
| `Save`     | Save     | Enregistrer  |
| `Cancel`   | Cancel   | Annuler      |
| `Close`    | Close    | Fermer       |
| `Continue` | Continue | Continuer    |
| `Back`     | Back     | Retour       |
| `Next`     | Next     | Suivant      |
| `Previous` | Previous | Précédent    |
| `Required` | required | obligatoire  |
| `Optional` | optional | facultatif   |

### SiteSelector (`LABELS.SiteSelector.*`)

Site Selector Tool specific labels.

### DischargePoint (`LABELS.DischargePoint.*`)

Discharge Point Selector specific labels.

### Task (`LABELS.Task.*`)

Task list status labels.

### Error (`LABELS.Error.*`)

User-friendly error messages and titles.

### A11y (`LABELS.A11y.*`)

Accessibility announcements for screen readers.

## Adding New Labels

### Step 1: Add to CustomLabels.labels-meta.xml

```xml
<labels>
    <fullName>sfGpsDsCaOn_MyCategory_MyLabel</fullName>
    <language>en_US</language>
    <protected>false</protected>
    <shortDescription>Description of the label</shortDescription>
    <value>English text here</value>
</labels>
```

### Step 2: Add French Translation

In `translations/fr_CA.translation-meta.xml`:

```xml
<customLabels>
    <label>sfGpsDsCaOn_MyCategory_MyLabel</label>
    <translation>French text here</translation>
</customLabels>
```

### Step 3: Import in sfGpsDsCaOnLabels.js

```javascript
import MyCategory_MyLabel from "@salesforce/label/c.sfGpsDsCaOn_MyCategory_MyLabel";

export const LABELS = {
  // ... existing labels ...
  MyCategory: {
    MyLabel: MyCategory_MyLabel
  }
};
```

### Step 4: Use in Component

```javascript
import { LABELS } from "c/sfGpsDsCaOnLabels";

get myLabelText() {
  return LABELS.MyCategory.MyLabel;
}
```

## Naming Convention

Labels follow this pattern: `sfGpsDsCaOn_[Category]_[Name]`

| Category         | Description              |
| ---------------- | ------------------------ |
| `Common`         | Shared UI elements       |
| `Error`          | Error messages           |
| `SiteSelector`   | Site Selector Tool       |
| `DischargePoint` | Discharge Point Selector |
| `Task`           | Task List                |
| `Form`           | Form-related             |
| `A11y`           | Accessibility            |

## Testing

### Switch Language in Salesforce

1. Go to **Setup > Company Information**
2. Add French (Canada) to **Language Settings**
3. For user testing, go to **Personal Settings > Language & Time Zone**
4. Set **Language** to French (Canada)
5. Refresh the page to see French translations

### Experience Cloud Sites

1. Go to **Experience Builder > Settings**
2. Enable multiple languages
3. Add French (Canada) as a supported language
4. Users can switch via the language toggle in the header

## Components Using i18n

| Component                           | Status         |
| ----------------------------------- | -------------- |
| `sfGpsDsCaOnSiteSelectorTool`       | ✅ Implemented |
| `sfGpsDsCaOnUserMessages`           | ✅ Implemented |
| `sfGpsDsCaOnDischargePointSelector` | ✅ Implemented |
| `sfGpsDsCaOnTaskList`               | ✅ Implemented |
| `sfGpsDsCaOnDropdown`               | ✅ Implemented |
| `sfGpsDsCaOnSearch`                 | ✅ Implemented |
| `sfGpsDsCaOnLoadingIndicator`       | ✅ Implemented |

## Best Practices

1. **Never hardcode user-facing text** - Always use Custom Labels
2. **Use meaningful label names** - Follow the naming convention
3. **Group related labels** - Use categories consistently
4. **Add translations immediately** - Don't leave labels without French
5. **Use placeholders for dynamic values** - `{0}`, `{1}` format
6. **Test in both languages** - Verify translations make sense in context

## Ontario Design System Language Support

The Header and Footer components pass a `language` property to the underlying Ontario DS web components. This enables:

- Language toggle in the header
- Proper `lang` attribute on the page
- ODS component translations

```html
<c-sf-gps-ds-ca-on-header
  language="fr"
  language-toggle-options='[{"label":"English","value":"en"},{"label":"Français","value":"fr"}]'
></c-sf-gps-ds-ca-on-header>
```

## Resources

- [Salesforce Custom Labels](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_methods_system_label.htm)
- [Translation Workbench](https://help.salesforce.com/s/articleView?id=sf.customize_wbench.htm)
- [Ontario Design System - Language](https://designsystem.ontario.ca/guidelines/detail/language.html)
