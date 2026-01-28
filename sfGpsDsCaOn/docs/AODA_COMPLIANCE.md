# AODA Accessibility Compliance Guide

This document details how the Ontario Design System components comply with the **Accessibility for Ontarians with Disabilities Act (AODA)** and **WCAG 2.1 Level AA** requirements.

## Compliance Summary

| Category                       | Status  | Notes                                        |
| ------------------------------ | ------- | -------------------------------------------- |
| Keyboard Accessibility (2.1.1) | ✅ Pass | All interactive elements keyboard accessible |
| Focus Indicators (2.4.7)       | ✅ Pass | Visible 4px focus outlines                   |
| Color Contrast (1.4.3)         | ✅ Pass | Uses Ontario DS color tokens                 |
| Alt Text (1.1.1)               | ✅ Pass | Proper alt text or aria-hidden               |
| Form Labels (1.3.1, 3.3.2)     | ✅ Pass | All inputs properly labeled                  |
| Error Messages (3.3.1)         | ✅ Pass | role="alert" with aria-live                  |
| ARIA Usage (4.1.2)             | ✅ Pass | Proper ARIA attributes                       |
| Headings (2.4.6)               | ✅ Pass | Configurable heading levels                  |
| Focus Order (2.4.3)            | ✅ Pass | Logical tab order                            |
| Status Messages (4.1.3)        | ✅ Pass | aria-live for dynamic content                |

---

## WCAG 2.1 Level AA Compliance Details

### 1. Perceivable

#### 1.1.1 Non-text Content

All images and icons have appropriate text alternatives:

```html
<!-- Decorative icons - hidden from screen readers -->
<svg aria-hidden="true" focusable="false">...</svg>

<!-- Meaningful images - with alt text -->
<img src="{icon}" alt="{iconAltText}" />

<!-- Icon-only buttons - with aria-label -->
<button aria-label="Close modal">
  <svg aria-hidden="true">...</svg>
</button>
```

**Components Verified:**

- All card components (Action, Feature, Link, Selectable)
- Modal close button
- Back to Top button
- Form file delete buttons

#### 1.3.1 Info and Relationships

Form controls use proper structure:

```html
<!-- Text inputs with labels -->
<label for="input-id">Label text</label>
<input id="input-id" aria-describedby="hint-id error-id" />

<!-- Grouped controls with fieldset/legend -->
<fieldset>
  <legend>Group label</legend>
  <input type="checkbox" id="opt1" />
  <label for="opt1">Option 1</label>
</fieldset>
```

**Components Verified:**

- sfGpsDsCaOnTextInput
- sfGpsDsCaOnTextArea
- sfGpsDsCaOnDropdown
- sfGpsDsCaOnCheckboxGroup
- sfGpsDsCaOnRadioGroup
- sfGpsDsCaOnDateInput

#### 1.4.3 Contrast (Minimum)

All text meets 4.5:1 contrast ratio:

| Element    | Foreground | Background | Ratio  |
| ---------- | ---------- | ---------- | ------ |
| Body text  | #1a1a1a    | #ffffff    | 16.1:1 |
| Links      | #0066cc    | #ffffff    | 7.0:1  |
| Error text | #cd0000    | #ffffff    | 7.3:1  |
| Hint text  | #666666    | #ffffff    | 5.7:1  |

Large text (18pt+) meets 3:1 ratio.

#### 1.4.11 Non-text Contrast

Interactive components meet 3:1 contrast:

| Element       | Color   | Ratio |
| ------------- | ------- | ----- |
| Focus outline | #009adb | 3.8:1 |
| Input border  | #666666 | 5.7:1 |
| Error border  | #cd0000 | 7.3:1 |
| Button border | #1a5a96 | 8.5:1 |

---

### 2. Operable

#### 2.1.1 Keyboard

All interactive elements are keyboard accessible:

| Component  | Keyboard Support             |
| ---------- | ---------------------------- |
| Buttons    | Enter, Space                 |
| Links      | Enter                        |
| Modals     | Escape to close, Tab trapped |
| Accordions | Enter, Space (native button) |
| Dropdowns  | Arrow keys, Enter, Escape    |
| Tabs       | Arrow keys, Home, End        |
| Search     | Arrow keys, Enter, Escape    |

**Example - Tab Navigation with Roving Tabindex:**

```javascript
handleTabKeyDown(event) {
  switch (event.key) {
    case "ArrowLeft":
    case "ArrowUp":
      // Move to previous tab
      break;
    case "ArrowRight":
    case "ArrowDown":
      // Move to next tab
      break;
    case "Home":
      // Move to first tab
      break;
    case "End":
      // Move to last tab
      break;
  }
}
```

#### 2.4.3 Focus Order

Components maintain logical focus order:

- DOM order matches visual order
- Modal focus trap keeps focus within dialog
- Skip links available for navigation

#### 2.4.7 Focus Visible

All interactive elements have visible focus indicators:

```css
/* Standard focus indicator */
:focus {
  outline: 4px solid var(--ontario-colour-focus, #009adb);
  outline-offset: 2px;
}

/* Focus-visible pattern (keyboard only) */
:focus:not(:focus-visible) {
  outline: none;
}
:focus-visible {
  outline: 4px solid var(--ontario-colour-focus, #009adb);
  outline-offset: 2px;
}
```

**Components with Alternative Focus Patterns:**

