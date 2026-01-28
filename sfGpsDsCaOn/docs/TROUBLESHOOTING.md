# Ontario Design System - Troubleshooting Guide

This guide provides solutions for common issues encountered with Ontario Design System LWC components.

---

## Table of Contents

1. [Quick Diagnostics](#quick-diagnostics)
2. [Component Issues](#component-issues)
3. [OmniStudio Form Issues](#omnistudio-form-issues)
4. [GIS/Map Issues](#gismap-issues)
5. [API/Integration Issues](#apiintegration-issues)
6. [Styling Issues](#styling-issues)
7. [Accessibility Issues](#accessibility-issues)
8. [Performance Issues](#performance-issues)
9. [Deployment Issues](#deployment-issues)
10. [Error Codes Reference](#error-codes-reference)

---

## Quick Diagnostics

### Enable Debug Mode

Always start troubleshooting with debug mode enabled:

```javascript
// In browser console
window.sfGpsDsCaOnDebug = true;
// Reload the page
```

### Check for Console Errors

1. Open browser Developer Tools (F12)
2. Go to **Console** tab
3. Filter by "error" or "sfGpsDsCaOn"
4. Look for red error messages

### Verify Component Loading

```javascript
// Check if component is defined
console.log(document.querySelector("c-sf-gps-ds-ca-on-callout"));
```

### Network Requests

1. Go to **Network** tab in Developer Tools
2. Filter by "apex" for Apex controller calls
3. Check for failed requests (red)

---

## Component Issues

### Issue: Component Not Rendering

**Symptoms:**

- Blank space where component should be
- No error in console

**Causes & Solutions:**

| Cause                     | Solution                                            |
| ------------------------- | --------------------------------------------------- |
| Component not deployed    | Run `sf project deploy start -d sfGpsDsCaOn`        |
| Missing dependencies      | Check `js-meta.xml` for required LWC dependencies   |
| Incorrect target          | Verify component target matches page type           |
| Lightning Locker blocking | Check LWS compatibility (see LWR_BEST_PRACTICES.md) |

**Debug Steps:**

```javascript
// Check if LWC is registered
console.log(customElements.get("c-sf-gps-ds-ca-on-callout"));
```

### Issue: Modal Not Opening

**Symptoms:**

- Button click does nothing
- Modal stays closed

**Solutions:**

1. **Check event handlers:**

```javascript
// Verify button has onclick
document.querySelector(".ontario-button").onclick;
```

2. **Check modal state:**

```javascript
// In component debug
log.debug("Modal state", { isOpen: this._isModalOpen });
```

3. **Z-index conflict:** Add higher z-index to modal overlay.

### Issue: Dropdown Not Showing Options

**Symptoms:**

- Dropdown opens but shows no items
- "No options available" message

**Solutions:**

1. **Verify data binding:**

```javascript
// Check if options are populated
log.debug("Options", this.options);
```

2. **Check JSON format:**

```json
// Required format
[
  { "value": "opt1", "label": "Option 1" },
  { "value": "opt2", "label": "Option 2" }
]
```

3. **Check for async issues:** Ensure data loads before render.

### Issue: Accordion Not Expanding

**Symptoms:**

- Click on accordion header does nothing
- Chevron not rotating

**Solutions:**

1. **Verify HTML structure:**

```html
<!-- Each item needs unique key -->
<template for:each="{items}" for:item="item">
  <c-sf-gps-ds-ca-on-accordion-item key="{item.id}" ... />
</template>
```

2. **Check CSS conflicts:** Ontario DS accordion requires specific styles.

---

## OmniStudio Form Issues

### Issue: Field Value Not Saving

**Symptoms:**

- User enters value but it's lost on navigation
- OmniScript JSON doesn't contain field

**Solutions:**

1. **Verify merge field binding:**

```
%fieldName%
```

2. **Check applyCallResp is called:**

```javascript
log.debug("Applying value", this.value);
super.applyCallResp(this.value);
```

3. **Check OmniScript element name matches JSON path.**

### Issue: Validation Not Triggering

**Symptoms:**

- Required field doesn't show error
- Form allows submission with invalid data

**Solutions:**

1. **Check required property:**

```html
<c-sf-gps-ds-ca-on-form-text
  required
  error-message="This field is required"
></c-sf-gps-ds-ca-on-form-text>
```

2. **Verify step validation:**

```javascript
// In OmniScript
this._propSetMap.validationRules;
```

3. **Check custom validation:**

```javascript
this.checkValidity();
this.reportValidity();
```

### Issue: Typeahead Not Filtering

**Symptoms:**

- All options show regardless of input
- No filtering on keystrokes

**Solutions:**

1. **Check DataRaptor filter configuration:**
   - Input parameter: `searchTerm`
   - WHERE clause: `LIKE '%{searchTerm}%'`

2. **Verify debounce timing:**

```javascript
// Default is 300ms - user may be typing too fast
_debounceMs = 300;
```

3. **Check minimum characters:**

```javascript
// Some typeaheads require 2+ characters
if (searchTerm.length < 2) return;
```

### Issue: SelectableCards Not Dispatching Events

**Symptoms:**

- Card click doesn't update OmniScript
- No value change event

**Solutions:**

1. **Check event listener:**

```html
<c-sf-gps-ds-ca-on-form-selectable-cards
  onchange="{handleChange}"
></c-sf-gps-ds-ca-on-form-selectable-cards>
```

2. **Check single vs multi-select:**

```javascript
// For multi-select, value is array
value = ["option1", "option2"];
```

---

## GIS/Map Issues

### Issue: Map Not Loading

**Symptoms:**

- Blank white space in map area
- "Loading..." text stays forever

**Solutions:**

1. **Check CSP Trusted Sites:**
   - `https://js.arcgis.com`
   - `https://services.arcgisonline.com`
   - `https://basemaps.arcgis.com`

2. **Check Visualforce page is deployed:**

```
sfGpsDsCaOnSiteSelectorPage
sfGpsDsCaOnDischargePointSelectorPage
```

3. **Check vfPageUrl property:**

```html
<c-sf-gps-ds-ca-on-site-selector-tool
  vf-page-url="/apex/sfGpsDsCaOnSiteSelectorPage"
></c-sf-gps-ds-ca-on-site-selector-tool>
```

4. **Check iframe permissions:**

```javascript
// Visualforce must allow embedding
<apex:page ...>
```

### Issue: LIO Layers Not Loading

**Symptoms:**

- Base map shows but no Ontario layers
- 403 errors in network tab

**Solutions:**

1. **Check CSP for LIO:**
   - `https://ws.lioservices.lrc.gov.on.ca`

2. **Verify layer URLs are correct:**

```javascript
const LAYER_CONFIG = {
  MECP_DISTRICT:
    "https://ws.lioservices.lrc.gov.on.ca/arcgis1071a/rest/services/..."
};
```

3. **Check CORS:** LIO services may require proxy for cross-origin.

### Issue: postMessage Not Working

**Symptoms:**

- Map receives no commands from LWC
- Selection doesn't return to parent

**Solutions:**

1. **Check origin matching:**

```javascript
// In Visualforce page
window.parent.postMessage(data, "*");
```

2. **Verify event listener:**

```javascript
connectedCallback() {
  window.addEventListener('message', this._handleMessage);
}
disconnectedCallback() {
  window.removeEventListener('message', this._handleMessage);
}
```

3. **Check message format:**

```javascript
{
  title: "messageType",
  detail: { /* data */ }
}
```

---

## API/Integration Issues

### Issue: DecisionExplainer API Errors

**Symptoms:**

- "Failed to evaluate" error
- No decision explanation returned

**Solutions:**

1. **Check Named Credential:**
   - Name: `DecisionExplainer` (or as configured)
   - URL: `https://<your-domain>.my.salesforce.com`

2. **Check External Credential permissions:**
   - Permission Set assigned to running user

3. **Check Expression Set API Name:**

```javascript
expressionSetApiName = "YourExpressionSet_v1";
```

4. **Verify input variables:**

```javascript
inputVariables = '[{"name":"var1","value":"value1"}]';
```

### Issue: Integration Procedure Timeout

**Symptoms:**

- Request times out after 120s
- "Request Entity Too Large" error

**Solutions:**

1. **Optimize DataRaptor queries:**
   - Add LIMIT clauses
   - Index frequently filtered fields

2. **Split into multiple IPs:**
   - Use Continuation for long-running callouts

3. **Check bulkification:**

```apex
// Avoid SOQL in loops
for (Account a : accounts) {
  // BAD: Query in loop
  Contact[] contacts = [SELECT Id FROM Contact WHERE AccountId = :a.Id];
}
```

### Issue: NAICS Code Picker Not Loading Codes

**Symptoms:**

- Search returns no results
- Hierarchy doesn't expand

**Solutions:**

1. **Check custom metadata deployment:**

```
sfGpsDsCaOnNaicsCode__mdt
```

2. **Verify search controller:**

```apex
@AuraEnabled(cacheable=true)
public static List<NaicsCode> searchCodes(String searchTerm) {
  // Must use escapeSingleQuotes
}
```

---

## Styling Issues

### Issue: Components Look Unstyled

**Symptoms:**

- No Ontario DS colors
- Generic browser styling

**Solutions:**

1. **Check static resource deployment:**

```
sfGpsDsCaOnStyles
sfGpsDsCaOnComponents
```

2. **Verify CSS import:**

```css
@import url("/sfsites/c/resource/sfGpsDsCaOnStyles/ontario-design-system.min.css");
```

3. **Check for CSS variable support:**

```css
/* Fallback for older browsers */
color: var(--ontario-colour-black, #1a1a1a);
```

### Issue: Colors Don't Match Design System

**Symptoms:**

- Wrong blue, gold, or other colors
- Inconsistent theming

**Solutions:**

1. **Use CSS variables, not hex codes:**

```css
/* Correct */
color: var(--ontario-colour-primary);

/* Incorrect */
color: #0066cc;
```

2. **Check variable overrides:**

```css
:root {
  --ontario-colour-primary: #0066cc; /* Should match DS */
}
```

### Issue: Focus Indicators Not Visible

**Symptoms:**

- Can't see keyboard focus
- Fails accessibility audit

**Solutions:**

1. **Don't remove outlines:**

```css
/* BAD */
*:focus {
  outline: none;
}

/* GOOD */
*:focus {
  outline: 2px solid var(--ontario-colour-focus);
}
```

2. **Check contrast ratio:** Focus indicator needs 3:1 against background.

---

## Accessibility Issues

### Issue: Screen Reader Not Announcing Changes

**Symptoms:**

- Dynamic content changes silently
- Status messages not read

**Solutions:**

1. **Add live region:**

```html
<div aria-live="polite" aria-atomic="true">{statusMessage}</div>
```

2. **Use appropriate politeness:**
   - `polite` - Wait for pause in speech
   - `assertive` - Interrupt immediately (errors only)

### Issue: Keyboard Navigation Broken

**Symptoms:**

- Can't tab to element
- Arrow keys don't work in list

**Solutions:**

1. **Check tabindex:**

```html
<!-- Focusable -->
<div tabindex="0">...</div>

<!-- Not focusable -->
<div tabindex="-1">...</div>
```

2. **Add keyboard handlers:**

```javascript
handleKeyDown(event) {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    this.focusNextItem();
  }
}
```

### Issue: axe-core Reports Violations

**Symptoms:**

- Accessibility audit fails
- Specific WCAG violations

**Solutions:**

| Violation           | Fix                                   |
| ------------------- | ------------------------------------- |
| `button-name`       | Add visible text or aria-label        |
| `color-contrast`    | Increase text/background contrast     |
| `image-alt`         | Add alt text or aria-hidden="true"    |
| `label`             | Associate label with input via for/id |
| `aria-hidden-focus` | Remove aria-hidden or tabindex        |

---

## Performance Issues

### Issue: Slow Initial Load

**Symptoms:**

- Components take >3s to appear
- Spinner shows for long time

**Solutions:**

1. **Enable lazy loading:**

```javascript
import MyComponent from "c/myComponent";
// Instead of static import
```

2. **Defer non-critical components:**

```javascript
renderedCallback() {
  if (!this._initialized) {
    this._initialized = true;
    // Load heavy components after first render
    setTimeout(() => this.loadSecondaryComponents(), 100);
  }
}
```

3. **Use cacheable Apex:**

```apex
@AuraEnabled(cacheable=true)
public static List<Data> getData() { ... }
```

### Issue: Dropdown Lag on Type

**Symptoms:**

- Typing feels sluggish
- Options update slowly

**Solutions:**

1. **Increase debounce:**

```javascript
_debounceMs = 300; // Default
_debounceMs = 500; // For slow connections
```

2. **Limit options:**

```apex
LIMIT 50 // Don't return thousands of options
```

3. **Virtualize long lists:** Only render visible items.

---

## Deployment Issues

### Issue: "Invalid field" on Deploy

**Symptoms:**

- Deploy fails with field errors
- Custom metadata not found

**Solutions:**

1. **Deploy dependencies first:**

```bash
# Order matters
sf project deploy start -d sfGpsDsBaseComms
sf project deploy start -d sfGpsDsCaOn
```

2. **Check API version in meta files:**

```xml
<apiVersion>59.0</apiVersion>
```

### Issue: Component Not Appearing in Builder

**Symptoms:**

- Can't find component in Experience Builder
- "No components" message

**Solutions:**

1. **Check targets in meta file:**

```xml
<targets>
  <target>lightningCommunity__Page</target>
  <target>lightningCommunity__Default</target>
</targets>
```

2. **Verify component is public:**

```xml
<isExposed>true</isExposed>
```

3. **Check master label:**

```xml
<masterLabel>Ontario Callout</masterLabel>
```

---

## Error Codes Reference

| Code        | Meaning                     | Solution                              |
| ----------- | --------------------------- | ------------------------------------- |
| `SFGPS-001` | API connection failed       | Check Named Credential configuration  |
| `SFGPS-002` | Expression Set not found    | Verify Expression Set API name        |
| `SFGPS-003` | Invalid input variables     | Check JSON format of inputVariables   |
| `SFGPS-004` | Authorization failed        | Check External Credential permissions |
| `SFGPS-005` | Apex callout exception      | Check debug logs for Apex errors      |
| `SFGPS-006` | LWS sandbox violation       | Review code for restricted APIs       |
| `SFGPS-007` | CSP blocked resource        | Add domain to Trusted Sites           |
| `SFGPS-008` | postMessage origin mismatch | Verify iframe source matches          |

---

## Getting Help

### Collect Diagnostic Information

Before requesting support, gather:

1. **Browser console logs** (with debug mode enabled)
2. **Network request/response** for failed API calls
3. **Apex debug logs** for server-side issues
4. **Component configuration** (properties, data sources)
5. **Salesforce org details** (version, edition, enabled features)

### Debug Log Collection

```apex
// Enable debug logging for user
System.debug(LoggingLevel.DEBUG, 'Your debug message');
```

### Support Channels

- GitHub Issues: Report bugs and feature requests
- Developer Documentation: See `/docs` folder
- Salesforce Trailblazer Community: Search for similar issues

---

## Related Documentation

- [DEBUG_GUIDE.md](./DEBUG_GUIDE.md) - Detailed logging setup
- [LWR_BEST_PRACTICES.md](./LWR_BEST_PRACTICES.md) - LWR/LWS compatibility
- [AODA_COMPLIANCE.md](./AODA_COMPLIANCE.md) - Accessibility requirements
- [GIS_GUIDE.md](./GIS_GUIDE.md) - GIS component setup
