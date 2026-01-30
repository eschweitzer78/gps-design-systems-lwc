/*
 * Copyright (c) 2026, Shannon Schupbach, Jeremy Blankenship and salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

/**
 * Map Selector Mixin - Shared functionality for map-based selector components
 *
 * This mixin provides common functionality shared between SiteSelectorTool
 * and DischargePointSelector components:
 *
 * - Modal management (open/close state)
 * - Tab navigation with roving tabindex (WCAG 2.1.1)
 * - PostMessage communication with Visualforce iframe
 * - Message origin validation (LWS Security)
 * - Window message listener lifecycle
 *
 * ## Usage
 * ```javascript
 * import { MapSelectorMixin } from "c/sfGpsDsCaOnMapSelectorMixin";
 *
 * export default class MyComponent extends MapSelectorMixin(LightningElement) {
 *   // Override tab order for your component
 *   get tabOrder() {
 *     return ["search", "sitepoint", "layers"];
 *   }
 *
 *   // Override to handle specific message types
 *   handleMapMessageData(data) {
 *     // Handle your specific message types
 *   }
 * }
 * ```
 *
 * ## LWR/LWS Compatibility
 * - No eval() or dynamic code execution
 * - Uses specific targetOrigin for postMessage
 * - Validates message origins before processing
 */

import { track } from "lwc";

/**
 * @typedef {Object} TabConfig
 * @property {string} id - Tab identifier
 * @property {string} label - Tab display label
 * @property {string} icon - Tab icon path
 * @property {string} [mapMode] - Mode to send to map (defaults to id)
 */

/**
 * Map Selector Mixin factory function
 *
 * @param {typeof LightningElement} Base - The base class to extend
 * @returns {typeof LightningElement} Extended class with map selector functionality
 */
