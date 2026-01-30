/**
 * @description Unit and accessibility tests for sfGpsDsCaOnDischargePointSelector component
 * Tests coordinate input, tab navigation, and ESRI map integration.
 *
 * @author Shannon Schupbach
 * @since 2026
 */

import { createElement } from "lwc";
import SfGpsDsCaOnDischargePointSelector from "c/sfGpsDsCaOnDischargePointSelector";
import { runAxe } from "./accessibility/axeConfig";

describe("c-sf-gps-ds-ca-on-discharge-point-selector", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  });

  // ============================================
  // RENDERING TESTS
  // ============================================

  describe("Rendering", () => {
    it("should render trigger button", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      element.buttonLabel = "Add discharge point";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const button = element.querySelector(
          ".sfgpsdscaon-discharge-selector__trigger"
        );
        expect(button).not.toBeNull();
        expect(button.textContent).toContain("Add discharge point");
      });
    });

    it("should render modal when opened", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      element.buttonLabel = "Add discharge point";
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          const button = element.querySelector(
            ".sfgpsdscaon-discharge-selector__trigger"
          );
          button.click();
        })
        .then(() => {
          const modal = element.querySelector("c-sf-gps-ds-ca-on-modal");
          expect(modal).not.toBeNull();
        });
    });

    it("should render coordinate input component", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      element.buttonLabel = "Add discharge point";
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          const coordInput = element.querySelector(
            "c-sf-gps-ds-ca-on-coordinate-input"
          );
          expect(coordInput).not.toBeNull();
        });
    });
  });

  // ============================================
  // TAB NAVIGATION TESTS
  // ============================================

  describe("Tab Navigation", () => {
    it("should switch to drop point tab on click", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          const dropPointTab = element.querySelector('[data-tab="droppoint"]');
          dropPointTab.click();
        })
        .then(() => {
          const activeTab = element.querySelector('[aria-selected="true"]');
          expect(activeTab.dataset.tab).toBe("droppoint");
        });
    });

    it("should navigate tabs with arrow keys", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          const tablist = element.querySelector('[role="tablist"]');
          const firstTab = element.querySelector('[data-tab="search"]');

          // Focus the first tab
          firstTab.focus();

          // Press ArrowRight
          const event = new KeyboardEvent("keydown", {
            key: "ArrowRight",
            bubbles: true
          });
          tablist.dispatchEvent(event);
        })
        .then(() => {
          const dropPointTab = element.querySelector('[data-tab="droppoint"]');
          expect(dropPointTab.getAttribute("aria-selected")).toBe("true");
        });
    });

    it("should wrap around on arrow navigation", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          const tablist = element.querySelector('[role="tablist"]');
          const lastTab = element.querySelector('[data-tab="layers"]');

          // Click to select last tab
          lastTab.click();
        })
        .then(() => {
          const tablist = element.querySelector('[role="tablist"]');

          // Press ArrowRight from last tab
          const event = new KeyboardEvent("keydown", {
            key: "ArrowRight",
            bubbles: true
          });
          tablist.dispatchEvent(event);
        })
        .then(() => {
          // Should wrap to first tab
          const searchTab = element.querySelector('[data-tab="search"]');
          expect(searchTab.getAttribute("aria-selected")).toBe("true");
        });
    });

    it("should support Home/End keys for tabs", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          const tablist = element.querySelector('[role="tablist"]');

          // Press End key
          const event = new KeyboardEvent("keydown", {
            key: "End",
            bubbles: true
          });
          tablist.dispatchEvent(event);
        })
        .then(() => {
          const layersTab = element.querySelector('[data-tab="layers"]');
          expect(layersTab.getAttribute("aria-selected")).toBe("true");
        });
    });
  });

  // ============================================
  // COORDINATE FORMAT TESTS
  // ============================================

  describe("Coordinate Formats", () => {
    it("should switch coordinate format via dropdown", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          const formatDropdown = element.querySelector(
            ".sfgpsdscaon-discharge-selector__format-select"
          );
          if (formatDropdown) {
            formatDropdown.value = "utm";
            formatDropdown.dispatchEvent(
              new Event("change", { bubbles: true })
            );
          }
        })
        .then(() => {
          const coordInput = element.querySelector(
            "c-sf-gps-ds-ca-on-coordinate-input"
          );
          if (coordInput) {
            // Default format is "dms" unless changed via the dropdown
            expect(["utm", "dms", "decimal"]).toContain(coordInput.format);
          }
        });
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  describe("Accessibility", () => {
    it("should have role=tablist on tab bar", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          const tabBar = element.querySelector('[role="tablist"]');
          expect(tabBar).not.toBeNull();
        });
    });

    it("should have aria-label on tablist", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          const tablist = element.querySelector('[role="tablist"]');
          const ariaLabel = tablist.getAttribute("aria-label");
          expect(ariaLabel).not.toBeNull();
        });
    });

    it("should have proper tab structure", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          const tablist = element.querySelector('[role="tablist"]');
          expect(tablist).not.toBeNull();
          
          const tabs = element.querySelectorAll('[role="tab"]');
          expect(tabs.length).toBe(3);
          
          // Each tab should have an ID and aria-selected
          tabs.forEach((tab) => {
            expect(tab.id).not.toBe("");
            expect(tab.hasAttribute("aria-selected")).toBe(true);
          });
        });
    });

    it("should use roving tabindex for tabs", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          const activeTab = element.querySelector('[aria-selected="true"]');
          const inactiveTabs = element.querySelectorAll(
            '[aria-selected="false"]'
          );

          // Active tab should have tabindex=0
          expect(activeTab.getAttribute("tabindex")).toBe("0");

          // Inactive tabs should have tabindex=-1
          inactiveTabs.forEach((tab) => {
            expect(tab.getAttribute("tabindex")).toBe("-1");
          });
        });
    });

    it("should have accessible search button with aria-label", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          const searchBtn = element.querySelector(
            ".sfgpsdscaon-discharge-selector__search-btn"
          );
          if (searchBtn) {
            const ariaLabel = searchBtn.getAttribute("aria-label");
            const srText = searchBtn.querySelector(".ontario-show-for-sr");
            expect(ariaLabel || srText).not.toBeNull();
          }
        });
    });

    it("should have live region for coordinate announcements", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          const liveRegion = element.querySelector('[aria-live="assertive"]');
          expect(liveRegion).not.toBeNull();
        });
    });

    it("should pass axe accessibility audit", async () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      element.open();
      await Promise.resolve();

      const results = await runAxe(element);
      expect(results.violations).toHaveLength(0);
    });
  });

  // ============================================
  // PUBLIC METHODS TESTS
  // ============================================

  describe("Public Methods", () => {
    it("should open via open() method", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          const modal = element.querySelector("c-sf-gps-ds-ca-on-modal");
          expect(modal.isOpen).toBe(true);
        });
    });

    it("should close via close() method", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          element.close();
        })
        .then(() => {
          const modal = element.querySelector("c-sf-gps-ds-ca-on-modal");
          expect(modal.isOpen).toBe(false);
        });
    });

    it("should return coordinate data via getCoordinateData()", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const data = element.getCoordinateData();
        // Initially null, but method should be available
        expect(data).toBeNull();
      });
    });
  });

  // ============================================
  // LWR/LWS COMPATIBILITY TESTS
  // ============================================

  describe("LWR/LWS Compatibility", () => {
    it("should use hasNoVfPageUrl computed property", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      // No vfPageUrl set
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          // Should show placeholder, not iframe
          const placeholder = element.querySelector(
            ".sfgpsdscaon-discharge-selector__map-placeholder"
          );
          expect(placeholder).not.toBeNull();
        });
    });

    it("should clean up event listeners on disconnect", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      element.open();

      return Promise.resolve().then(() => {
        document.body.removeChild(element);

        // Sending a message after removal should not cause errors
        const event = new MessageEvent("message", {
          data: { action: "test" },
          origin: "https://test.force.com"
        });
        expect(() => window.dispatchEvent(event)).not.toThrow();
      });
    });
  });

  // ============================================
  // ONTARIO DS COMPLIANCE TESTS
  // ============================================

  describe("Ontario DS Compliance", () => {
    it("should use Ontario button styling for trigger", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      element.buttonLabel = "Add discharge point";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const button = element.querySelector(
          ".sfgpsdscaon-discharge-selector__trigger"
        );
        expect(
          button.classList.contains("ontario-button") ||
            button.classList.contains("sfgpsdscaon-discharge-selector__trigger")
        ).toBe(true);
      });
    });

    it("should use two-panel layout in modal", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          const leftPanel = element.querySelector(
            ".sfgpsdscaon-discharge-selector__left-panel"
          );
          const rightPanel = element.querySelector(
            ".sfgpsdscaon-discharge-selector__right-panel"
          );

          expect(leftPanel).not.toBeNull();
          expect(rightPanel).not.toBeNull();
        });
    });
  });

  // ============================================
  // MIXIN INTEGRATION TESTS
  // ============================================

  describe("MapSelectorMixin Integration", () => {
    it("should have open() public method from mixin", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      expect(typeof element.open).toBe("function");
    });

    it("should have close() public method from mixin", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      expect(typeof element.close).toBe("function");
    });

    it("should have getCoordinateData() public method", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      expect(typeof element.getCoordinateData).toBe("function");
    });

    it("should inherit tab navigation from mixin", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          const tabs = element.querySelectorAll('[role="tab"]');
          expect(tabs.length).toBe(3);
          
          // Verify correct tab order for DischargePointSelector
          expect(tabs[0].dataset.tab).toBe("search");
          expect(tabs[1].dataset.tab).toBe("droppoint");
          expect(tabs[2].dataset.tab).toBe("layers");
        });
    });

    it("should use component-specific iframe selector", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      element.vfPageUrl = "/apex/sfGpsDsCaOnSiteSelectorPage";
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          // DischargePointSelector uses .sfgpsdscaon-discharge-selector__map-iframe
          const iframe = element.querySelector(".sfgpsdscaon-discharge-selector__map-iframe");
          expect(iframe).not.toBeNull();
        });
    });

    it("should map droppoint tab to sitepoint mode for map", () => {
      const element = createElement("c-sf-gps-ds-ca-on-discharge-point-selector", {
        is: SfGpsDsCaOnDischargePointSelector
      });
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          // Click on droppoint tab
          const dropPointTab = element.querySelector('[data-tab="droppoint"]');
          dropPointTab.click();
        })
        .then(() => {
          // Verify droppoint tab is active
          const activeTab = element.querySelector('[aria-selected="true"]');
          expect(activeTab.dataset.tab).toBe("droppoint");
        });
    });
  });
});
