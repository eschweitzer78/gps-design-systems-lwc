# Ontario Design System - Custom Components Guide

This guide documents the custom components (`sfgpsdscaon-*` prefixed classes) that extend the Ontario Design System for Salesforce-specific use cases.

---

## Table of Contents

1. [Overview](#overview)
2. [When to Use Custom vs Standard Components](#when-to-use-custom-vs-standard-components)
3. [Custom Component Reference](#custom-component-reference)
   - [Action Card](#action-card)
   - [Selectable Card](#selectable-card)
   - [Notification Card](#notification-card)
   - [Activity Status Card](#activity-status-card)
   - [Feature Card](#feature-card)
   - [Link Card](#link-card)
   - [Site Task Card](#site-task-card)
   - [Coordinate Input](#coordinate-input)
   - [NAICS Code Picker](#naics-code-picker)
   - [Decision Explainer](#decision-explainer)
4. [Extending Components](#extending-components)
5. [CSS Class Naming Conventions](#css-class-naming-conventions)

---

## Overview

The Ontario Design System provides a solid foundation of UI components. However, some Salesforce and domain-specific use cases require extended functionality. Custom components:

- **Extend ODS patterns** with additional features
- **Integrate with Salesforce** data and services
- **Address domain-specific needs** (e.g., GIS, NAICS codes)
- **Maintain ODS styling** while adding functionality

### Class Naming

Custom components use a distinct prefix to differentiate from standard ODS classes:

| Type             | Prefix         | Example                          |
| ---------------- | -------------- | -------------------------------- |
| Standard ODS     | `ontario-`     | `ontario-button`, `ontario-card` |
| Custom Extension | `sfgpsdscaon-` | `sfgpsdscaon-action-card`        |

---

## When to Use Custom vs Standard Components

### Use Standard ODS Components When:

- The component matches an ODS specification exactly
- No Salesforce integration is required
- Standard styling and behavior are sufficient

### Use Custom Components When:

- Additional functionality is needed (e.g., icons, actions)
- Salesforce data integration is required
- Domain-specific features are needed
- The use case is unique to your application

### Decision Matrix

| Scenario                        | Component Choice                     |
| ------------------------------- | ------------------------------------ |
| Simple navigation card          | `sfGpsDsCaOnCard` (Standard)         |
| Card with primary action button | `sfGpsDsCaOnActionCard` (Custom)     |
| Single-select option            | `sfGpsDsCaOnRadioGroup` (Standard)   |
| Visual card-based selection     | `sfGpsDsCaOnSelectableCard` (Custom) |
| Display key-value data          | `sfGpsDsCaOnSummaryList` (Standard)  |
| Track task completion           | `sfGpsDsCaOnTaskList` (Standard)     |
| Site-specific tasks with status | `sfGpsDsCaOnSiteTaskCard` (Custom)   |

---

## Custom Component Reference

### Action Card

**Component:** `sfGpsDsCaOnActionCard`

A card component with a colored header bar, icon, heading, description, primary action button, and optional secondary link. Ideal for service selection and permission pages.

#### Properties

| Property      | Type   | Description                                                              |
| ------------- | ------ | ------------------------------------------------------------------------ |
| `heading`     | String | Card heading text                                                        |
| `description` | String | Card description text                                                    |
| `icon`        | String | Icon name to display in header                                           |
| `headerColor` | String | Header bar color: `dark-blue`, `blue`, `teal`, `green`, `gold`, `purple` |
| `buttonLabel` | String | Primary button label                                                     |
| `buttonUrl`   | String | Primary button URL                                                       |
| `linkLabel`   | String | Secondary link label                                                     |
| `linkUrl`     | String | Secondary link URL                                                       |

#### CSS Classes

```css
.sfgpsdscaon-action-card              /* Container */
.sfgpsdscaon-action-card__header      /* Colored header bar */
.sfgpsdscaon-action-card__header--{color}  /* Color variants */
.sfgpsdscaon-action-card__icon        /* Header icon */
.sfgpsdscaon-action-card__heading     /* Heading text */
.sfgpsdscaon-action-card__body        /* Body container */
.sfgpsdscaon-action-card__description /* Description text */
.sfgpsdscaon-action-card__button      /* Primary button */
.sfgpsdscaon-action-card__link        /* Secondary link */
```

#### Example

```html
<c-sf-gps-ds-ca-on-action-card-comm
  heading="Apply for a permit"
  description="Start your environmental permit application"
  icon="document"
  header-color="teal"
  button-label="Start Application"
  button-url="/apply"
  link-label="Learn more"
  link-url="/about-permits"
></c-sf-gps-ds-ca-on-action-card-comm>
```

---

### Selectable Card

**Component:** `sfGpsDsCaOnSelectableCard`

An interactive card that can be selected/deselected, similar to a large checkbox or radio button. Used for visual option selection.

#### Properties

| Property        | Type    | Description              |
| --------------- | ------- | ------------------------ |
| `heading`       | String  | Card heading             |
| `description`   | String  | Card description         |
| `value`         | String  | Selection value          |
| `selected`      | Boolean | Whether card is selected |
| `disabled`      | Boolean | Whether card is disabled |
| `selectionMode` | String  | `single` or `multiple`   |

#### CSS Classes

```css
.sfgpsdscaon-selectable-card           /* Container */
.sfgpsdscaon-selectable-card--selected /* Selected state */
.sfgpsdscaon-selectable-card--disabled /* Disabled state */
.sfgpsdscaon-selectable-card__checkbox /* Checkbox indicator */
.sfgpsdscaon-selectable-card__content  /* Content area */
```

#### Events

| Event    | Detail                | Description                  |
| -------- | --------------------- | ---------------------------- |
| `select` | `{ value, selected }` | Fired when selection changes |

---

### Notification Card

**Component:** `sfGpsDsCaOnNotificationCard`

A card for displaying notifications, alerts, or status updates with timestamp and optional actions.

#### Properties

| Property      | Type    | Description                           |
| ------------- | ------- | ------------------------------------- |
| `heading`     | String  | Notification title                    |
| `message`     | String  | Notification message                  |
| `type`        | String  | `info`, `warning`, `error`, `success` |
| `timestamp`   | String  | Notification timestamp                |
| `actionLabel` | String  | Action button label                   |
| `actionUrl`   | String  | Action button URL                     |
| `dismissible` | Boolean | Whether notification can be dismissed |

#### Events

| Event     | Detail              | Description               |
| --------- | ------------------- | ------------------------- |
| `dismiss` | `{ id }`            | Fired when dismissed      |
| `action`  | `{ id, actionUrl }` | Fired when action clicked |

---

### Activity Status Card

**Component:** `sfGpsDsCaOnActivityStatusCard`

Displays activity/task status with visual indicators. Used for tracking workflow progress.

#### Properties

| Property      | Type   | Description                                   |
| ------------- | ------ | --------------------------------------------- |
| `heading`     | String | Activity name                                 |
| `description` | String | Activity description                          |
| `status`      | String | `pending`, `in-progress`, `complete`, `error` |
| `statusLabel` | String | Custom status label                           |
| `dueDate`     | String | Due date display                              |

---

### Feature Card

**Component:** `sfGpsDsCaOnFeatureCard`

A card highlighting a feature or capability with icon and call-to-action.

#### Properties

| Property      | Type   | Description          |
| ------------- | ------ | -------------------- |
| `heading`     | String | Feature heading      |
| `description` | String | Feature description  |
| `icon`        | String | Feature icon         |
| `ctaLabel`    | String | Call-to-action label |
| `ctaUrl`      | String | Call-to-action URL   |

---

### Link Card

**Component:** `sfGpsDsCaOnLinkCard`

A simple card variant optimized for navigation links with minimal styling.

#### Properties

| Property      | Type    | Description          |
| ------------- | ------- | -------------------- |
| `heading`     | String  | Link text            |
| `href`        | String  | Destination URL      |
| `description` | String  | Optional description |
| `external`    | Boolean | Opens in new tab     |

---

### Site Task Card

**Component:** `sfGpsDsCaOnSiteTaskCard`

Domain-specific card for site/facility tasks with location and status information.

#### Properties

| Property      | Type   | Description        |
| ------------- | ------ | ------------------ |
| `siteName`    | String | Site/facility name |
| `siteAddress` | String | Site address       |
| `taskName`    | String | Task name          |
| `taskStatus`  | String | Task status        |
| `dueDate`     | String | Due date           |
| `href`        | String | Navigation URL     |

---

### Coordinate Input

**Component:** `sfGpsDsCaOnCoordinateInput`

Specialized input for geographic coordinates (latitude/longitude) with validation and format conversion.

#### Properties

| Property    | Type    | Description                                |
| ----------- | ------- | ------------------------------------------ |
| `label`     | String  | Input label                                |
| `latitude`  | Number  | Latitude value                             |
| `longitude` | Number  | Longitude value                            |
| `format`    | String  | `decimal`, `dms` (degrees-minutes-seconds) |
| `required`  | Boolean | Whether input is required                  |
| `readonly`  | Boolean | Whether input is read-only                 |

#### Events

| Event      | Detail                    | Description                   |
| ---------- | ------------------------- | ----------------------------- |
| `change`   | `{ latitude, longitude }` | Fired when coordinates change |
| `validate` | `{ valid, errors }`       | Fired on validation           |

---

### NAICS Code Picker

**Component:** `sfGpsDsCaOnNaicsCodePicker`

Specialized picker for North American Industry Classification System (NAICS) codes with search and hierarchy navigation.

#### Properties

| Property        | Type    | Description                           |
| --------------- | ------- | ------------------------------------- |
| `label`         | String  | Picker label                          |
| `value`         | String  | Selected NAICS code                   |
| `required`      | Boolean | Whether selection is required         |
| `maxSelections` | Number  | Maximum selections (for multi-select) |

#### Events

| Event    | Detail                  | Description                  |
| -------- | ----------------------- | ---------------------------- |
| `change` | `{ code, description }` | Fired when selection changes |

---

### Decision Explainer

**Component:** `sfGpsDsCaOnDecisionExplainer`

Displays decision outcomes with explanations, used for eligibility checks and automated decisions.

#### Properties

| Property         | Type   | Description                                   |
| ---------------- | ------ | --------------------------------------------- |
| `heading`        | String | Decision heading                              |
| `outcome`        | String | `eligible`, `not-eligible`, `review-required` |
| `explanation`    | String | Explanation text                              |
| `criteria`       | Array  | Array of criteria with pass/fail status       |
| `nextStepsLabel` | String | Next steps heading                            |
| `nextSteps`      | String | Next steps content                            |

---

## Extending Components

### Creating a New Custom Component

Follow this pattern when creating new custom components:

1. **Extend the base class:**

```typescript
import SfGpsDsLwc from "c/sfGpsDsLwc";

export default class SfGpsDsCaOnMyCustomComponent extends SfGpsDsLwc {
  static renderMode = "light";

  connectedCallback() {
    super.connectedCallback?.();
    this.classList.add("caon-scope");
  }
}
```

2. **Use Light DOM:**

```html
<template lwc:render-mode="light">
  <!-- Component content -->
</template>
```

3. **Create Experience Builder wrapper:**

```typescript
// sfGpsDsCaOnMyCustomComponentComm.ts
export default class SfGpsDsCaOnMyCustomComponentComm extends SfGpsDsLwc {
  // Accept JSON strings for complex properties
  @api propertiesJson?: string;

  get parsedProperties() {
    // Parse and validate JSON
  }
}
```

4. **Follow CSS naming conventions:**

```css
.sfgpsdscaon-my-custom-component {
}
.sfgpsdscaon-my-custom-component__element {
}
.sfgpsdscaon-my-custom-component--modifier {
}
```

---

## CSS Class Naming Conventions

### Standard ODS Classes

```css
/* Block */
.ontario-{component}

/* Element */
.ontario-{component}__{element}

/* Modifier */
.ontario-{component}--{modifier}
```

### Custom Extension Classes

```css
/* Block */
.sfgpsdscaon-{component}

/* Element */
.sfgpsdscaon-{component}__{element}

/* Modifier */
.sfgpsdscaon-{component}--{modifier}
```

### Mixing Standard and Custom

When extending ODS components, use standard classes for base styling and custom classes for extensions:

```html
<div class="ontario-card sfgpsdscaon-action-card">
  <div class="ontario-card__heading sfgpsdscaon-action-card__heading">
    <!-- Content -->
  </div>
</div>
```

### Utility Classes

Both systems share utility classes:

```css
.ontario-show-for-sr    /* Screen reader only */
.ontario-show-on-focus  /* Visible only on focus */
.ontario-invisible      /* Visually hidden but accessible */
```

---

## Best Practices

### Do

1. **Reuse ODS patterns**: Start with standard components when possible
2. **Document custom components**: Add JSDoc comments to all public APIs
3. **Test accessibility**: Custom components must meet AODA requirements
4. **Follow naming conventions**: Use consistent `sfgpsdscaon-` prefix
5. **Provide Experience Builder support**: Create `*Comm` wrapper components

### Don't

1. **Don't duplicate ODS functionality**: Extend, don't recreate
2. **Don't break ODS patterns**: Maintain familiar interactions
3. **Don't ignore mobile**: Test on all screen sizes
4. **Don't skip validation**: Validate all JSON inputs

---

## Related Documentation

- [Component API Reference](./COMPONENT_API.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Theming Guide](./THEMING_GUIDE.md)
- [AODA Compliance](./AODA_COMPLIANCE.md)
