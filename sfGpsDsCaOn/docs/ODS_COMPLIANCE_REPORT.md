# Ontario Design System Compliance Report

**Generated:** January 30, 2026  
**ODS Version:** 2.2.0 (October 30, 2025)  
**Package Versions:**

- `@ongov/ontario-design-system-component-library`: 5.0.0
- `@ongov/ontario-design-system-global-styles`: 5.0.0

---

## Executive Summary

The `sfGpsDsCaOn` component library is a Salesforce LWC (Lightning Web Component) implementation of the Ontario Design System. This audit confirms **strong compliance** with ODS v2.2.0, with appropriate adaptations for the Salesforce LWR environment.

### Overall Status: COMPLIANT

| Category             | Status    |
| -------------------- | --------- |
| Component Coverage   | Excellent |
| CSS Class Naming     | Compliant |
| Accessibility (AODA) | Compliant |
| Package Versions     | Current   |

---

## Component Coverage Matrix

### Standard ODS Components Implemented

| ODS Component      | Implementation                                           | Status    |
| ------------------ | -------------------------------------------------------- | --------- |
| Accordion          | `sfGpsDsCaOnAccordion`, `sfGpsDsCaOnAccordionGroup`      | Compliant |
| Alerts/Callouts    | `sfGpsDsCaOnCallout`, `sfGpsDsCaOnPageAlertComm`         | Compliant |
| Back Button        | `sfGpsDsCaOnBackButton`                                  | Compliant |
| Back to Top        | `sfGpsDsCaOnBackToTop`                                   | Compliant |
| Badges             | `sfGpsDsCaOnBadgeComm`                                   | Compliant |
| Blockquote         | `sfGpsDsCaOnBlockquoteComm`                              | Compliant |
| Breadcrumbs        | `sfGpsDsCaOnBreadcrumbs`                                 | Compliant |
| Buttons            | `sfGpsDsCaOnButtonComm`                                  | Compliant |
| Cards              | `sfGpsDsCaOnCard`, `sfGpsDsCaOnCardComm`                 | Compliant |
| Checkboxes         | `sfGpsDsCaOnCheckboxGroup`                               | Compliant |
| Date Input         | `sfGpsDsCaOnDateInput`                                   | Compliant |
| Dropdown           | `sfGpsDsCaOnDropdown`                                    | Compliant |
| Fieldset           | `sfGpsDsCaOnFieldset`                                    | Compliant |
| Footer             | `sfGpsDsCaOnFooter` (uses ontario-footer web component)  | Compliant |
| Form Review        | `sfGpsDsCaOnFormReview`                                  | Compliant |
| Header             | `sfGpsDsCaOnHeader` (uses ontario-header web component)  | Compliant |
| In-page Navigation | `sfGpsDsCaOnInPageNav`                                   | Compliant |
| Loading Indicator  | `sfGpsDsCaOnLoadingIndicator`                            | Compliant |
| Modal              | `sfGpsDsCaOnModal`                                       | Compliant |
| Radio Buttons      | `sfGpsDsCaOnRadioGroup`                                  | Compliant |
| Search Box         | `sfGpsDsCaOnSearch`                                      | Compliant |
| Step Indicator     | `sfGpsDsCaOnStepIndicator` (uses ontario-step-indicator) | Compliant |
| Summary List       | `sfGpsDsCaOnSummaryList`                                 | Compliant |
| Tables             | `sfGpsDsCaOnTable`                                       | Compliant |
| Task List          | `sfGpsDsCaOnTaskList`                                    | Compliant |
| Text Area          | `sfGpsDsCaOnTextArea`                                    | Compliant |
| Text Input         | `sfGpsDsCaOnTextInput`                                   | Compliant |

### Extended Components (Beyond ODS)

These components extend ODS patterns for Salesforce-specific needs:

