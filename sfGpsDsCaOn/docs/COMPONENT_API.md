# Ontario Design System - Component API Reference

This document provides the API reference for all Ontario Design System UI components and OmniStudio form components.

---

## Table of Contents

1. [UI Components](#ui-components)
   - [Header](#sfgpsdscaonheadercomm)
   - [Footer](#sfgpsdscaonfootercomm)
   - [Text Input](#sfgpsdscaontextinput)
   - [Dropdown](#sfgpsdscaondropdown)
   - [Checkbox Group](#sfgpsdscaoncheckboxgroup)
   - [Radio Group](#sfgpsdscaonradiogroup)
   - [Date Input](#sfgpsdscaondateinput)
   - [Button](#sfgpsdscaonbuttoncomm)
   - [Badge](#sfgpsdscaonbadgecomm)
   - [Callout](#sfgpsdscaoncalloutcomm)
   - [Card](#sfgpsdscaoncardcomm)
   - [Loading Indicator](#sfgpsdscaonloadingindicator)
   - [Step Indicator](#sfgpsdscaonstepindicator)
   - [Feature Card](#sfgpsdscaonfeaturecard)
   - [Notification Card](#sfgpsdscaonnotificationcard)
   - [Link Card](#sfgpsdscaonlinkcard)
   - [Action Card](#sfgpsdscaonactioncard)
   - [Action Card Collection](#sfgpsdscaonactioncardcollectioncomm)
   - [Selectable Card](#sfgpsdscaonselectablecard)
   - [Selectable Card Group](#sfgpsdscaonselectablecardgroup)
   - [Activity Status Card](#sfgpsdscaonactivitystatuscard)
   - [NAICS Code Picker](#sfgpsdscaonnaicscodepicker)
   - [Site Task Card](#sfgpsdscaonsitetaskcard)
   - [Modal](#sfgpsdscaonmodal)
   - [Coordinate Input](#sfgpsdscaoncoordinateinput)
2. [OmniStudio Form Components](#omnistudio-form-components)
3. [GIS Components](#gis-components)

---

## UI Components

### sfGpsDsCaOnHeaderComm

The Ontario Design System header component for Experience Builder sites. Supports Ontario Government branding, application headers, menu items, and language toggle.

#### Properties

| Property                    | Type    | Default     | Description                                                         |
| --------------------------- | ------- | ----------- | ------------------------------------------------------------------- |
| `type`                      | String  | `"ontario"` | Header type: `ontario`, `application`, or `serviceOntario`          |
| `applicationHeaderInfoJson` | String  | -           | JSON object with `title`, `href`, and `maxWidth` for app headers    |
| `menuItemsJson`             | String  | -           | JSON array of menu items with `title` and `href`                    |
| `languageToggleOptionsJson` | String  | -           | JSON object with `englishLink` and `frenchLink` URLs                |
| `disableDynamicMenu`        | Boolean | `true`      | When true, disables fetching menu data from Ontario's API           |
| `language`                  | String  | `"en"`      | Header language: `en` (English) or `fr` (French)                    |
| `assetBasePath`             | String  | -           | Base path for header assets (logos, icons). Leave empty for default |
| `className`                 | String  | -           | Additional CSS classes                                              |

#### Menu Items JSON Format

```json
[
  { "title": "Home", "href": "/home" },
  { "title": "Services", "href": "/services" },
  { "title": "Contact", "href": "/contact" }
]
```

#### Language Toggle Options JSON Format

```json
{
  "englishLink": "/en/home",
  "frenchLink": "/fr/home"
}
```

#### Application Header Info JSON Format

```json
{
  "title": "Environmental Registry",
  "href": "/",
  "maxWidth": "1200px"
}
```

#### Usage Example

```html
<c-sf-gps-ds-ca-on-header-comm
  type="application"
  language="en"
  application-header-info-json='{"title": "EASR Portal", "href": "/"}'
  menu-items-json='[{"title": "Home", "href": "/home"}, {"title": "Register", "href": "/register"}]'
  language-toggle-options-json='{"englishLink": "/en", "frenchLink": "/fr"}'
  disable-dynamic-menu
></c-sf-gps-ds-ca-on-header-comm>
```

---

### sfGpsDsCaOnFooterComm

The Ontario Design System footer component for Experience Builder sites. Supports Ontario Government branding and language toggle.

#### Properties

| Property                    | Type   | Default | Description                                          |
| --------------------------- | ------ | ------- | ---------------------------------------------------- |
| `language`                  | String | `"en"`  | Footer language: `en` (English) or `fr` (French)     |
| `languageToggleOptionsJson` | String | -       | JSON object with `englishLink` and `frenchLink` URLs |
| `className`                 | String | -       | Additional CSS classes                               |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-footer-comm
  language="en"
  language-toggle-options-json='{"englishLink": "/en", "frenchLink": "/fr"}'
></c-sf-gps-ds-ca-on-footer-comm>
```

---

### sfGpsDsCaOnTextInput

A text input field styled with Ontario Design System.

#### Properties

| Property       | Type    | Default  | Description                                                |
| -------------- | ------- | -------- | ---------------------------------------------------------- |
| `label`        | String  | -        | Label text displayed above the input                       |
| `name`         | String  | -        | Input name attribute                                       |
| `value`        | String  | `""`     | Current input value                                        |
| `type`         | String  | `"text"` | Input type (text, email, password, number, tel, url, time) |
| `placeholder`  | String  | -        | Placeholder text                                           |
| `hintText`     | String  | -        | Help text displayed below label                            |
| `required`     | Boolean | `false`  | Shows "(required)" flag                                    |
| `optional`     | Boolean | `false`  | Shows "(optional)" flag                                    |
| `disabled`     | Boolean | `false`  | Disables the input                                         |
| `readonly`     | Boolean | `false`  | Makes input read-only                                      |
| `maxLength`    | Number  | -        | Maximum character length                                   |
| `minLength`    | Number  | -        | Minimum character length                                   |
| `pattern`      | String  | -        | Validation regex pattern                                   |
| `errorMessage` | String  | -        | Error message to display                                   |
| `className`    | String  | -        | Additional CSS classes                                     |

#### Events

| Event    | Detail              | Description                  |
| -------- | ------------------- | ---------------------------- |
| `change` | `{ value: string }` | Fired when value changes     |
| `blur`   | `{ value: string }` | Fired when input loses focus |
| `input`  | `{ value: string }` | Fired on each keystroke      |
| `focus`  | `{ value: string }` | Fired when input gains focus |

#### Methods

| Method                       | Parameters | Returns | Description               |
| ---------------------------- | ---------- | ------- | ------------------------- |
| `focus()`                    | -          | void    | Focuses the input         |
| `checkValidity()`            | -          | boolean | Returns validity state    |
| `reportValidity()`           | -          | boolean | Shows validation message  |
| `setCustomValidity(message)` | string     | void    | Sets custom error message |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-text-input
  label="Email Address"
  type="email"
  name="email"
  value="{email}"
  required
  hint-text="We'll use this to contact you"
  error-message="{emailError}"
  onchange="{handleEmailChange}"
>
</c-sf-gps-ds-ca-on-text-input>
```

---

### sfGpsDsCaOnDropdown

A dropdown select field styled with Ontario Design System.

#### Properties

| Property             | Type    | Default    | Description                         |
| -------------------- | ------- | ---------- | ----------------------------------- |
| `label`              | String  | -          | Label text                          |
| `name`               | String  | -          | Select name attribute               |
| `value`              | String  | `""`       | Currently selected value            |
| `options`            | Array   | `[]`       | Array of `{ value, label }` objects |
| `defaultOptionLabel` | String  | `"Select"` | Placeholder option text             |
| `hintText`           | String  | -          | Help text                           |
| `required`           | Boolean | `false`    | Shows "(required)" flag             |
| `optional`           | Boolean | `false`    | Shows "(optional)" flag             |
| `disabled`           | Boolean | `false`    | Disables the dropdown               |
| `errorMessage`       | String  | -          | Error message                       |
| `className`          | String  | -          | Additional CSS classes              |

#### Options Format

```javascript
options = [
  { value: "on", label: "Ontario" },
  { value: "bc", label: "British Columbia" },
  { value: "ab", label: "Alberta" }
];
```

#### Events

| Event    | Detail              | Description                     |
| -------- | ------------------- | ------------------------------- |
| `change` | `{ value: string }` | Fired when selection changes    |
| `blur`   | `{ value: string }` | Fired when dropdown loses focus |
| `focus`  | `{ value: string }` | Fired when dropdown gains focus |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-dropdown
  label="Province"
  name="province"
  options="{provinceOptions}"
  value="{selectedProvince}"
  required
  default-option-label="Select a province"
  onchange="{handleProvinceChange}"
>
</c-sf-gps-ds-ca-on-dropdown>
```

---

### sfGpsDsCaOnCheckboxGroup

A group of checkboxes styled with Ontario Design System.

#### Properties

| Property       | Type    | Default | Description                   |
| -------------- | ------- | ------- | ----------------------------- |
| `legend`       | String  | -       | Fieldset legend text          |
| `name`         | String  | -       | Checkbox group name           |
| `options`      | Array   | `[]`    | Array of checkbox options     |
| `value`        | Array   | `[]`    | Array of selected values      |
| `hintText`     | String  | -       | Help text                     |
| `required`     | Boolean | `false` | At least one must be selected |
| `optional`     | Boolean | `false` | Shows "(optional)" flag       |
| `disabled`     | Boolean | `false` | Disables all checkboxes       |
| `errorMessage` | String  | -       | Error message                 |

#### Options Format

```javascript
options = [
  { value: "email", label: "Email", checked: true },
  { value: "phone", label: "Phone", checked: false },
  {
    value: "mail",
    label: "Mail",
    checked: false,
    hintText: "Physical mail only"
  }
];
```

#### Events

| Event    | Detail                | Description                  |
| -------- | --------------------- | ---------------------------- |
| `change` | `{ value: string[] }` | Fired when selection changes |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-checkbox-group
  legend="Contact Preferences"
  name="contactPrefs"
  options="{contactOptions}"
  value="{selectedContacts}"
  onchange="{handleContactChange}"
>
</c-sf-gps-ds-ca-on-checkbox-group>
```

---

### sfGpsDsCaOnRadioGroup

A group of radio buttons styled with Ontario Design System.

#### Properties

| Property       | Type    | Default | Description              |
| -------------- | ------- | ------- | ------------------------ |
| `legend`       | String  | -       | Fieldset legend text     |
| `name`         | String  | -       | Radio group name         |
| `options`      | Array   | `[]`    | Array of radio options   |
| `value`        | String  | -       | Currently selected value |
| `hintText`     | String  | -       | Help text                |
| `required`     | Boolean | `false` | Selection required       |
| `optional`     | Boolean | `false` | Shows "(optional)" flag  |
| `disabled`     | Boolean | `false` | Disables all radios      |
| `errorMessage` | String  | -       | Error message            |

#### Options Format

```javascript
options = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "maybe", label: "Maybe", hintText: "Additional information" }
];
```

#### Events

| Event    | Detail              | Description                  |
| -------- | ------------------- | ---------------------------- |
| `change` | `{ value: string }` | Fired when selection changes |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-radio-group
  legend="Do you agree?"
  name="agreement"
  options="{agreementOptions}"
  value="{selectedAgreement}"
  required
  onchange="{handleAgreementChange}"
>
</c-sf-gps-ds-ca-on-radio-group>
```

---

### sfGpsDsCaOnDateInput

A date input with Ontario Design System styling.

#### Properties

| Property       | Type    | Default | Description                    |
| -------------- | ------- | ------- | ------------------------------ |
| `label`        | String  | -       | Label text                     |
| `name`         | String  | -       | Input name                     |
| `value`        | String  | -       | Date value (YYYY-MM-DD format) |
| `hintText`     | String  | -       | Help text                      |
| `required`     | Boolean | `false` | Date required                  |
| `optional`     | Boolean | `false` | Shows "(optional)" flag        |
| `disabled`     | Boolean | `false` | Disables the input             |
| `min`          | String  | -       | Minimum date (YYYY-MM-DD)      |
| `max`          | String  | -       | Maximum date (YYYY-MM-DD)      |
| `errorMessage` | String  | -       | Error message                  |

#### Events

| Event    | Detail              | Description                  |
| -------- | ------------------- | ---------------------------- |
| `change` | `{ value: string }` | Fired when date changes      |
| `blur`   | `{ value: string }` | Fired when input loses focus |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-date-input
  label="Date of Birth"
  name="dob"
  value="{dateOfBirth}"
  required
  max="2006-01-01"
  hint-text="You must be 18 or older"
  onchange="{handleDobChange}"
>
</c-sf-gps-ds-ca-on-date-input>
```

---

### sfGpsDsCaOnButtonComm

An Ontario Design System button for Experience Builder.

#### Properties

| Property    | Type    | Default     | Description                                 |
| ----------- | ------- | ----------- | ------------------------------------------- |
| `label`     | String  | -           | Button text                                 |
| `type`      | String  | `"primary"` | Button style (primary, secondary, tertiary) |
| `ariaLabel` | String  | -           | Accessible label                            |
| `disabled`  | Boolean | `false`     | Disables the button                         |
| `url`       | String  | -           | Navigation URL                              |
| `target`    | String  | -           | Link target (\_blank, \_self)               |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-button-comm
  label="Submit Application"
  type="primary"
  onclick="{handleSubmit}"
>
</c-sf-gps-ds-ca-on-button-comm>
```

---

### sfGpsDsCaOnBadgeComm

An Ontario Design System badge for Experience Builder.

#### Properties

| Property | Type   | Default         | Description                                       |
| -------- | ------ | --------------- | ------------------------------------------------- |
| `label`  | String | -               | Badge text                                        |
| `type`   | String | `"information"` | Badge type (information, success, warning, error) |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-badge-comm label="New" type="information">
</c-sf-gps-ds-ca-on-badge-comm>
```

---

### sfGpsDsCaOnCalloutComm

An Ontario Design System callout for Experience Builder. Supports both standard callouts with border colors and alert-style callouts with background colors and icons.

#### Properties

| Property          | Type   | Default     | Description                                                                               |
| ----------------- | ------ | ----------- | ----------------------------------------------------------------------------------------- |
| `heading`         | String | -           | Callout heading (supports Markdown)                                                       |
| `headingLevel`    | String | `"h2"`      | Heading level (h2, h3, h4, h5, h6)                                                        |
| `content`         | String | -           | Callout body text (supports Markdown)                                                     |
| `type`            | String | `"default"` | Callout type (default, information, warning, error, success)                              |
| `highlightColour` | String | `"default"` | Border color for default type (blue, gold, green, lime, purple, sky, taupe, teal, yellow) |
| `className`       | String | -           | Additional CSS classes                                                                    |

#### Type Variants

| Type          | Appearance                          | Use Case                                   |
| ------------- | ----------------------------------- | ------------------------------------------ |
| `default`     | Border color only (no icon)         | General informational callouts             |
| `information` | Blue background with info icon      | Helpful tips, additional context           |
| `warning`     | Yellow background with warning icon | Regulatory notices, important cautions     |
| `error`       | Red background with error icon      | Hard stops, ineligibility, critical errors |
| `success`     | Green background with success icon  | Confirmations, successful completions      |

#### Usage Examples

**Standard Callout (border only):**

```html
<c-sf-gps-ds-ca-on-callout-comm
  heading="Existing site information"
  content="The sites listed are sites previously created and stored in your profile."
  highlight-colour="sky"
>
</c-sf-gps-ds-ca-on-callout-comm>
```

**Warning Callout (yellow background with icon):**

```html
<c-sf-gps-ds-ca-on-callout-comm
  heading="Important regulatory notice"
  content="The person certifying must have authority to bind the registrant as per Ontario Regulation 245/11."
  type="warning"
>
</c-sf-gps-ds-ca-on-callout-comm>
```

**Error Callout (red background with icon):**

```html
<c-sf-gps-ds-ca-on-callout-comm
  heading="You do not meet the requirements"
  content="Based on your answer, you may need to apply for an Environmental Compliance Approval (ECA)."
  type="error"
>
</c-sf-gps-ds-ca-on-callout-comm>
```

---

### sfGpsDsCaOnCardComm

An Ontario Design System card for Experience Builder.

#### Properties

| Property      | Type   | Default | Description      |
| ------------- | ------ | ------- | ---------------- |
| `title`       | String | -       | Card title       |
| `description` | String | -       | Card description |
| `imageUrl`    | String | -       | Card image URL   |
| `imageAlt`    | String | -       | Image alt text   |
| `url`         | String | -       | Card link URL    |
| `target`      | String | -       | Link target      |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-card-comm
  title="Apply for Benefits"
  description="Learn about available benefits and how to apply."
  url="/benefits"
>
</c-sf-gps-ds-ca-on-card-comm>
```

---

### sfGpsDsCaOnLoadingIndicator

A loading spinner with Ontario Design System styling.

#### Properties

| Property | Type   | Default        | Description                 |
| -------- | ------ | -------------- | --------------------------- |
| `label`  | String | `"Loading..."` | Screen reader text          |
| `size`   | String | `"medium"`     | Size (small, medium, large) |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-loading-indicator
  label="Loading your application..."
  size="large"
>
</c-sf-gps-ds-ca-on-loading-indicator>
```

---

### sfGpsDsCaOnStepIndicator

A step progress indicator with Ontario Design System styling.

#### Properties

| Property      | Type   | Default | Description                  |
| ------------- | ------ | ------- | ---------------------------- |
| `steps`       | Array  | `[]`    | Array of step objects        |
| `currentStep` | Number | `0`     | Current step index (0-based) |

#### Steps Format

```javascript
steps = [
  { label: "Personal Info", status: "complete" },
  { label: "Address", status: "current" },
  { label: "Review", status: "incomplete" }
];
```

#### Usage Example

```html
<c-sf-gps-ds-ca-on-step-indicator
  steps="{formSteps}"
  current-step="{currentStepIndex}"
>
</c-sf-gps-ds-ca-on-step-indicator>
```

---

### sfGpsDsCaOnFeatureCard

A horizontal card with image, heading, and description for service navigation on home pages.

#### Properties

| Property       | Type   | Default | Description                                  |
| -------------- | ------ | ------- | -------------------------------------------- |
| `heading`      | String | -       | The heading/title of the feature card        |
| `description`  | String | -       | Description text below the heading           |
| `url`          | String | `"#"`   | URL to navigate to when the card is clicked  |
| `image`        | String | -       | Image URL to display on the left side        |
| `imageAltText` | String | -       | Alt text for the image (defaults to heading) |
| `headingLevel` | String | `"h2"`  | Heading level for accessibility (h2, h3, h4) |
| `className`    | String | -       | Additional CSS classes                       |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-feature-card-comm
  heading="Pre-screening"
  description="Find out what environmental permissions you or your business requires."
  image="/resource/sfGpsDsCaOnGlobalStyles/images/pre-screening.jpg"
  url="/pre-screening"
  heading-level="h2"
></c-sf-gps-ds-ca-on-feature-card-comm>
```

---

### sfGpsDsCaOnNotificationCard

A card for displaying notification categories with colored headers and unread counts.

#### Properties

| Property           | Type   | Default    | Description                                           |
| ------------------ | ------ | ---------- | ----------------------------------------------------- |
| `heading`          | String | -          | The heading/title of the notification category        |
| `description`      | String | -          | Description text explaining the notification category |
| `url`              | String | `"#"`      | URL to navigate to when viewing notifications         |
| `notificationType` | String | `"action"` | Type of notification (action, reminder, status)       |
| `unreadCount`      | Number | `0`        | Number of unread notifications                        |
| `className`        | String | -          | Additional CSS classes                                |

#### Notification Types

| Type       | Header Color   |
| ---------- | -------------- |
| `action`   | Dark (#1a1a1a) |
| `reminder` | Teal (#00838f) |
| `status`   | Blue (#0277bd) |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-notification-card-comm
  heading="Action required"
  description="Check messages that need your attention."
  notification-type="action"
  unread-count="2"
  url="/notifications/action"
></c-sf-gps-ds-ca-on-notification-card-comm>
```

---

### sfGpsDsCaOnLinkCard

A simple card with heading and description for external links (Related Links sections).

#### Properties

| Property      | Type    | Default | Description                         |
| ------------- | ------- | ------- | ----------------------------------- |
| `heading`     | String  | -       | The heading/title of the link card  |
| `description` | String  | -       | Description text below the heading  |
| `url`         | String  | `"#"`   | URL to navigate to                  |
| `isExternal`  | Boolean | `false` | Whether the link opens in a new tab |
| `className`   | String  | -       | Additional CSS classes              |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-link-card-comm
  heading="Access environment"
  description="Search and view detailed information about environmental permissions across Ontario."
  url="https://access.environment.ontario.ca"
  is-external="true"
></c-sf-gps-ds-ca-on-link-card-comm>
```

---

### sfGpsDsCaOnActionCard

An action card component for displaying service/action options with icon, title, description, and link.

#### Properties

| Property      | Type   | Default | Description                                          |
| ------------- | ------ | ------- | ---------------------------------------------------- |
| `heading`     | String | -       | The card heading/title                               |
| `description` | String | -       | Description text (supports Markdown in Comm version) |
| `url`         | String | `"#"`   | URL to navigate to when clicked                      |
| `icon`        | String | -       | Icon identifier (e.g., "document", "calendar")       |
| `className`   | String | -       | Additional CSS classes                               |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-action-card-comm
  heading="Apply for a new activity"
  description="Start a new EASR registration for your business."
  url="/apply"
  icon="document"
></c-sf-gps-ds-ca-on-action-card-comm>
```

---

### sfGpsDsCaOnActionCardCollectionComm

A responsive grid collection of action cards for Experience Builder.

#### Properties

| Property    | Type          | Default | Description                    |
| ----------- | ------------- | ------- | ------------------------------ |
| `cards`     | String (JSON) | `"[]"`  | JSON array of card objects     |
| `columns`   | String        | `"2"`   | Number of columns (1, 2, 3, 4) |
| `className` | String        | -       | Additional CSS classes         |

#### Cards JSON Format

```json
[
  {
    "heading": "Apply for a new activity",
    "description": "Start a new registration.",
    "url": "/apply",
    "icon": "document"
  },
  {
    "heading": "Register for an existing activity",
    "description": "Update an existing registration.",
    "url": "/register",
    "icon": "edit"
  }
]
```

---

### sfGpsDsCaOnSelectableCard

A selectable card component with checkbox functionality, expandable content, and optional badge/link.

#### Properties

| Property          | Type    | Default  | Description                                        |
| ----------------- | ------- | -------- | -------------------------------------------------- |
| `value`           | String  | -        | The value when selected                            |
| `label`           | String  | -        | Card label/title                                   |
| `description`     | String  | -        | Description text (supports multi-line with `\n`)   |
| `expandedContent` | String  | -        | HTML content shown when expanded                   |
| `checked`         | Boolean | `false`  | Whether the card is selected                       |
| `disabled`        | Boolean | `false`  | Disables the card                                  |
| `name`            | String  | -        | Group name for radio/checkbox behavior             |
| `badge`           | String  | -        | Badge text (e.g., "NEW", "IN PROGRESS")            |
| `badgeVariant`    | String  | `"info"` | Badge style: `success`, `info`, `warning`, `error` |
| `linkLabel`       | String  | -        | Optional link text                                 |
| `linkUrl`         | String  | -        | Optional link URL                                  |

#### Events

| Event    | Detail               | Description                       |
| -------- | -------------------- | --------------------------------- |
| `select` | `{ value, checked }` | Fired when card selection changes |

#### Badge Variants

| Variant   | Background       | Use Case                  |
| --------- | ---------------- | ------------------------- |
| `success` | Green (#118847)  | Completed, approved       |
| `info`    | Blue (#0066CC)   | New, informational        |
| `warning` | Yellow (#1A1A1A) | Pending, attention needed |
| `error`   | Red (#CD0000)    | Error, rejected           |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-selectable-card
  value="stormwater"
  label="Stormwater Management Works"
  description="Activities related to stormwater management."
  badge="NEW"
  badge-variant="info"
  link-label="View details"
  link-url="/details/stormwater"
  checked="{isSelected}"
  onselect="{handleSelect}"
></c-sf-gps-ds-ca-on-selectable-card>
```

---

### sfGpsDsCaOnSelectableCardGroup

A group of selectable cards with single or multi-select behavior.

#### Properties

| Property      | Type    | Default | Description                  |
| ------------- | ------- | ------- | ---------------------------- |
| `name`        | String  | -       | Group name                   |
| `options`     | Array   | `[]`    | Array of card option objects |
| `value`       | Array   | `[]`    | Currently selected values    |
| `disabled`    | Boolean | `false` | Disables all cards           |
| `multiSelect` | Boolean | `true`  | Allow multiple selections    |

#### Options Format

```javascript
options = [
  {
    value: "air",
    label: "Air Emissions",
    description: "Activities that release emissions.",
    badge: "NEW",
    badgeVariant: "success",
    linkLabel: "More info",
    linkUrl: "/air-details"
  },
  {
    value: "water",
    label: "Water Discharge",
    description: "Activities involving water discharge."
  }
];
```

#### Events

| Event    | Detail                | Description                  |
| -------- | --------------------- | ---------------------------- |
| `change` | `{ value: string[] }` | Fired when selection changes |

---

### sfGpsDsCaOnActivityStatusCard

A card displaying an activity's status, progress, and action options.

#### Properties

| Property         | Type    | Default     | Description                                   |
| ---------------- | ------- | ----------- | --------------------------------------------- |
| `activityId`     | String  | -           | Unique identifier for the activity            |
| `activityName`   | String  | -           | Display name of the activity                  |
| `activityType`   | String  | -           | Type/category of the activity                 |
| `status`         | String  | -           | Current status (e.g., "Draft", "In Progress") |
| `statusVariant`  | String  | `"default"` | Status badge style                            |
| `completedSteps` | Number  | `0`         | Number of completed steps                     |
| `totalSteps`     | Number  | `0`         | Total number of steps                         |
| `lastUpdated`    | String  | -           | Last update timestamp                         |
| `url`            | String  | -           | URL to activity details                       |
| `allowRemove`    | Boolean | `false`     | Show remove action                            |

#### Events

| Event    | Detail                         | Description                  |
| -------- | ------------------------------ | ---------------------------- |
| `remove` | `{ activityId, activityName }` | Fired when Remove is clicked |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-activity-status-card-comm
  activity-id="ACT-001"
  activity-name="Stormwater Management"
  activity-type="Industrial"
  status="In Progress"
  completed-steps="3"
  total-steps="5"
  url="/activities/ACT-001"
  allow-remove
  onremove="{handleRemove}"
></c-sf-gps-ds-ca-on-activity-status-card-comm>
```

---

### sfGpsDsCaOnNaicsCodePicker

A cascading 5-level dropdown picker for NAICS (North American Industry Classification System) codes.

#### Properties

| Property       | Type    | Default | Description                     |
| -------------- | ------- | ------- | ------------------------------- |
| `value`        | String  | -       | Selected NAICS code             |
| `options`      | Array   | `[]`    | Hierarchical NAICS code options |
| `label`        | String  | -       | Field label                     |
| `hintText`     | String  | -       | Help text                       |
| `required`     | Boolean | `false` | Required validation             |
| `disabled`     | Boolean | `false` | Disable the picker              |
| `errorMessage` | String  | -       | Error message to display        |

#### Events

| Event    | Detail                       | Description                     |
| -------- | ---------------------------- | ------------------------------- |
| `change` | `{ value, label, fullPath }` | Fired when selection changes    |
| `clear`  | -                            | Fired when selection is cleared |

---

### sfGpsDsCaOnSiteTaskCard

A card displaying a registration site with its associated tasks and completion progress.

#### Properties

| Property         | Type    | Default | Description               |
| ---------------- | ------- | ------- | ------------------------- |
| `siteId`         | String  | -       | Unique site identifier    |
| `siteName`       | String  | -       | Site display name         |
| `siteAddress`    | String  | -       | Site address              |
| `tasks`          | Array   | `[]`    | Array of task objects     |
| `completedTasks` | Number  | `0`     | Number of completed tasks |
| `totalTasks`     | Number  | `0`     | Total number of tasks     |
| `allowRemove`    | Boolean | `false` | Show remove action        |

#### Tasks Format

```javascript
tasks = [
  { label: "Site details", status: "complete", url: "/site/1/details" },
  { label: "NAICS codes", status: "in-progress", url: "/site/1/naics" },
  { label: "Site contacts", status: "not-started", url: "/site/1/contacts" }
];
```

#### Events

| Event    | Detail                 | Description                  |
| -------- | ---------------------- | ---------------------------- |
| `remove` | `{ siteId, siteName }` | Fired when Remove is clicked |

---

### sfGpsDsCaOnModal

A modal dialog component with Ontario DS styling.

#### Properties

| Property          | Type    | Default    | Description                              |
| ----------------- | ------- | ---------- | ---------------------------------------- |
| `title`           | String  | -          | Modal title in header                    |
| `size`            | String  | `"medium"` | Size: `small`, `medium`, `large`, `full` |
| `isOpen`          | Boolean | `false`    | Controls modal visibility                |
| `hideCloseButton` | Boolean | `false`    | Hide the X close button                  |
| `hideHeader`      | Boolean | `false`    | Hide the header section                  |
| `hideFooter`      | Boolean | `false`    | Hide the footer section                  |

#### Methods

| Method    | Parameters | Returns | Description      |
| --------- | ---------- | ------- | ---------------- |
| `open()`  | -          | void    | Opens the modal  |
| `close()` | -          | void    | Closes the modal |

#### Events

| Event   | Detail | Description                |
| ------- | ------ | -------------------------- |
| `close` | -      | Fired when modal is closed |

#### Slots

| Slot Name | Description             |
| --------- | ----------------------- |
| `content` | Main modal body content |
| `footer`  | Footer buttons/actions  |

#### Features

- Dark header with Ontario branding
- Focus trapping for accessibility
- Escape key to close
- Body scroll lock when open
- ARIA modal attributes

#### Usage Example

```html
<c-sf-gps-ds-ca-on-modal
  title="Site Selector"
  size="large"
  is-open="{isModalOpen}"
  onclose="{handleClose}"
>
  <div slot="content">
    <!-- Modal content here -->
  </div>
  <div slot="footer">
    <button onclick="{handleSave}">Save</button>
  </div>
</c-sf-gps-ds-ca-on-modal>
```

---

### sfGpsDsCaOnCoordinateInput

A reusable input component for geographic coordinates supporting multiple formats.

#### Properties

| Property       | Type    | Default | Description                                |
| -------------- | ------- | ------- | ------------------------------------------ |
| `format`       | String  | `"dms"` | Coordinate format: `utm`, `dms`, `decimal` |
| `required`     | Boolean | `false` | Required validation                        |
| `disabled`     | Boolean | `false` | Disable all fields                         |
| `errorMessage` | String  | -       | Error message to display                   |
| `className`    | String  | -       | Additional CSS classes                     |

#### Formats

| Format    | Fields                                                                      |
| --------- | --------------------------------------------------------------------------- |
| `utm`     | UTM Zone (1-60), UTM East (M), UTM North (M)                                |
| `dms`     | Latitude (degrees, minutes, seconds), Longitude (degrees, minutes, seconds) |
| `decimal` | Latitude (-90 to 90), Longitude (-180 to 180)                               |

#### Methods

| Method            | Parameters | Returns                   | Description                             |
| ----------------- | ---------- | ------------------------- | --------------------------------------- |
| `getValue()`      | -          | Object                    | Returns current coordinate values       |
| `setValue(value)` | Object     | void                      | Sets coordinate values programmatically |
| `validate()`      | -          | `{ valid, errors }`       | Validates input                         |
| `toDecimal()`     | -          | `{ latitude, longitude }` | Converts to decimal format              |

#### Events

| Event    | Detail              | Description                             |
| -------- | ------------------- | --------------------------------------- |
| `change` | `{ format, value }` | Fired when any coordinate value changes |

---

### sfGpsDsCaOnButtonComm (Enhanced)

The Ontario button component now supports icons.

#### Additional Properties

| Property       | Type   | Default  | Description                                                                                                               |
| -------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `icon`         | String | -        | Icon name: `add`, `remove`, `edit`, `delete`, `search`, `download`, `upload`, `external`, `chevron-right`, `chevron-left` |
| `iconPosition` | String | `"left"` | Icon position: `left` or `right`                                                                                          |

#### Usage Example with Icon

```html
<c-sf-gps-ds-ca-on-button-comm
  label="Add new site"
  type="secondary"
  icon="add"
  icon-position="left"
  onclick="{handleAddSite}"
></c-sf-gps-ds-ca-on-button-comm>
```

---

## OmniStudio Form Components

OmniStudio form components inherit their properties from OmniScript configuration. The following properties are available through the OmniScript designer.

### Common Properties (All Form Components)

| OmniScript Property | Maps To                | Description         |
| ------------------- | ---------------------- | ------------------- |
| `label`             | `mergedLabel`          | Field label         |
| `help`              | `mergedHelpText`       | Hint text           |
| `required`          | `_propSetMap.required` | Required validation |
| `readOnly`          | `_propSetMap.readOnly` | Read-only mode      |
| `disabled`          | `_propSetMap.disabled` | Disabled state      |
| `placeholder`       | `mergedPlaceholder`    | Placeholder text    |

### Validation Messages

| OmniScript Property          | Description                  |
| ---------------------------- | ---------------------------- |
| `messageWhenValueMissing`    | Error for required fields    |
| `messageWhenPatternMismatch` | Error for pattern validation |
| `messageWhenTooShort`        | Error for minimum length     |
| `messageWhenTooLong`         | Error for maximum length     |
| `messageWhenRangeUnderflow`  | Error for minimum value      |
| `messageWhenRangeOverflow`   | Error for maximum value      |

### Form Component Mapping

| OmniScript Element            | Ontario Component                     | Base Class                     |
| ----------------------------- | ------------------------------------- | ------------------------------ |
| Text                          | sfGpsDsCaOnFormText                   | sfGpsDsFormText                |
| Text Area                     | sfGpsDsCaOnFormTextarea               | sfGpsDsFormTextarea            |
| Email                         | sfGpsDsCaOnFormEmail                  | sfGpsDsFormEmail               |
| URL                           | sfGpsDsCaOnFormUrl                    | sfGpsDsFormUrl                 |
| Telephone                     | sfGpsDsCaOnFormTelephone              | sfGpsDsFormText                |
| Range                         | sfGpsDsCaOnFormRange                  | sfGpsDsOsrtOmniscriptRange     |
| Number                        | sfGpsDsCaOnFormNumber                 | sfGpsDsFormNumber              |
| Password                      | sfGpsDsCaOnFormPassword               | sfGpsDsFormPassword            |
| Currency                      | sfGpsDsCaOnFormCurrency               | sfGpsDsFormCurrency            |
| Date                          | sfGpsDsCaOnFormDate                   | sfGpsDsFormDate                |
| Time                          | sfGpsDsCaOnFormTime                   | sfGpsDsFormTime                |
| Date/Time                     | sfGpsDsCaOnFormDateTime               | sfGpsDsFormDateTime            |
| Radio                         | sfGpsDsCaOnFormRadio                  | sfGpsDsFormRadio               |
| Checkbox                      | sfGpsDsCaOnFormCheckbox               | sfGpsDsFormCheckbox            |
| Select                        | sfGpsDsCaOnFormSelect                 | sfGpsDsFormSelect              |
| Multi-select                  | sfGpsDsCaOnFormMultiselect            | sfGpsDsFormMultiselect         |
| Lookup                        | sfGpsDsCaOnFormLookup                 | sfGpsDsFormLookup              |
| Typeahead                     | sfGpsDsCaOnFormTypeahead              | sfGpsDsFormTypeahead           |
| Places Typeahead              | sfGpsDsCaOnFormPlacesTypeahead        | sfGpsDsFormPlacesTypeahead     |
| File                          | sfGpsDsCaOnFormFile                   | sfGpsDsFormFile                |
| Image                         | sfGpsDsCaOnFormImage                  | sfGpsDsFormFile                |
| Text Block                    | sfGpsDsCaOnFormTextBlock              | sfGpsDsFormTextBlock           |
| Formula                       | sfGpsDsCaOnFormFormula                | sfGpsDsFormFormula             |
| Disclosure                    | sfGpsDsCaOnFormDisclosure             | sfGpsDsFormDisclosure          |
| Messaging                     | sfGpsDsCaOnFormMessaging              | sfGpsDsFormMessaging           |
| Step                          | sfGpsDsCaOnFormStep                   | sfGpsDsFormStep                |
| Step Chart                    | sfGpsDsCaOnFormStepChart              | sfGpsDsFormStepChart           |
| Block                         | sfGpsDsCaOnFormBlock                  | sfGpsDsFormBlock               |
| Edit Block                    | sfGpsDsCaOnFormEditBlock              | sfGpsDsOsrtOmniscriptEditBlock |
| Custom LWC (Selectable Cards) | sfGpsDsCaOnFormSelectableCards        | sfGpsDsFormMultiselect         |
| Custom LWC (NAICS Picker)     | sfGpsDsCaOnFormNaicsCodePicker        | sfGpsDsFormSelect              |
| Custom LWC (Site Selector)    | sfGpsDsCaOnFormSiteSelectorTool       | OmniscriptBaseMixin            |
| Custom LWC (Discharge Point)  | sfGpsDsCaOnFormDischargePointSelector | OmniscriptBaseMixin            |

---

## GIS Components

For comprehensive documentation on GIS-integrated components, see **[GIS_GUIDE.md](./GIS_GUIDE.md)**.

### Quick Reference

| Component                           | Description                      | OmniScript LWC                          |
| ----------------------------------- | -------------------------------- | --------------------------------------- |
| `sfGpsDsCaOnSiteSelectorTool`       | Address selection with ESRI map  | `sfGpsDsCaOnFormSiteSelectorTool`       |
| `sfGpsDsCaOnDischargePointSelector` | Coordinate entry with ESRI map   | `sfGpsDsCaOnFormDischargePointSelector` |
| `sfGpsDsCaOnCoordinateInput`        | UTM/DMS/Decimal coordinate input | -                                       |
| `sfGpsDsCaOnModal`                  | Ontario DS modal dialog          | -                                       |

---

## Business Rules Components

### sfGpsDsCaOnDecisionExplainerComm

A component for displaying business rule evaluation results with step-by-step explanations. Integrates with Salesforce Business Rules Engine DecisionExplainer API.

> **Setup Required:** This component requires Connected App configuration and authorization. See [DECISION_EXPLAINER_SETUP.md](./DECISION_EXPLAINER_SETUP.md) for complete setup instructions.

#### Properties

| Property                   | Type    | Default                 | Description                                       |
| -------------------------- | ------- | ----------------------- | ------------------------------------------------- |
| `heading`                  | String  | `"Eligibility Results"` | Heading text displayed above the results          |
| `expressionSetApiName`     | String  | -                       | API name of the expression set to evaluate        |
| `integrationProcedureName` | String  | -                       | Integration Procedure name (Type_SubType format)  |
| `evaluationMethod`         | String  | `"expressionSet"`       | Method: `expressionSet` or `integrationProcedure` |
| `inputVariablesJson`       | String  | -                       | JSON string containing input variables            |
| `viewModeDefault`          | String  | `"concise"`             | Display mode: `concise` or `detailed`             |
| `showViewToggle`           | Boolean | `true`                  | Show button to toggle between view modes          |
| `autoEvaluate`             | Boolean | `false`                 | Automatically evaluate on component load          |
| `showInputs`               | Boolean | `false`                 | Display input values in summary                   |
| `showOutputs`              | Boolean | `true`                  | Display calculated output values                  |
| `className`                | String  | -                       | Additional CSS classes                            |

#### Events

| Event            | Detail                | Description                       |
| ---------------- | --------------------- | --------------------------------- |
| `evaluate`       | `{ success, result }` | Fired after evaluation completes  |
| `error`          | `{ message }`         | Fired if evaluation fails         |
| `viewmodechange` | `{ viewMode }`        | Fired when user toggles view mode |

#### Methods

| Method             | Parameters | Returns                              | Description                     |
| ------------------ | ---------- | ------------------------------------ | ------------------------------- |
| `evaluate()`       | -          | `Promise<DecisionExplanationResult>` | Trigger evaluation              |
| `reset()`          | -          | `void`                               | Reset to initial state          |
| `toggleViewMode()` | -          | `void`                               | Toggle between concise/detailed |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-decision-explainer-comm
  heading="Your Eligibility Results"
  expression-set-api-name="Benefit_Eligibility_Check"
  input-variables-json='{"income": 50000, "dependents": 2, "isVeteran": true}'
  view-mode-default="concise"
  show-view-toggle="true"
  auto-evaluate="true"
  show-outputs="true"
></c-sf-gps-ds-ca-on-decision-explainer-comm>
```

#### Programmatic Usage

```javascript
// Get component reference
const explainer = this.template.querySelector(
  "c-sf-gps-ds-ca-on-decision-explainer"
);

// Set input variables dynamically
explainer.inputVariables = {
  income: this.userIncome,
  dependents: this.dependentCount,
  isVeteran: this.veteranStatus
};

// Trigger evaluation
const result = await explainer.evaluate();

if (result.success) {
  console.log("Eligible:", result.overallResult === "passed");
  console.log("Outputs:", result.outputs);
} else {
  console.error("Evaluation failed:", result.errorMessage);
}
```

#### Result Object Structure

```javascript
{
  success: true,
  overallResult: 'passed', // 'passed', 'failed', or 'error'
  overallMessage: 'All eligibility criteria have been met.',
  steps: [
    {
      stepName: 'Income_Check',
      stepLabel: 'Income Verification',
      message: 'Your income of $50,000 meets the threshold.',
      passed: true,
      showDetails: true,
      sequenceNumber: 1,
      details: {
        threshold: 45000,
        actualIncome: 50000
      }
    },
    // ... more steps
  ],
  outputs: {
    eligibleAmount: 1200,
    benefitTier: 'Standard'
  }
}
```

---

## Related Documentation

- [OMNISTUDIO_FORMS.md](./OMNISTUDIO_FORMS.md) - OmniStudio forms overview
- [OMNISCRIPT_SETUP.md](./OMNISCRIPT_SETUP.md) - OmniScript configuration
- [GIS_GUIDE.md](./GIS_GUIDE.md) - GIS components (Site Selector, Discharge Point, ESRI integration)
- [LWR_GUIDE.md](./LWR_GUIDE.md) - LWR compatibility and best practices
- [DECISION_EXPLAINER_SETUP.md](./DECISION_EXPLAINER_SETUP.md) - Decision Explainer setup (Connected App, permissions)
- [BUILD_GUIDE.md](./BUILD_GUIDE.md) - Build and deployment
