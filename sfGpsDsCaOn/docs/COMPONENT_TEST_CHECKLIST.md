# Component-Specific Test Checklist

This checklist provides specific test cases for each sfGpsDsCaOn component. Use this alongside the general Testing Guide for comprehensive compliance verification.

> **Related Guide:** For testing tools, methodology, and WCAG requirements, see [TESTING_GUIDE.md](./TESTING_GUIDE.md).

---

## How to Use This Checklist

1. Test each component individually
2. Check off items as you verify them
3. Note any failures with details
4. Retest after fixes are applied

**Legend:**

- ✅ Pass
- ❌ Fail
- ⚠️ Partial/Needs Review
- N/A Not Applicable

---

## Form Input Components

### sfGpsDsCaOnTextInput

| Test ID | Category   | Test Case                           | Expected Result                    | Status |
| ------- | ---------- | ----------------------------------- | ---------------------------------- | ------ |
| TI-001  | Visual     | Label displays above input          | Label visible, properly positioned |        |
| TI-002  | Visual     | Required indicator shows asterisk   | Red asterisk or "(required)" flag  |        |
| TI-003  | Visual     | Optional flag displays "(optional)" | Text shows when optional=true      |        |
| TI-004  | Visual     | Hint text displays below label      | Gray hint text visible             |        |
| TI-005  | Visual     | Error state shows red border        | 3px red border on input            |        |
| TI-006  | Visual     | Error message shows with icon       | SVG icon + error text              |        |
| TI-007  | Visual     | Focus state shows blue outline      | 3px cyan outline on focus          |        |
| TI-008  | A11y       | Label associated with input         | `for` matches input `id`           |        |
| TI-009  | A11y       | aria-required set when required     | `aria-required="true"`             |        |
| TI-010  | A11y       | aria-invalid set on error           | `aria-invalid="true"`              |        |
| TI-011  | A11y       | aria-describedby links hint/error   | IDs match hint and error elements  |        |
| TI-012  | A11y       | Screen reader announces label       | VoiceOver/NVDA reads label         |        |
| TI-013  | A11y       | Screen reader announces error       | Error announced on blur            |        |
| TI-014  | Keyboard   | Tab focuses input                   | Input receives focus               |        |
| TI-015  | Keyboard   | Can type in input                   | Characters appear                  |        |
| TI-016  | Keyboard   | Tab moves to next element           | Focus leaves input                 |        |
| TI-017  | Func       | Value updates on input              | `value` property changes           |        |
| TI-018  | Func       | Blur event fires                    | `onblur` handler called            |        |
| TI-019  | Func       | Change event fires                  | `onchange` handler called          |        |
| TI-020  | Func       | maxLength enforced                  | Cannot type beyond limit           |        |
| TI-021  | Func       | minLength validation works          | Error shows if too short           |        |
| TI-022  | Func       | Pattern validation works            | Error shows on mismatch            |        |
| TI-023  | Func       | Read-only prevents editing          | Input not editable                 |        |
| TI-024  | Func       | Disabled prevents interaction       | Input grayed out, not focusable    |        |
| TI-025  | Responsive | Displays correctly at 320px         | No overflow, readable              |        |
| TI-026  | ODS        | Matches Ontario DS text input       | Compare to designsystem.ontario.ca |        |

### sfGpsDsCaOnTextArea

