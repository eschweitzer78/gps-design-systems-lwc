import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuNswSectionLwr from "c/sfGpsDsAuNswSectionLwr";

describe("c-sf-gps-ds-au-nsw-section-lwr", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }

    window.$A = undefined;
  });

  it("does not show in Aura", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-nsw-section-lwr", {
      is: SfGpsDsAuNswSectionLwr
    });

    // Act
    window.$A = "hello";

    document.body.appendChild(element);

    // Assert
    const section = element.querySelector(".nsw-section");
    expect(section).toBeNull();

    const error = element.querySelector("c-sf-gps-ds-configuration-error");
    expect(error).not.toBeNull();
  });

  it("shows in LWR without container by default", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-nsw-section-lwr", {
      is: SfGpsDsAuNswSectionLwr
    });

    // Act
    document.body.appendChild(element);

    // Assert
    const section = element.querySelector(".nsw-section");
    expect(section).not.toBeNull();

    const container = element.querySelector(".nsw-container");
    expect(container).toBeNull();

    const error = element.querySelector("c-sf-gps-ds-configuration-error");
    expect(error).toBeNull();
  });

  it("shows in LWR with container if configured so", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-nsw-section-lwr", {
      is: SfGpsDsAuNswSectionLwr
    });

    // Act
    element.withContainer = true;
    document.body.appendChild(element);

    // Assert
    const section = element.querySelector(".nsw-section");
    expect(section).not.toBeNull();

    const container = element.querySelector(".nsw-container");
    expect(container).not.toBeNull();
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-nsw-section-lwr", {
      is: SfGpsDsAuNswSectionLwr
    });

    // Act
    document.body.appendChild(element);

    // Assert
    await expect(element).toBeAccessible();
  });
});
