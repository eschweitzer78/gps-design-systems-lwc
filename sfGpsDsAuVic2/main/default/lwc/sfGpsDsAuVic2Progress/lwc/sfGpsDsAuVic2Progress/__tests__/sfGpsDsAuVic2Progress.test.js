import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuVic2Progress from "c/sfGpsDsAuVic2Progress";

describe("c-sf-gps-ds-au-vic2-progress", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("renders as a div when non expandable", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic2-progress", {
      is: SfGpsDsAuVic2Progress
    });
    element.steps = [
      { label: "Step 1" },
      { label: "Step 2" },
      { label: "Step 3" }
    ];
    element.currentStep = 1;
    element.expandable = false;
    document.body.appendChild(element);

    // Act
    const header = element.shadowRoot.querySelector(".rpl-progress__header");

    // Assert
    expect(header.tagName).toBe("DIV");
  });

  it("renders the correct steps when expanded", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic2-progress", {
      is: SfGpsDsAuVic2Progress
    });

    element.steps = [
      { label: "Step 1" },
      { label: "Step 2" },
      { label: "Step 3" }
    ];
    element.currentStep = 1;
    element.expandable = true;
    document.body.appendChild(element);

    // Act
    const header = element.shadowRoot.querySelector(".rpl-progress__header");

    expect(header.tagName).toBe("BUTTON");

    header.click();

    await Promise.resolve();

    const steps = element.shadowRoot.querySelectorAll(
      ".rpl-progress__steps li"
    );
    expect(steps).toHaveLength(3);
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic2-progress", {
      is: SfGpsDsAuVic2Progress
    });

    element.currentStep = 1;
    element.expandable = true;

    document.body.appendChild(element);

    // Act
    await expect(element).toBeAccessible();
  });
});