| Test ID | Category   | Test Case                       | Expected Result                    | Status |
| ------- | ---------- | ------------------------------- | ---------------------------------- | ------ |
| TA-001  | Visual     | Multi-line input displays       | Textarea with multiple rows        |        |
| TA-002  | Visual     | Character count shows           | Count displays below textarea      |        |
| TA-003  | Visual     | Character count updates         | Count changes on input             |        |
| TA-004  | Visual     | Warning state at threshold      | Color changes near limit           |        |
| TA-005  | Visual     | Error state at limit            | Red when exceeded                  |        |
| TA-006  | A11y       | aria-describedby includes count | Character count announced          |        |
| TA-007  | A11y       | Live region for count changes   | Screen reader announces updates    |        |
| TA-008  | Keyboard   | Enter creates new line          | Newline inserted                   |        |
| TA-009  | Func       | Value includes newlines         | Multi-line value preserved         |        |
| TA-010  | Func       | maxLength enforced              | Cannot exceed limit                |        |
| TA-011  | Responsive | Resizes appropriately           | Fits container width               |        |
| TA-012  | ODS        | Matches Ontario DS textarea     | Compare to designsystem.ontario.ca |        |

### sfGpsDsCaOnDropdown

| Test ID | Category | Test Case                     | Expected Result                    | Status |
| ------- | -------- | ----------------------------- | ---------------------------------- | ------ |
| DD-001  | Visual   | Dropdown arrow displays       | Chevron icon on right              |        |
| DD-002  | Visual   | Options list appears on click | Dropdown opens                     |        |
| DD-003  | Visual   | Selected option highlighted   | Visual indication of selection     |        |
| DD-004  | Visual   | Placeholder text shows        | Placeholder when no selection      |        |
| DD-005  | A11y     | role="combobox" set           | Correct ARIA role                  |        |
| DD-006  | A11y     | aria-expanded updates         | true when open, false when closed  |        |
| DD-007  | A11y     | aria-activedescendant set     | Points to focused option           |        |
| DD-008  | A11y     | Options have role="option"    | Correct role on list items         |        |
| DD-009  | Keyboard | Space/Enter opens dropdown    | Dropdown expands                   |        |
| DD-010  | Keyboard | Arrow keys navigate options   | Focus moves through list           |        |
| DD-011  | Keyboard | Enter selects option          | Selection made, dropdown closes    |        |
| DD-012  | Keyboard | Escape closes dropdown        | Dropdown collapses                 |        |
| DD-013  | Keyboard | Type-ahead finds option       | Typing jumps to matching option    |        |
| DD-014  | Func     | Selection updates value       | Value property changes             |        |
| DD-015  | Func     | Change event fires            | Handler called on selection        |        |
| DD-016  | Func     | Required validation works     | Error if no selection              |        |
| DD-017  | ODS      | Matches Ontario DS dropdown   | Compare to designsystem.ontario.ca |        |

### sfGpsDsCaOnCheckboxGroup

| Test ID | Category | Test Case                     | Expected Result                    | Status |
| ------- | -------- | ----------------------------- | ---------------------------------- | ------ |
| CB-001  | Visual   | Checkboxes display in group   | Multiple checkboxes visible        |        |
| CB-002  | Visual   | Legend/label above group      | Group label visible                |        |
| CB-003  | Visual   | Checked state shows checkmark | Visible checkmark indicator        |        |
| CB-004  | Visual   | Focus indicator on checkbox   | Outline on focused item            |        |
| CB-005  | A11y     | fieldset groups checkboxes    | `<fieldset>` element used          |        |
| CB-006  | A11y     | legend provides group label   | `<legend>` element present         |        |
| CB-007  | A11y     | aria-required on fieldset     | Set when required                  |        |
| CB-008  | A11y     | aria-invalid on fieldset      | Set when error                     |        |
| CB-009  | A11y     | Each checkbox has label       | Labels properly associated         |        |
| CB-010  | Keyboard | Tab moves to first checkbox   | Focus on first item                |        |
| CB-011  | Keyboard | Space toggles checkbox        | Check/uncheck on space             |        |
| CB-012  | Keyboard | Tab moves through checkboxes  | Can tab to each item               |        |
| CB-013  | Func     | Multiple selections allowed   | Can check multiple boxes           |        |
| CB-014  | Func     | Value is array                | Returns array of selections        |        |
| CB-015  | Func     | Required validation works     | Error if none selected             |        |
| CB-016  | ODS      | Matches Ontario DS checkboxes | Compare to designsystem.ontario.ca |        |

