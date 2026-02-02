# Pattern-Based Test Execution Guide

> **Purpose**: Document pattern validation tests that cover multiple components through testing one representative
> **Related**: [COMPONENT_TEST_CHECKLIST.md](./COMPONENT_TEST_CHECKLIST.md), [MANUAL_TESTING_SCHEDULE.md](./MANUAL_TESTING_SCHEDULE.md)

---

## Overview

Pattern-based testing validates shared implementation patterns by thoroughly testing one representative component. When the representative passes, the pattern is validated for all components sharing that pattern.

This approach:

- Reduces testing time by 60-70%
- Ensures consistency across component families
- Identifies pattern-level defects affecting multiple components

---

## Pattern A: Form Input Components

### Representative: sfGpsDsCaOnTextInput

### Components Covered by This Pattern (14)

| Component       | Variations                       |
| --------------- | -------------------------------- |
| TextInput       | TextInput, TextInputComm         |
| TextArea        | TextArea, TextAreaComm           |
| DateInput       | DateInput, DateInputComm         |
| Dropdown        | Dropdown, DropdownComm           |
| CheckboxGroup   | CheckboxGroup, CheckboxGroupComm |
| RadioGroup      | RadioGroup, RadioGroupComm       |
| CoordinateInput | CoordinateInput (standalone)     |
| NaicsCodePicker | NaicsCodePicker (standalone)     |

### Shared Pattern Elements

All form input components implement these patterns:

1. **Label Association**
   - `<label for="input-id">` matches `<input id="input-id">`
   - Label positioned above input per Ontario DS

2. **Required/Optional Indicators**
   - Required: Red asterisk or "(required)" text
   - Optional: "(optional)" text when `optional=true`

3. **Hint Text**
   - Gray text below label
   - Linked via `aria-describedby`

4. **Error State**
   - 3px red border on input
   - Error message with SVG icon
   - `aria-invalid="true"` on input
   - Error message linked via `aria-describedby`

5. **Focus State**
   - 3px cyan outline per Ontario DS
   - `:focus-visible` styling

6. **Validation**
   - Required field validation
   - Pattern/format validation where applicable
   - Min/max length or value validation

### Test Execution Checklist

Execute these tests on TextInput. If all pass, the pattern is validated for all 14 components.

#### Visual Tests

| ID    | Test               | Steps                              | Expected                             | Status |
| ----- | ------------------ | ---------------------------------- | ------------------------------------ | ------ |
| V-001 | Label Position     | Render component with label        | Label displays above input           | [ ]    |
| V-002 | Required Indicator | Set `required=true`                | Red asterisk or "(required)" visible | [ ]    |
| V-003 | Optional Flag      | Set `optional=true`                | "(optional)" text visible            | [ ]    |
| V-004 | Hint Text          | Set `hint="Help text"`             | Gray hint text below label           | [ ]    |
| V-005 | Error Border       | Trigger validation error           | 3px red border on input              | [ ]    |
| V-006 | Error Message      | Trigger validation error           | Error text with SVG icon             | [ ]    |
| V-007 | Focus Outline      | Focus input with keyboard          | 3px cyan outline visible             | [ ]    |
| V-008 | Ontario DS Match   | Compare to designsystem.ontario.ca | Visual match to reference            | [ ]    |

#### Accessibility Tests

| ID    | Test                     | Steps                         | Expected                        | Status |
| ----- | ------------------------ | ----------------------------- | ------------------------------- | ------ |
| A-001 | Label Association        | Inspect `for`/`id` attributes | `for` matches input `id`        | [ ]    |
| A-002 | aria-required            | Set `required=true`, inspect  | `aria-required="true"` on input | [ ]    |
| A-003 | aria-invalid             | Trigger error, inspect        | `aria-invalid="true"` on input  | [ ]    |
| A-004 | aria-describedby (hint)  | Set hint, inspect             | ID links to hint element        | [ ]    |
| A-005 | aria-describedby (error) | Trigger error, inspect        | ID links to error element       | [ ]    |
| A-006 | Screen Reader Label      | Use VoiceOver/NVDA            | Label announced on focus        | [ ]    |
| A-007 | Screen Reader Error      | Trigger error, focus          | Error announced                 | [ ]    |
| A-008 | Screen Reader Hint       | Set hint, focus               | Hint announced after label      | [ ]    |

#### Keyboard Tests

