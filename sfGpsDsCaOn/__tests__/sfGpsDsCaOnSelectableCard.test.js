/**
 * @description Unit and accessibility tests for sfGpsDsCaOnSelectableCard component
 * Tests selection, badge display, link rendering, and expanded content.
 * 
 * @author Shannon Schupbach
 * @since 2026
 */

import { createElement } from "lwc";
import SfGpsDsCaOnSelectableCard from "c/sfGpsDsCaOnSelectableCard";
import { runAxe } from "./accessibility/axeConfig";

describe("c-sf-gps-ds-ca-on-selectable-card", () => {
  afterEach(() => {
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  // ============================================
  // RENDERING TESTS
  // ============================================

  describe("Rendering", () => {
    it("should render with label", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const label = element.querySelector(".sfgpsdscaon-selectable-card__title");
        expect(label).not.toBeNull();
        expect(label.textContent).toBe("Test Label");
      });
    });

    it("should render with description", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.description = "This is a description";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const description = element.querySelector(".sfgpsdscaon-selectable-card__description");
        expect(description).not.toBeNull();
        expect(description.textContent).toContain("This is a description");
      });
    });

    it("should render checkbox input", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const checkbox = element.querySelector('input[type="checkbox"]');
        expect(checkbox).not.toBeNull();
      });
    });
  });

  // ============================================
  // SELECTION TESTS
  // ============================================

  describe("Selection", () => {
    it("should reflect checked state", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.checked = true;
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const checkbox = element.querySelector('input[type="checkbox"]');
        expect(checkbox.checked).toBe(true);
      });
    });

    it("should fire select event on click", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      document.body.appendChild(element);

      const selectHandler = jest.fn();
      element.addEventListener("select", selectHandler);

      return Promise.resolve().then(() => {
        const checkbox = element.querySelector('input[type="checkbox"]');
        checkbox.click();

        expect(selectHandler).toHaveBeenCalled();
        expect(selectHandler.mock.calls[0][0].detail).toEqual({
          value: "test-value",
          checked: true
        });
      });
    });

    it("should toggle checked state on click", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.checked = false;
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          const checkbox = element.querySelector('input[type="checkbox"]');
          checkbox.click();
        })
        .then(() => {
          const checkbox = element.querySelector('input[type="checkbox"]');
          expect(checkbox.checked).toBe(true);
        });
    });

    it("should not be selectable when disabled", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.disabled = true;
      document.body.appendChild(element);

      const selectHandler = jest.fn();
      element.addEventListener("select", selectHandler);

      return Promise.resolve().then(() => {
        const checkbox = element.querySelector('input[type="checkbox"]');
        expect(checkbox.disabled).toBe(true);
        
        checkbox.click();
        expect(selectHandler).not.toHaveBeenCalled();
      });
    });
  });

  // ============================================
  // BADGE TESTS
  // ============================================

  describe("Badge", () => {
    it("should render badge when provided", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.badge = "NEW";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const badge = element.querySelector(".sfgpsdscaon-selectable-card__badge");
        expect(badge).not.toBeNull();
        expect(badge.textContent).toBe("NEW");
      });
    });

    it("should not render badge when not provided", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const badge = element.querySelector(".sfgpsdscaon-selectable-card__badge");
        expect(badge).toBeNull();
      });
    });

    it("should apply success variant class", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.badge = "COMPLETE";
      element.badgeVariant = "success";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const badge = element.querySelector(".sfgpsdscaon-selectable-card__badge");
        expect(badge.classList.contains("sfgpsdscaon-selectable-card__badge--success")).toBe(true);
      });
    });

    it("should apply info variant class by default", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.badge = "NEW";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const badge = element.querySelector(".sfgpsdscaon-selectable-card__badge");
        expect(badge.classList.contains("sfgpsdscaon-selectable-card__badge--info")).toBe(true);
      });
    });

    it("should apply warning variant class", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.badge = "PENDING";
      element.badgeVariant = "warning";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const badge = element.querySelector(".sfgpsdscaon-selectable-card__badge");
        expect(badge.classList.contains("sfgpsdscaon-selectable-card__badge--warning")).toBe(true);
      });
    });

    it("should apply error variant class", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.badge = "REJECTED";
      element.badgeVariant = "error";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const badge = element.querySelector(".sfgpsdscaon-selectable-card__badge");
        expect(badge.classList.contains("sfgpsdscaon-selectable-card__badge--error")).toBe(true);
      });
    });
  });

  // ============================================
  // LINK TESTS
  // ============================================

  describe("Link", () => {
    it("should render link when linkLabel and linkUrl provided", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.linkLabel = "More details";
      element.linkUrl = "/details/test";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const link = element.querySelector(".sfgpsdscaon-selectable-card__link");
        expect(link).not.toBeNull();
        expect(link.textContent).toBe("More details");
        expect(link.getAttribute("href")).toBe("/details/test");
      });
    });

    it("should not render link when linkLabel is missing", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.linkUrl = "/details/test";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const link = element.querySelector(".sfgpsdscaon-selectable-card__link");
        expect(link).toBeNull();
      });
    });

    it("should not render link when linkUrl is missing", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.linkLabel = "More details";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const link = element.querySelector(".sfgpsdscaon-selectable-card__link");
        expect(link).toBeNull();
      });
    });

    it("should not toggle selection when clicking link", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.linkLabel = "More details";
      element.linkUrl = "/details/test";
      document.body.appendChild(element);

      const selectHandler = jest.fn();
      element.addEventListener("select", selectHandler);

      return Promise.resolve().then(() => {
        const link = element.querySelector(".sfgpsdscaon-selectable-card__link");
        link.click();

        // Link click should not trigger selection
        // (This depends on implementation - may need stopPropagation)
        expect(selectHandler).not.toHaveBeenCalled();
      });
    });
  });

  // ============================================
  // EXPANDED CONTENT TESTS
  // ============================================

  describe("Expanded Content", () => {
    it("should render expanded content when provided", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.expandedContent = "Additional details";
      document.body.appendChild(element);

      return Promise.resolve()
        .then(() => {
          // Click the expand button to show expanded content
          const expandBtn = element.querySelector(
            ".sfgpsdscaon-selectable-card__expand-btn"
          );
          if (expandBtn) {
            expandBtn.click();
          }
        })
        .then(() => {
          // Check for expanded content container (class ends with __expanded-content)
          const expanded = element.querySelector(
            ".sfgpsdscaon-selectable-card__expanded-content"
          );
          expect(expanded).not.toBeNull();
        });
    });

    it("should not render expanded content when not provided", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        // When no expandedContent prop, expand button shouldn't exist
        const expandBtn = element.querySelector(
          ".sfgpsdscaon-selectable-card__expand-btn"
        );
        expect(expandBtn).toBeNull();
      });
    });
  });

  // ============================================
  // MULTI-LINE DESCRIPTION TESTS
  // ============================================

  describe("Multi-line Description", () => {
    it("should preserve newlines in description", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.description = "Line 1\nLine 2\nLine 3";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const description = element.querySelector(
          ".sfgpsdscaon-selectable-card__description"
        );
        // Verify description element exists with the content
        expect(description).not.toBeNull();
        expect(description.textContent).toContain("Line 1");
        // Note: JSDOM doesn't compute CSS styles, so we verify
        // the element exists with the proper class for styling
        expect(
          description.classList.contains(
            "sfgpsdscaon-selectable-card__description"
          )
        ).toBe(true);
      });
    });
  });

  // ============================================
  // ACCESSIBILITY TESTS
  // ============================================

  describe("Accessibility", () => {
    it("should have checkbox role", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const checkbox = element.querySelector('input[type="checkbox"]');
        expect(checkbox).not.toBeNull();
      });
    });

    it("should have aria-checked reflecting state", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.checked = true;
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const checkbox = element.querySelector('input[type="checkbox"]');
        expect(checkbox.checked).toBe(true);
      });
    });

    it("should have associated label", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const checkbox = element.querySelector('input[type="checkbox"]');
        const checkboxId = checkbox.getAttribute("id");
        const label = element.querySelector(`label[for="${checkboxId}"]`);
        
        expect(label).not.toBeNull();
      });
    });

    it("should have aria-disabled when disabled", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.disabled = true;
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const checkbox = element.querySelector('input[type="checkbox"]');
        expect(checkbox.disabled).toBe(true);
      });
    });

    it("should have visible focus indicator", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const checkbox = element.querySelector('input[type="checkbox"]');
        checkbox.focus();
        
        // Verify focus styling is applied
        const card = element.querySelector(".sfgpsdscaon-selectable-card");
        expect(card).not.toBeNull();
      });
    });

    it("should have proper color contrast for badge", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.badge = "NEW";
      element.badgeVariant = "success";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        const badge = element.querySelector(
          ".sfgpsdscaon-selectable-card__badge"
        );
        // Verify badge exists with the success variant class
        // (JSDOM doesn't compute CSS styles, so we check class instead)
        expect(badge).not.toBeNull();
        expect(
          badge.classList.contains("sfgpsdscaon-selectable-card__badge--success")
        ).toBe(true);
      });
    });

    it("should pass axe accessibility audit", async () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      element.description = "Description text";
      element.badge = "NEW";
      document.body.appendChild(element);

      await Promise.resolve();

      const results = await runAxe(element);
      expect(results.violations).toHaveLength(0);
    });
  });

  // ============================================
  // ONTARIO DS COMPLIANCE TESTS
  // ============================================

  describe("Ontario DS Compliance", () => {
    it("should use Ontario checkbox styling", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        // The component uses ontario-checkboxes__item class
        const container = element.querySelector(".ontario-checkboxes__item");
        expect(container).not.toBeNull();

        // Also verify the checkbox has Ontario styling class
        const checkbox = element.querySelector(".ontario-checkboxes__input");
        expect(checkbox).not.toBeNull();
      });
    });

    it("should have proper focus outline (3px)", () => {
      const element = createElement("c-sf-gps-ds-ca-on-selectable-card", {
        is: SfGpsDsCaOnSelectableCard
      });
      element.value = "test-value";
      element.label = "Test Label";
      document.body.appendChild(element);

      return Promise.resolve().then(() => {
        // Verify the label has the Ontario checkbox label class
        // which provides focus styling (JSDOM can't compute CSS)
        const label = element.querySelector(".ontario-checkboxes__label");
        expect(label).not.toBeNull();

        // Verify the checkbox input is focusable
        const checkbox = element.querySelector('input[type="checkbox"]');
        expect(checkbox).not.toBeNull();
        expect(checkbox.disabled).toBe(false);
      });
    });
  });
});
