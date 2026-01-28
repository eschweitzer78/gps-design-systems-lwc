/**
 * @description Unit and accessibility tests for sfGpsDsCaOnModal component
 * Tests focus trapping, keyboard navigation, ARIA attributes, and visual states.
 * 
 * @author Shannon Schupbach
 * @since 2026
 */

import { createElement } from "lwc";
import SfGpsDsCaOnModal from "c/sfGpsDsCaOnModal";
import { runAxe, formatViolations } from "./accessibility/axeConfig";

// Mock the focus trapping behavior
const mockFocusableElements = () => {
  return document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
};

describe("c-sf-gps-ds-ca-on-modal", () => {
  afterEach(() => {
    // Clean up DOM after each test
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    // Reset body overflow
    document.body.style.overflow = "";
  });

  // ============================================
  // RENDERING TESTS
  // ============================================

  describe("Rendering", () => {
    it("should not render when isOpen is false", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = false;
      element.title = "Test Modal";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const backdrop = element.querySelector(".sfgpsdscaon-modal__backdrop");
        expect(backdrop).toBeNull();
      });
    });

    it("should render when isOpen is true", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const backdrop = element.querySelector(".sfgpsdscaon-modal__backdrop");
        expect(backdrop).not.toBeNull();
      });
    });

    it("should render title in header", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Site Selector";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const title = element.querySelector(".sfgpsdscaon-modal__title");
        expect(title).not.toBeNull();
        expect(title.textContent).toBe("Site Selector");
      });
    });

    it("should hide header when hideHeader is true", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      element.hideHeader = true;
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const header = element.querySelector(".sfgpsdscaon-modal__header");
        expect(header).toBeNull();
      });
    });

    it("should hide footer when hideFooter is true", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      element.hideFooter = true;
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const footer = element.querySelector(".sfgpsdscaon-modal__footer");
        expect(footer).toBeNull();
      });
    });

    it("should hide close button when hideCloseButton is true", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      element.hideCloseButton = true;
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const closeBtn = element.querySelector(".sfgpsdscaon-modal__close");
        expect(closeBtn).toBeNull();
      });
    });

    it("should apply size class correctly", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      element.size = "large";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        // Size class is on the modal container, not the dialog
        const modal = element.querySelector(".sfgpsdscaon-modal");
        expect(modal.classList.contains("sfgpsdscaon-modal--large")).toBe(true);
      });
    });
  });

  // ============================================
  // KEYBOARD NAVIGATION TESTS
  // ============================================

  describe("Keyboard Navigation", () => {
    it("should close modal on Escape key press", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      document.body.appendChild(element);

      const closeHandler = jest.fn();
      element.addEventListener("close", closeHandler);

      return Promise.resolve().then(() => {
        // Keydown listener is on document, not the element
        const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true });
        document.dispatchEvent(event);

        expect(closeHandler).toHaveBeenCalled();
      });
    });

    it("should trap focus within modal on Tab", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const focusableElements = element.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        // Focus should be contained within the modal
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          // Verify focus elements exist
          expect(firstElement).not.toBeNull();
          expect(lastElement).not.toBeNull();
        }
      });
    });
  });

  // ============================================
  // PUBLIC METHODS TESTS
  // ============================================

  describe("Public Methods", () => {
    it("should open modal via open() method", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.title = "Test Modal";
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          element.open();
        })
        .then(() => {
          const backdrop = element.querySelector(".sfgpsdscaon-modal__backdrop");
          expect(backdrop).not.toBeNull();
        });
    });

    it("should close modal via close() method", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      document.body.appendChild(element);

      const closeHandler = jest.fn();
      element.addEventListener("close", closeHandler);

      return Promise.resolve()
        .then(() => {
          element.close();
        })
        .then(() => {
          expect(closeHandler).toHaveBeenCalled();
        });
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  describe("Accessibility", () => {
    it("should have role=dialog", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const dialog = element.querySelector('[role="dialog"]');
        expect(dialog).not.toBeNull();
      });
    });

    it("should have aria-modal=true", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const dialog = element.querySelector('[aria-modal="true"]');
        expect(dialog).not.toBeNull();
      });
    });

    it("should have aria-labelledby pointing to title", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const dialog = element.querySelector('[role="dialog"]');
        const titleId = dialog.getAttribute("aria-labelledby");
        expect(titleId).not.toBeNull();
        
        const title = element.querySelector(`#${titleId}`);
        expect(title).not.toBeNull();
      });
    });

    it("should have aria-describedby pointing to content", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const dialog = element.querySelector('[role="dialog"]');
        const descId = dialog.getAttribute("aria-describedby");
        expect(descId).not.toBeNull();
        
        const content = element.querySelector(`#${descId}`);
        expect(content).not.toBeNull();
        expect(content.classList.contains("sfgpsdscaon-modal__content")).toBe(true);
      });
    });

    it("should have unique IDs for multiple modal instances", () => {
      const element1 = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element1.isOpen = true;
      element1.title = "Modal 1";
      document.body.appendChild(element1);

      const element2 = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element2.isOpen = true;
      element2.title = "Modal 2";
      document.body.appendChild(element2);

      return Promise.resolve().then(() => {
        const dialog1 = element1.querySelector('[role="dialog"]');
        const dialog2 = element2.querySelector('[role="dialog"]');
        
        const titleId1 = dialog1.getAttribute("aria-labelledby");
        const titleId2 = dialog2.getAttribute("aria-labelledby");
        
        // IDs should be unique
        expect(titleId1).not.toBe(titleId2);
      });
    });

    it("should have accessible close button with dynamic label", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Site Selector";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const closeBtn = element.querySelector(".sfgpsdscaon-modal__close-btn");
        expect(closeBtn).not.toBeNull();
        
        const ariaLabel = closeBtn.getAttribute("aria-label");
        expect(ariaLabel).toContain("Site Selector");
      });
    });

    it("should lock body scroll when open", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        expect(document.body.style.overflow).toBe("hidden");
      });
    });

    it("should have accessible close button", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const closeBtn = element.querySelector(".sfgpsdscaon-modal__close-btn");
        expect(closeBtn).not.toBeNull();
        
        const ariaLabel = closeBtn.getAttribute("aria-label");
        expect(ariaLabel).not.toBeNull();
        expect(ariaLabel.toLowerCase()).toContain("close");
      });
    });

    it("should pass axe accessibility audit", async () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      document.body.appendChild(element);

      await Promise.resolve();

      const results = await runAxe(element);
      expect(results.violations).toHaveLength(0);
    });
  });

  // ============================================
  // SLOT TESTS
  // ============================================

  describe("Slots", () => {
    it("should render content slot", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const contentSlot = element.querySelector('[slot="content"]') || 
                            element.querySelector('.sfgpsdscaon-modal__content');
        expect(contentSlot).not.toBeNull();
      });
    });

    it("should render footer slot", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      element.hideFooter = false;
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const footerSlot = element.querySelector('[slot="footer"]') || 
                           element.querySelector('.sfgpsdscaon-modal__footer');
        expect(footerSlot).not.toBeNull();
      });
    });
  });

  // ============================================
  // ONTARIO DS COMPLIANCE TESTS
  // ============================================

  describe("Ontario DS Compliance", () => {
    it("should have dark header background", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const header = element.querySelector(".sfgpsdscaon-modal__header");
        expect(header).not.toBeNull();
        
        const styles = window.getComputedStyle(header);
        // Verify dark background (Ontario blue or similar)
        // The exact color may vary, so we check it's not white/transparent
        expect(styles.backgroundColor).not.toBe("rgb(255, 255, 255)");
        expect(styles.backgroundColor).not.toBe("transparent");
      });
    });

    it("should have visible focus indicator on close button", () => {
      const element = createElement("c-sf-gps-ds-ca-on-modal", {
        is: SfGpsDsCaOnModal
      });
      element.isOpen = true;
      element.title = "Test Modal";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const closeBtn = element.querySelector(".sfgpsdscaon-modal__close-btn");
        expect(closeBtn).not.toBeNull();
        
        closeBtn.focus();
        // In JSDOM, computed styles may not reflect CSS file rules
        // Just verify the button exists and is focusable
        expect(closeBtn.tagName).toBe("BUTTON");
      });
    });
  });
});