| Component                           | Purpose                            | ODS Alignment     |
| ----------------------------------- | ---------------------------------- | ----------------- |
| `sfGpsDsCaOnActionCard`             | Cards with header bars and actions | Extends Card      |
| `sfGpsDsCaOnActivityStatusCard`     | Status display cards               | Extends Card      |
| `sfGpsDsCaOnCoordinateInput`        | GIS coordinate input               | Extends Form      |
| `sfGpsDsCaOnDecisionExplainer`      | Decision explanation               | Custom            |
| `sfGpsDsCaOnDischargePointSelector` | Environmental selector             | Custom            |
| `sfGpsDsCaOnFeatureCard`            | Feature highlight cards            | Extends Card      |
| `sfGpsDsCaOnLinkCard`               | Navigation link cards              | Extends Card      |
| `sfGpsDsCaOnNaicsCodePicker`        | Industry code selector             | Custom            |
| `sfGpsDsCaOnNotificationCard`       | Notification display               | Extends Card      |
| `sfGpsDsCaOnSearchEinstein`         | Einstein-integrated search         | Extends Search    |
| `sfGpsDsCaOnSelectableCard`         | Interactive selection cards        | Extends Card      |
| `sfGpsDsCaOnSiteTaskCard`           | Site-specific tasks                | Extends Card      |
| `sfGpsDsCaOnTaskListSalesforce`     | Salesforce task integration        | Extends Task List |

---

## CSS Class Naming Compliance

### Naming Convention Adherence

| Pattern                              | Compliance |
| ------------------------------------ | ---------- |
| BEM methodology                      | Compliant  |
| `ontario-` prefix for ODS classes    | Compliant  |
| `sfgpsdscaon-` prefix for extensions | Compliant  |
| Semantic class names                 | Compliant  |

### Examples of Correct Usage

```css
/* Standard ODS - Block */
.ontario-button

/* Standard ODS - Element */
.ontario-card__heading

/* Standard ODS - Modifier */
.ontario-button--primary

/* Custom Extension - Block */
.sfgpsdscaon-action-card

/* Custom Extension - Element */
.sfgpsdscaon-action-card__header
```

### Color Token Compliance

| Token      | ODS Value             | Implementation                       | Status    |
| ---------- | --------------------- | ------------------------------------ | --------- |
| Link       | `#06c` / `#0066cc`    | `$ontario-color-link: #0066cc`       | Compliant |
| Link Hover | `#00478f`             | `$ontario-color-link-hover: #00478f` | Compliant |
| Focus      | `#009adb`             | `$ontario-color-focus: #009adb`      | Compliant |
| Error      | `#cd0000` / `#d81a21` | `$ontario-color-error: #d81a21`      | Compliant |
| Black      | `#1a1a1a`             | `$ontario-color-black: #1a1a1a`      | Compliant |

---

## Accessibility (AODA) Compliance

### Standards Met

| Requirement              | Status      |
| ------------------------ | ----------- |
| WCAG 2.1 Level AA        | Compliant   |
| Focus visible indicators | Implemented |
| Color contrast ratios    | Compliant   |
| Keyboard navigation      | Implemented |
| Screen reader support    | Implemented |
| ARIA attributes          | Implemented |

### Implementation Details

| Feature            | Implementation                       |
| ------------------ | ------------------------------------ |
| Focus Ring         | 4px solid `#009adb` outline          |
| Screen Reader Text | `.ontario-show-for-sr` class         |
| Skip Links         | `.ontario-show-on-focus` class       |
| Form Labels        | Associated via `for`/`id` attributes |
| Error Messaging    | `aria-describedby`, `aria-invalid`   |
| Live Regions       | `role="status"`, `aria-live`         |

### Form Component Accessibility

All form components include:

- Label association with inputs
- Error messaging with ARIA
- Hint text with `aria-describedby`
- Required/optional flag indicators
- Skip links for long option lists

---

## Package Version Tracking

### Current Versions

```json
{
  "@ongov/ontario-design-system-component-library": "5.0.0",
  "@ongov/ontario-design-system-global-styles": "5.0.0"
}
```

### Version History

| Date       | Package       | Version | Notes                   |
| ---------- | ------------- | ------- | ----------------------- |
| 2026-01-30 | Both packages | 5.0.0   | Current (latest on npm) |

### Update Procedure

To check for updates:

```bash
npm view @ongov/ontario-design-system-component-library version
npm view @ongov/ontario-design-system-global-styles version
```

To update:

```bash
npm update @ongov/ontario-design-system-component-library
npm update @ongov/ontario-design-system-global-styles
npm run prep-caon  # Copy updated assets
```

---

## Feature Compliance

### ODS v2.2.0 Features (October 2025)