| ID    | Test        | Steps                | Expected                        | Status |
| ----- | ----------- | -------------------- | ------------------------------- | ------ |
| K-001 | Tab Focus   | Press Tab            | Input receives focus            | [ ]    |
| K-002 | Tab Order   | Press Tab repeatedly | Focus moves to next element     | [ ]    |
| K-003 | Input Entry | Type while focused   | Characters appear in input      | [ ]    |
| K-004 | Shift+Tab   | Press Shift+Tab      | Focus moves to previous element | [ ]    |

#### Functional Tests

| ID    | Test                | Steps                            | Expected                    | Status |
| ----- | ------------------- | -------------------------------- | --------------------------- | ------ |
| F-001 | Value Binding       | Type in input                    | `value` property updates    | [ ]    |
| F-002 | Change Event        | Type and blur                    | `change` event fires        | [ ]    |
| F-003 | Blur Event          | Focus then blur                  | `blur` event fires          | [ ]    |
| F-004 | Required Validation | Leave required field empty, blur | Error message appears       | [ ]    |
| F-005 | maxLength           | Set maxLength, type past limit   | Cannot exceed limit         | [ ]    |
| F-006 | minLength           | Set minLength, enter short value | Error on validation         | [ ]    |
| F-007 | Pattern             | Set pattern, enter non-matching  | Error on validation         | [ ]    |
| F-008 | Read-only           | Set `readonly=true`              | Input not editable          | [ ]    |
| F-009 | Disabled            | Set `disabled=true`              | Input grayed, not focusable | [ ]    |

#### Responsive Tests

| ID    | Test          | Steps                   | Expected              | Status |
| ----- | ------------- | ----------------------- | --------------------- | ------ |
| R-001 | 320px Width   | Set viewport to 320px   | No overflow, readable | [ ]    |
| R-002 | 768px Width   | Set viewport to 768px   | Proper layout         | [ ]    |
| R-003 | 1024px+ Width | Set viewport to 1024px+ | Proper layout         | [ ]    |

### Pattern Validation Result

**Date**: ********\_********
**Tester**: ********\_********

| Category      | Tests  | Passed | Failed |
| ------------- | ------ | ------ | ------ |
| Visual        | 8      |        |        |
| Accessibility | 8      |        |        |
| Keyboard      | 4      |        |        |
| Functional    | 9      |        |        |
| Responsive    | 3      |        |        |
| **Total**     | **32** |        |        |

**Pattern Status**: [ ] VALIDATED [ ] FAILED

**If VALIDATED**: Pattern confirmed for all 14 form input components.

**If FAILED**: Document failures and verify if pattern-level or component-specific:

| Failed Test | Pattern Issue? | Affected Components |
| ----------- | -------------- | ------------------- |
|             |                |                     |

---

## Pattern B: Comm Variant Components

### Representative: sfGpsDsCaOnCardComm

### Components Covered by This Pattern (30+)

All components ending in `Comm`:

- AccordionComm, AccordionGroupComm
- ActionCardCollectionComm
- AsideComm
- BackButtonComm, BackToTopComm
- BadgeComm, BlockquoteComm, ButtonComm
- BreadcrumbsComm
- CalloutComm, CardComm
- CheckboxGroupComm, CriticalAlertComm
- DateInputComm, DecisionExplainerComm, DropdownComm
- FeatureCardComm, FieldsetComm
- FooterExpandedComm, FooterSimpleComm
- FormReviewComm
- HeaderComm
- InPageNavComm
- LinkCardComm, LoadingIndicatorComm
- ModalComm
- NotificationCardComm
- PageAlertComm
- RadioGroupComm
- SearchComm, SiteTaskCardComm, StepIndicatorComm, SummaryListComm
- TableComm, TaskListComm, TaskListSalesforceComm
- TextAreaComm, TextInputComm

### Shared Pattern Elements

1. **Base Class Extension**
   - All extend `SfGpsDsLwc`
   - Inherit property handling, lifecycle methods

2. **Light DOM Rendering**
   - `static renderMode = "light"`
   - Required for LWR sites

3. **Scope Class Application**
   - `caon-scope` class added in `connectedCallback`
   - Enables Ontario DS CSS scoping

4. **Property Parsing**
   - JSON string properties from Experience Builder
   - Parsed in `connectedCallback` or `renderedCallback`

5. **CSS Variable Fallback**
   - Uses `var(--ontario-colour-*, fallback)` pattern
   - Works with or without theme variables

### Test Execution Checklist

