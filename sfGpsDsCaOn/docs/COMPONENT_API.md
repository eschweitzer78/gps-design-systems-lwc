# Ontario Design System - Component API Reference

This document provides the API reference for all Ontario Design System UI components and OmniStudio form components.

---

## Table of Contents

1. [UI Components](#ui-components)
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
2. [OmniStudio Form Components](#omnistudio-form-components)

---

## UI Components

### sfGpsDsCaOnTextInput

A text input field styled with Ontario Design System.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | String | - | Label text displayed above the input |
| `name` | String | - | Input name attribute |
| `value` | String | `""` | Current input value |
| `type` | String | `"text"` | Input type (text, email, password, number, tel, url, time) |
| `placeholder` | String | - | Placeholder text |
| `hintText` | String | - | Help text displayed below label |
| `required` | Boolean | `false` | Shows "(required)" flag |
| `optional` | Boolean | `false` | Shows "(optional)" flag |
| `disabled` | Boolean | `false` | Disables the input |
| `readonly` | Boolean | `false` | Makes input read-only |
| `maxLength` | Number | - | Maximum character length |
| `minLength` | Number | - | Minimum character length |
| `pattern` | String | - | Validation regex pattern |
| `errorMessage` | String | - | Error message to display |
| `className` | String | - | Additional CSS classes |

#### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value: string }` | Fired when value changes |
| `blur` | `{ value: string }` | Fired when input loses focus |
| `input` | `{ value: string }` | Fired on each keystroke |
| `focus` | `{ value: string }` | Fired when input gains focus |

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `focus()` | - | void | Focuses the input |
| `checkValidity()` | - | boolean | Returns validity state |
| `reportValidity()` | - | boolean | Shows validation message |
| `setCustomValidity(message)` | string | void | Sets custom error message |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-text-input
  label="Email Address"
  type="email"
  name="email"
  value={email}
  required
  hint-text="We'll use this to contact you"
  error-message={emailError}
  onchange={handleEmailChange}
>
</c-sf-gps-ds-ca-on-text-input>
```

---

### sfGpsDsCaOnDropdown

A dropdown select field styled with Ontario Design System.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | String | - | Label text |
| `name` | String | - | Select name attribute |
| `value` | String | `""` | Currently selected value |
| `options` | Array | `[]` | Array of `{ value, label }` objects |
| `defaultOptionLabel` | String | `"Select"` | Placeholder option text |
| `hintText` | String | - | Help text |
| `required` | Boolean | `false` | Shows "(required)" flag |
| `optional` | Boolean | `false` | Shows "(optional)" flag |
| `disabled` | Boolean | `false` | Disables the dropdown |
| `errorMessage` | String | - | Error message |
| `className` | String | - | Additional CSS classes |

#### Options Format

```javascript
options = [
  { value: "on", label: "Ontario" },
  { value: "bc", label: "British Columbia" },
  { value: "ab", label: "Alberta" }
];
```

#### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value: string }` | Fired when selection changes |
| `blur` | `{ value: string }` | Fired when dropdown loses focus |
| `focus` | `{ value: string }` | Fired when dropdown gains focus |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-dropdown
  label="Province"
  name="province"
  options={provinceOptions}
  value={selectedProvince}
  required
  default-option-label="Select a province"
  onchange={handleProvinceChange}
>
</c-sf-gps-ds-ca-on-dropdown>
```

---

### sfGpsDsCaOnCheckboxGroup

A group of checkboxes styled with Ontario Design System.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `legend` | String | - | Fieldset legend text |
| `name` | String | - | Checkbox group name |
| `options` | Array | `[]` | Array of checkbox options |
| `value` | Array | `[]` | Array of selected values |
| `hintText` | String | - | Help text |
| `required` | Boolean | `false` | At least one must be selected |
| `optional` | Boolean | `false` | Shows "(optional)" flag |
| `disabled` | Boolean | `false` | Disables all checkboxes |
| `errorMessage` | String | - | Error message |

#### Options Format

```javascript
options = [
  { value: "email", label: "Email", checked: true },
  { value: "phone", label: "Phone", checked: false },
  { value: "mail", label: "Mail", checked: false, hintText: "Physical mail only" }
];
```

#### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value: string[] }` | Fired when selection changes |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-checkbox-group
  legend="Contact Preferences"
  name="contactPrefs"
  options={contactOptions}
  value={selectedContacts}
  onchange={handleContactChange}
>
</c-sf-gps-ds-ca-on-checkbox-group>
```

---

### sfGpsDsCaOnRadioGroup

A group of radio buttons styled with Ontario Design System.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `legend` | String | - | Fieldset legend text |
| `name` | String | - | Radio group name |
| `options` | Array | `[]` | Array of radio options |
| `value` | String | - | Currently selected value |
| `hintText` | String | - | Help text |
| `required` | Boolean | `false` | Selection required |
| `optional` | Boolean | `false` | Shows "(optional)" flag |
| `disabled` | Boolean | `false` | Disables all radios |
| `errorMessage` | String | - | Error message |

#### Options Format

```javascript
options = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "maybe", label: "Maybe", hintText: "Additional information" }
];
```

#### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value: string }` | Fired when selection changes |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-radio-group
  legend="Do you agree?"
  name="agreement"
  options={agreementOptions}
  value={selectedAgreement}
  required
  onchange={handleAgreementChange}
