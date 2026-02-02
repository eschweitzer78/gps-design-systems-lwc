# Manual Testing Schedule: sfGpsDsCaOn Components

> **Purpose**: Structured testing schedule for manual QA based on component priority and risk
> **Related**: [COMPONENT_TEST_CHECKLIST.md](./COMPONENT_TEST_CHECKLIST.md), [TESTING_GUIDE.md](./TESTING_GUIDE.md)

---

## Overview

This schedule prioritizes manual testing based on:

1. **Risk level** - External integrations, security, data sensitivity
2. **Uniqueness** - Components requiring individual attention (no pattern coverage)
3. **Reuse impact** - Defects that cascade to many other components

---

## Phase 1: Critical Priority (Test First)

These components have unique functionality, high risk, or external dependencies that require comprehensive individual testing.

### 1.1 SiteSelectorTool

**Component**: `sfGpsDsCaOnSiteSelectorTool`
**Estimated Time**: 4-6 hours
**Tester Skills**: GIS familiarity, accessibility testing

| Test Area            | Test Cases                                    | Reference                            |
| -------------------- | --------------------------------------------- | ------------------------------------ |
| Address Search       | Enter valid Ontario address; verify geocoding | GIS_GUIDE.md                         |
| Coordinate Search    | Test UTM, DMS, Decimal formats                | SST tests in **tests**               |
| Lot/Concession       | Search by lot/concession number               | ONTARIO_LIO_INTEGRATION_PROCEDURE.md |
| Tab Navigation       | Arrow keys between tabs (WCAG 2.1.1)          | TESTING_GUIDE.md Section 2.1         |
| PostMessage Security | Verify origin validation in console           | Security tests                       |
| Screen Reader        | VoiceOver/NVDA announces tab changes          | A11y checklist                       |
| Error Handling       | Invalid address; network failure              | UserMessages integration             |
| Read-Only Mode       | Test with readOnly=true                       | Component API                        |

**Pass Criteria**:

- [ ] All 3 search modes return correct location
- [ ] Tab navigation works with keyboard only
- [ ] Screen reader announces live region updates
- [ ] No console errors related to postMessage origin

---

### 1.2 DischargePointSelector

**Component**: `sfGpsDsCaOnDischargePointSelector`
**Estimated Time**: 3-4 hours
**Tester Skills**: GIS familiarity, coordinate systems knowledge

| Test Area        | Test Cases                             | Reference             |
| ---------------- | -------------------------------------- | --------------------- |
| UTM Coordinates  | Enter valid UTM Zone 17/18 coordinates | GIS_GUIDE.md          |
| DMS Coordinates  | Enter degrees/minutes/seconds format   | Component API         |
| Decimal Degrees  | Enter lat/long in decimal format       | Component API         |
| Format Switching | Change format; verify conversion       | CoordinateInput tests |
| Point Placement  | Verify map shows correct location      | Visual verification   |
| Validation       | Invalid coordinates show error         | Error component       |

**Pass Criteria**:

- [ ] All 3 coordinate formats work correctly
- [ ] Conversion between formats is accurate
- [ ] Point appears at correct map location
- [ ] Validation errors are clear and accessible

---

### 1.3 FormFormReview

**Component**: `sfGpsDsCaOnFormFormReview`
**Estimated Time**: 4-5 hours
**Tester Skills**: OmniScript familiarity

| Test Area        | Test Cases                                    | Reference                           |
| ---------------- | --------------------------------------------- | ----------------------------------- |
| Auto-Generation  | Complete form; verify all fields in review    | FORMREVIEW_TROUBLESHOOTING_GUIDE.md |
| Ghost Data       | Navigate back/forward; verify no phantom data | Zombie audit tests                  |
| Sensitive Fields | Verify blocklisted fields are hidden          | Security blocklist                  |
| Edit Navigation  | Click Edit; verify returns to correct step    | FormEditBlock tests                 |
| Nested Data      | Test Edit Blocks with arrays                  | FormEditBlock tests                 |
| Empty Fields     | Optional fields show appropriate placeholder  | Component API                       |

**Pass Criteria**:

- [ ] All submitted fields appear in review
- [ ] No ghost/zombie data from navigation
- [ ] Sensitive fields (SSN, password, etc.) are NOT displayed
- [ ] Edit links navigate to correct form step

---

### 1.4 Modal

**Component**: `sfGpsDsCaOnModal`
**Estimated Time**: 2-3 hours
**Tester Skills**: Accessibility testing, keyboard navigation

