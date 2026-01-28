# Ontario Design System Compliance Testing Guide

This guide outlines the tools, processes, and checklists for testing sfGpsDsCaOn components for compliance with the Ontario Design System (ODS) and AODA accessibility requirements.

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

| Tool | Purpose | How to Use |
|------|---------|------------|
| **axe DevTools** | Automated WCAG testing | Browser extension - run on each component |
| **WAVE** | Web accessibility evaluation | Browser extension or wave.webaim.org |
| **Lighthouse** | Accessibility audit in Chrome | DevTools > Lighthouse > Accessibility |
| **Pa11y** | CLI accessibility testing | `npx pa11y <url>` |
| **eslint-plugin-jsx-a11y** | Static analysis for a11y | Add to ESLint config |

### Screen Readers (Manual Testing)

| Tool | Platform | Notes |
|------|----------|-------|
| **VoiceOver** | macOS/iOS | Built-in, Cmd+F5 to enable |
| **NVDA** | Windows | Free, download from nvaccess.org |
| **JAWS** | Windows | Industry standard, commercial |
| **TalkBack** | Android | Built-in accessibility service |

### Visual Testing

| Tool | Purpose | How to Use |
|------|---------|------------|
| **Ontario DS Documentation** | Reference specification | https://designsystem.ontario.ca |
| **Figma Ontario DS Kit** | Design reference | Compare against design specs |
| **Percy/Chromatic** | Visual regression | Integrate with CI/CD |
| **Storybook** | Component isolation | Test components in isolation |

### Color & Contrast

| Tool | Purpose | How to Use |
|------|---------|------------|
| **WebAIM Contrast Checker** | WCAG contrast ratios | webaim.org/resources/contrastchecker |
| **Colour Contrast Analyser** | Desktop app | Download from TPGi |
| **Chrome DevTools** | Inspect contrast | Elements > Styles > color picker |

### Browser DevTools

| Feature | Purpose |
|---------|---------|
| **Accessibility Tree** | Inspect ARIA structure |
| **CSS Grid/Flexbox Inspector** | Verify layout |
| **Device Emulation** | Test responsive design |
| **Network Throttling** | Test performance |
| **Forced Colors Mode** | Test high contrast |

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

- [ ] **Primary Blue**: #1a5a96 (Ontario Blue)
- [ ] **Focus Color**: #009ACD (Cyan)
- [ ] **Error Red**: #D81A21
- [ ] **Success Green**: #118847
- [ ] **Warning Yellow**: #FEBA35
- [ ] **Text Color**: #1A1A1A (near-black)
- [ ] **Background**: #FFFFFF (white)
- [ ] **Border Gray**: #CCCCCC

### Spacing

- [ ] Uses 8px grid system
- [ ] Consistent padding/margins per Ontario DS specs
- [ ] Proper spacing between form elements (24px minimum)

### Components Match Ontario DS

For each component, verify visual match:

| Component | Check Against |
|-----------|---------------|
| Buttons | https://designsystem.ontario.ca/components/buttons.html |
| Text Input | https://designsystem.ontario.ca/components/text-inputs.html |
| Dropdown | https://designsystem.ontario.ca/components/dropdown-lists.html |
| Checkbox | https://designsystem.ontario.ca/components/checkboxes.html |
| Radio | https://designsystem.ontario.ca/components/radio-buttons.html |
| Accordion | https://designsystem.ontario.ca/components/accordions.html |
| Callout | https://designsystem.ontario.ca/components/callouts.html |
| Card | https://designsystem.ontario.ca/components/cards.html |
| Table | https://designsystem.ontario.ca/components/tables.html |

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

| Key | Expected Behavior |
|-----|-------------------|
| Tab | Move to next focusable element |
| Shift+Tab | Move to previous focusable element |
| Enter | Activate buttons/links |
| Space | Toggle checkboxes, activate buttons |
| Arrow keys | Navigate within component (radio, select) |
| Escape | Close modals, dropdowns |
| Home/End | Jump to first/last item in lists |

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

| Breakpoint | Width | Test At |
|------------|-------|---------|
| Mobile | < 640px | 320px, 375px, 414px |
| Tablet | 640px - 1024px | 768px, 1024px |
| Desktop | > 1024px | 1280px, 1440px, 1920px |

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

| Browser | Version | Platform |
|---------|---------|----------|
| Chrome | Latest 2 versions | Windows, macOS |
| Firefox | Latest 2 versions | Windows, macOS |
| Safari | Latest 2 versions | macOS, iOS |
| Edge | Latest 2 versions | Windows |

### Testing Points

- [ ] Visual rendering matches
- [ ] JavaScript functionality works
- [ ] CSS Grid/Flexbox supported
- [ ] Custom properties (CSS variables) work
- [ ] Web Components render (lwc:external)
- [ ] Form validation works
- [ ] Focus indicators visible

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

---

## Testing Workflow

### 1. Component Development Testing

```bash
# Run local dev server (if available)
npm run start

# Run unit tests
npm run test

# Run lint checks
npm run lint
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

- [Ontario Design System](https://designsystem.ontario.ca)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [AODA Web Standards](https://www.ontario.ca/page/how-make-websites-accessible)
- [axe-core Documentation](https://www.deque.com/axe/)
- [WebAIM Resources](https://webaim.org/resources/)
- [Salesforce LWC Accessibility](https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.accessibility)