>
</c-sf-gps-ds-ca-on-radio-group>
```

---

### sfGpsDsCaOnDateInput

A date input with Ontario Design System styling.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | String | - | Label text |
| `name` | String | - | Input name |
| `value` | String | - | Date value (YYYY-MM-DD format) |
| `hintText` | String | - | Help text |
| `required` | Boolean | `false` | Date required |
| `optional` | Boolean | `false` | Shows "(optional)" flag |
| `disabled` | Boolean | `false` | Disables the input |
| `min` | String | - | Minimum date (YYYY-MM-DD) |
| `max` | String | - | Maximum date (YYYY-MM-DD) |
| `errorMessage` | String | - | Error message |

#### Events

| Event | Detail | Description |
|-------|--------|-------------|
| `change` | `{ value: string }` | Fired when date changes |
| `blur` | `{ value: string }` | Fired when input loses focus |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-date-input
  label="Date of Birth"
  name="dob"
  value={dateOfBirth}
  required
  max="2006-01-01"
  hint-text="You must be 18 or older"
  onchange={handleDobChange}
>
</c-sf-gps-ds-ca-on-date-input>
```

---

### sfGpsDsCaOnButtonComm

An Ontario Design System button for Experience Builder.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | String | - | Button text |
| `type` | String | `"primary"` | Button style (primary, secondary, tertiary) |
| `ariaLabel` | String | - | Accessible label |
| `disabled` | Boolean | `false` | Disables the button |
| `url` | String | - | Navigation URL |
| `target` | String | - | Link target (_blank, _self) |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-button-comm
  label="Submit Application"
  type="primary"
  onclick={handleSubmit}
>
</c-sf-gps-ds-ca-on-button-comm>
```

---

### sfGpsDsCaOnBadgeComm

An Ontario Design System badge for Experience Builder.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | String | - | Badge text |
| `type` | String | `"information"` | Badge type (information, success, warning, error) |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-badge-comm
  label="New"
  type="information"
>
</c-sf-gps-ds-ca-on-badge-comm>
```

---

### sfGpsDsCaOnCalloutComm

An Ontario Design System callout for Experience Builder.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | String | - | Callout heading |
| `content` | String | - | Callout body text (supports HTML) |
| `type` | String | `"information"` | Callout type |

#### Usage Example

```html
<c-sf-gps-ds-ca-on-callout-comm
  title="Important Information"
  content="Please review the following before continuing."
  type="warning"
>
</c-sf-gps-ds-ca-on-callout-comm>
```

---

### sfGpsDsCaOnCardComm

An Ontario Design System card for Experience Builder.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | String | - | Card title |
| `description` | String | - | Card description |
| `imageUrl` | String | - | Card image URL |
| `imageAlt` | String | - | Image alt text |
| `url` | String | - | Card link URL |
| `target` | String | - | Link target |

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

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | String | `"Loading..."` | Screen reader text |
| `size` | String | `"medium"` | Size (small, medium, large) |

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

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `steps` | Array | `[]` | Array of step objects |
| `currentStep` | Number | `0` | Current step index (0-based) |

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
  steps={formSteps}
  current-step={currentStepIndex}