### sfGpsDsCaOnRadioGroup

| Test ID | Category | Test Case                          | Expected Result                    | Status |
| ------- | -------- | ---------------------------------- | ---------------------------------- | ------ |
| RG-001  | Visual   | Radio buttons display in group     | Multiple radios visible            |        |
| RG-002  | Visual   | Selected state shows filled circle | Visual selection indicator         |        |
| RG-003  | Visual   | Only one selected at a time        | Mutual exclusivity                 |        |
| RG-004  | A11y     | fieldset groups radios             | `<fieldset>` element used          |        |
| RG-005  | A11y     | Radios share same name             | Same name attribute                |        |
| RG-006  | A11y     | aria-checked reflects state        | Updated on selection               |        |
| RG-007  | Keyboard | Arrow keys navigate radios         | Move between options               |        |
| RG-008  | Keyboard | Space selects focused radio        | Selection made                     |        |
| RG-009  | Func     | Only one value selected            | Single selection enforced          |        |
| RG-010  | Func     | Change event fires                 | Handler called on selection        |        |
| RG-011  | ODS      | Matches Ontario DS radio buttons   | Compare to designsystem.ontario.ca |        |

### sfGpsDsCaOnDateInput

| Test ID | Category | Test Case                     | Expected Result                    | Status |
| ------- | -------- | ----------------------------- | ---------------------------------- | ------ |
| DI-001  | Visual   | Three input fields display    | Day, month, year fields            |        |
| DI-002  | Visual   | Fields labeled appropriately  | Labels for each field              |        |
| DI-003  | Visual   | Hint shows date format        | Format hint visible                |        |
| DI-004  | A11y     | Group has accessible name     | fieldset/legend or aria-label      |        |
| DI-005  | A11y     | Each field has label          | Labels associated                  |        |
| DI-006  | A11y     | aria-describedby links hint   | Hint associated with fields        |        |
| DI-007  | Keyboard | Tab moves between fields      | Focus order correct                |        |
| DI-008  | Keyboard | Auto-advance on complete      | Moves to next field                |        |
| DI-009  | Func     | Valid date accepted           | Correct dates work                 |        |
| DI-010  | Func     | Invalid date rejected         | Feb 30 shows error                 |        |
| DI-011  | Func     | Min/max dates enforced        | Out of range shows error           |        |
| DI-012  | Func     | Value in correct format       | YYYY-MM-DD output                  |        |
| DI-013  | ODS      | Matches Ontario DS date input | Compare to designsystem.ontario.ca |        |

---

## OmniScript Form Components

### sfGpsDsCaOnFormTypeahead

| Test ID | Category   | Test Case                         | Expected Result              | Status |
| ------- | ---------- | --------------------------------- | ---------------------------- | ------ |
| FT-001  | Visual     | Input with search icon            | Icon visible                 |        |
| FT-002  | Visual     | Dropdown appears on input         | Options list shows           |        |
| FT-003  | Visual     | Loading indicator displays        | Spinner during search        |        |
| FT-004  | Visual     | No results message shows          | Message when empty           |        |
| FT-005  | A11y       | role="combobox" set               | Correct ARIA role            |        |
| FT-006  | A11y       | aria-autocomplete="list"          | Autocomplete announced       |        |
| FT-007  | A11y       | aria-activedescendant updates     | Points to highlighted option |        |
| FT-008  | A11y       | Live region announces results     | "X results found" announced  |        |
| FT-009  | A11y       | aria-required set                 | Announced when required      |        |
| FT-010  | Keyboard   | Arrow down opens list             | Dropdown expands             |        |
| FT-011  | Keyboard   | Arrow keys navigate options       | Highlight moves              |        |
| FT-012  | Keyboard   | Enter selects option              | Selection made               |        |
| FT-013  | Keyboard   | Escape closes list                | Dropdown collapses           |        |
| FT-014  | Func       | Search triggers on input          | Options filter/load          |        |
| FT-015  | Func       | Selection updates OmniScript data | applyCallResp called         |        |
| FT-016  | Func       | Validation works                  | Required/pattern enforced    |        |
| FT-017  | OmniScript | Component registered              | Shows in designer            |        |
| FT-018  | OmniScript | Properties configurable           | Props editable               |        |

