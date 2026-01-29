# Ontario Design System Compliance Testing Guide

This guide outlines the tools, processes, and checklists for testing sfGpsDsCaOn components for compliance with the Ontario Design System (ODS) and AODA accessibility requirements.

> **Related Guide:** For detailed per-component test cases with specific test IDs, see [COMPONENT_TEST_CHECKLIST.md](./COMPONENT_TEST_CHECKLIST.md).

## Table of Contents

1. [Testing Tools](#testing-tools)
2. [Visual Compliance Checklist](#visual-compliance-checklist)
3. [Accessibility Testing Checklist](#accessibility-testing-checklist)
4. [Functional Testing Checklist](#functional-testing-checklist)
5. [Responsive Design Checklist](#responsive-design-checklist)
6. [Browser Compatibility Checklist](#browser-compatibility-checklist)
7. [OmniScript Integration Checklist](#omniscript-integration-checklist)

---

## Testing Tools

### Automated Accessibility Testing

| Tool                       | Purpose                       | How to Use                                |
| -------------------------- | ----------------------------- | ----------------------------------------- |
| **axe DevTools**           | Automated WCAG testing        | Browser extension - run on each component |
| **WAVE**                   | Web accessibility evaluation  | Browser extension or wave.webaim.org      |
| **Lighthouse**             | Accessibility audit in Chrome | DevTools > Lighthouse > Accessibility     |
| **Pa11y**                  | CLI accessibility testing     | `npx pa11y <url>`                         |
| **eslint-plugin-jsx-a11y** | Static analysis for a11y      | Add to ESLint config                      |

### Screen Readers (Manual Testing)

| Tool          | Platform  | Notes                            |
| ------------- | --------- | -------------------------------- |
| **VoiceOver** | macOS/iOS | Built-in, Cmd+F5 to enable       |
| **NVDA**      | Windows   | Free, download from nvaccess.org |
| **JAWS**      | Windows   | Industry standard, commercial    |
| **TalkBack**  | Android   | Built-in accessibility service   |

### Visual Testing

| Tool                         | Purpose                 | How to Use                      |
| ---------------------------- | ----------------------- | ------------------------------- |
| **Ontario DS Documentation** | Reference specification | https://designsystem.ontario.ca |
| **Figma Ontario DS Kit**     | Design reference        | Compare against design specs    |
| **Percy/Chromatic**          | Visual regression       | Integrate with CI/CD            |
| **Storybook**                | Component isolation     | Test components in isolation    |

### Color & Contrast

| Tool                         | Purpose              | How to Use                           |
| ---------------------------- | -------------------- | ------------------------------------ |
| **WebAIM Contrast Checker**  | WCAG contrast ratios | webaim.org/resources/contrastchecker |
| **Colour Contrast Analyser** | Desktop app          | Download from TPGi                   |
| **Chrome DevTools**          | Inspect contrast     | Elements > Styles > color picker     |

### Browser DevTools

| Feature                        | Purpose                |
| ------------------------------ | ---------------------- |
| **Accessibility Tree**         | Inspect ARIA structure |
| **CSS Grid/Flexbox Inspector** | Verify layout          |
| **Device Emulation**           | Test responsive design |
| **Network Throttling**         | Test performance       |
| **Forced Colors Mode**         | Test high contrast     |

---

## Visual Compliance Checklist

### Typography

- [ ] **Font Family**: Uses Open Sans (body) and Raleway (headings) from Ontario DS
- [ ] **Font Sizes**: Match Ontario DS type scale
  - [ ] H1: 2.5rem (40px)
  - [ ] H2: 2rem (32px)
  - [ ] H3: 1.5rem (24px)
  - [ ] H4: 1.25rem (20px)
  - [ ] Body: 1rem (16px)
- [ ] **Line Height**: 1.5 for body text, 1.2-1.3 for headings
- [ ] **Font Weight**: 400 regular, 600 semi-bold, 700 bold

### Colors

> **Note**: All colors should be implemented using CSS variables with fallbacks (e.g., `var(--ontario-colour-link, #0066cc)`). When testing, verify the computed color matches the expected value below.

- [ ] **Primary Blue**: #1a5a96 (Ontario Blue) - `--ontario-colour-primary`
- [ ] **Focus Color**: #009ADB (Cyan) - `--ontario-colour-focus`
- [ ] **Error Red**: #CD0000 - `--ontario-colour-error`
- [ ] **Success Green**: #118847 - `--ontario-colour-success`
- [ ] **Warning Yellow**: #FFC107 - `--ontario-colour-warning`
- [ ] **Text Color**: #1A1A1A (near-black) - `--ontario-colour-black`
- [ ] **Background**: #FFFFFF (white) - `--ontario-colour-white`
- [ ] **Border Gray**: #CCCCCC - `--ontario-greyscale-20`
- [ ] **Link Blue**: #0066CC - `--ontario-colour-link`

### Spacing

- [ ] Uses 8px grid system
- [ ] Consistent padding/margins per Ontario DS specs
- [ ] Proper spacing between form elements (24px minimum)

### Components Match Ontario DS

For each component, verify visual match:

| Component  | Check Against                                                  |
| ---------- | -------------------------------------------------------------- |
| Buttons    | https://designsystem.ontario.ca/components/buttons.html        |
| Text Input | https://designsystem.ontario.ca/components/text-inputs.html    |
| Dropdown   | https://designsystem.ontario.ca/components/dropdown-lists.html |
| Checkbox   | https://designsystem.ontario.ca/components/checkboxes.html     |
| Radio      | https://designsystem.ontario.ca/components/radio-buttons.html  |
| Accordion  | https://designsystem.ontario.ca/components/accordions.html     |
| Callout    | https://designsystem.ontario.ca/components/callouts.html       |
| Card       | https://designsystem.ontario.ca/components/cards.html          |
| Table      | https://designsystem.ontario.ca/components/tables.html         |

---

## Accessibility Testing Checklist

### WCAG 2.1 Level AA Requirements

#### Perceivable (1.x)

- [ ] **1.1.1 Non-text Content**: All images have alt text
- [ ] **1.3.1 Info and Relationships**: Form labels properly associated
- [ ] **1.3.2 Meaningful Sequence**: Logical reading order
- [ ] **1.3.3 Sensory Characteristics**: Instructions don't rely on shape/color alone
- [ ] **1.3.4 Orientation**: Works in portrait and landscape
- [ ] **1.3.5 Identify Input Purpose**: Autocomplete attributes on form fields
- [ ] **1.4.1 Use of Color**: Information not conveyed by color alone
- [ ] **1.4.3 Contrast (Minimum)**: 4.5:1 for normal text, 3:1 for large text
- [ ] **1.4.4 Resize Text**: Content readable at 200% zoom
- [ ] **1.4.10 Reflow**: No horizontal scrolling at 320px width
- [ ] **1.4.11 Non-text Contrast**: UI elements have 3:1 contrast
- [ ] **1.4.12 Text Spacing**: Content works with increased spacing
- [ ] **1.4.13 Content on Hover/Focus**: Tooltips dismissible and persistent

#### Operable (2.x)

- [ ] **2.1.1 Keyboard**: All functionality keyboard accessible
- [ ] **2.1.2 No Keyboard Trap**: Can tab out of all components
- [ ] **2.1.4 Character Key Shortcuts**: Single-key shortcuts can be disabled
- [ ] **2.4.1 Bypass Blocks**: Skip links present
- [ ] **2.4.2 Page Titled**: Descriptive page titles
- [ ] **2.4.3 Focus Order**: Logical tab order
- [ ] **2.4.4 Link Purpose**: Links describe destination
- [ ] **2.4.6 Headings and Labels**: Descriptive headings
- [ ] **2.4.7 Focus Visible**: Clear focus indicators (3px outline)
- [ ] **2.5.1 Pointer Gestures**: Complex gestures have alternatives
- [ ] **2.5.2 Pointer Cancellation**: Actions on mouse up, not down
- [ ] **2.5.3 Label in Name**: Visible label matches accessible name
- [ ] **2.5.4 Motion Actuation**: Motion-based actions have alternatives

#### Understandable (3.x)

- [ ] **3.1.1 Language of Page**: `lang` attribute set
- [ ] **3.1.2 Language of Parts**: Language changes marked
- [ ] **3.2.1 On Focus**: No unexpected context changes on focus
- [ ] **3.2.2 On Input**: No unexpected changes on input
- [ ] **3.3.1 Error Identification**: Errors clearly described
- [ ] **3.3.2 Labels or Instructions**: Form fields have labels
- [ ] **3.3.3 Error Suggestion**: Error messages suggest fixes
- [ ] **3.3.4 Error Prevention**: Confirmation for important actions

#### Robust (4.x)

- [ ] **4.1.1 Parsing**: Valid HTML
- [ ] **4.1.2 Name, Role, Value**: ARIA properly implemented
- [ ] **4.1.3 Status Messages**: Status changes announced

### Screen Reader Testing

For each component, test with VoiceOver (Mac) or NVDA (Windows):

- [ ] Component name announced correctly
- [ ] Role announced (button, textbox, combobox, etc.)
- [ ] State announced (expanded, selected, checked, etc.)
- [ ] Error messages announced immediately
- [ ] Required field status announced
- [ ] Hints/help text associated and announced
- [ ] Live regions announce dynamic changes

### Keyboard Testing

| Key        | Expected Behavior                         |
| ---------- | ----------------------------------------- |
| Tab        | Move to next focusable element            |
| Shift+Tab  | Move to previous focusable element        |
| Enter      | Activate buttons/links                    |
| Space      | Toggle checkboxes, activate buttons       |
| Arrow keys | Navigate within component (radio, select) |
| Escape     | Close modals, dropdowns                   |
| Home/End   | Jump to first/last item in lists          |

### Tab Pattern Testing (WCAG 2.1)

For components using the ARIA tab pattern (Site Selector, Discharge Point Selector):

| Requirement                 | Expected Behavior                                     |
| --------------------------- | ----------------------------------------------------- |
| **role="tablist"**          | Container has tablist role                            |
| **role="tab"**              | Each tab has tab role                                 |
| **aria-selected**           | Active tab has `aria-selected="true"`                 |
| **aria-controls**           | Each tab references its panel via aria-controls       |
| **aria-label**              | Tablist has descriptive aria-label                    |
| **Roving tabindex**         | Active tab has `tabindex="0"`, others `tabindex="-1"` |
| **Arrow navigation**        | Left/Right arrows move between tabs                   |
| **Home/End**                | Jump to first/last tab                                |
| **Focus follows selection** | Focus moves to newly selected tab                     |

### Modal Accessibility Testing

For modal dialogs (sfGpsDsCaOnModal):

| Requirement           | Expected Behavior                       |
| --------------------- | --------------------------------------- |
| **role="dialog"**     | Dialog has correct role                 |
| **aria-modal="true"** | Modal behavior indicated                |
| **aria-labelledby**   | Points to unique title ID               |
| **aria-describedby**  | Points to content container             |
| **Unique IDs**        | Multiple modals have unique IDs         |
| **Focus trapping**    | Tab cycles within modal                 |
| **Escape to close**   | Escape key closes modal                 |
| **Close button**      | Has dynamic aria-label with modal title |
| **Body scroll lock**  | Background scroll disabled when open    |
| **Focus restoration** | Focus returns to trigger on close       |

### Form Input Accessibility Testing

For grouped form inputs (Coordinate Input):

| Requirement          | Expected Behavior                    |
| -------------------- | ------------------------------------ |
| **fieldset/legend**  | Related inputs grouped with fieldset |
| **aria-describedby** | Inputs linked to hint text           |
| **aria-required**    | Required state announced             |
| **role="alert"**     | Errors use alert role                |
| **aria-live**        | Dynamic errors announced             |
| **aria-hidden**      | Decorative symbols hidden            |

### Live Region Testing

For components with dynamic updates (Site Selector, Discharge Point Selector):

| Requirement               | Expected Behavior                       |
| ------------------------- | --------------------------------------- |
| **aria-live="assertive"** | Important updates announced immediately |
| **aria-atomic="true"**    | Entire region announced                 |
| **Screen reader**         | Updates announced without focus change  |

---

## Functional Testing Checklist

### Form Components

- [ ] **Text Input**
  - [ ] Value updates on input
  - [ ] Blur event fires correctly
  - [ ] Validation triggers appropriately
  - [ ] Character count updates (if enabled)
  - [ ] Read-only state prevents editing

- [ ] **Textarea**
  - [ ] Multi-line input works
  - [ ] Character limit enforced
  - [ ] Auto-resize works (if enabled)

- [ ] **Dropdown/Select**
  - [ ] Options display correctly
  - [ ] Selection updates value
  - [ ] Placeholder shows when empty
  - [ ] Disabled state prevents interaction

- [ ] **Checkbox/Radio**
  - [ ] Click toggles state
  - [ ] Keyboard selection works
  - [ ] Group validation works
  - [ ] Required validation enforced

- [ ] **Date Input**
  - [ ] Date format matches Ontario standard (YYYY-MM-DD)
  - [ ] Invalid dates rejected
  - [ ] Min/max dates enforced

- [ ] **Typeahead/Lookup**
  - [ ] Search triggers on input
  - [ ] Options filter correctly
  - [ ] Selection populates field
  - [ ] Loading state displays
  - [ ] No results message shows

### Navigation Components

- [ ] **Accordion**
  - [ ] Expand/collapse works
  - [ ] Multiple expand mode works (if configured)
  - [ ] Animation smooth
  - [ ] State persists (if configured)

- [ ] **Breadcrumbs**
  - [ ] Links navigate correctly
  - [ ] Current page not linked
  - [ ] Truncation works on long paths

- [ ] **Back Button**
  - [ ] Navigates to previous page
  - [ ] URL override works

- [ ] **Step Indicator**
  - [ ] Shows current step
  - [ ] Progress percentage accurate
  - [ ] Step count correct

---

## Responsive Design Checklist

### Breakpoints (Ontario DS)

| Breakpoint | Width          | Test At                |
| ---------- | -------------- | ---------------------- |
| Mobile     | < 640px        | 320px, 375px, 414px    |
| Tablet     | 640px - 1024px | 768px, 1024px          |
| Desktop    | > 1024px       | 1280px, 1440px, 1920px |

### Mobile Testing

- [ ] Touch targets minimum 44x44px
- [ ] No horizontal scrolling
- [ ] Text readable without zooming
- [ ] Forms usable on small screens
- [ ] Modals/dropdowns fit viewport
- [ ] Navigation accessible

### Tablet Testing

- [ ] Layout adapts appropriately
- [ ] Touch and mouse both work
- [ ] Landscape orientation works

### Desktop Testing

- [ ] Content doesn't stretch too wide
- [ ] Whitespace appropriate
- [ ] Multi-column layouts work

---

## Browser Compatibility Checklist

### Required Browsers (Ontario Standard)

| Browser | Version           | Platform       |
| ------- | ----------------- | -------------- |
| Chrome  | Latest 2 versions | Windows, macOS |
| Firefox | Latest 2 versions | Windows, macOS |
| Safari  | Latest 2 versions | macOS, iOS     |
| Edge    | Latest 2 versions | Windows        |

### Testing Points

- [ ] Visual rendering matches
- [ ] JavaScript functionality works
- [ ] CSS Grid/Flexbox supported
- [ ] Custom properties (CSS variables) work
- [ ] Web Components render (lwc:external)
- [ ] Form validation works
- [ ] Focus indicators visible

---

## New Component Testing Checklists

### Modal Component (sfGpsDsCaOnModal)

- [ ] **Rendering**
  - [ ] Modal hidden when isOpen is false
  - [ ] Modal visible when isOpen is true
  - [ ] Title renders in header
  - [ ] Header hidden when hideHeader is true
  - [ ] Footer hidden when hideFooter is true
  - [ ] Close button hidden when hideCloseButton is true
  - [ ] Size classes apply correctly (small, medium, large, full)

- [ ] **Keyboard Navigation**
  - [ ] Escape key closes modal
  - [ ] Tab key cycles through focusable elements
  - [ ] Shift+Tab cycles backwards
  - [ ] Focus trapped within modal

- [ ] **Accessibility**
  - [ ] role="dialog" present
  - [ ] aria-modal="true" present
  - [ ] aria-labelledby points to title
  - [ ] Close button has aria-label
  - [ ] Body scroll locked when open
  - [ ] Focus returns to trigger on close

- [ ] **Ontario DS Compliance**
  - [ ] Dark header background (#1a5a96 or similar)
  - [ ] 3px focus outline on focusable elements
  - [ ] White text on dark header

---

### Coordinate Input Component (sfGpsDsCaOnCoordinateInput)

- [ ] **Format Rendering**
  - [ ] DMS format renders by default
  - [ ] UTM format renders when format="utm"
  - [ ] Decimal format renders when format="decimal"
  - [ ] Format switches dynamically

- [ ] **UTM Validation**
  - [ ] Zone validates 1-60 range
  - [ ] East validates numeric
  - [ ] North validates numeric
  - [ ] Valid coordinates accepted

- [ ] **DMS Validation**
  - [ ] Degrees validate 0-90 (lat) / 0-180 (lng)
  - [ ] Minutes validate 0-59
  - [ ] Seconds validate 0-59
  - [ ] Direction (N/S/E/W) handled correctly

- [ ] **Decimal Validation**
  - [ ] Latitude validates -90 to 90
  - [ ] Longitude validates -180 to 180
  - [ ] Decimal precision preserved

- [ ] **Conversion**
  - [ ] DMS to Decimal accurate
  - [ ] Negative longitude (West) handled
  - [ ] toDecimal() returns correct values

- [ ] **Accessibility**
  - [ ] All inputs have labels
  - [ ] Error messages have role="alert"
  - [ ] Required fields marked with aria-required
  - [ ] Disabled state applied correctly

---

### Selectable Card Component (sfGpsDsCaOnSelectableCard)

- [ ] **Rendering**
  - [ ] Label displays correctly
  - [ ] Description displays correctly
  - [ ] Multi-line descriptions preserve newlines
  - [ ] Checkbox input present

- [ ] **Selection**
  - [ ] Checked state reflects correctly
  - [ ] Select event fires on click
  - [ ] Event detail contains value and checked
  - [ ] Disabled state prevents selection

- [ ] **Badge**
  - [ ] Badge renders when provided
  - [ ] Badge hidden when not provided
  - [ ] Success variant applies green background
  - [ ] Info variant applies blue background (default)
  - [ ] Warning variant applies appropriate styling
  - [ ] Error variant applies red background

- [ ] **Link**
  - [ ] Link renders when linkLabel and linkUrl provided
  - [ ] Link not rendered when either is missing
  - [ ] Link click does not toggle selection

- [ ] **Accessibility**
  - [ ] Checkbox has associated label
  - [ ] Checkbox disabled when card disabled
  - [ ] Focus indicator visible
  - [ ] Badge has sufficient color contrast (4.5:1)

- [ ] **Ontario DS Compliance**
  - [ ] Uses ontario-checkboxes styling
  - [ ] 3px focus outline
  - [ ] Proper checkbox indicator

---

### Site Selector Tool Component (sfGpsDsCaOnSiteSelectorTool)

- [ ] **Rendering**
  - [ ] Trigger button renders
  - [ ] Modal opens on button click
  - [ ] Modal has correct title
  - [ ] Iframe renders when vfPageUrl provided
  - [ ] Placeholder shows when vfPageUrl missing

- [ ] **Tab Navigation**
  - [ ] Tab bar renders
  - [ ] Search tab active by default
  - [ ] Tabs switch on click
  - [ ] aria-selected updates correctly

- [ ] **Search**
  - [ ] Search input renders
  - [ ] Search button renders
  - [ ] Clear button renders

- [ ] **postMessage**
  - [ ] Origin validated on incoming messages
  - [ ] Invalid origins rejected
  - [ ] Address data received correctly
  - [ ] goTo messages handled

- [ ] **Save Action**
  - [ ] Save button renders
  - [ ] addressselected event fires on save
  - [ ] Modal closes after save

- [ ] **Accessibility**
  - [ ] Tab bar has role="tablist"
  - [ ] Tabs have role="tab"
  - [ ] aria-selected on active tab
  - [ ] Search input has label/aria-label

- [ ] **LWR/LWS Compatibility**
  - [ ] Uses computed properties (not template negation)
  - [ ] Event listeners cleaned up on disconnect

---

### Discharge Point Selector Component (sfGpsDsCaOnDischargePointSelector)

- [ ] **Rendering**
  - [ ] Trigger button renders with correct label
  - [ ] Modal opens with "Source" title
  - [ ] Search method dropdown renders
  - [ ] Coordinate format dropdown renders when coordinates selected
  - [ ] Coordinate input renders

- [ ] **Coordinate Formats**
  - [ ] UTM format selectable
  - [ ] DMS format selectable
  - [ ] Decimal format selectable
  - [ ] Format switch preserves entered data (if possible)

- [ ] **Continue Action**
  - [ ] Continue button renders
  - [ ] Validation runs before continue
  - [ ] continue event fires with coordinate data
  - [ ] Modal closes after continue

- [ ] **postMessage**
  - [ ] Coordinates sent to map on search
  - [ ] Marker placed on map
  - [ ] Reverse geocode triggered

---

### Activity Status Card Component (sfGpsDsCaOnActivityStatusCard)

- [ ] **Rendering**
  - [ ] Activity name displays
  - [ ] Activity type displays
  - [ ] Status badge displays
  - [ ] Progress indicator displays (X of Y)
  - [ ] Last updated displays

- [ ] **Remove Action**
  - [ ] Remove link hidden when allowRemove is false
  - [ ] Remove link visible when allowRemove is true
  - [ ] remove event fires on click
  - [ ] Event detail contains activityId and activityName

- [ ] **Accessibility**
  - [ ] Status announced to screen readers
  - [ ] Remove link has accessible name
  - [ ] Progress uses role="status"

---

### NAICS Code Picker Component (sfGpsDsCaOnNaicsCodePicker)

- [ ] **Cascading Selection**
  - [ ] Level 1 (Sector) loads on init
  - [ ] Level 2 loads when Level 1 selected
  - [ ] Level 3 loads when Level 2 selected
  - [ ] Level 4 loads when Level 3 selected
  - [ ] Level 5 loads when Level 4 selected

- [ ] **Selection**
  - [ ] Change event fires with full code
  - [ ] Clear resets all levels
  - [ ] Output includes code and label

- [ ] **Accessibility**
  - [ ] Each dropdown has label
  - [ ] Loading state announced
  - [ ] Selection announced

---

### Site Task Card Component (sfGpsDsCaOnSiteTaskCard)

- [ ] **Rendering**
  - [ ] Site name displays in header
  - [ ] Site address displays
  - [ ] Tasks list renders
  - [ ] Progress summary displays (X of Y completed)

- [ ] **Task Status**
  - [ ] Complete tasks show checkmark
  - [ ] In-progress tasks show appropriate indicator
  - [ ] Not-started tasks show empty indicator

- [ ] **Remove Action**
  - [ ] Remove link hidden when allowRemove is false
  - [ ] Remove link visible when allowRemove is true
  - [ ] remove event fires on click

---

## OmniScript Integration Checklist

### Component Registration

- [ ] Component appears in OmniScript Designer
- [ ] Component configurable in property panel
- [ ] Component renders in preview
- [ ] Component renders in runtime

### Data Binding

- [ ] Value syncs with OmniScript data
- [ ] `applyCallResp()` updates data correctly
- [ ] Formula fields work
- [ ] Conditional visibility works
- [ ] Repeat functionality works

### Validation

- [ ] Required validation enforces
- [ ] Pattern validation works
- [ ] Custom validation messages display
- [ ] Errors block navigation (if configured)

### Styling

- [ ] Ontario DS styles apply
- [ ] No SLDS style conflicts
- [ ] Custom CSS overrides work
- [ ] Light DOM compatibility (LWR)

### New OmniStudio Form Components

#### sfGpsDsCaOnFormSelectableCards

- [ ] Multi-select options render as cards
- [ ] Extended options (JSON) apply correctly
- [ ] Badges display with correct variants
- [ ] Links render and navigate correctly
- [ ] Selection updates OmniScript data
- [ ] Required validation works

#### sfGpsDsCaOnFormNaicsCodePicker

- [ ] Cascading dropdowns load correctly
- [ ] Selection updates OmniScript data
- [ ] Clear action resets picker
- [ ] Required validation works
- [ ] DataRaptor integration works

#### sfGpsDsCaOnFormSiteSelectorTool

- [ ] Button triggers modal
- [ ] ESRI map loads in iframe
- [ ] Address search works
- [ ] Address selection updates OmniScript data
- [ ] Flattened fields output correctly
- [ ] Required validation works

#### sfGpsDsCaOnFormDischargePointSelector

- [ ] Button triggers modal
- [ ] Coordinate format selection works
- [ ] Coordinate entry validates
- [ ] Selection updates OmniScript data
- [ ] UTM coordinates output correctly
- [ ] Required validation works

---

## Apex Test Coverage

### Required Test Classes

| Apex Class                          | Test Class                              | Coverage Goal |
| ----------------------------------- | --------------------------------------- | ------------- |
| `sfGpsDsCaOnSiteSelectorCtr`        | `sfGpsDsCaOnSiteSelectorCtrTest`        | 85%+          |
| `SfGpsDsCaOnNotificationController` | `SfGpsDsCaOnNotificationControllerTest` | 85%+          |
| `SfGpsDsCaOnSearchController`       | `SfGpsDsCaOnSearchControllerTest`       | 85%+          |
| `SfGpsDsCaOnTaskController`         | `SfGpsDsCaOnTaskControllerTest`         | 85%+          |

### sfGpsDsCaOnSiteSelectorCtr Test Cases

- [ ] Constructor with default values
- [ ] Constructor with URL parameters
- [ ] Constructor with partial URL parameters
- [ ] fetchCommunityURL returns valid URL
- [ ] fetchVFDomainURL returns VF domain
- [ ] Missing custom metadata handled gracefully
- [ ] Empty URL parameters handled
- [ ] checkResourceExists works correctly

---

## Testing Workflow

### 1. Component Development Testing

```bash
# Run local dev server (if available)
npm run start

# Run unit tests
npm run test

# Run specific test file
npm run test -- sfGpsDsCaOnModal.test.js

# Run tests with coverage
npm run test -- --coverage

# Run lint checks
npm run lint
```

### 1b. LWC Unit Tests

The project includes Jest-based unit tests in `sfGpsDsCaOn/__tests__/`:

| Test File                                   | Component                | Coverage                                               |
| ------------------------------------------- | ------------------------ | ------------------------------------------------------ |
| `sfGpsDsCaOnModal.test.js`                  | Modal                    | Rendering, keyboard, unique IDs, aria-describedby      |
| `sfGpsDsCaOnCoordinateInput.test.js`        | Coordinate Input         | Formats, validation, fieldset/legend, aria-describedby |
| `sfGpsDsCaOnSelectableCard.test.js`         | Selectable Card          | Selection, badge, link                                 |
| `sfGpsDsCaOnSiteSelectorTool.test.js`       | Site Selector            | Tabs, arrow keys, live regions, postMessage            |
| `sfGpsDsCaOnDischargePointSelector.test.js` | Discharge Point Selector | Tabs, arrow keys, coordinates, live regions            |
| `sfGpsDsCaOnTextInput.test.js`              | Text Input               | Input handling, validation                             |
| `sfGpsDsCaOnFormTypeahead.test.js`          | Typeahead                | Autocomplete, selection                                |

```bash
# Run all sfGpsDsCaOn tests
cd sfGpsDsCaOn
npm run test

# Run with watch mode
npm run test -- --watch
```

### 1c. Apex Unit Tests

```bash
# Deploy and run tests
sf apex run test --class-names sfGpsDsCaOnSiteSelectorCtrTest --result-format human --code-coverage

# Run all tests with coverage
sf apex run test --test-level RunLocalTests --code-coverage --result-format human

# Get test results
sf apex get test --test-run-id <testRunId>
```

### 2. Accessibility Audit

```bash
# Run axe-core on page
npx axe <url>

# Run Pa11y
npx pa11y <url> --standard WCAG2AA

# Run Lighthouse
# Use Chrome DevTools > Lighthouse
```

### 3. Visual Regression

```bash
# If using Percy
npx percy exec -- npm run test:visual

# If using Chromatic (Storybook)
npx chromatic --project-token=<token>
```

### 4. Manual Testing Checklist

1. Open component in browser
2. Run axe DevTools extension
3. Run WAVE extension
4. Test with keyboard only (no mouse)
5. Test with screen reader (VoiceOver/NVDA)
6. Test at 200% zoom
7. Test at 320px width
8. Test in each required browser
9. Compare visually to Ontario DS docs

---

## Reporting Issues

When reporting compliance issues, include:

1. **Component name**
2. **WCAG criterion violated** (e.g., 1.4.3 Contrast)
3. **Steps to reproduce**
4. **Expected behavior**
5. **Actual behavior**
6. **Screenshots/recordings**
7. **Browser/device info**
8. **Severity** (Critical/High/Medium/Low)

---

## Resources

### Internal Documentation

- [COMPONENT_TEST_CHECKLIST.md](./COMPONENT_TEST_CHECKLIST.md) - Detailed per-component test cases
- [COMPONENT_API.md](./COMPONENT_API.md) - Component properties reference
- [GIS_GUIDE.md](./GIS_GUIDE.md) - GIS components (Site Selector, Discharge Point)
- [OMNISTUDIO_FORMS.md](./OMNISTUDIO_FORMS.md) - OmniStudio form components
- [LWR_GUIDE.md](./LWR_GUIDE.md) - LWR/LWS patterns and best practices

### External Documentation

- [Ontario Design System](https://designsystem.ontario.ca)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [AODA Web Standards](https://www.ontario.ca/page/how-make-websites-accessible)
- [axe-core Documentation](https://www.deque.com/axe/)
- [WebAIM Resources](https://webaim.org/resources/)
- [Salesforce LWC Accessibility](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.accessibility)
- [Salesforce Apex Testing](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_testing.htm)
- [LWC Jest Testing](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.testing)
