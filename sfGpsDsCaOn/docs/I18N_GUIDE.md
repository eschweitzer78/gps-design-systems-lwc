# Internationalization (i18n) Guide

This guide explains how to implement English/French bilingual support in Ontario Design System components.

## Overview

Ontario is officially bilingual, and all government services must be available in both English and French. The components support dynamic language switching through Salesforce Custom Labels.

## Quick Start

1. **For Developers**: Import labels from `c/sfGpsDsCaOnLabels` and use in your components
2. **For Translators**: Use Translation Workbench to edit translations without code
3. **For Admins**: Configure language settings in Salesforce Setup

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

### Nav (`LABELS.Nav.*`)

Navigation/menu item labels for the Header component:

| Key             | English                    | French                |
| --------------- | -------------------------- | --------------------- |
| `Home`          | Home                       | Accueil               |
| `About`         | About                      | À propos              |
| `Services`      | Services                   | Services              |
| `Contact`       | Contact                    | Contact               |
| `Help`          | Help                       | Aide                  |
| `FAQ`           | Frequently Asked Questions | Foire aux questions   |
| `Apply`         | Apply                      | Soumettre une demande |
| `MyAccount`     | My Account                 | Mon compte            |
| `SignIn`        | Sign In                    | Connexion             |
| `SignOut`       | Sign Out                   | Déconnexion           |
| `Dashboard`     | Dashboard                  | Tableau de bord       |
| `Applications`  | Applications               | Demandes              |
| `Permits`       | Permits                    | Permis                |
| `Licenses`      | Licenses                   | Licences              |
| `Reports`       | Reports                    | Rapports              |
| `Settings`      | Settings                   | Paramètres            |
| `Profile`       | Profile                    | Profil                |
| `Notifications` | Notifications              | Notifications         |

#### Using Dynamic Menu Translation

The Header component supports dynamic menu translation using `labelKey`:

```javascript
// In Experience Builder or programmatically
const menuItems = [
  { labelKey: "Home", href: "/" },
  { labelKey: "Dashboard", href: "/dashboard" },
  { labelKey: "Applications", href: "/applications" },
  { labelKey: "Help", href: "/help" }
];
```

The component will automatically translate the menu items based on the user's language:

- **English user**: Home, Dashboard, Applications, Help
- **French user**: Accueil, Tableau de bord, Demandes, Aide

You can also mix static titles with label keys:

```javascript
const menuItems = [
  { labelKey: "Home", href: "/" },
  { title: "Custom Page", href: "/custom" }, // Static, not translated
  { labelKey: "Contact", href: "/contact" }
];
```

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

## Translation Workbench

Translation Workbench allows non-developers to edit translations directly in Salesforce Setup without modifying code.

### Enabling Translation Workbench

1. Go to **Setup** → **Translation Workbench** → **Translation Settings**
2. Click **Enable**
3. Add supported languages (French - Canada is required for Ontario)

### Editing Translations via UI

1. Go to **Setup** → **Translation Workbench** → **Translate**
2. Select **Language**: French (Canada)
3. Select **Setup Component**: Custom Labels
4. In the filter, search for `sfGpsDsCaOn`
5. Edit translations in the **Translation** column
6. Click **Save**

Changes take effect immediately for users with that language setting.

### Bulk Export/Import

For managing many translations or professional translation services:

#### Export

1. Go to **Setup** → **Translation Workbench** → **Export**
2. Select **Language**: French (Canada)
3. Select **Setup Components**: Custom Labels
4. Click **Export**
5. Download the generated `.stf` (Salesforce Translation Format) file

#### Import

1. Have translations added to the `.stf` file
2. Go to **Setup** → **Translation Workbench** → **Import**
3. Upload the translated file
4. Review and publish

### Permissions for Translators

To allow translators access without full admin rights:

1. Create a Permission Set: "Translation Manager"
2. Enable System Permissions:
   - "Manage Translation"
   - "View Setup and Configuration"
3. Assign to translator users

## Adding New Languages

### Step 1: Enable Language in Salesforce

1. Go to **Setup** → **Company Information** → **Edit**
2. In **Language Settings**, add the new language
3. Save

### Step 2: Create Translation File

Create a new file `sfGpsDsCaOn/main/default/translations/[locale].translation-meta.xml`:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<Translations xmlns="http://soap.sforce.com/2006/04/metadata">
    <customLabels>
        <label>sfGpsDsCaOn_Common_Search</label>
        <translation>[Translated text]</translation>
    </customLabels>
    <!-- Add all other labels -->