### sfGpsDsCaOnFormPlacesTypeahead

| Test ID | Category   | Test Case                           | Expected Result                        | Status |
| ------- | ---------- | ----------------------------------- | -------------------------------------- | ------ |
| PT-001  | Visual     | Input with location icon            | Location pin icon visible              |        |
| PT-002  | Visual     | Dropdown appears on input           | Address options list shows             |        |
| PT-003  | Visual     | Google attribution displays         | "Powered by Google" at bottom          |        |
| PT-004  | Visual     | Map displays after selection        | lightning-map shows location           |        |
| PT-005  | Visual     | Ontario DS styling applied          | Ontario input/label classes            |        |
| PT-006  | A11y       | role="combobox" set                 | Correct ARIA role                      |        |
| PT-007  | A11y       | aria-autocomplete="list"            | Autocomplete announced                 |        |
| PT-008  | A11y       | aria-activedescendant updates       | Points to highlighted address          |        |
| PT-009  | A11y       | Live region announces results       | "X addresses found" announced          |        |
| PT-010  | A11y       | aria-required set when required     | Announced when required                |        |
| PT-011  | A11y       | aria-invalid set on error           | Error state announced                  |        |
| PT-012  | A11y       | Error message has role="alert"      | Assertive announcement                 |        |
| PT-013  | A11y       | Google attribution aria-hidden      | Hidden from screen readers             |        |
| PT-014  | Keyboard   | Arrow down opens list               | Dropdown expands                       |        |
| PT-015  | Keyboard   | Arrow keys navigate addresses       | Highlight moves through options        |        |
| PT-016  | Keyboard   | Enter selects address               | Address selected and details fetched   |        |
| PT-017  | Keyboard   | Escape closes list                  | Dropdown collapses                     |        |
| PT-018  | Func       | Search triggers Google Places API   | Address predictions load               |        |
| PT-019  | Func       | Selection fetches place details     | Full address components retrieved      |        |
| PT-020  | Func       | googleTransformation maps fields    | Address parts map to OmniScript fields |        |
| PT-021  | Func       | Map updates with selected location  | Map marker shows selected place        |        |
| PT-022  | Func       | hideMap property works              | Map hidden when configured             |        |
| PT-023  | Func       | googleAddressCountry biases results | Canadian addresses prioritized         |        |
| PT-024  | OmniScript | Component registered                | Shows in designer                      |        |
| PT-025  | OmniScript | Google Maps API key configurable    | API key property editable              |        |
| PT-026  | OmniScript | Properties inherited from base      | All Places properties available        |        |

### sfGpsDsCaOnFormLookup

| Test ID | Category   | Test Case                    | Expected Result                 | Status |
| ------- | ---------- | ---------------------------- | ------------------------------- | ------ |
| FL-001  | Visual     | Input with lookup icon       | Search icon visible             |        |
| FL-002  | Visual     | Dropdown on focus/input      | Options appear                  |        |
| FL-003  | Visual     | Selected pills display       | Multi-select shows pills        |        |
| FL-004  | A11y       | role="combobox" set          | Correct ARIA role               |        |
| FL-005  | A11y       | Live region for results      | Announces result count          |        |
| FL-006  | A11y       | aria-describedby links error | Error associated                |        |
| FL-007  | Keyboard   | Full keyboard navigation     | All actions keyboard accessible |        |
| FL-008  | Func       | Remote lookup works          | DataRaptor/REST called          |        |
| FL-009  | Func       | Selection updates data       | Value stored in OmniScript      |        |
| FL-010  | OmniScript | Works in forms               | Integrates properly             |        |