| ID    | Test               | Steps                     | Expected                              | Status |
| ----- | ------------------ | ------------------------- | ------------------------------------- | ------ |
| C-001 | Light DOM          | Inspect rendered output   | No shadow-root; elements in light DOM | [ ]    |
| C-002 | Scope Class        | Inspect container element | `caon-scope` class present            | [ ]    |
| C-003 | Base Class         | Check inheritance         | Extends SfGpsDsLwc                    | [ ]    |
| C-004 | String Props       | Set JSON string property  | Parsed correctly                      | [ ]    |
| C-005 | CSS Variables      | Inspect computed styles   | Ontario DS colors applied             | [ ]    |
| C-006 | No Variables       | Remove CSS variables      | Fallback colors used                  | [ ]    |
| C-007 | Experience Builder | Configure in EB           | Properties editable                   | [ ]    |

### Pattern Validation Result

**Date**: ********\_********
**Tester**: ********\_********

| Tests | Passed | Failed |
| ----- | ------ | ------ |
| 7     |        |        |

**Pattern Status**: [ ] VALIDATED [ ] FAILED

---

## Pattern C: OmniStudio Form Components

### Representative: sfGpsDsCaOnFormText

### Components Covered by This Pattern (40+)

All components in `omnistudio-standard-runtime-forms/lwc/`:

- FormBlock, FormCheckbox, FormCurrency, FormDate, FormDateTime
- FormDischargePointSelector, FormDisclosure
- FormEditBlock, FormEditBlockLabel, FormEditBlockNew
- FormEmail, FormFile, FormFormReview, FormFormula
- FormImage, FormLookup, FormMessaging, FormMultiselect
- FormNaicsCodePicker, FormNumber, FormPassword
- FormPlacesTypeahead, FormRadio, FormRange, FormSelect
- FormSelectableCards, FormSiteSelectorTool
- FormStep, FormStepChart
- FormTelephone, FormText, FormTextBlock, FormTextarea
- FormTime, FormTypeahead, FormUrl

### Shared Pattern Elements

1. **OmniStudio Base Extension**
   - Extends OmniScript base form classes
   - Uses `OmniscriptBaseMixin`

2. **Property Resolution**
   - Checks `@api` properties first
   - Falls back to `jsonDef` from OmniScript

3. **Data Binding**
   - Uses `applyCallResp` for data updates
   - Updates propagate to OmniScript data model

4. **Designer Registration**
   - Registered as OmniScript custom element
   - Properties configurable in designer

5. **Validation Integration**
   - Validation state from OmniScript
   - Error display via base class

### Test Execution Checklist

| ID    | Test                  | Steps                            | Expected                      | Status |
| ----- | --------------------- | -------------------------------- | ----------------------------- | ------ |
| O-001 | Designer Registration | Open OmniScript designer         | Component appears in palette  | [ ]    |
| O-002 | Property Config       | Configure properties in designer | Properties editable           | [ ]    |
| O-003 | Data Binding          | Enter value                      | OmniScript data model updates | [ ]    |
| O-004 | Validation            | Trigger validation               | Error displays                | [ ]    |
| O-005 | Required              | Set required in designer         | Validation enforced           | [ ]    |
| O-006 | jsonDef Fallback      | Remove @api prop                 | Falls back to jsonDef value   | [ ]    |
| O-007 | applyCallResp         | Update value                     | applyCallResp called          | [ ]    |
| O-008 | Ontario Styling       | Render component                 | Ontario DS styles applied     | [ ]    |

### Pattern Validation Result

**Date**: ********\_********
**Tester**: ********\_********

| Tests | Passed | Failed |
| ----- | ------ | ------ |
| 8     |        |        |

**Pattern Status**: [ ] VALIDATED [ ] FAILED

---

## Pattern D: Card Components

### Representative: sfGpsDsCaOnCard

### Components Covered by This Pattern (8)

- Card, CardComm, CardCollectionLwr
- ActionCard, ActionCardCollectionComm
- FeatureCard, FeatureCardComm
- LinkCard, LinkCardComm
- SelectableCard, SelectableCardGroup
- ActivityStatusCard, ActivityStatusCardCollection
- SiteTaskCard, SiteTaskCardCollection, SiteTaskCardComm
- NotificationCard, NotificationCardComm, NotificationCardData

### Shared Pattern Elements

1. **Image Handling**
   - Optional image with alt text
   - Lazy loading support

2. **Heading Configuration**
   - Configurable heading level (h2, h3, h4)
   - Heading text as property

3. **CTA/Link**
   - Call-to-action button or link
   - URL and target configuration

4. **Slot Content**
   - Default slot for custom content
   - Named slots for specific areas

5. **Responsive Layout**
   - Flexbox-based layout
   - Stacks on mobile

### Test Execution Checklist