</Translations>
```

Common locale codes:

- `fr_CA` - French (Canada)
- `es` - Spanish
- `zh_CN` - Chinese (Simplified)
- `pt_BR` - Portuguese (Brazil)

### Step 3: Deploy

```bash
sf project deploy start --source-dir sfGpsDsCaOn/main/default/translations
```

### Step 4: Configure Experience Site (if applicable)

1. **Experience Builder** → **Settings** → **Languages**
2. Add the new language
3. Set as active

## How Language Selection Works

### Internal Salesforce Users

Language is determined by the user's personal settings:

1. **Personal Settings** → **Language & Time Zone**
2. Set **Language** to desired language
3. Refresh the page

### Experience Cloud (Community) Users

Language can be set by:

1. **User Profile Language**: Default language for the user
2. **URL Parameter**: `?language=fr` appended to URL
3. **Language Toggle**: Header component with language switch

### Language Toggle Configuration

The Header component supports a language toggle:

```javascript
// In Experience Builder or component configuration
const languageToggleOptions = {
  englishLink: "/s/?language=en",
  frenchLink: "/s/?language=fr"
};
```

This creates a toggle that navigates to the same page with the language parameter.

## Translation File Format

### Custom Labels (Source)

Located in `labels/CustomLabels.labels-meta.xml`:

```xml
<labels>
    <fullName>sfGpsDsCaOn_Common_Search</fullName>
    <language>en_US</language>
    <protected>false</protected>
    <shortDescription>Search button label</shortDescription>
    <value>Search</value>
</labels>
```

| Element            | Description                                      |
| ------------------ | ------------------------------------------------ |
| `fullName`         | Unique identifier (use naming convention)        |
| `language`         | Base language (always `en_US`)                   |
| `protected`        | `false` allows editing via Translation Workbench |
| `shortDescription` | Context for translators                          |
| `value`            | English text                                     |

### Translations

Located in `translations/fr_CA.translation-meta.xml`:

```xml
<customLabels>
    <label>sfGpsDsCaOn_Common_Search</label>
    <translation>Rechercher</translation>
</customLabels>
```

| Element       | Description                           |
| ------------- | ------------------------------------- |
| `label`       | Must match `fullName` in CustomLabels |
| `translation` | Translated text                       |

## Translation Guidelines

### Ontario French Standards

Follow the Ontario Government's French language guidelines:

1. **Use Canadian French** - Not European French
2. **Be consistent** - Use the same translation for the same term
3. **Match formality** - Ontario uses formal "vous" not informal "tu"
4. **Keep it concise** - French text is often longer; ensure UI accommodates

### Common Translations Reference

| English    | French (Ontario) | Notes              |
| ---------- | ---------------- | ------------------ |
| Submit     | Soumettre        | Not "Envoyer"      |
| Cancel     | Annuler          |                    |
| Delete     | Supprimer        |                    |
| Required   | Obligatoire      |                    |
| Optional   | Facultatif       |                    |
| Sign in    | Connexion        | Not "Se connecter" |
| Sign out   | Déconnexion      |                    |
| My Account | Mon compte       |                    |
| Error      | Erreur           |                    |
| Warning    | Avertissement    |                    |
| Success    | Réussite         |                    |

### Placeholders

Labels with placeholders like `{0}`, `{1}` must preserve them:

```
English: "Step {0} of {1}"
French:  "Étape {0} de {1}"
```

The order can change if grammatically required in the target language.

## Troubleshooting

### Labels Not Translating

1. **Check user language setting** - Ensure it's set to the target language
2. **Verify deployment** - Confirm translation file is deployed
3. **Check label name** - The `<label>` in translation must exactly match `<fullName>`
4. **Clear cache** - Hard refresh the browser (Ctrl+Shift+R)

### Translation Workbench Not Showing Labels

1. **Filter correctly** - Search for `sfGpsDsCaOn` prefix
2. **Select Custom Labels** - Not other component types
3. **Ensure labels deployed** - Labels must exist in org before translating

### Experience Cloud Not Switching

1. **Enable multilingual site** - In Experience Builder Settings
2. **Add language to site** - The language must be added to the site
3. **Check URL parameter** - Ensure `?language=fr` is being passed

## CI/CD Integration

### Deploying Translations

Include translations in your deployment:

```bash
# Deploy labels and translations together
sf project deploy start \
  --source-dir sfGpsDsCaOn/main/default/labels \
  --source-dir sfGpsDsCaOn/main/default/translations
```

### Validation

Add translation validation to your CI pipeline:

```javascript
// Example Jest test for translation completeness
describe("Translation Completeness", () => {
  it("should have French translations for all labels", () => {
    const labels = parseXml("labels/CustomLabels.labels-meta.xml");
    const translations = parseXml("translations/fr_CA.translation-meta.xml");

    labels.forEach((label) => {
      const hasTranslation = translations.some(
        (t) => t.label === label.fullName
      );
      expect(hasTranslation).toBe(true);
    });
  });
});
```

## Resources

- [Salesforce Custom Labels](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_methods_system_label.htm)
- [Translation Workbench](https://help.salesforce.com/s/articleView?id=sf.customize_wbench.htm)
- [Ontario Design System - Language](https://designsystem.ontario.ca/guidelines/detail/language.html)
- [Ontario French Language Services](https://www.ontario.ca/page/government-services-french)
- [Experience Cloud Multilingual Sites](https://help.salesforce.com/s/articleView?id=sf.exp_cloud_multilingual.htm)