| Test Area         | Test Cases                             | Reference           |
| ----------------- | -------------------------------------- | ------------------- |
| Focus Trap        | Tab should cycle within modal          | WCAG 2.4.3          |
| Escape Key        | Pressing Escape closes modal           | Keyboard checklist  |
| Background Scroll | Body should not scroll when modal open | Visual verification |
| Focus Restoration | Focus returns to trigger on close      | WCAG 2.4.3          |
| Screen Reader     | Modal announced; role="dialog"         | VoiceOver/NVDA      |
| Size Variants     | Test small, medium, large, full        | Component API       |

**Pass Criteria**:

- [ ] Cannot tab out of modal to background
- [ ] Escape closes modal
- [ ] Background is not scrollable
- [ ] Focus returns to original element on close
- [ ] Screen reader announces modal opening/closing

---

## Phase 2: High Priority (Test Second)

These components have complex state management or external integrations requiring focused testing.

### 2.1 NaicsCodePicker

**Component**: `sfGpsDsCaOnNaicsCodePicker`
**Estimated Time**: 2-3 hours

| Test Area           | Test Cases                                    |
| ------------------- | --------------------------------------------- |
| Cascading Selection | Select sector; verify sub-sectors filter      |
| All 5 Levels        | Navigate through all dropdown levels          |
| Code Reconstruction | Enter 6-digit code; verify dropdowns populate |
| Clear Function      | Clear selection; verify all levels reset      |
| Required Validation | Submit without selection; verify error        |

**Pass Criteria**:

- [ ] Each level correctly filters based on parent
- [ ] 6-digit code populates all 5 dropdowns correctly
- [ ] Clear resets all levels to placeholder
- [ ] Validation prevents submission without selection

---

### 2.2 CoordinateInput

**Component**: `sfGpsDsCaOnCoordinateInput`
**Estimated Time**: 2 hours

| Test Area      | Test Cases                                   |
| -------------- | -------------------------------------------- |
| UTM Format     | Enter Easting, Northing, Zone                |
| DMS Format     | Enter degrees, minutes, seconds for lat/long |
| Decimal Format | Enter latitude and longitude                 |
| Format Switch  | Change format; verify value converts         |
| Validation     | Invalid coordinates show appropriate errors  |

**Pass Criteria**:

- [ ] All 3 formats accept valid input
- [ ] Conversion between formats maintains accuracy
- [ ] Invalid values show clear error messages

---

### 2.3 FormPlacesTypeahead

**Component**: `sfGpsDsCaOnFormPlacesTypeahead`
**Estimated Time**: 2 hours
**Prerequisite**: Valid Google Places API key configured

| Test Area          | Test Cases                                     |
| ------------------ | ---------------------------------------------- |
| Address Search     | Type partial address; verify suggestions       |
| Selection          | Select address; verify fields populate         |
| Google Attribution | "Powered by Google" displays                   |
| Map Display        | Map shows selected location (if hideMap=false) |
| Field Mapping      | Verify googleTransformation maps correctly     |

**Pass Criteria**:

- [ ] Typing triggers address suggestions
- [ ] Selection populates all address fields
- [ ] Google attribution is visible
- [ ] Map updates to selected location

---

### 2.4 Search

**Component**: `sfGpsDsCaOnSearch`
**Estimated Time**: 1-2 hours

| Test Area           | Test Cases                                     |
| ------------------- | ---------------------------------------------- |
| Autocomplete        | Type; verify suggestions appear after debounce |
| Keyboard Navigation | Arrow keys navigate suggestions                |
| Selection           | Enter selects highlighted suggestion           |
| Clear               | Clear button/Escape clears input               |
| Screen Reader       | Live region announces result count             |

**Pass Criteria**:

- [ ] Suggestions appear after typing
- [ ] Arrow keys navigate without mouse
- [ ] Enter selects highlighted item
- [ ] Screen reader announces "X results found"

---

### 2.5 TaskListSalesforce

**Component**: `sfGpsDsCaOnTaskListSalesforce`
**Estimated Time**: 2 hours
**Prerequisite**: Salesforce org with Task records

| Test Area         | Test Cases                        |
| ----------------- | --------------------------------- |
| Data Loading      | Tasks display from Apex wire      |
| Permission Filter | User sees only permitted tasks    |
| Error Handling    | Invalid query shows error message |
| Refresh           | Data refreshes on trigger         |

**Pass Criteria**:

- [ ] Tasks load and display correctly
- [ ] Only user's permitted tasks are visible
- [ ] Errors display user-friendly messages

---

## Phase 3: Medium Priority (Test Third)

### 3.1 FormLookup

**Estimated Time**: 1-2 hours

| Test Area     | Test Cases                          |
| ------------- | ----------------------------------- |
| Remote Search | Verify DataRaptor/REST lookup works |
| Multi-Select  | Multiple selections appear as pills |
| Pill Removal  | X button removes selection          |

---

### 3.2 FormRange

**Estimated Time**: 1 hour