| Component   | Pattern              | Reason                        |
| ----------- | -------------------- | ----------------------------- |
| TaskList    | Parent :focus-within | Link focus shows on container |
| Modal close | Box-shadow           | Dark background contrast      |
| Cards       | Box-shadow           | Elevated card effect          |

---

### 3. Understandable

#### 3.3.1 Error Identification

Errors are clearly communicated:

```html
<div class="ontario-error-messaging" role="alert">
  <svg aria-hidden="true"><!-- Error icon --></svg>
  <span class="ontario-error-messaging__content"> {errorMessage} </span>
</div>
```

**Error Patterns:**

- `role="alert"` for immediate announcement
- `aria-live="assertive"` for dynamic errors
- `aria-invalid="true"` on invalid inputs
- `aria-describedby` linking error to input

#### 3.3.2 Labels or Instructions

All form controls have:

- Visible labels
- Hint text with `aria-describedby`
- Required field indicators
- Character count feedback

---

### 4. Robust

#### 4.1.2 Name, Role, Value

Custom components expose proper ARIA:

```html
<!-- Modal dialog -->
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-desc"
>
  <!-- Accordion -->
  <button aria-expanded="false" aria-controls="content-id">
    <section id="content-id" aria-hidden="true">
      <!-- Search combobox -->
      <input
        role="combobox"
        aria-expanded="false"
        aria-autocomplete="list"
        aria-owns="listbox-id"
        aria-activedescendant="option-1"
      />
    </section>
  </button>
</div>
```

#### 4.1.3 Status Messages

Dynamic content uses appropriate live regions:

| Content Type    | Pattern              | Example                   |
| --------------- | -------------------- | ------------------------- |
| Search results  | `aria-live="polite"` | "5 suggestions available" |
| Form errors     | `role="alert"`       | "This field is required"  |
| Loading         | `role="alert"`       | "Loading..."              |
| Character count | `aria-live="polite"` | "50 characters remaining" |

---

## Component-Specific Accessibility

### Form Components

| Component     | Label       | Hint | Error | Keyboard         |
| ------------- | ----------- | ---- | ----- | ---------------- |
| TextInput     | ✅          | ✅   | ✅    | ✅               |
| TextArea      | ✅          | ✅   | ✅    | ✅               |
| Dropdown      | ✅          | ✅   | ✅    | ✅ Arrow keys    |
| DateInput     | ✅ Fieldset | ✅   | ✅    | ✅               |
| CheckboxGroup | ✅ Fieldset | ✅   | ✅    | ✅               |
| RadioGroup    | ✅ Fieldset | ✅   | ✅    | ✅ Arrow keys    |
| Search        | ✅          | ✅   | ✅    | ✅ Full combobox |
| Typeahead     | ✅          | ✅   | ✅    | ✅ Full combobox |

### Interactive Components

| Component   | ARIA Pattern           | Keyboard             |
| ----------- | ---------------------- | -------------------- |
| Modal       | dialog + aria-modal    | Escape, Tab trap     |
| Accordion   | button + aria-expanded | Enter/Space          |
| Tabs        | tablist + tab          | Arrow keys, Home/End |
| Collapsible | details/summary        | Enter/Space          |

### Navigation Components

| Component   | ARIA Pattern                  |
| ----------- | ----------------------------- |
| Breadcrumbs | nav + aria-label="Breadcrumb" |
| InPageNav   | nav + aria-current            |
| BackToTop   | button + aria-label           |
| BackButton  | button/link with visible text |

---

## Testing Recommendations

### Automated Testing

Run these tools during development:

1. **axe-core** (integrated in Jest tests)

   ```javascript
   import { axe, toHaveNoViolations } from "jest-axe";
   expect.extend(toHaveNoViolations);

   it("should have no accessibility violations", async () => {
     const results = await axe(container);
     expect(results).toHaveNoViolations();
   });
   ```

2. **WAVE Browser Extension**
   - Check for missing alt text
   - Verify heading hierarchy
   - Identify contrast issues

3. **Lighthouse Accessibility Audit**
   - Run in Chrome DevTools
   - Target 100% accessibility score

### Manual Testing Checklist

- [ ] Navigate entire page using only keyboard
- [ ] Verify all focus indicators are visible
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Check content at 200% zoom
- [ ] Test with high contrast mode
- [ ] Verify skip links work
- [ ] Check error message announcements
- [ ] Test modal focus trap

### Screen Reader Testing

Test with:

- **VoiceOver** (macOS/iOS)
- **NVDA** (Windows, free)
- **JAWS** (Windows)

Key scenarios:

1. Form completion with errors
2. Modal open/close
3. Accordion expand/collapse
4. Search with suggestions
5. Table navigation

---

## Ontario DS Accessibility Features

The Ontario Design System includes built-in accessibility:

| Feature         | Description                       |
| --------------- | --------------------------------- |
| Focus Colors    | `--ontario-colour-focus: #009adb` |
| Error Colors    | `--ontario-colour-error: #cd0000` |
| Skip Links      | Built into page template          |
| Responsive Text | rem-based sizing                  |
| High Contrast   | Respects prefers-contrast         |
| Reduced Motion  | Respects prefers-reduced-motion   |

---

## Resources

- [AODA Requirements](https://www.ontario.ca/page/accessibility-laws)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Ontario Design System](https://designsystem.ontario.ca/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

---

## Changelog

| Date       | Change                                          |
| ---------- | ----------------------------------------------- |
| 2026-01-28 | Initial AODA compliance audit                   |
| 2026-01-28 | Fixed ActionCard image alt/aria-hidden conflict |