### sfGpsDsCaOnFormRange

| Test ID | Category | Test Case               | Expected Result         | Status |
| ------- | -------- | ----------------------- | ----------------------- | ------ |
| FR-001  | Visual   | Slider track displays   | Track visible           |        |
| FR-002  | Visual   | Thumb/handle visible    | Draggable thumb         |        |
| FR-003  | Visual   | Current value displays  | Value label shown       |        |
| FR-004  | A11y     | role="slider" set       | Correct role            |        |
| FR-005  | A11y     | aria-valuemin set       | Minimum value           |        |
| FR-006  | A11y     | aria-valuemax set       | Maximum value           |        |
| FR-007  | A11y     | aria-valuenow set       | Current value           |        |
| FR-008  | A11y     | aria-valuetext set      | Human-readable value    |        |
| FR-009  | Keyboard | Arrow keys adjust value | Increment/decrement     |        |
| FR-010  | Keyboard | Home/End set min/max    | Jump to extremes        |        |
| FR-011  | Func     | Step enforced           | Snaps to step values    |        |
| FR-012  | Func     | Value updates data      | OmniScript data changes |        |

### sfGpsDsCaOnFormStep

| Test ID | Category | Test Case                   | Expected Result           | Status |
| ------- | -------- | --------------------------- | ------------------------- | ------ |
| FS-001  | Visual   | Step heading displays       | Title visible             |        |
| FS-002  | Visual   | Navigation buttons show     | Back/Next/Save visible    |        |
| FS-003  | Visual   | Error summary appears       | Shows on validation error |        |
| FS-004  | A11y     | Skip link present           | Keyboard skip available   |        |
| FS-005  | A11y     | Step announced on change    | aria-live announcement    |        |
| FS-006  | A11y     | Error summary focusable     | Can focus error region    |        |
| FS-007  | A11y     | Navigation is landmark      | `<nav>` with aria-label   |        |
| FS-008  | Keyboard | Skip link works             | Jumps to navigation       |        |
| FS-009  | Keyboard | Focus on step change        | Heading focused           |        |
| FS-010  | Func     | Back navigates to previous  | Step changes              |        |
| FS-011  | Func     | Next validates and advances | Moves forward             |        |
| FS-012  | Func     | Save triggers save action   | OmniScript save           |        |

### sfGpsDsCaOnFormStepChart

| Test ID | Category | Test Case                | Expected Result           | Status |
| ------- | -------- | ------------------------ | ------------------------- | ------ |
| SC-001  | Visual   | Progress indicator shows | Step chart visible        |        |
| SC-002  | Visual   | Current step highlighted | Visual indication         |        |
| SC-003  | Visual   | Percentage displayed     | Progress percentage shown |        |
| SC-004  | A11y     | Progress announced       | aria-live for step change |        |
| SC-005  | A11y     | Accessible description   | "Step X of Y" announced   |        |
| SC-006  | Func     | Updates on step change   | Reflects current step     |        |

---

## Navigation Components

### sfGpsDsCaOnAccordion

| Test ID | Category | Test Case                     | Expected Result                    | Status |
| ------- | -------- | ----------------------------- | ---------------------------------- | ------ |
| AC-001  | Visual   | Header/trigger visible        | Clickable header                   |        |
| AC-002  | Visual   | Expand/collapse icon          | Chevron animates                   |        |
| AC-003  | Visual   | Content hidden when collapsed | Panel not visible                  |        |
| AC-004  | Visual   | Content visible when expanded | Panel displays                     |        |
| AC-005  | A11y     | Button role on header         | `<button>` or role="button"        |        |
| AC-006  | A11y     | aria-expanded set             | true/false reflects state          |        |
| AC-007  | A11y     | aria-controls links panel     | ID matches panel                   |        |
| AC-008  | A11y     | Panel has aria-hidden         | true when collapsed                |        |
| AC-009  | Keyboard | Enter/Space toggles           | Expand/collapse                    |        |
| AC-010  | Keyboard | Arrow keys navigate (group)   | Move between accordions            |        |
| AC-011  | Func     | Animation smooth              | No jank on toggle                  |        |
| AC-012  | Func     | Multiple expand works         | If configured                      |        |
| AC-013  | ODS      | Matches Ontario DS accordion  | Compare to designsystem.ontario.ca |        |

