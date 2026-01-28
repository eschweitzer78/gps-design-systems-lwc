# Ontario Design System - Debug and Tracing Guide

This guide explains how to enable debugging, use the logging utilities, and troubleshoot Ontario Design System LWC components.

---

## Quick Start

### Enable Debug Mode

Open your browser's developer console and run:

```javascript
window.sfGpsDsCaOnDebug = true;
```

Or add a URL parameter:

```
https://your-site.com/s/page?debug=true
```

Or set in localStorage (persists across sessions):

```javascript
localStorage.setItem("sfGpsDsCaOnDebug", "true");
```

### Disable Debug Mode

```javascript
window.sfGpsDsCaOnDebug = false;
// Or
localStorage.removeItem("sfGpsDsCaOnDebug");
```

---

## Debug Utility Overview

The `sfGpsDsCaOnDebugUtils` module provides standardized logging and tracing for all Ontario DS components.

### Features

| Feature                | Description                                         |
| ---------------------- | --------------------------------------------------- |
| **Logger Class**       | Consistent logging with component identification    |
| **Log Levels**         | NONE, ERROR, WARN, INFO, DEBUG, TRACE               |
| **Performance Timing** | Measure operation duration                          |
| **State Tracking**     | Log property changes                                |
| **Event Tracing**      | Track dispatched and received events                |
| **Method Tracing**     | Log method entry/exit for execution flow            |
| **Instance IDs**       | Unique identifiers for multiple component instances |

---

## Using the Logger in Components

### Basic Setup

```javascript
import { Logger } from "c/sfGpsDsCaOnDebugUtils";

// Create a logger for your component
const log = new Logger("SfGpsDsCaOnMyComponent");

export default class SfGpsDsCaOnMyComponent extends LightningElement {
  connectedCallback() {
    log.debug("Component connected", { someProperty: this.someProperty });
  }
}
```

### Log Levels

```javascript
// Error - always logged (unless NONE)
log.error("Failed to load data", error);

// Warning - logged at WARN level and above
log.warn("Deprecated property used", "oldPropName");

// Info - logged at INFO level and above
log.info("User completed action", { action: "submit" });

// Debug - logged at DEBUG level and above
log.debug("Processing options", { count: options.length });

// Trace - most verbose, logged at TRACE level only
log.trace("handleKeyDown", { key: event.key });
```

### Method Tracing

Use `enter()` and `exit()` to trace execution flow:

```javascript
handleOptionSelect(event) {
  log.enter("handleOptionSelect", { type: event.type });

  // ... method logic ...

  log.exit("handleOptionSelect");
}
```

**Console Output:**

```
[SfGpsDsCaOnFormTypeahead] > handleOptionSelect { type: "click" }
[SfGpsDsCaOnFormTypeahead] < handleOptionSelect
```

### State Change Tracking

Track property changes for debugging reactivity:

```javascript
handleChange(event) {
  const oldValue = this.value;
  this.value = event.target.value;
  log.stateChange("value", oldValue, this.value);
}
```

**Console Output:**

```
[SfGpsDsCaOnDropdown] State: value { from: "", to: "option1" }
```

### Event Tracing

Track custom events:

```javascript
// When dispatching
this.dispatchEvent(new CustomEvent("change", { detail: { value } }));
log.eventDispatch("change", { value });

// When receiving
handleCustomEvent(event) {
  log.eventReceived("customEvent", event);
  // ... handle event ...
}
```

### Performance Measurement

Measure operation duration:

```javascript
connectedCallback() {
  log.timeStart("initialization");

  // ... initialization logic ...

  log.timeEnd("initialization");
}
```

**Console Output:**

```
[SfGpsDsCaOnFormLookup] Timer started: initialization
[SfGpsDsCaOnFormLookup] Timer initialization: 2.35ms
```

---

## Advanced Features

### Instance IDs for Multiple Components

When multiple instances of the same component exist on a page:

```javascript
const log = new Logger("SfGpsDsCaOnTextInput", {
  includeInstanceId: true
});

// Output: [SfGpsDsCaOnTextInput#1] ...
// Output: [SfGpsDsCaOnTextInput#2] ...
```

### Timestamps

Include timestamps in logs:

```javascript
const log = new Logger("SfGpsDsCaOnSearch", {
  includeTimestamp: true
});

// Output: 2026-01-26T15:30:45.123Z [SfGpsDsCaOnSearch] ...
```

### Child Loggers

Create context-specific loggers:

```javascript
const log = new Logger("SfGpsDsCaOnForm");
const validationLog = log.child("validation");

// Output: [SfGpsDsCaOnForm:validation] Validating field...
```

### Debug Assertions

Assert conditions during development:

```javascript
import { debugAssert } from "c/sfGpsDsCaOnDebugUtils";

debugAssert(options.length > 0, "Options array should not be empty");
```

### State Dump

Dump component state to console table:

```javascript
import { dumpState } from "c/sfGpsDsCaOnDebugUtils";

dumpState("SfGpsDsCaOnDropdown", {
  value: this.value,
  options: this.options,
  isOpen: this._isOpen,
  highlightIndex: this._highlightIndex
});
```

