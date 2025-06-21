import { createElement } from "@lwc/engine-dom";
import SfGpsDsAuVic2ButtonComm from "c/sfGpsDsAuVic2ButtonComm";

describe("c-sf-gps-ds-au-vic2-button-comm", () => {
  afterEach(() => {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });

  it("is accessible", async () => {
    // Arrange
    const element = createElement("c-sf-gps-ds-au-vic2-button-comm", {
      is: SfGpsDsAuVic2ButtonComm
    });

    // Act
    element.link = "[Click me](#)";
    element.disabled = false;

    document.body.appendChild(element);

    // Assert
    const button = element.shadowRoot.querySelector("button");
    expect(button).not.toBeNull();

    await expect(element).toBeAccessible();
  });
});
