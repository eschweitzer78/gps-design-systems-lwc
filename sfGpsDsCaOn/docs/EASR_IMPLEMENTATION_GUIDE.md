# EASR Prototype Implementation Guide

This guide documents how to implement the UI patterns shown in the EASR (Environmental Activity and Sector Registry) prototype screenshots using the Ontario Design System components.

---

## Table of Contents

1. [Page Layout Patterns](#page-layout-patterns)
2. [Activity Cards](#activity-cards)
3. [Task Lists with Status Badges](#task-lists-with-status-badges)
4. [Site Task Cards](#site-task-cards)
5. [Form Questions with Radio Groups](#form-questions-with-radio-groups)
6. [Callout Alerts](#callout-alerts)
7. [Summary Lists (Review Pages)](#summary-lists-review-pages)
8. [Site Selector Tool](#site-selector-tool)
9. [Discharge Point Selector](#discharge-point-selector)
10. [Attestation Forms](#attestation-forms)
11. [Button Patterns](#button-patterns)
12. [Navigation Patterns](#navigation-patterns)

---

## Page Layout Patterns

### Standard Form Page Layout

Most EASR pages follow this structure:

```html
<!-- Back link -->
<a href="#" class="ontario-back-link">
  <span class="ontario-icon ontario-icon-back"></span>
  Back
</a>

<!-- Step indicator (optional) -->
<div class="ontario-step-indicator">Step X of X</div>

<!-- Page title -->
<h1 class="ontario-h1">Page Title</h1>

<!-- Page description -->
<p class="ontario-lead-statement">Description text...</p>

<!-- Main content area -->
<div class="ontario-form-group">
  <!-- Form components go here -->
</div>

<!-- Action buttons -->
<div class="ontario-button-group">
  <c-sf-gps-ds-ca-on-button
    label="Save and continue"
    variant="primary"
  ></c-sf-gps-ds-ca-on-button>
  <c-sf-gps-ds-ca-on-button
    label="Save draft"
    variant="secondary"
  ></c-sf-gps-ds-ca-on-button>
</div>

<!-- Back to top button -->
<c-sf-gps-ds-ca-on-back-to-top></c-sf-gps-ds-ca-on-back-to-top>
```

**Reference Screenshots:** 7, 8, 26-39

---

## Activity Cards

Used to display EASR activities with progress status (Screenshot 5).

### Component

Use `sfGpsDsCaOnActivityStatusCard`:

```html
<c-sf-gps-ds-ca-on-activity-status-card
  title="Air emissions"
  show-remove-link
  onremove="{handleRemove}"
>
  <!-- Field list -->
  <div slot="fields">
    <div class="ontario-form-group">
      <strong>Business name:</strong> {businessName}
    </div>
    <div class="ontario-form-group">
      <strong>Registration site(s):</strong> {sites}
    </div>
  </div>

  <!-- Progress indicator -->
  <div slot="progress">
    <span class="ontario-icon ontario-icon-error" aria-hidden="true"></span>
    0 out of X steps completed
  </div>

  <!-- Actions -->
  <div slot="actions">
    <c-sf-gps-ds-ca-on-button
      label="Start"
      variant="primary"
      onclick="{handleStart}"
    >
    </c-sf-gps-ds-ca-on-button>
  </div>
</c-sf-gps-ds-ca-on-activity-status-card>
```

### Multiple Activities Grid

```html
<div class="ontario-row">
  <div class="ontario-columns ontario-small-12 ontario-medium-6">
    <c-sf-gps-ds-ca-on-activity-status-card
      ...
    ></c-sf-gps-ds-ca-on-activity-status-card>
  </div>
  <div class="ontario-columns ontario-small-12 ontario-medium-6">
    <c-sf-gps-ds-ca-on-activity-status-card
      ...
    ></c-sf-gps-ds-ca-on-activity-status-card>
  </div>
</div>
```

**Reference Screenshots:** 5, 46

---

## Task Lists with Status Badges

Used for "Getting Started" and "Before you submit" sections (Screenshots 7, 25).

### Implementation Pattern

```html
<section class="ontario-task-list">
  <h2 class="ontario-h3">Getting started</h2>

  <ul class="ontario-task-list__items">
    <!-- Completed task -->
    <li class="ontario-task-list__item">
      <a href="#" class="ontario-task-list__link">Before you register</a>
      <c-sf-gps-ds-ca-on-badge label="COMPLETED" type="success">
      </c-sf-gps-ds-ca-on-badge>
    </li>

    <!-- Not started task -->
    <li class="ontario-task-list__item">
      <a href="#" class="ontario-task-list__link">Operation information</a>
      <c-sf-gps-ds-ca-on-badge label="NOT STARTED" type="default">
      </c-sf-gps-ds-ca-on-badge>
    </li>

    <!-- Cannot start yet task -->
    <li class="ontario-task-list__item">
      <span class="ontario-task-list__text">Activity requirements</span>
      <c-sf-gps-ds-ca-on-badge label="CANNOT START YET" type="default">
      </c-sf-gps-ds-ca-on-badge>
    </li>
  </ul>
</section>
```

### Badge Status Mapping

| Status       | Badge Type           | Label            |
| ------------ | -------------------- | ---------------- |
| Completed    | `success`            | COMPLETED        |
| Not Started  | `default`            | NOT STARTED      |
| In Progress  | `info`               | IN PROGRESS      |
| Cannot Start | `default` (disabled) | CANNOT START YET |

**Reference Screenshots:** 7, 13, 25, 46

---

## Site Task Cards

Used to display site-specific tasks within a registration (Screenshots 25, 46).

### Component

Use `sfGpsDsCaOnSiteTaskCard`:

```html
<c-sf-gps-ds-ca-on-site-task-card
  title="Site 1 name identifier"
  show-remove-link
  onremove="{handleRemove}"
>
  <!-- Task list -->
  <ul class="ontario-task-list__items" slot="tasks">
    <li class="ontario-task-list__item">
      <a href="#" class="ontario-task-list__link">Activity information</a>
      <c-sf-gps-ds-ca-on-badge
        label="NOT STARTED"
        type="default"
      ></c-sf-gps-ds-ca-on-badge>
    </li>
    <li class="ontario-task-list__item">
      <a href="#" class="ontario-task-list__link"
        >Stormwater discharge location</a
      >
      <c-sf-gps-ds-ca-on-badge
        label="NOT STARTED"
        type="default"
      ></c-sf-gps-ds-ca-on-badge>
    </li>
    <li class="ontario-task-list__item">
      <a href="#" class="ontario-task-list__link">Related applications</a>
      <c-sf-gps-ds-ca-on-badge
        label="NOT STARTED"
        type="default"
      ></c-sf-gps-ds-ca-on-badge>
    </li>
  </ul>

  <!-- Progress summary -->
  <div slot="progress">
    <span class="ontario-icon ontario-icon-error" aria-hidden="true"></span>
    0 out of 3 sections (Not started)
  </div>
</c-sf-gps-ds-ca-on-site-task-card>
```

**Reference Screenshots:** 25, 46

---

## Form Questions with Radio Groups

Used for eligibility check questions (Screenshots 26-39).

### Standard Question Pattern

```html
<div class="ontario-form-group">
  <fieldset class="ontario-fieldset">
    <legend class="ontario-fieldset__legend">
      <h2 class="ontario-h4">
        4. Will your storm water management works be servicing any of the
        following sites?
        <span class="ontario-label__flag">(required)</span>
      </h2>
    </legend>

    <!-- Optional list of items -->
    <ul class="ontario-list">
      <li>A waste disposal site as defined in Part V of the Act.</li>
      <li>
        An abandoned motor vehicle site as defined in Part VII of the Act.
      </li>
      <!-- More items... -->
    </ul>

    <c-sf-gps-ds-ca-on-radio-group
      name="question4"
      options="{radioOptions}"
      value="{selectedValue}"
      onchange="{handleChange}"
    ></c-sf-gps-ds-ca-on-radio-group>
  </fieldset>
</div>
```

### Radio Options Format

```javascript
get radioOptions() {
  return [
    { label: 'Yes', value: 'yes' },
    { label: 'No', value: 'no' }
  ];
}
```

**Reference Screenshots:** 26-39, 42-44

---

## Callout Alerts

### Error/Hard Stop Callout

Used when user answers make them ineligible (Screenshots 29, 31, 32).

```html
<c-sf-gps-ds-ca-on-callout
  heading="You do not meet the requirements"
  type="error"
>
  <p>
    Based on your answer, you do not meet the requirements to register your
    storm water management works in the Environmental Activity and Sector
    Registry and may need to
    <a href="#">apply for an Environmental Compliance Approval (ECA)</a>.
  </p>

  <p>
    The use, operation, establishment, alteration, extension or replacement of
    any new or existing storm water management works that services any of these
    sites is not prescribed for the purposes of
    <a href="#">subsection 20.21 (1) of the Act</a>.
  </p>
</c-sf-gps-ds-ca-on-callout>
```

### Warning Callout

Used for regulatory notices and important cautions (Screenshot 48).

```html
<c-sf-gps-ds-ca-on-callout heading="Important regulatory notice" type="warning">
  <p>
    The person certifying must have the authority to bind the registrant as per
    <a href="#">Ontario Regulation 245/11</a> under Part II.2 of the Act.
    Therefore, only an individual that is part of the registrant's company
    should be certifying the registration (not the consultants who are hired by
    the company).
  </p>
</c-sf-gps-ds-ca-on-callout>
```

### Information Callout (Standard Border)

Used for helpful context without urgency.

```html
<c-sf-gps-ds-ca-on-callout
  heading="Existing site information"
  highlight-colour="sky"
>
  <p>
    The sites listed are sites previously created and stored in your profile.
  </p>
</c-sf-gps-ds-ca-on-callout>
```

### Callout Type Reference

| Scenario                      | Type                              | Icon                |
| ----------------------------- | --------------------------------- | ------------------- |
| Hard stop / Ineligibility     | `error`                           | Red error icon      |
| Regulatory warning / Caution  | `warning`                         | Yellow warning icon |
| Helpful information           | `information`                     | Blue info icon      |
| Success confirmation          | `success`                         | Green checkmark     |
| General information (no icon) | `default` with `highlight-colour` | None                |

**Reference Screenshots:** 11, 29, 31, 32, 48

---

## Summary Lists (Review Pages)

Used for "Review your answers" pages (Screenshot 45).

### Component

Use `sfGpsDsCaOnSummaryList`:

```html
<section>
  <h2 class="ontario-h3">
    Geographic coordinates (to be provided in Datum NAD83)
  </h2>
  <a href="#" class="ontario-summary-list__edit">Edit</a>

  <c-sf-gps-ds-ca-on-summary-list
    items="{coordinateItems}"
    ratio="1-2"
  ></c-sf-gps-ds-ca-on-summary-list>
</section>

<section>
  <h2 class="ontario-h3">Source protection area</h2>
  <a href="#" class="ontario-summary-list__edit">Edit</a>

  <c-sf-gps-ds-ca-on-summary-list
    items="{protectionAreaItems}"
    ratio="1-2"
  ></c-sf-gps-ds-ca-on-summary-list>
</section>
```

### Items Format

```javascript
get coordinateItems() {
  return [
    { term: 'Method of collection', description: 'Map' },
    { term: 'Accuracy estimate', description: '1-10 M(map)' },
    { term: 'UTM zone', description: '17' },
    { term: 'UTM east (M)', description: '641541.5' },
    { term: 'UTM north (M)', description: '4848130.8' },
    { term: 'Watershed name', description: 'West Lake Ontario Shoreline' },
    { term: 'Watershed use - Annual', description: 'N/A' },
    { term: 'Watershed use - Summer', description: 'N/A' }
  ];
}
```

**Reference Screenshots:** 45, 49

---

## Site Selector Tool

Used for address/location selection with map (Screenshots 19-22).

### Component

Use `sfGpsDsCaOnSiteSelectorTool`:

```html
<c-sf-gps-ds-ca-on-site-selector-tool
  heading="Search for your site address"
  description="Enter an address to search or click on the map to select a location."
  onaddressselected="{handleAddressSelected}"
  onsave="{handleSave}"
></c-sf-gps-ds-ca-on-site-selector-tool>
```

**Reference Screenshots:** 19, 20, 21, 22

---

## Discharge Point Selector

Used for selecting discharge point locations with coordinates (Screenshots 40, 41).

### Component

Use `sfGpsDsCaOnDischargePointSelector`:

```html
<c-sf-gps-ds-ca-on-discharge-point-selector
  site-name="{siteName}"
  site-address="{siteAddress}"
  ondischargeselected="{handleDischargeSelected}"
></c-sf-gps-ds-ca-on-discharge-point-selector>
```

### Site Information Card

Display site context above the selector:

```html
<div class="ontario-card ontario-card--light">
  <div class="ontario-card__content">
    <h3 class="ontario-h5">{siteName}</h3>
    <p>{primaryAddress}</p>
    <p>{cityProvince}</p>
    <p>{country}</p>
    <a href="#" class="ontario-link">Map view</a>

    <div class="ontario-margin-top-16-!">
      <strong>Special policy area</strong>
      <p>{policyArea}</p>
    </div>
  </div>
</div>
```

**Reference Screenshots:** 40, 41

---

## Attestation Forms

Used for certification/declaration pages (Screenshot 48).

### Implementation Pattern

```html
<section>
  <h1 class="ontario-h1">Attestation</h1>
  <p class="ontario-lead-statement">
    The person who certifies the registration must be someone who has legal
    authority to bind the person engaging in the activity...
  </p>
</section>

<section>
  <h2 class="ontario-h2">Person attesting information</h2>

  <fieldset class="ontario-fieldset">
    <legend class="ontario-fieldset__legend">
      <strong
        >The person certifying that information being filed for this
        registration is complete and accurate must be one of those listed
        below.</strong
      >
      <span class="ontario-label__flag">(required)</span>
    </legend>

    <c-sf-gps-ds-ca-on-radio-group
      name="attestationType"
      options="{attestationOptions}"
      value="{selectedAttestationType}"
      onchange="{handleAttestationTypeChange}"
    ></c-sf-gps-ds-ca-on-radio-group>
  </fieldset>
</section>

<section>
  <h2 class="ontario-h2">Attestation</h2>

  <c-sf-gps-ds-ca-on-checkbox-group
    name="attestationConfirm"
    options="{confirmationOptions}"
    values="{confirmationValues}"
    onchange="{handleConfirmationChange}"
  ></c-sf-gps-ds-ca-on-checkbox-group>

  <!-- Warning callout -->
  <c-sf-gps-ds-ca-on-callout type="warning">
    <p>
      The person certifying must have the authority to bind the registrant as
      per <a href="#">Ontario Regulation 245/11</a>...
    </p>
  </c-sf-gps-ds-ca-on-callout>
</section>

<section>
  <div class="ontario-row">
    <div class="ontario-columns ontario-small-12 ontario-medium-6">
      <c-sf-gps-ds-ca-on-text-input
        label="First name"
        name="firstName"
        value="{firstName}"
      ></c-sf-gps-ds-ca-on-text-input>
    </div>
    <div class="ontario-columns ontario-small-12 ontario-medium-6">
      <c-sf-gps-ds-ca-on-text-input
        label="Last name"
        name="lastName"
        value="{lastName}"
      ></c-sf-gps-ds-ca-on-text-input>
    </div>
  </div>

  <div class="ontario-row">
    <div class="ontario-columns ontario-small-12 ontario-medium-6">
      <c-sf-gps-ds-ca-on-text-input
        label="Job title"
        name="jobTitle"
        value="{jobTitle}"
        required
      ></c-sf-gps-ds-ca-on-text-input>
    </div>
    <div class="ontario-columns ontario-small-12 ontario-medium-6">
      <c-sf-gps-ds-ca-on-text-input
        label="Business/legal name"
        name="businessName"
        value="{businessName}"
        required
        readonly
      ></c-sf-gps-ds-ca-on-text-input>
    </div>
  </div>

  <c-sf-gps-ds-ca-on-date-input
    label="Date"
    name="attestationDate"
    value="{attestationDate}"
  ></c-sf-gps-ds-ca-on-date-input>
</section>

<div class="ontario-button-group">
  <c-sf-gps-ds-ca-on-button
    label="Attest"
    variant="primary"
  ></c-sf-gps-ds-ca-on-button>
  <c-sf-gps-ds-ca-on-button
    label="Save draft"
    variant="secondary"
  ></c-sf-gps-ds-ca-on-button>
</div>
```

**Reference Screenshots:** 48

---

## Button Patterns

### Primary Action Buttons

```html
<!-- Single primary action -->
<c-sf-gps-ds-ca-on-button label="Save and continue" variant="primary">
</c-sf-gps-ds-ca-on-button>

<!-- Primary + Secondary -->
<div class="ontario-button-group">
  <c-sf-gps-ds-ca-on-button
    label="Save and continue"
    variant="primary"
  ></c-sf-gps-ds-ca-on-button>
  <c-sf-gps-ds-ca-on-button
    label="Save draft"
    variant="secondary"
  ></c-sf-gps-ds-ca-on-button>
</div>
```

### Add Action Button (with icon)

```html
<c-sf-gps-ds-ca-on-button
  label="Add site(s)"
  variant="secondary"
  icon-name="add"
  icon-position="left"
>
</c-sf-gps-ds-ca-on-button>
```

### Tertiary/Text Links

```html
<c-sf-gps-ds-ca-on-button label="Back to home" variant="tertiary">
</c-sf-gps-ds-ca-on-button>
```

**Reference Screenshots:** All pages

---

## Navigation Patterns

### Back Link

```html
<a href="#" class="ontario-back-link">
  <svg class="ontario-icon" aria-hidden="true">
    <use href="#ontario-icon-back"></use>
  </svg>
  Back
</a>
```

### Step Indicator

```html
<div class="ontario-step-indicator" aria-label="Step X of X">
  <span class="ontario-step-indicator__text">Step X of X</span>
</div>
```

### Back to Top

```html
<c-sf-gps-ds-ca-on-back-to-top></c-sf-gps-ds-ca-on-back-to-top>
```

**Reference Screenshots:** All form pages

---

## Complete Page Example

Here's a complete example implementing an eligibility check question page:

```html
<template>
  <!-- Back link -->
  <a href="#" class="ontario-back-link" onclick="{handleBack}">
    <span class="ontario-icon ontario-icon-back"></span>
    Back
  </a>

  <!-- Step indicator -->
  <div class="ontario-step-indicator">Step 4 of 22</div>

  <!-- Page heading -->
  <h1 class="ontario-h1">Activity information</h1>
  <h2 class="ontario-h2">Industry eligibility check</h2>

  <!-- Question -->
  <div class="ontario-form-group">
    <fieldset class="ontario-fieldset">
      <legend class="ontario-fieldset__legend">
        <strong
          >4. Will your storm water management works be servicing any of the
          following sites?</strong
        >
        <span class="ontario-label__flag">(required)</span>
      </legend>

      <ul class="ontario-list">
        <template for:each="{siteTypes}" for:item="site">
          <li key="{site.id}">{site.label}</li>
        </template>
      </ul>

      <c-sf-gps-ds-ca-on-radio-group
        name="question4"
        options="{yesNoOptions}"
        value="{question4Value}"
        onchange="{handleQuestion4Change}"
      ></c-sf-gps-ds-ca-on-radio-group>
    </fieldset>
  </div>

  <!-- Error callout (shown conditionally) -->
  <template lwc:if="{showHardStop}">
    <c-sf-gps-ds-ca-on-callout
      heading="You do not meet the requirements"
      type="error"
    >
      <p>
        Based on your answer, you do not meet the requirements to register your
        storm water management works in the Environmental Activity and Sector
        Registry and may need to
        <a href="#">apply for an Environmental Compliance Approval (ECA)</a>.
      </p>
    </c-sf-gps-ds-ca-on-callout>
  </template>

  <!-- Action buttons -->
  <div class="ontario-button-group">
    <c-sf-gps-ds-ca-on-button
      label="Save and continue"
      variant="primary"
      onclick="{handleSaveAndContinue}"
    >
    </c-sf-gps-ds-ca-on-button>
    <c-sf-gps-ds-ca-on-button
      label="Save draft"
      variant="secondary"
      onclick="{handleSaveDraft}"
    >
    </c-sf-gps-ds-ca-on-button>
  </div>

  <!-- Back to top -->
  <c-sf-gps-ds-ca-on-back-to-top></c-sf-gps-ds-ca-on-back-to-top>
</template>
```

---

## Component Quick Reference

| UI Pattern           | Component                           | Key Properties                             |
| -------------------- | ----------------------------------- | ------------------------------------------ |
| Activity cards       | `sfGpsDsCaOnActivityStatusCard`     | title, show-remove-link                    |
| Site task cards      | `sfGpsDsCaOnSiteTaskCard`           | title, show-remove-link                    |
| Status badges        | `sfGpsDsCaOnBadge`                  | label, type                                |
| Error/Warning alerts | `sfGpsDsCaOnCallout`                | heading, type (error/warning/info/success) |
| Info callouts        | `sfGpsDsCaOnCallout`                | heading, highlight-colour                  |
| Review summaries     | `sfGpsDsCaOnSummaryList`            | items, ratio                               |
| Site selector        | `sfGpsDsCaOnSiteSelectorTool`       | heading, description                       |
| Discharge selector   | `sfGpsDsCaOnDischargePointSelector` | site-name, site-address                    |
| Coordinate input     | `sfGpsDsCaOnCoordinateInput`        | value, format                              |
| NAICS picker         | `sfGpsDsCaOnNaicsCodePicker`        | value                                      |
| Buttons              | `sfGpsDsCaOnButton`                 | label, variant, icon-name                  |
| Text inputs          | `sfGpsDsCaOnTextInput`              | label, name, value                         |
| Radio groups         | `sfGpsDsCaOnRadioGroup`             | name, options, value                       |
| Checkbox groups      | `sfGpsDsCaOnCheckboxGroup`          | name, options, values                      |
| Date inputs          | `sfGpsDsCaOnDateInput`              | label, value                               |
| Dropdowns            | `sfGpsDsCaOnDropdown`               | label, options, value                      |
| Back to top          | `sfGpsDsCaOnBackToTop`              | (none)                                     |
| Modal dialogs        | `sfGpsDsCaOnModal`                  | heading, is-open                           |

---

## Additional Resources

- [Component API Reference](./COMPONENT_API.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Testing Guide](./TESTING_GUIDE.md)
- [Ontario Design System](https://designsystem.ontario.ca/)