### sfGpsDsCaOnBreadcrumbs

| Test ID | Category | Test Case                      | Expected Result                    | Status |
| ------- | -------- | ------------------------------ | ---------------------------------- | ------ |
| BC-001  | Visual   | Trail displays horizontally    | Links in a row                     |        |
| BC-002  | Visual   | Separator between items        | Visual separator                   |        |
| BC-003  | Visual   | Current page not linked        | Last item is text                  |        |
| BC-004  | A11y     | nav element with aria-label    | Breadcrumb navigation              |        |
| BC-005  | A11y     | aria-current on current        | "page" on last item                |        |
| BC-006  | Keyboard | Links focusable                | Tab through links                  |        |
| BC-007  | Func     | Links navigate correctly       | URLs work                          |        |
| AC-008  | ODS      | Matches Ontario DS breadcrumbs | Compare to designsystem.ontario.ca |        |

### sfGpsDsCaOnBackToTop

| Test ID | Category | Test Case                      | Expected Result                    | Status |
| ------- | -------- | ------------------------------ | ---------------------------------- | ------ |
| BT-001  | Visual   | Button hidden at top           | Not visible initially              |        |
| BT-002  | Visual   | Button appears on scroll       | Shows after threshold              |        |
| BT-003  | Visual   | Button in fixed position       | Stays in viewport                  |        |
| BT-004  | A11y     | Accessible name                | aria-label or text                 |        |
| BT-005  | A11y     | Focus moves to top             | Focus on skip target               |        |
| BT-006  | Keyboard | Keyboard activatable           | Enter/Space works                  |        |
| BT-007  | Func     | Scrolls to top                 | Page scrolls up                    |        |
| BT-008  | Func     | Works with LWS                 | try/catch for window APIs          |        |
| BT-009  | ODS      | Matches Ontario DS back-to-top | Compare to designsystem.ontario.ca |        |

### sfGpsDsCaOnInPageNav

| Test ID | Category | Test Case                   | Expected Result            | Status |
| ------- | -------- | --------------------------- | -------------------------- | ------ |
| IN-001  | Visual   | Navigation list displays    | Links visible              |        |
| IN-002  | Visual   | Current section highlighted | aria-current styling       |        |
| IN-003  | A11y     | nav element used            | `<nav>` with aria-label    |        |
| IN-004  | A11y     | aria-current="page" set     | On active link             |        |
| IN-005  | Keyboard | Links keyboard accessible   | Tab and Enter work         |        |
| IN-006  | Func     | Links jump to sections      | Anchor navigation works    |        |
| IN-007  | Func     | Updates on scroll           | Highlights current section |        |

---

## Content Components

### sfGpsDsCaOnCallout

| Test ID | Category | Test Case                  | Expected Result                    | Status |
| ------- | -------- | -------------------------- | ---------------------------------- | ------ |
| CO-001  | Visual   | Callout box displays       | Styled container                   |        |
| CO-002  | Visual   | Icon displays (if set)     | Type-specific icon                 |        |
| CO-003  | Visual   | Heading displays           | Title visible                      |        |
| CO-004  | Visual   | Content displays           | Body text visible                  |        |
| CO-005  | A11y     | Proper heading level       | h2/h3/h4 as configured             |        |
| CO-006  | A11y     | role="region" or similar   | Appropriate landmark               |        |
| CO-007  | Func     | Slot content works         | Custom content renders             |        |
| CO-008  | ODS      | Matches Ontario DS callout | Compare to designsystem.ontario.ca |        |

