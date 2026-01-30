# MapSelectorMixin

A shared mixin module providing common functionality for map-based selector components in the Ontario Design System.

## Overview

The `MapSelectorMixin` extracts shared logic from `SiteSelectorTool` and `DischargePointSelector` components to reduce code duplication and centralize maintenance of common functionality.

## Features

The mixin provides:

- **Modal management** - Open/close state handling
- **Tab navigation** - Roving tabindex pattern (WCAG 2.1.1 compliant)
- **PostMessage communication** - Secure iframe communication with Visualforce
- **Origin validation** - LWS-compliant security for message handling
- **Lifecycle management** - Window message listener setup/cleanup

## Usage

```javascript
import { api, LightningElement, track } from "lwc";
import { MapSelectorMixin } from "c/sfGpsDsCaOnMapSelectorMixin";

export default class MyMapSelector extends MapSelectorMixin(LightningElement) {
  static renderMode = "light";

  // Visualforce page URL (required for map integration)
  @api vfPageUrl;

  // Override tab order for your component
  get tabOrder() {
    return ["search", "sitepoint", "layers"];
  }

  // Override iframe selector if using different CSS class
  get iframeSelector() {
    return ".my-component__map-iframe";
  }

  // Handle component-specific message types
  handleMapMessageData(data) {
    switch (data.name) {
      case "searchResult":
        // Handle search result
        break;
      case "pinPlaced":
        // Handle pin placement
        break;
      default:
        break;
    }
  }

  connectedCallback() {
    this.classList.add("caon-scope");
    this.setupMessageListener(); // From mixin
  }

  disconnectedCallback() {
    this.cleanupMessageListener(); // From mixin
  }
}
```

## Configuration Properties

Override these getters in your component to customize behavior:

| Property         | Type       | Default                                   | Description                             |
| ---------------- | ---------- | ----------------------------------------- | --------------------------------------- |
| `tabOrder`       | `string[]` | `["search", "sitepoint", "layers"]`       | Tab identifiers for keyboard navigation |
| `iframeSelector` | `string`   | `".sfgpsdscaon-map-selector__map-iframe"` | CSS selector for the map iframe         |
| `debugMode`      | `boolean`  | `false`                                   | Enable verbose console logging          |
| `componentName`  | `string`   | `"MapSelectorMixin"`                      | Name used in debug logs                 |

## Inherited State Properties

The mixin provides these tracked properties:

| Property        | Type      | Description                  |
| --------------- | --------- | ---------------------------- |
| `_isModalOpen`  | `boolean` | Modal open/close state       |
| `_activeTab`    | `string`  | Currently active tab ID      |
| `_isSearching`  | `boolean` | Search operation in progress |
| `_errorMessage` | `string`  | Error message to display     |
| `_mapLoaded`    | `boolean` | Map iframe loaded state      |

## Inherited Methods

### Modal Management

| Method               | Description                           |
| -------------------- | ------------------------------------- |
| `openModal()`        | Opens the modal, clears error message |
| `closeModal()`       | Closes the modal                      |
| `handleModalClose()` | Event handler for modal close event   |

### Tab Navigation

| Method                    | Description                                 |
| ------------------------- | ------------------------------------------- |
| `handleTabClick(event)`   | Handles tab click, sends mode change to map |
| `handleTabKeyDown(event)` | Keyboard navigation (Arrow keys, Home/End)  |
| `isTabActive(tabId)`      | Returns true if tab is active               |
| `getTabTabIndex(tabId)`   | Returns "0" or "-1" for roving tabindex     |

### PostMessage Communication

| Method                       | Description                               |
| ---------------------------- | ----------------------------------------- |
| `sendMessageToMap(message)`  | Sends postMessage to VF iframe            |
| `getVfOrigin()`              | Extracts and caches origin from vfPageUrl |
| `isValidOrigin(eventOrigin)` | Validates message origin for security     |

### Lifecycle

| Method                     | Description                     |
| -------------------------- | ------------------------------- |
| `setupMessageListener()`   | Adds window message listener    |
| `cleanupMessageListener()` | Removes window message listener |

## Message Handling

The mixin handles the `pageLoaded` message automatically. For component-specific messages, implement `handleMapMessageData(data)`:

```javascript
handleMapMessageData(data) {
  switch (data.name) {
    case "searchResult":
      this._isSearching = false;
      if (data.address) {
        this._addressDetails = data.address;
        this._coordinates = data.coordinates;
      } else if (data.error) {
        this._errorMessage = formatUserError(data.error);
      }
      break;

    case "pinPlaced":
      if (data.coordinates) {
        this._coordinates = data.coordinates;
      }
      break;

    case "error":
      this._errorMessage = formatUserError(data.error);
      this._isSearching = false;
      break;
  }
}
```

## Tab Mode Mapping

If your tab IDs differ from map modes, override `_getMapModeForTab()`:

```javascript
// Example: "droppoint" tab → "sitepoint" mode
_getMapModeForTab(tabId) {
  return tabId === "droppoint" ? "sitepoint" : tabId;
}
```

## LWR/LWS Compatibility

The mixin is designed for LWR/LWS compatibility:

- No `eval()` or dynamic code execution
- Uses specific `targetOrigin` in `postMessage()` (not `"*"`)
- Validates message origins before processing
- Uses Light DOM rendering pattern

## Security

### Origin Validation

The mixin validates all incoming postMessage events:

1. Extracts origin from `vfPageUrl` using the `URL` API
2. Caches the origin for performance
3. Rejects messages from non-matching origins

```javascript
// Origin is extracted from vfPageUrl
// e.g., "https://yourorg--c.vf.force.com/apex/SiteSelectorPage"
// becomes "https://yourorg--c.vf.force.com"
```

### Secure PostMessage

Outgoing messages use specific origin targeting:

```javascript
iframe.contentWindow.postMessage(
  JSON.stringify(message),
  this.getVfOrigin() // Specific origin, not "*"
);
```

## Accessibility (WCAG 2.1)

The mixin implements:

- **2.1.1 Keyboard** - Arrow key navigation for tabs
- **Roving tabindex** - Only active tab is focusable
- **Focus management** - Automatic focus on tab switch

## Files

| File                                      | Description                          |
| ----------------------------------------- | ------------------------------------ |
| `sfGpsDsCaOnMapSelectorMixin.js`          | Main mixin module                    |
| `sfGpsDsCaOnMapSelectorMixin.js-meta.xml` | Component metadata                   |
| `sfGpsDsCaOnMapSelectorBase.css`          | Shared base styles (optional import) |

## Components Using This Mixin

- `sfGpsDsCaOnSiteSelectorTool` - Address-based site selection
- `sfGpsDsCaOnDischargePointSelector` - Coordinate-based point selection

## Related Documentation

- [GIS_GUIDE.md](../../docs/GIS_GUIDE.md) - GIS components overview
- [COMPONENT_API.md](../../docs/COMPONENT_API.md) - Component API reference
