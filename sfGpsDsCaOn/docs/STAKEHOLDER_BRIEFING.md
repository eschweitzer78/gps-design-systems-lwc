# sfGpsDsCaOn Component Library: Stakeholder Briefing

> **Purpose**: Executive summary and decision support document for business and IT stakeholders
> **Date**: January 30, 2026
> **Audience**: Development managers, QA leads, business stakeholders, IT leadership

---

## Executive Summary

The sfGpsDsCaOn library implements the **Ontario Design System** within Salesforce, providing **134 Lightning Web Components** for government digital services. This briefing summarizes component value, risk, and testing recommendations.

### Key Numbers

| Metric                     | Value                |
| -------------------------- | -------------------- |
| Total Components           | 134                  |
| Core Components            | 60                   |
| OmniStudio Form Components | 40+                  |
| Community (Comm) Variants  | 30+                  |
| Current Test Coverage      | ~23% (14 components) |

---

## Section 1: High-Value Components (Greatest Reuse)

These components are used across the entire application. Defects in these components cascade to all forms and pages.

### Critical Infrastructure

| Component                | Depends On It  | Business Impact                   |
| ------------------------ | -------------- | --------------------------------- |
| `sfGpsDsLwc` base class  | 100 components | Foundation for all UI             |
| `sfGpsDsHelpers` utility | 34 components  | CSS and utility functions         |
| `sfGpsDsCaOnLabels`      | 19 components  | All user-facing text/translations |

### High-Reuse Form Elements

Every form in the system uses these components:

- **TextInput** - Text entry fields
- **Dropdown** - Selection menus
- **CheckboxGroup** - Multi-select options
- **RadioGroup** - Single-select options
- **DateInput** - Date collection (Ontario 3-field format)
- **Label**, **Hint**, **Error** - Form field supporting elements

### High-Reuse Layout Components

Every page in the system uses these:

- **Header** - Site navigation and branding
- **Footer** - Site footer with required links
- **Modal** - Dialogs and confirmations
- **Card** - Content presentation
- **Accordion** - Collapsible sections

**Recommendation**: Prioritize stability for these components. Any defect affects all users.

---

## Section 2: High-Value Components (Time Savings)

These components represent significant development investment. Building equivalent functionality from scratch would require the estimated effort shown.

### Tier 1: Very High Complexity (6-8 weeks each)

| Component                  | Key Features                                                                              | Build Time Saved |
| -------------------------- | ----------------------------------------------------------------------------------------- | ---------------- |
| **FormFormReview**         | Auto-generates form summary from OmniScript data; security blocklist for sensitive fields | 6-8 weeks        |
| **SiteSelectorTool**       | ESRI map integration; address geocoding; coordinate conversion; 3 search modes            | 4-6 weeks        |
| **DischargePointSelector** | ESRI map; UTM/DMS/Decimal coordinates; environmental point placement                      | 3-4 weeks        |

### Tier 2: High Complexity (2-3 weeks each)

| Component           | Key Features                                                  | Build Time Saved |
| ------------------- | ------------------------------------------------------------- | ---------------- |
| **Modal**           | Focus trapping; keyboard navigation; accessibility compliance | 2-3 weeks        |
| **FormTypeahead**   | Autocomplete; debouncing; OmniStudio integration              | 2-3 weeks        |
| **NaicsCodePicker** | 5-level cascading dropdown for industry codes                 | 2-3 weeks        |
| **CoordinateInput** | Multiple coordinate formats with conversion                   | 2 weeks          |

### Tier 3: OmniStudio Form Suite (40+ components)

All OmniStudio form components bridge Ontario DS styling with OmniScript data binding, saving approximately 1-2 weeks per component.

**Total Estimated Time Savings**: 25-35 weeks of development effort

---

## Section 3: Risk Assessment

### Critical Risk (External Dependencies + Security)

| Component                  | Risk Factors                                     | Potential Impact                                                  |
| -------------------------- | ------------------------------------------------ | ----------------------------------------------------------------- |
| **SiteSelectorTool**       | ESRI iframe; postMessage security; external APIs | Location data corruption; security vulnerability; feature failure |
| **DischargePointSelector** | Same ESRI risks; coordinate accuracy             | Environmental permit data errors; regulatory compliance           |
| **FormSiteSelectorTool**   | Apex callout; OmniScript binding                 | Incorrect location in form submissions                            |
| **TaskListSalesforce**     | 3 Apex wire methods; live data                   | Permission errors; data exposure                                  |
| **SearchEinstein**         | Einstein API dependency                          | Search failure; performance degradation                           |

### High Risk (Complex State + Accessibility)

