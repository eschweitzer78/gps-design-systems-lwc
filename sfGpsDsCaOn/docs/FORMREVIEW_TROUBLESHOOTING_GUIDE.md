# FormReview Component Troubleshooting Guide

This guide helps administrators and developers troubleshoot issues with the `sfGpsDsCaOnFormFormReview` component.

## Table of Contents

1. [Enabling Debug Mode](#enabling-debug-mode)
2. [Common Issues](#common-issues)
3. [Debug Panel Usage](#debug-panel-usage)
4. [Reading Console Output](#reading-console-output)
5. [Schema Compatibility](#schema-compatibility)
6. [Performance Issues](#performance-issues)
7. [Reporting Issues](#reporting-issues)

---

## Enabling Debug Mode

### Method 1: Configuration Properties

Add debug properties in the OmniScript Designer JSON Editor:

```json
{
  "debugMode": true,
  "debugPanel": true,
  "logLevel": "debug"
}
```

### Method 2: URL Parameter

Add `?formReviewDebug=true` to the page URL to enable the diagnostic panel without changing configuration.

### Configuration Options

| Property     | Type    | Default  | Description                                 |
| ------------ | ------- | -------- | ------------------------------------------- |
| `debugMode`  | Boolean | `false`  | Enable verbose console logging              |
| `debugPanel` | Boolean | `false`  | Show visual diagnostic panel                |
| `logLevel`   | String  | `"warn"` | Log level: `error`, `warn`, `info`, `debug` |
| `strictMode` | Boolean | `false`  | Throw errors instead of using fallbacks     |

---

## Common Issues

### Issue: "No Sections Displayed"

**Symptoms:**

- Review page shows "No answers to review"
- Data exists in the OmniScript but isn't visible

**Possible Causes:**

1. **Ghost Data Detection**
   - Steps may be conditionally hidden, causing their data to be filtered
   - Check the diagnostic panel for "Ghost Data" step status

2. **All Steps Excluded**
   - `excludeSteps` configuration may be filtering all steps
3. **Internal Fields Only**
   - OmniScript data may only contain internal system fields

**Solution:**

```json
// Check your excludeSteps configuration
{
  "excludeSteps": "InternalStep1,InternalStep2"
}
```

Enable debug mode and look for log entries with `STEP_SKIPPED` events.

---

### Issue: "Wrong Labels Shown"

**Symptoms:**

- Field labels show raw API names (e.g., "firstName" instead of "First Name")
- Dropdown values show codes instead of display text (e.g., "opt_1" instead of "Option One")

**Cause:**
The component couldn't resolve labels from the OmniScript definition, or option values need label lookup.

**Solution:**

Configure the `labelSchema` property:

```json
{
  "labelSchema": {
    "PersonalInfo:shippingMethod": {
      "std_ship": "Standard Shipping (3-5 days)",
      "exp_ship": "Express Shipping (1-2 days)",
      "ovn_ship": "Overnight Shipping"
    },
    "PersonalInfo:preferredContact": {
      "email": "Email",
      "phone": "Phone",
      "mail": "Mail"
    }
  }
}
```

Configure the `fieldMapping` property for custom labels:

```json
{
  "fieldMapping": {
    "PersonalInfo:firstName": "Your First Name",
    "PersonalInfo:lastName": "Your Last Name"
  }
}
```

---

### Issue: "Edit Button Goes to Wrong Step"

**Symptoms:**

- Clicking "Change" navigates to an unexpected step
- Navigation seems off by one or more steps

**Cause:**
Conditional steps shift the visual index. The component now uses step names instead of indices for navigation.

**Solution:**

1. Ensure you're using the latest component version
2. Check the diagnostic panel for navigation resolution logs
3. Verify step names in your OmniScript match the data keys

Look for `NAVIGATION_RESOLVED` log events to see where navigation is targeting.

---

### Issue: "Values Showing as [Object object]"

**Symptoms:**

- Complex field values display as `[Object object]` or raw JSON

**Cause:**
The component encountered an unexpected object structure.

**Solution:**

1. Enable debug mode to see what's being received
2. Check if the field is a File Upload, Multi-Select, or custom element
3. Use `excludeFields` to hide problematic fields:

```json
{
  "excludeFields": "Step1:complexField,Step2:legacyData"
}
```

---

### Issue: "File Names Not Showing"

**Symptoms:**

- File uploads show "Uploaded file" instead of the actual filename

**Cause:**
The filename property path has changed or is missing in the data.

**Solution:**
The component checks these fallback paths:

1. `fileName`
2. `FileName`
3. `name`
4. `Name`
5. `Title`
6. `title`
7. `PathOnClient`

If none work, ensure your File Upload element is configured to include filename in the response.

---

## Debug Panel Usage

The diagnostic panel provides real-time troubleshooting information.

### Panel Sections

#### Status Bar

Shows at-a-glance information:

- **Version**: Detected OmniStudio version
- **Schema**: Validation status (Valid/Invalid)
- **Warnings**: Number of warnings detected
- **Fallbacks**: Number of fallback property paths used

#### Statistics

- **Sections**: Number of sections generated
- **Fields**: Total fields processed
- **Null Gaps**: Edit Block null gaps filtered

#### Warnings Section

Lists all warnings with:

- Warning code (e.g., `DEPRECATED_PATH`)
- Descriptive message
- Context data (expandable)

#### Data Structure Section

Shows each step with:

- **Active/Ghost Data** status
- Field count
- Null gap count
- Subsection presence

#### Recent Logs Section

Shows the last 10 log entries with level, event, message, and context.

### Panel Actions

- **Copy**: Copies all diagnostic data to clipboard (JSON format)
- **Close**: Hides the panel for this session

---

## Reading Console Output

When `debugMode: true`, structured log entries appear in the browser console.

### Log Format

```
[FormReview] LEVEL: Message {context}
```

### Log Levels

| Level   | Description       | When to Use                                      |
| ------- | ----------------- | ------------------------------------------------ |
| `ERROR` | Critical failures | Schema validation failures, navigation errors    |
| `WARN`  | Potential issues  | Fallback usage, ghost data, deprecation warnings |
| `INFO`  | Operational info  | Initialization, section generation, navigation   |
| `DEBUG` | Detailed traces   | Every field extracted, every step processed      |

### Key Log Events

| Event                  | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `INIT_START`           | Component initialization beginning             |
| `INIT_COMPLETE`        | Component ready with section count             |
| `SCHEMA_VALIDATE`      | Schema validation result                       |
| `SCHEMA_WARNING`       | Specific schema warning                        |
| `VERSION_DETECTED`     | OmniStudio version fingerprint                 |
| `STEP_PROCESSED`       | Step successfully processed                    |
| `STEP_SKIPPED`         | Step filtered (ghost data, excluded, internal) |
| `FIELD_EXTRACTED`      | Individual field added to output               |
| `LABEL_LOOKUP`         | Label resolution from labelSchema              |
| `FALLBACK_USED`        | Primary property path failed, using fallback   |
| `EDIT_BLOCK_DETECTED`  | Repeatable Edit Block found                    |
| `SUBSECTION_CREATED`   | Block/Edit Block rendered as subsection        |
| `NULL_GAP_FILTERED`    | Null array item (deleted row) filtered         |
| `DEPTH_LIMIT_REACHED`  | Recursion limit hit (performance protection)   |
| `NAVIGATION_REQUESTED` | User clicked Change link                       |
| `NAVIGATION_RESOLVED`  | Navigation target calculated                   |

### Example Debug Session

```
[FormReview] INFO: Initializing with 4 steps detected
[FormReview] DEBUG: Schema validation passed (2 warnings)
[FormReview] WARN: propSetMap.label not found for Step1, using caption fallback
[FormReview] DEBUG: PersonalInfo - 5 fields extracted, 0 filtered
[FormReview] DEBUG: ContactInfo - 3 fields extracted, 1 null gap filtered
[FormReview] INFO: Edit Block detected: ContactInfo:Addresses - creating subsection
[FormReview] WARN: File field missing fileName, using fallback: "document.pdf"
[FormReview] INFO: Render complete: 4 sections, 12 items, 1 subsection
```

---

## Schema Compatibility

The component detects OmniStudio version signatures and applies appropriate logic.

### Known Version Signatures

| Version                  | Characteristics               |
| ------------------------ | ----------------------------- |
| `omnistudio-pre-2024`    | Uses `propSetMap.label` only  |
| `omnistudio-2024-winter` | Adds `propSetMap.caption`     |
| `omnistudio-2025-spring` | Adds `propSetMap.displayName` |
| `omnistudio-2026`        | May add new properties        |

### Property Fallback Chains

When the primary property path fails, the component tries alternatives:

**Labels:**

1. `propSetMap.label`
2. `propSetMap.caption`
3. `propSetMap.text`
4. `propSetMap.title`
5. `propSetMap.displayName`
6. `label`
7. `name`

**File Names:**

1. `fileName`
2. `FileName`
3. `name`
4. `Name`
5. `Title`
6. `title`
7. `PathOnClient`

### Handling New OmniStudio Versions

If you encounter issues after a Salesforce release:

1. Enable debug mode
2. Look for `NEW_PROPERTIES_DETECTED` warnings
3. Check if fallback chains are being used excessively
4. Report new property patterns for inclusion in future updates

---

## Performance Issues

### Issue: Mobile Freeze / Unresponsive UI

**Symptoms:**

- "Next" button unresponsive for 1-2 seconds
- Page appears to hang on mobile devices

**Cause:**
Deep recursion through large OmniScript data structures.

**Mitigations Built-In:**

1. **Recursion Depth Limit**: Maximum depth of 5 levels
2. **Debounced Regeneration**: 100ms delay between regeneration attempts
3. **Shallow Hash Comparison**: Avoids JSON.stringify on large objects

**Additional Solutions:**

1. Exclude unnecessary steps:

```json
{
  "excludeSteps": "TechnicalStep1,InternalCalculations,HTTPActions"
}
```

2. If you see `DEPTH_LIMIT_REACHED` warnings, your OmniScript may have unusually deep nesting

### Issue: "Too Many Sections"

**Solution:**
Increase granularity of exclusions or use manual sections:

```json
{
  "sectionsJson": [
    {
      "heading": "Personal Information",
      "items": [{ "key": "Name", "value": "%PersonalInfo:fullName%" }]
    }
  ]
}
```

---

## Reporting Issues

When reporting issues, include:

1. **Debug Panel Screenshot** or copied JSON
2. **Console Logs** with `debugMode: true` and `logLevel: "debug"`
3. **OmniScript Version** (visible in debug panel as detected version)
4. **Steps to Reproduce**
5. **Expected vs Actual Behavior**

### Self-Healing Mechanisms

The component includes self-healing for common issues:

| Issue                   | Self-Heal Action                  |
| ----------------------- | --------------------------------- |
| Array null gaps         | Filters and logs original indices |
| Missing step definition | Uses formatted step name          |
| Circular reference      | Truncates at depth limit          |
| LWS Proxy issues        | Uses shallow hash comparison      |
| Empty sections          | Excludes from output              |

If self-healing activates, you'll see corresponding log entries.

---

## API Reference

### Exposed Methods

```javascript
// Get diagnostic data programmatically
const diagnostics = component.getDiagnostics();

// Get logger instance
const logger = component.getLogger();

// Clear log history
component.clearLogs();
```

### Logger Instance Methods

```javascript
// Access log history
logger.getHistory();

// Get statistics
logger.getStats();

// Get warnings only
logger.getWarnings();

// Get summary for diagnostics
logger.getSummary();
```

---

## Quick Reference Card

| Problem          | First Check                       | Solution                        |
| ---------------- | --------------------------------- | ------------------------------- |
| No sections      | Diagnostic panel → Data Structure | Remove from `excludeSteps`      |
| Wrong labels     | Console → `LABEL_LOOKUP` events   | Add to `labelSchema`            |
| Wrong navigation | Console → `NAVIGATION_RESOLVED`   | Verify step names               |
| Performance      | Console → `DEPTH_LIMIT_REACHED`   | Add to `excludeSteps`           |
| [Object object]  | Console → `FIELD_EXTRACTED`       | Add to `excludeFields`          |
| Ghost data shown | Diagnostic panel → step status    | Component filters automatically |