| ID    | Test              | Steps                       | Expected                | Status |
| ----- | ----------------- | --------------------------- | ----------------------- | ------ |
| D-001 | Image Display     | Set image property          | Image renders           | [ ]    |
| D-002 | Image Alt Text    | Inspect img element         | alt attribute present   | [ ]    |
| D-003 | Heading Level     | Set headingLevel="h3"       | `<h3>` element rendered | [ ]    |
| D-004 | CTA Link          | Set href property           | Link renders, clickable | [ ]    |
| D-005 | CTA Target        | Set target="\_blank"        | Opens in new tab        | [ ]    |
| D-006 | Slot Content      | Add content in slot         | Custom content renders  | [ ]    |
| D-007 | Keyboard Focus    | Tab to card                 | Focus indicator visible | [ ]    |
| D-008 | Keyboard Activate | Press Enter on focused card | Navigation occurs       | [ ]    |
| D-009 | Responsive 320px  | Set viewport to 320px       | Card stacks, readable   | [ ]    |

### Pattern Validation Result

**Date**: ********\_********
**Tester**: ********\_********

| Tests | Passed | Failed |
| ----- | ------ | ------ |
| 9     |        |        |

**Pattern Status**: [ ] VALIDATED [ ] FAILED

---

## Pattern E: Navigation Components

### Representative: sfGpsDsCaOnBreadcrumbs

### Components Covered by This Pattern (5)

- Breadcrumbs, BreadcrumbsComm
- InPageNav, InPageNavComm
- StepIndicator, StepIndicatorComm
- BackButton, BackButtonComm
- BackToTop, BackToTopComm

### Shared Pattern Elements

1. **Nav Element**
   - Uses `<nav>` semantic element
   - Has `aria-label` for identification

2. **Current Item**
   - `aria-current="page"` on active item
   - Visual styling for current state

3. **Keyboard Navigation**
   - Links are focusable
   - Enter/Space activates links

4. **Link Handling**
   - Standard `<a>` elements or equivalent
   - Proper href attributes

### Test Execution Checklist

| ID    | Test             | Steps                | Expected              | Status |
| ----- | ---------------- | -------------------- | --------------------- | ------ |
| N-001 | Nav Element      | Inspect DOM          | `<nav>` element used  | [ ]    |
| N-002 | aria-label       | Inspect nav element  | aria-label present    | [ ]    |
| N-003 | aria-current     | Inspect current item | `aria-current="page"` | [ ]    |
| N-004 | Visual Current   | View current item    | Visually distinct     | [ ]    |
| N-005 | Tab Focus        | Tab through links    | All links focusable   | [ ]    |
| N-006 | Enter Activation | Press Enter on link  | Navigation occurs     | [ ]    |
| N-007 | Screen Reader    | Use VoiceOver/NVDA   | Navigation announced  | [ ]    |

### Pattern Validation Result

**Date**: ********\_********
**Tester**: ********\_********

| Tests | Passed | Failed |
| ----- | ------ | ------ |
| 7     |        |        |

**Pattern Status**: [ ] VALIDATED [ ] FAILED

---

## Summary: Pattern Coverage

| Pattern             | Representative | Components | Tests | Status |
| ------------------- | -------------- | ---------- | ----- | ------ |
| A: Form Inputs      | TextInput      | 14         | 32    | [ ]    |
| B: Comm Variants    | CardComm       | 30+        | 7     | [ ]    |
| C: OmniStudio Forms | FormText       | 40+        | 8     | [ ]    |
| D: Cards            | Card           | 8          | 9     | [ ]    |
| E: Navigation       | Breadcrumbs    | 5          | 7     | [ ]    |

**Total Unique Tests**: 63
**Total Components Covered**: 97+

**Efficiency Gain**: Testing 63 cases validates 97+ components, compared to testing each individually.

---

## Execution Notes

### Before Testing

1. Set up test environment with all components deployed
2. Have screen reader ready (VoiceOver or NVDA)
3. Have [COMPONENT_TEST_CHECKLIST.md](./COMPONENT_TEST_CHECKLIST.md) open for detailed test cases
4. Have Ontario DS reference open: https://designsystem.ontario.ca

### During Testing

1. Execute all tests for one pattern before moving to next
2. Document any failures immediately
3. Note if failure is pattern-level (affects all) or component-specific

### After Testing

1. If pattern validated, mark all covered components as "pattern validated"
2. If pattern failed, determine which components need individual testing
3. Update component test status in [COMPONENT_TEST_CHECKLIST.md](./COMPONENT_TEST_CHECKLIST.md)