>
</c-sf-gps-ds-ca-on-step-indicator>
```

---

### sfGpsDsCaOnFeatureCard

A horizontal card with image, heading, and description for service navigation on home pages.

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `heading` | String | - | The heading/title of the feature card |
| `description` | String | - | Description text below the heading |
| `url` | String | `"#"` | URL to navigate to when the card is clicked |
| `image` | String | - | Image URL to display on the left side |
| `imageAltText` | String | - | Alt text for the image (defaults to heading) |
| `headingLevel` | String | `"h2"` | Heading level for accessibility (h2, h3, h4) |
| `className` | String | - | Additional CSS classes |

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

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `heading` | String | - | The heading/title of the notification category |
| `description` | String | - | Description text explaining the notification category |
| `url` | String | `"#"` | URL to navigate to when viewing notifications |
| `notificationType` | String | `"action"` | Type of notification (action, reminder, status) |
| `unreadCount` | Number | `0` | Number of unread notifications |
| `className` | String | - | Additional CSS classes |

#### Notification Types

| Type | Header Color |
|------|--------------|
| `action` | Dark (#1a1a1a) |
| `reminder` | Teal (#00838f) |
| `status` | Blue (#0277bd) |

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

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `heading` | String | - | The heading/title of the link card |
| `description` | String | - | Description text below the heading |
| `url` | String | `"#"` | URL to navigate to |
| `isExternal` | Boolean | `false` | Whether the link opens in a new tab |
| `className` | String | - | Additional CSS classes |

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

## OmniStudio Form Components

OmniStudio form components inherit their properties from OmniScript configuration. The following properties are available through the OmniScript designer.

### Common Properties (All Form Components)

| OmniScript Property | Maps To | Description |
|---------------------|---------|-------------|
| `label` | `mergedLabel` | Field label |
| `help` | `mergedHelpText` | Hint text |
| `required` | `_propSetMap.required` | Required validation |
| `readOnly` | `_propSetMap.readOnly` | Read-only mode |
| `disabled` | `_propSetMap.disabled` | Disabled state |
| `placeholder` | `mergedPlaceholder` | Placeholder text |

### Validation Messages

| OmniScript Property | Description |
|---------------------|-------------|
| `messageWhenValueMissing` | Error for required fields |
| `messageWhenPatternMismatch` | Error for pattern validation |
| `messageWhenTooShort` | Error for minimum length |
| `messageWhenTooLong` | Error for maximum length |
| `messageWhenRangeUnderflow` | Error for minimum value |
| `messageWhenRangeOverflow` | Error for maximum value |

### Form Component Mapping

| OmniScript Element | Ontario Component | Base Class |
|--------------------|-------------------|------------|
| Text | sfGpsDsCaOnFormText | sfGpsDsFormText |
| Text Area | sfGpsDsCaOnFormTextarea | sfGpsDsFormTextarea |
| Email | sfGpsDsCaOnFormEmail | sfGpsDsFormEmail |
| URL | sfGpsDsCaOnFormUrl | sfGpsDsFormUrl |
| Telephone | sfGpsDsCaOnFormTelephone | sfGpsDsFormText |
| Range | sfGpsDsCaOnFormRange | sfGpsDsOsrtOmniscriptRange |
| Number | sfGpsDsCaOnFormNumber | sfGpsDsFormNumber |
| Password | sfGpsDsCaOnFormPassword | sfGpsDsFormPassword |
| Currency | sfGpsDsCaOnFormCurrency | sfGpsDsFormCurrency |
| Date | sfGpsDsCaOnFormDate | sfGpsDsFormDate |
| Time | sfGpsDsCaOnFormTime | sfGpsDsFormTime |
| Date/Time | sfGpsDsCaOnFormDateTime | sfGpsDsFormDateTime |
| Radio | sfGpsDsCaOnFormRadio | sfGpsDsFormRadio |
| Checkbox | sfGpsDsCaOnFormCheckbox | sfGpsDsFormCheckbox |
| Select | sfGpsDsCaOnFormSelect | sfGpsDsFormSelect |
| Multi-select | sfGpsDsCaOnFormMultiselect | sfGpsDsFormMultiselect |
| Lookup | sfGpsDsCaOnFormLookup | sfGpsDsFormLookup |
| Typeahead | sfGpsDsCaOnFormTypeahead | sfGpsDsFormTypeahead |
| Places Typeahead | sfGpsDsCaOnFormPlacesTypeahead | sfGpsDsFormPlacesTypeahead |
| File | sfGpsDsCaOnFormFile | sfGpsDsFormFile |
| Image | sfGpsDsCaOnFormImage | sfGpsDsFormFile |
| Text Block | sfGpsDsCaOnFormTextBlock | sfGpsDsFormTextBlock |
| Formula | sfGpsDsCaOnFormFormula | sfGpsDsFormFormula |
| Disclosure | sfGpsDsCaOnFormDisclosure | sfGpsDsFormDisclosure |
| Messaging | sfGpsDsCaOnFormMessaging | sfGpsDsFormMessaging |
| Step | sfGpsDsCaOnFormStep | sfGpsDsFormStep |
| Step Chart | sfGpsDsCaOnFormStepChart | sfGpsDsFormStepChart |
| Block | sfGpsDsCaOnFormBlock | sfGpsDsFormBlock |
| Edit Block | sfGpsDsCaOnFormEditBlock | sfGpsDsOsrtOmniscriptEditBlock |

---

## Related Documentation

- [OMNISTUDIO_FORMS.md](./OMNISTUDIO_FORMS.md) - OmniStudio forms overview
- [OMNISCRIPT_SETUP.md](./OMNISCRIPT_SETUP.md) - OmniScript configuration
- [SETUP.md](./SETUP.md) - Initial setup