---

## Programmatic Log Level Control

### Set Log Level

```javascript
import { setLogLevel, LogLevel } from "c/sfGpsDsCaOnDebugUtils";

// Show all logs
setLogLevel(LogLevel.TRACE);

// Show debug and above
setLogLevel(LogLevel.DEBUG);

// Show info and above
setLogLevel(LogLevel.INFO);

// Show warnings and errors only
setLogLevel(LogLevel.WARN);

// Show errors only
setLogLevel(LogLevel.ERROR);

// Disable all logging
setLogLevel(LogLevel.NONE);
```

### Enable/Disable Debug Mode

```javascript
import { enableDebug, disableDebug } from "c/sfGpsDsCaOnDebugUtils";

enableDebug(); // Sets level to DEBUG
disableDebug(); // Sets level to ERROR
```

---

## Troubleshooting Common Issues

### 1. Component Not Rendering

Enable debug mode and check for errors:

```javascript
window.sfGpsDsCaOnDebug = true;
// Reload page and check console for errors
```

Look for:

- `ERROR:` messages indicating failures
- `connectedCallback` entry without exit (component crashed during init)

### 2. Dropdown/Typeahead Not Working

Check keyboard and selection events:

```javascript
// Look for these patterns in console:
// > handleInputKeyDown { key: "ArrowDown" }
// State: _highlightIndex { from: -1, to: 0 }
// > handleOptionSelect { type: "click" }
```

### 3. Form Validation Issues

Look for validation state changes:

```javascript
// Check for:
// State: isValid { from: true, to: false }
// Component initialized { required: true, ... }
```

### 4. OmniScript Data Not Updating

Check `applyCallResp` calls:

```javascript
// Look for:
// Applying value to OmniScript { value: "selectedValue" }
// Value applied successfully
// Or: ERROR: Failed to apply value [error details]
```

### 5. Performance Issues

Use timing to identify slow operations:

```javascript
log.timeStart("dataLoad");
// ... operation ...
log.timeEnd("dataLoad");

// Output: Timer dataLoad: 1523.45ms
```

---

## Best Practices

### 1. Use Consistent Logging

All components should use the Logger class:

```javascript
const log = new Logger("ComponentName");
```

### 2. Log at Appropriate Levels

| Level | Use For                               |
| ----- | ------------------------------------- |
| ERROR | Failures that break functionality     |
| WARN  | Deprecated usage, potential issues    |
| INFO  | User actions, important state changes |
| DEBUG | Development debugging, state details  |
| TRACE | Method entry/exit, verbose tracing    |

### 3. Include Context in Logs

Bad:

```javascript
log.debug("Error occurred");
```

Good:

```javascript
log.debug("Failed to load options", {
  dataRaptor: this._propSetMap.optionSource,
  error: error.message
});
```

### 4. Clean Up for Production

Debug logging is automatically suppressed when:

- `window.sfGpsDsCaOnDebug` is not set
- URL parameter `?debug=true` is not present
- localStorage doesn't have the debug flag

No code changes needed for production.

---

## Components with Debug Logging

The following components have been enhanced with debug logging:

| Component                        | Key Logged Operations                                 |
| -------------------------------- | ----------------------------------------------------- |
| `sfGpsDsCaOnFormTypeahead`       | Keyboard navigation, option selection, initialization |
| `sfGpsDsCaOnFormPlacesTypeahead` | Google Places selection, place details retrieval      |
| `sfGpsDsCaOnFormLookup`          | Dropdown open/close, option selection, ARIA focus     |
| `sfGpsDsCaOnSearchComm`          | Search queries, suggestions, errors                   |
| `sfGpsDsCaOnDropdown`            | Value changes, events                                 |

---

## Error Tracking

For production error tracking, use the `sfGpsDsCaOnErrorTracker` module.

### Basic Setup

```javascript
import { ErrorTracker } from "c/sfGpsDsCaOnErrorTracker";

const tracker = new ErrorTracker("SfGpsDsCaOnMyComponent", {
  reportToApex: true // Enable server-side logging
});
```

### Track Errors with Correlation IDs

```javascript
try {
  await this.callApex();
} catch (error) {
  tracker.trackError(error, { action: "loadData" });
  // Logs: [SfGpsDsCaOnMyComponent] INTEGRATION Error [SFGPS-1706450400123-a1b2c3d4]: ...
}
```

### Pass Correlation ID to Apex

Include the correlation ID in Apex calls for end-to-end tracing:

```javascript
const correlationId = tracker.getCorrelationId();
const result = await callApex({ correlationId, ...params });
```

### Search Logs by Correlation ID

Use the correlation ID to find related log entries:

```apex
// In Developer Console > Debug Logs
// Search for: [SFGPS-1706450400123-a1b2c3d4]
```

---

## Related Documentation

- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions
- [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Development guide
- [COMPONENT_API.md](./COMPONENT_API.md) - Component APIs
- [OMNISCRIPT_SETUP.md](./OMNISCRIPT_SETUP.md) - OmniScript configuration