| Feature                           | Status                     |
| --------------------------------- | -------------------------- |
| Ontario.ca header Account Sign in | Supported via menuItems    |
| New Sort icons                    | Included in package update |
| "More accounts" icon              | Included in package update |

### ODS v2.1.0 Features (September 2025)

| Feature                     | Status   |
| --------------------------- | -------- |
| Updated Visa icons          | Included |
| Checkbox background fix     | Applied  |
| Radio button background fix | Applied  |
| In-page navigation HR fix   | Applied  |
| Task list focus ring fix    | Applied  |

### ODS v1.11.0 Features (July 2025)

| Feature               | Status      |
| --------------------- | ----------- |
| Task List component   | Implemented |
| Raleway Modified font | Included    |

### ODS v1.9.1 Features (December 2024)

| Feature             | Status      |
| ------------------- | ----------- |
| Search Autocomplete | Implemented |

### ODS v1.8.0 Features (May 2024)

| Feature            | Status      |
| ------------------ | ----------- |
| In-page Navigation | Implemented |
| Summary List       | Implemented |
| Form Review        | Implemented |

---

## Recommendations

### Completed

1. ~~Update npm packages to latest~~ - Already at v5.0.0
2. ~~Implement Accordion Expand/Collapse All~~ - In AccordionGroup
3. ~~Implement Search Autocomplete~~ - Fully implemented
4. ~~Support Header Account Sign-in~~ - Via menuItems
5. ~~Create Form Review component~~ - Implemented
6. ~~Create Theming documentation~~ - THEMING_GUIDE.md
7. ~~Create Custom Components documentation~~ - CUSTOM_COMPONENTS_GUIDE.md

### Ongoing Maintenance

1. **Monitor ODS releases** - Check for updates quarterly
2. **Test accessibility** - Run automated tests on changes
3. **Validate color contrast** - Verify after theming changes
4. **Update documentation** - Keep in sync with component changes

---

## Testing Recommendations

### Automated Testing

- Run `npm run test-caon` for unit tests
- Run `npm run test-caon:a11y` for accessibility tests

### Manual Testing

1. **Keyboard navigation** - Tab through all interactive elements
2. **Screen reader** - Test with VoiceOver/NVDA
3. **Zoom** - Test at 200% and 400% zoom
4. **Mobile** - Test on iOS and Android devices

### Color Contrast Verification

Use these tools:

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Accessible Colors](https://accessible-colors.com/)
- Browser DevTools accessibility audit

---

## Appendix: Component File Locations

```
sfGpsDsCaOn/main/default/lwc/
├── sfGpsDsCaOnAccordion/
├── sfGpsDsCaOnActionCard/
├── sfGpsDsCaOnBackButton/
├── sfGpsDsCaOnBackToTop/
├── sfGpsDsCaOnBadgeComm/
├── sfGpsDsCaOnBlockquoteComm/
├── sfGpsDsCaOnBreadcrumbs/
├── sfGpsDsCaOnButtonComm/
├── sfGpsDsCaOnCallout/
├── sfGpsDsCaOnCard/
├── sfGpsDsCaOnCheckboxGroup/
├── sfGpsDsCaOnDateInput/
├── sfGpsDsCaOnDropdown/
├── sfGpsDsCaOnFieldset/
├── sfGpsDsCaOnFooter/
├── sfGpsDsCaOnFormReview/          # NEW
├── sfGpsDsCaOnHeader/
├── sfGpsDsCaOnInPageNav/
├── sfGpsDsCaOnLoadingIndicator/
├── sfGpsDsCaOnModal/
├── sfGpsDsCaOnRadioGroup/
├── sfGpsDsCaOnSearch/
├── sfGpsDsCaOnStepIndicator/
├── sfGpsDsCaOnSummaryList/
├── sfGpsDsCaOnTable/
├── sfGpsDsCaOnTaskList/
├── sfGpsDsCaOnTextArea/
├── sfGpsDsCaOnTextInput/
└── ...
```

---

## Related Documentation

- [Component API Reference](./COMPONENT_API.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Theming Guide](./THEMING_GUIDE.md)
- [Custom Components Guide](./CUSTOM_COMPONENTS_GUIDE.md)
- [AODA Compliance](./AODA_COMPLIANCE.md)
- [Testing Guide](./TESTING_GUIDE.md)

---

_This report should be updated when ODS releases new versions or when significant changes are made to the component library._