### sfGpsDsCaOnCard

| Test ID | Category | Test Case                        | Expected Result                    | Status |
| ------- | -------- | -------------------------------- | ---------------------------------- | ------ |
| CD-001  | Visual   | Card container displays          | Styled box                         |        |
| CD-002  | Visual   | Image displays (if set)          | Image visible                      |        |
| CD-003  | Visual   | Title displays                   | Heading visible                    |        |
| CD-004  | Visual   | Description displays             | Body text visible                  |        |
| CD-005  | Visual   | Link/button displays             | CTA visible                        |        |
| CD-006  | A11y     | Card is focusable (if clickable) | Tab focuses card                   |        |
| CD-007  | A11y     | Image has alt text               | Describes image                    |        |
| CD-008  | A11y     | Heading structure correct        | Proper heading level               |        |
| CD-009  | Keyboard | Card keyboard activatable        | Enter activates link               |        |
| CD-010  | ODS      | Matches Ontario DS card          | Compare to designsystem.ontario.ca |        |

### sfGpsDsCaOnTable

| Test ID | Category   | Test Case                | Expected Result                    | Status |
| ------- | ---------- | ------------------------ | ---------------------------------- | ------ |
| TB-001  | Visual     | Table structure displays | Rows and columns                   |        |
| TB-002  | Visual     | Header row styled        | Bold/background                    |        |
| TB-003  | Visual     | Zebra striping (if set)  | Alternating colors                 |        |
| TB-004  | A11y       | caption or aria-label    | Table has name                     |        |
| TB-005  | A11y       | th elements for headers  | Proper header cells                |        |
| TB-006  | A11y       | scope attribute set      | Row/column scope                   |        |
| TB-007  | A11y       | No tabindex on table     | Table not focusable                |        |
| TB-008  | Responsive | Scrolls horizontally     | No content cut off                 |        |
| TB-009  | ODS        | Matches Ontario DS table | Compare to designsystem.ontario.ca |        |

---

## Test Execution Log

### Component: ******\_\_\_******

### Date: ******\_\_\_******

### Tester: ******\_\_\_******

| Test ID | Result | Notes |
| ------- | ------ | ----- |
|         |        |       |
|         |        |       |
|         |        |       |

### Summary

- Total Tests: \_\_\_
- Passed: \_\_\_
- Failed: \_\_\_
- Blocked: \_\_\_

### Issues Found

1.
2.
3.

---

## Appendix: Quick Visual Comparison URLs

| Component      | Ontario DS Reference URL                                       |
| -------------- | -------------------------------------------------------------- |
| Buttons        | https://designsystem.ontario.ca/components/buttons.html        |
| Text Inputs    | https://designsystem.ontario.ca/components/text-inputs.html    |
| Textareas      | https://designsystem.ontario.ca/components/text-areas.html     |
| Checkboxes     | https://designsystem.ontario.ca/components/checkboxes.html     |
| Radio Buttons  | https://designsystem.ontario.ca/components/radio-buttons.html  |
| Dropdown Lists | https://designsystem.ontario.ca/components/dropdown-lists.html |
| Date Input     | https://designsystem.ontario.ca/components/date-input.html     |
| Accordions     | https://designsystem.ontario.ca/components/accordions.html     |
| Callouts       | https://designsystem.ontario.ca/components/callouts.html       |
| Cards          | https://designsystem.ontario.ca/components/cards.html          |
| Tables         | https://designsystem.ontario.ca/components/data-tables.html    |
| Breadcrumbs    | https://designsystem.ontario.ca/components/breadcrumbs.html    |
| Back to Top    | https://designsystem.ontario.ca/components/back-to-top.html    |
| Step Indicator | https://designsystem.ontario.ca/components/step-indicator.html |
