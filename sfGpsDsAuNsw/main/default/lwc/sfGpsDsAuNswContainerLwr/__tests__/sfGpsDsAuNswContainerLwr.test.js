import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuNswContainerLwr from "c/sfGpsDsAuNswContainerLwr";

describe("c-sf-gps-ds-au-nsw-container-lwr", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("does not show in Aura", () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-nsw-container-lwr", {
      is: SfGpsDsAuNswContainerLwr
    });

    // Act
    element.className = "nsw-container";
    window.$A = "hello";

    document.body.appendChild(element);

    // Assert
    const container = element.querySelector(".nsw-container");
    expect(container).toBeNull();

    const notify = element.querySelector("c-sf-gps-ds-configuration-error");
    expect(notify).not.toBeNull();
  });
});