| Component            | Risk Factors                             | Potential Impact                            |
| -------------------- | ---------------------------------------- | ------------------------------------------- |
| **FormFormReview**   | Security blocklist; recursive processing | Sensitive data exposure; incomplete reviews |
| **Modal**            | Focus trapping; keyboard navigation      | AODA non-compliance; keyboard trap          |
| **MapSelectorMixin** | Shared by all map components             | Single point of failure for GIS features    |

### Medium Risk (Validation + Data Integrity)

| Component           | Risk Factors                              |
| ------------------- | ----------------------------------------- |
| **CoordinateInput** | Coordinate conversion errors              |
| **NaicsCodePicker** | Industry code impacts permit requirements |
| **DateInput**       | Multi-field date validation               |

**Recommendation**: Security review for postMessage handling in map components.

---

## Section 4: Testing Strategy Summary

### Pattern-Based Testing (Efficient Coverage)

Testing one representative component validates patterns shared across many:

| Pattern Group    | Representative | Components Covered |
| ---------------- | -------------- | ------------------ |
| Form Inputs      | TextInput      | 14 components      |
| Comm Variants    | CardComm       | 30+ components     |
| OmniStudio Forms | FormText       | 40+ components     |
| Cards            | Card           | 8 components       |
| Navigation       | Breadcrumbs    | 5 components       |

### Unique Component Testing (Individual Attention Required)

| Priority          | Components                                                                        | Reason                                   |
| ----------------- | --------------------------------------------------------------------------------- | ---------------------------------------- |
| **P1 - Critical** | SiteSelectorTool, DischargePointSelector, FormFormReview, Modal                   | Unique functionality; high risk          |
| **P2 - High**     | NaicsCodePicker, CoordinateInput, FormPlacesTypeahead, Search, TaskListSalesforce | Complex state; external integrations     |
| **P3 - Medium**   | FormLookup, FormRange, FormStep, FormStepChart                                    | Moderate complexity; OmniScript-specific |

---

## Section 5: Current Gaps and Recommendations

### Testing Coverage Gap

**Current state**: 14 of 60+ components have automated tests (~23%)

**Missing high-priority tests**:

1. Form elements: TextArea, Dropdown, CheckboxGroup, RadioGroup, DateInput
2. Navigation: Accordion, Breadcrumbs, StepIndicator, InPageNav
3. Layout: Header, Footer

### Recommended Actions

| Action                         | Priority | Effort   | Impact                               |
| ------------------------------ | -------- | -------- | ------------------------------------ |
| Add tests for form elements    | High     | 2-3 days | Validates 14+ components via pattern |
| Add tests for navigation       | High     | 1-2 days | AODA compliance assurance            |
| Security review of postMessage | High     | 1 day    | Risk mitigation for map components   |
| Add tests for Header/Footer    | Medium   | 1 day    | High visibility defect prevention    |

---

## Section 6: Decision Support Matrix

| Question                                             | Answer                                                                    |
| ---------------------------------------------------- | ------------------------------------------------------------------------- |
| Which components should never have breaking changes? | Labels, TextInput, Modal, Header, Footer                                  |
| Which components represent our custom IP?            | SiteSelectorTool, DischargePointSelector, FormFormReview, NaicsCodePicker |
| Which components need security review?               | SiteSelectorTool, DischargePointSelector, MapSelectorMixin                |
| Where should we invest in test coverage first?       | Form elements (pattern covers 14+), then Navigation (AODA)                |
| What's the single biggest risk?                      | postMessage security in map components                                    |

---

## Appendix: Component Inventory by Category

### Form Elements (14)

TextInput, TextArea, DateInput, Dropdown, CheckboxGroup, RadioGroup, CoordinateInput, NaicsCodePicker, CharacterCount, Label, Hint, Error, FormGroup, Fieldset

### Layout (12)

Card, ActionCard, FeatureCard, LinkCard, SelectableCard, ActivityStatusCard, SiteTaskCard, NotificationCard, Modal, Callout, Aside, LoadingIndicator

### Navigation (8)

Header, Footer, Breadcrumbs, InPageNav, StepIndicator, BackButton, BackToTop, Accordion

### Data Display (4)

Table, SummaryList, TaskList, TaskListSalesforce

### GIS/Location (4)

SiteSelectorTool, DischargePointSelector, CoordinateInput, MapSelectorMixin

### Search (2)

Search, SearchEinstein

### OmniStudio Forms (40+)

FormText, FormTextarea, FormNumber, FormCurrency, FormDate, FormDateTime, FormSelect, FormRadio, FormCheckbox, FormLookup, FormTypeahead, FormPlacesTypeahead, FormFile, FormRange, FormStep, FormStepChart, FormFormReview, FormSiteSelectorTool, FormDischargePointSelector, FormNaicsCodePicker, FormSelectableCards, and more...

### Utilities (5)

Labels, UserMessages, DebugUtils, ErrorTracker, MapSelectorMixin

---

## Contact

For technical questions about this analysis, contact the development team lead.