| Test Area       | Test Cases                       |
| --------------- | -------------------------------- |
| Slider Movement | Drag thumb; verify value updates |
| Keyboard        | Arrow keys increment/decrement   |
| Min/Max         | Verify bounds are enforced       |
| Step            | Verify snaps to step values      |

---

### 3.3 FormStep

**Estimated Time**: 1-2 hours

| Test Area  | Test Cases                            |
| ---------- | ------------------------------------- |
| Navigation | Back/Next buttons work                |
| Skip Link  | Skip link jumps to navigation         |
| Validation | Cannot advance with validation errors |
| Focus      | Heading focused on step change        |

---

### 3.4 FormStepChart

**Estimated Time**: 30 minutes

| Test Area        | Test Cases                   |
| ---------------- | ---------------------------- |
| Progress Display | Current step highlighted     |
| Percentage       | Percentage updates correctly |
| Screen Reader    | Progress announced on change |

---

## Phase 4: Pattern Validation

After completing unique component testing, validate common patterns using representative components.

### 4.1 Form Input Pattern

**Representative**: TextInput
**Components Validated**: TextInput, TextArea, DateInput, Dropdown, CheckboxGroup, RadioGroup, CoordinateInput, NaicsCodePicker (8 core + 6 variations = 14 components)

| Test Case ID     | Test                      |
| ---------------- | ------------------------- |
| TI-001 to TI-026 | Full TextInput test suite |

See [COMPONENT_TEST_CHECKLIST.md](./COMPONENT_TEST_CHECKLIST.md) for detailed test cases.

---

### 4.2 Card Pattern

**Representative**: Card
**Components Validated**: Card, ActionCard, FeatureCard, LinkCard, SelectableCard, ActivityStatusCard, SiteTaskCard, NotificationCard (8 components)

| Test Area  | Test Cases                    |
| ---------- | ----------------------------- |
| Image      | Alt text present; image loads |
| Heading    | Correct heading level         |
| CTA        | Link/button works             |
| Responsive | Layout correct at 320px       |

---

### 4.3 Navigation Pattern

**Representative**: Breadcrumbs
**Components Validated**: Breadcrumbs, InPageNav, StepIndicator, BackButton, BackToTop (5 components)

| Test Area    | Test Cases                      |
| ------------ | ------------------------------- |
| Nav Element  | `<nav>` with aria-label         |
| Current Item | aria-current="page" on active   |
| Keyboard     | Links focusable and activatable |

---

### 4.4 Comm Variant Pattern

**Representative**: CardComm
**Components Validated**: All 30+ Comm variants

| Test Area   | Test Cases                    |
| ----------- | ----------------------------- |
| Light DOM   | Renders in light DOM          |
| Scope Class | caon-scope class applied      |
| Properties  | Experience Builder props work |

---

## Testing Log Template

### Component: ********\_********

**Date**: ********\_********
**Tester**: ********\_********
**Environment**: ********\_********

| Test Area | Pass/Fail | Notes |
| --------- | --------- | ----- |
|           |           |       |
|           |           |       |
|           |           |       |

**Issues Found**:

1.
2.
3.

**Overall Result**: [ ] PASS [ ] FAIL [ ] BLOCKED

---

## Schedule Summary

| Phase   | Components                                                                        | Est. Time   | Cumulative  |
| ------- | --------------------------------------------------------------------------------- | ----------- | ----------- |
| Phase 1 | SiteSelectorTool, DischargePointSelector, FormFormReview, Modal                   | 13-18 hours | 13-18 hours |
| Phase 2 | NaicsCodePicker, CoordinateInput, FormPlacesTypeahead, Search, TaskListSalesforce | 9-12 hours  | 22-30 hours |
| Phase 3 | FormLookup, FormRange, FormStep, FormStepChart                                    | 3-5 hours   | 25-35 hours |
| Phase 4 | Pattern validation (4 patterns)                                                   | 4-6 hours   | 29-41 hours |

**Total Estimated Testing Time**: 29-41 hours (4-5 days)

---

## Prerequisites Checklist

Before starting testing:

- [ ] Access to Salesforce org with components deployed
- [ ] Screen reader installed (VoiceOver on Mac, NVDA on Windows)
- [ ] Google Places API key configured (for FormPlacesTypeahead)
- [ ] ESRI map VF page deployed (for SiteSelectorTool, DischargePointSelector)
- [ ] Sample OmniScript with form components
- [ ] Salesforce Task records for TaskListSalesforce
- [ ] Browser dev tools for console monitoring
- [ ] [COMPONENT_TEST_CHECKLIST.md](./COMPONENT_TEST_CHECKLIST.md) available
- [ ] [TESTING_GUIDE.md](./TESTING_GUIDE.md) reviewed