export const MapSelectorMixin = (Base) =>
  class extends Base {
    /* ========================================
     * MODAL STATE
     * ======================================== */

    /** @type {boolean} Modal open state */
    @track _isModalOpen = false;

    /** @type {string} Current active tab */
    @track _activeTab = "search";

    /** @type {boolean} Search in progress */
    @track _isSearching = false;

    /** @type {string} Error message */
    @track _errorMessage = "";

    /** @type {boolean} Map loaded state */
    @track _mapLoaded = false;

    /* ========================================
     * PRIVATE STATE
     * ======================================== */

    /**
     * Bound message handler for cleanup
     * @type {Function|null}
     * @private
     */
    _messageHandler = null;

    /**
     * Cached VF origin for postMessage security
     * @type {string|null}
     * @private
     */
    _vfOrigin = null;

    /* ========================================
     * CONFIGURATION - Override in subclass
     * ======================================== */

    /**
     * Tab order for keyboard navigation.
     * Override in subclass to customize tabs.
     * @returns {string[]}
     */
    get tabOrder() {
      return ["search", "sitepoint", "layers"];
    }

    /**
     * CSS selector for the map iframe.
     * Override if using a different selector.
     * @returns {string}
     */
    get iframeSelector() {
      return ".sfgpsdscaon-map-selector__map-iframe";
    }

    /**
     * Debug mode flag.
     * Override in subclass to enable debug logging.
     * @returns {boolean}
     */
    get debugMode() {
      return false;
    }

    /**
     * Component name for debug logging.
     * @returns {string}
     */
    get componentName() {
      return "MapSelectorMixin";
    }

    /* ========================================
     * COMPUTED PROPERTIES - Modal
     * ======================================== */

    /**
     * Whether the modal is open
     * @returns {boolean}
     */
    get isModalOpen() {
      return this._isModalOpen;
    }

    /* ========================================
     * COMPUTED PROPERTIES - Tabs
     * ======================================== */

    /**
     * Check if a specific tab is active
     * @param {string} tabId - Tab identifier
     * @returns {boolean}
     */
    isTabActive(tabId) {
      return this._activeTab === tabId;
    }

    /**
     * Get tabindex for a tab (roving tabindex pattern)
     * @param {string} tabId - Tab identifier
     * @returns {string} "0" if active, "-1" otherwise
     */
    getTabTabIndex(tabId) {
      return this._activeTab === tabId ? "0" : "-1";
    }

    /* ========================================
     * VF ORIGIN SECURITY - LWS Compliant
     * ======================================== */

    /**
     * Extracts and caches the origin from vfPageUrl for postMessage security.
     * LWS Security: Used to validate message origins and target origins.
     *
     * @returns {string} The origin (protocol + host) or "*" as fallback
     */
    getVfOrigin() {
      // Return cached origin if available
      if (this._vfOrigin) {
        return this._vfOrigin;
      }

      // Extract origin from vfPageUrl
      if (this.vfPageUrl) {
        try {
          const url = new URL(this.vfPageUrl);
          this._vfOrigin = url.origin;
          return this._vfOrigin;
        } catch {
          this._debugLog("Invalid vfPageUrl, cannot extract origin");
        }
      }

      // Fallback to wildcard (less secure, but functional)
      return "*";
    }

    /**
     * Validates if a message event origin matches the expected VF origin.
     * LWS Security: Prevents processing messages from untrusted origins.
     *
     * @param {string} eventOrigin - The origin from the MessageEvent
     * @returns {boolean} True if origin is valid
     */
    isValidOrigin(eventOrigin) {
      const expectedOrigin = this.getVfOrigin();

      // If we couldn't determine the origin, accept all (fallback behavior)
      if (expectedOrigin === "*") {
        return true;
      }

      // Strict origin check
      return eventOrigin === expectedOrigin;
    }

    /* ========================================
     * POST MESSAGE COMMUNICATION
     * ======================================== */

    /**
     * Sends a postMessage to the VF iframe
     * LWS Security: Uses specific targetOrigin instead of wildcard.
     *
     * @param {Object} message - Message object with title and detail
     */
    sendMessageToMap(message) {
      const iframe = this.querySelector(this.iframeSelector);

      if (this.debugMode) {
        this._debugLog("sendMessageToMap:", {
          iframeFound: !!iframe,
          hasContentWindow: !!(iframe && iframe.contentWindow),
          message: message
        });
      }

      if (iframe && iframe.contentWindow) {
        try {
          // LWS Security: Use specific origin instead of "*"
          const targetOrigin = this.getVfOrigin();
          iframe.contentWindow.postMessage(
            JSON.stringify(message),
            targetOrigin
          );

          if (this.debugMode) {
            this._debugLog("Message posted successfully to:", targetOrigin);
          }
        } catch (e) {
          // LWS may restrict postMessage in some cases
          console.warn(
            `${this.componentName}: Failed to send message to map:`,
            e.message
          );
        }
      } else if (this.debugMode) {
        this._debugLog("Cannot send message, iframe not found");
      }
    }

    /**
     * Handles message from VF iframe (map).
     * LWS Security: Validates message origin before processing.
     *
     * Override handleMapMessageData() in subclass to handle specific message types.
     *
     * @param {MessageEvent} event
     * @private
     */
    _handleMapMessage(event) {
      // LWS Security: Validate origin before processing message
      if (!this.isValidOrigin(event.origin)) {
        if (this.debugMode) {
          this._debugLog("Message rejected, origin mismatch:", {
            eventOrigin: event.origin,
            expectedOrigin: this.getVfOrigin()
          });
        }
        return;
      }

      try {
        const data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;

        if (!data || typeof data !== "object") {
          return;
        }

        if (this.debugMode) {
          this._debugLog("Processing message:", data.name, data);
        }

        // Handle common message types
        switch (data.name) {
          case "pageLoaded":
            this._mapLoaded = true;
            this._isSearching = false;
            break;

          default:
            // Delegate to subclass handler for specific message types
            if (typeof this.handleMapMessageData === "function") {
              this.handleMapMessageData(data);
            }
            break;
        }
      } catch (e) {
        if (this.debugMode) {
          this._debugLog("Error processing message:", e);
        }
      }
    }

    /* ========================================
     * TAB NAVIGATION
     * ======================================== */

    /**
     * Handles tab click
     * @param {Event} event
     */
    handleTabClick(event) {
      const tab = event.currentTarget.dataset.tab;
      if (tab) {
        this._activeTab = tab;

        // Get map mode (may differ from tab id)
        const mapMode = this._getMapModeForTab(tab);
        this.sendMessageToMap({
          title: "modeChange",
          detail: { mode: mapMode }
        });
      }
    }

    /**
     * Handles keyboard navigation for tabs (arrow keys).
     * WCAG 2.1.1 - Keyboard accessible
     *
     * @param {KeyboardEvent} event
     */
    handleTabKeyDown(event) {
      const tabs = this.tabOrder;
      const currentIndex = tabs.indexOf(this._activeTab);

      let newIndex = currentIndex;
      let shouldHandle = false;

      switch (event.key) {
        case "ArrowLeft":
        case "ArrowUp":
          newIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
          shouldHandle = true;
          break;
        case "ArrowRight":
        case "ArrowDown":
          newIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
          shouldHandle = true;
          break;
        case "Home":
          newIndex = 0;
          shouldHandle = true;
          break;
        case "End":
          newIndex = tabs.length - 1;
          shouldHandle = true;
          break;
        default:
          break;
      }

      if (shouldHandle) {
        event.preventDefault();
        this._activeTab = tabs[newIndex];

        // Get map mode for the new tab
        const mapMode = this._getMapModeForTab(this._activeTab);
        this.sendMessageToMap({
          title: "modeChange",
          detail: { mode: mapMode }
        });

        // Focus the new active tab
        // eslint-disable-next-line @lwc/lwc/no-async-operation
        setTimeout(() => {
          const newTab = this.querySelector(`[data-tab="${this._activeTab}"]`);
          if (newTab) {
            newTab.focus();
          }
        }, 0);
      }
    }

    /**
     * Gets the map mode for a given tab.
     * Override in subclass if tab ids differ from map modes.
     *
     * @param {string} tabId - Tab identifier
     * @returns {string} Map mode
     * @protected
     */
    _getMapModeForTab(tabId) {
      // Default: tab id equals map mode
      return tabId;
    }

    /* ========================================
     * MODAL MANAGEMENT
     * ======================================== */

    /**
     * Opens the modal.
     * Override in subclass to add initialization logic.
     */
    openModal() {
      this._isModalOpen = true;
      this._errorMessage = "";
    }

    /**
     * Closes the modal.
     * Override in subclass to add cleanup logic.
     */
    closeModal() {
      this._isModalOpen = false;
    }

    /**
     * Handles modal close event from modal component.
     */
    handleModalClose() {
      this.closeModal();
    }

    /* ========================================
     * LIFECYCLE
     * ======================================== */

    /**
     * Sets up message listener.
     * Call from connectedCallback() in subclass.
     */
    setupMessageListener() {
      this._messageHandler = this._handleMapMessage.bind(this);
      window.addEventListener("message", this._messageHandler);
    }

    /**
     * Removes message listener.
     * Call from disconnectedCallback() in subclass.
     */
    cleanupMessageListener() {
      if (this._messageHandler) {
        window.removeEventListener("message", this._messageHandler);
        this._messageHandler = null;
      }
    }

    /* ========================================
     * UTILITY
     * ======================================== */

    /**
     * Debug logging utility
     * @param {...any} args - Log arguments
     * @private
     */
    _debugLog(...args) {
      if (this.debugMode) {
        console.log(`${this.componentName}:`, ...args);
      }
    }
  };

export default MapSelectorMixin;
